#!/usr/bin/env node
/**
 * sync-meetup-events.mjs
 * Fetches AZUG FR events from Meetup GraphQL API and writes normalized
 * JSON files into src/content/events/.
 *
 * Usage:
 *   MEETUP_KEY=<token> node scripts/sync-meetup-events.mjs [--dry-run]
 *
 * Environment:
 *   MEETUP_KEY   Required. Meetup OAuth access token.
 */

import { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const EVENTS_DIR = resolve(ROOT, "src/content/events");
const MEETUP_GQL = "https://api.meetup.com/gql";
const GROUP_URLNAME = "azure-user-group-france";
const FETCH_COUNT = 50;

const isDryRun = process.argv.includes("--dry-run");
const MEETUP_KEY = process.env.MEETUP_KEY;

if (!MEETUP_KEY) {
  console.error(
    "Error: MEETUP_KEY environment variable is required.\n\n" +
    "Usage:\n" +
    "  MEETUP_KEY=<token> node scripts/sync-meetup-events.mjs [--dry-run]\n\n" +
    "Obtain an access token from https://www.meetup.com/api/oauth/list"
  );
  process.exit(1);
}

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function deriveStatus(meetupStatus, dateTime) {
  if (meetupStatus === "cancelled") return "cancelled";
  if (new Date(dateTime) > new Date()) return "upcoming";
  return "past";
}

function normalizeEvent(node) {
  const year = new Date(node.dateTime).getFullYear();
  const slug = `${slugify(node.title)}-${year}`;

  const venueNameLower = (node.venue?.name ?? "").toLowerCase();
  const isOnline =
    venueNameLower.includes("online") || venueNameLower.includes("virtual");

  return {
    slug,
    locale: "fr",
    title: node.title,
    summary: node.description?.slice(0, 300).trim() ?? "",
    ...(node.description !== undefined && node.description !== null
      ? { description: node.description }
      : {}),
    startDate: node.dateTime,
    ...(node.endTime != null ? { endDate: node.endTime } : {}),
    timezone: "Europe/Paris",
    status: deriveStatus(node.status, node.dateTime),
    ...(node.venue
      ? {
          venue: {
            ...(node.venue.name != null ? { name: node.venue.name } : {}),
            ...(node.venue.city != null ? { city: node.venue.city } : {}),
            ...(node.venue.address != null
              ? { address: node.venue.address }
              : {}),
            mode: isOnline ? "online" : "in_person",
          },
        }
      : {}),
    registrationUrl: node.eventUrl,
    meetupUrl: node.eventUrl,
    speakerSlugs: [],
    tags: [],
    source: {
      provider: "meetup",
      externalId: node.id,
      lastSyncedAt: new Date().toISOString(),
    },
  };
}

// Find an existing file whose source.externalId matches, to enable idempotent overwrite
function findExistingFile(externalId) {
  if (!existsSync(EVENTS_DIR)) return null;
  for (const file of readdirSync(EVENTS_DIR)) {
    if (!file.endsWith(".json")) continue;
    try {
      const data = JSON.parse(
        readFileSync(resolve(EVENTS_DIR, file), "utf-8")
      );
      if (data.source?.externalId === externalId) return file;
    } catch {
      // skip unparseable files
    }
  }
  return null;
}

const QUERY = `
query GroupEvents($urlname: String!, $first: Int!) {
  groupByUrlname(urlname: $urlname) {
    name
    upcomingEvents(input: { first: $first }) {
      edges {
        node {
          id
          title
          description
          dateTime
          endTime
          duration
          status
          venue {
            name
            address
            city
          }
          eventUrl
          going
          rsvpSettings {
            rsvpOpenTime
            rsvpCloseTime
          }
          hosts {
            name
          }
        }
      }
    }
    pastEvents(input: { first: $first }) {
      edges {
        node {
          id
          title
          description
          dateTime
          endTime
          duration
          status
          venue {
            name
            address
            city
          }
          eventUrl
          going
          hosts {
            name
          }
        }
      }
    }
  }
}
`;

async function fetchEvents() {
  const response = await fetch(MEETUP_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MEETUP_KEY}`,
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { urlname: GROUP_URLNAME, first: FETCH_COUNT },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Meetup API HTTP error: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(
      `Meetup GraphQL errors:\n${json.errors
        .map((e) => `  - ${e.message}`)
        .join("\n")}`
    );
  }

  const group = json.data?.groupByUrlname;
  if (!group) {
    throw new Error("Unexpected API response: groupByUrlname is null/undefined");
  }

  const upcomingNodes = (group.upcomingEvents?.edges ?? []).map((e) => e.node);
  const pastNodes = (group.pastEvents?.edges ?? []).map((e) => e.node);
  return [...upcomingNodes, ...pastNodes];
}

async function main() {
  if (isDryRun) {
    console.log("Dry-run mode enabled — no files will be written.\n");
  }

  let nodes;
  try {
    nodes = await fetchEvents();
  } catch (err) {
    console.error(`Error fetching events: ${err.message}`);
    process.exit(1);
  }

  if (!isDryRun && !existsSync(EVENTS_DIR)) {
    mkdirSync(EVENTS_DIR, { recursive: true });
  }

  let written = 0;
  for (const node of nodes) {
    const event = normalizeEvent(node);
    const existingFile = findExistingFile(node.id);
    const fileName = existingFile ?? `${event.slug}.json`;
    const filePath = resolve(EVENTS_DIR, fileName);
    const content = JSON.stringify(event, null, 2);

    if (isDryRun) {
      console.log(`[dry-run] Would write src/content/events/${fileName}`);
      console.log(content);
      console.log();
    } else {
      writeFileSync(filePath, content, "utf-8");
      console.log(`✓ Written src/content/events/${fileName}`);
    }
    written++;
  }

  console.log(`\nDone. ${written} event(s) processed.`);
}

main();
