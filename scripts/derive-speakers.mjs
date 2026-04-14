#!/usr/bin/env node
/**
 * derive-speakers.mjs
 * Generates/updates speaker entries from event data.
 * Existing speaker files are preserved — only missing fields are filled in.
 *
 * Usage:
 *   node scripts/derive-speakers.mjs [--dry-run]
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const EVENTS_DIR = join(ROOT, "src/content/events");
const SPEAKERS_DIR = join(ROOT, "src/content/speakers");
const DRY_RUN = process.argv.includes("--dry-run");

function humanizeName(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mergeSpeaker(existing, derived) {
  return {
    ...derived,
    ...existing,
    // Always merge derivedFrom.eventSourceIds (union of both)
    derivedFrom: {
      ...(derived.derivedFrom ?? {}),
      ...(existing.derivedFrom ?? {}),
      eventSourceIds: [
        ...new Set([
          ...(derived.derivedFrom?.eventSourceIds ?? []),
          ...(existing.derivedFrom?.eventSourceIds ?? []),
        ]),
      ],
    },
  };
}

async function main() {
  const eventFiles = (await readdir(EVENTS_DIR)).filter(
    (f) => f.endsWith(".json") && f !== ".gitkeep"
  );

  // Map slug -> { derived stub, seen eventSourceIds }
  const speakerMap = new Map();

  for (const file of eventFiles) {
    const raw = await readFile(join(EVENTS_DIR, file), "utf8");
    const event = JSON.parse(raw);
    const slugs = event.speakerSlugs ?? [];
    const externalId = event.source?.externalId;

    for (const slug of slugs) {
      if (!speakerMap.has(slug)) {
        speakerMap.set(slug, {
          slug,
          locale: "fr",
          name: humanizeName(slug),
          derivedFrom: { eventSourceIds: externalId ? [externalId] : [] },
        });
      } else if (externalId) {
        const entry = speakerMap.get(slug);
        entry.derivedFrom.eventSourceIds.push(externalId);
      }
    }
  }

  for (const [slug, derived] of speakerMap) {
    const filePath = join(SPEAKERS_DIR, `${slug}.json`);
    let merged = derived;

    if (existsSync(filePath)) {
      const existing = JSON.parse(await readFile(filePath, "utf8"));
      merged = mergeSpeaker(existing, derived);
    }

    const json = JSON.stringify(merged, null, 2) + "\n";

    if (DRY_RUN) {
      console.log(`→ Would update src/content/speakers/${slug}.json (dry-run)`);
    } else {
      await writeFile(filePath, json, "utf8");
      console.log(`✓ Updated src/content/speakers/${slug}.json`);
    }
  }

  if (speakerMap.size === 0) {
    console.log("No speaker slugs found in events.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
