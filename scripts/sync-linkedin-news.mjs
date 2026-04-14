#!/usr/bin/env node
/**
 * sync-linkedin-news.mjs
 * Fetches AZUG FR LinkedIn posts from an RSS bridge and writes normalized
 * JSON files into src/content/news/.
 *
 * Usage:
 *   RSS_BRIDGE_URL=<url> node scripts/sync-linkedin-news.mjs [--dry-run]
 *
 * Environment:
 *   RSS_BRIDGE_URL   Required. RSS bridge URL for AZUG FR LinkedIn posts.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const NEWS_DIR = join(ROOT, "src", "content", "news");

const RSS_BRIDGE_URL = process.env.RSS_BRIDGE_URL;
const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

if (!RSS_BRIDGE_URL) {
  console.error(
    "Error: RSS_BRIDGE_URL environment variable is required.\n\n" +
      "Usage:\n" +
      "  RSS_BRIDGE_URL=<url> node scripts/sync-linkedin-news.mjs [--dry-run]\n\n" +
      "Example:\n" +
      "  RSS_BRIDGE_URL=https://rss.app/feeds/xxxx.xml node scripts/sync-linkedin-news.mjs"
  );
  process.exit(1);
}

try {
  await run();
} catch (err) {
  console.error("Fatal error:", err.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main logic
// ---------------------------------------------------------------------------

async function run() {
  if (DRY_RUN) {
    console.log("ℹ Dry-run mode — no files will be written.");
  }

  console.log(`⏳ Fetching RSS feed: ${RSS_BRIDGE_URL}`);
  const res = await fetch(RSS_BRIDGE_URL);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} from ${RSS_BRIDGE_URL}`);
  }
  const xmlText = await res.text();

  const items = parseRssItems(xmlText);
  if (items.length === 0) {
    console.warn("⚠ No items found in the RSS feed.");
    return;
  }

  console.log(`📄 Found ${items.length} item(s).`);

  if (!DRY_RUN) {
    mkdirSync(NEWS_DIR, { recursive: true });
  }

  const now = new Date().toISOString();

  for (const item of items) {
    if (!item.pubDate) {
      console.warn(`⚠ Skipping item with no pubDate: "${item.title}"`);
      continue;
    }

    const slug = newsSlug(item.title, item.pubDate);
    const entry = {
      slug,
      locale: "fr",
      title: item.title || "Post LinkedIn AZUG FR",
      summary: stripHtml(item.description).slice(0, 300).trim(),
      content: item.description || undefined,
      publishedAt: new Date(item.pubDate).toISOString(),
      author: "AZUG FR",
      sourceUrl: item.link,
      tags: [],
      source: {
        provider: "linkedin-rss",
        externalId: item.guid || item.link,
        lastSyncedAt: now,
      },
    };

    const filePath = join(NEWS_DIR, `${slug}.json`);
    const json = JSON.stringify(entry, null, 2);

    if (DRY_RUN) {
      console.log(`✓ [dry-run] Would write ${filePath}`);
      console.log(json);
    } else {
      writeFileSync(filePath, json, "utf8");
      console.log(`✓ Written src/content/news/${slug}.json`);
    }
  }
}

// ---------------------------------------------------------------------------
// Minimal RSS/Atom parser — no external dependencies
// ---------------------------------------------------------------------------

function parseRssItems(xmlText) {
  const items = [];
  const itemPattern = /<(?:item|entry)[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;
  while ((match = itemPattern.exec(xmlText)) !== null) {
    const block = match[1];
    items.push({
      title: extractTag(block, "title"),
      description:
        extractCdata(block, "description") ||
        extractCdata(block, "content:encoded") ||
        extractCdata(block, "content") ||
        extractTag(block, "description"),
      link: extractTag(block, "link") || extractAttr(block, "link", "href"),
      pubDate:
        extractTag(block, "pubDate") ||
        extractTag(block, "published") ||
        extractTag(block, "updated"),
      guid: extractTag(block, "guid") || extractTag(block, "id"),
    });
  }
  return items;
}

function extractTag(xml, tag) {
  const m = xml.match(
    new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i")
  );
  return m ? m[1].trim() : "";
}

function extractCdata(xml, tag) {
  const m = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i")
  );
  return m ? m[1].trim() : "";
}

function extractAttr(xml, tag, attr) {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i"));
  return m ? m[1] : "";
}

// ---------------------------------------------------------------------------
// Slug and text helpers
// ---------------------------------------------------------------------------

function newsSlug(title, dateStr) {
  const date = new Date(dateStr);
  const datePart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return slugify(title).slice(0, 60) + "-" + datePart;
}

function slugify(text) {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
