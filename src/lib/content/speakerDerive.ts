import type { EventEntry, SpeakerEntry } from "../../content/config";
import { slugify } from "./slugify";

/**
 * Unique union of an event's own speakerSlugs and its talks' speakerSlugs,
 * keeping first-seen order.
 */
export function getEventSpeakerSlugs(
  e: Pick<EventEntry, "speakerSlugs" | "talks">
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const all = [...(e.speakerSlugs ?? []), ...(e.talks?.flatMap((t) => t.speakerSlugs ?? []) ?? [])];
  for (const slug of all) {
    if (!seen.has(slug)) {
      seen.add(slug);
      out.push(slug);
    }
  }
  return out;
}

/**
 * Extracts speaker stubs from a list of events.
 * Used by the derive-speakers script (T15) to seed speaker collection entries.
 * Returns a map of slug -> partial SpeakerEntry.
 */
export function extractSpeakerStubs(
  events: EventEntry[]
): Map<string, Partial<SpeakerEntry>> {
  const map = new Map<string, Partial<SpeakerEntry>>();

  for (const event of events) {
    for (const rawSlug of getEventSpeakerSlugs(event)) {
      const slug = slugify(rawSlug);
      const existing = map.get(slug);
      const externalId = event.source.externalId;
      if (existing) {
        const ids = existing.derivedFrom?.eventSourceIds ?? [];
        if (!ids.includes(externalId)) {
          existing.derivedFrom = { ...existing.derivedFrom, eventSourceIds: [...ids, externalId] };
        }
      } else {
        map.set(slug, {
          slug,
          derivedFrom: { eventSourceIds: [externalId] },
        } as Partial<SpeakerEntry>);
      }
    }
  }

  return map;
}

/**
 * Merges a derived speaker stub with an existing manual override entry.
 * Manual fields take precedence over derived fields.
 */
export function mergeSpeakerOverride(
  derived: Partial<SpeakerEntry>,
  override: SpeakerEntry
): SpeakerEntry {
  return { ...derived, ...override } as SpeakerEntry;
}
