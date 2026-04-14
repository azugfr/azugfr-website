import { getCollection } from "astro:content";
import type { EventEntry, NewsEntry, SpeakerEntry, SponsorEntry } from "../../content/config";
import type { Locale } from "../i18n";
import { resolveLocaleContent } from "../i18n";
import { deriveEventStatus } from "./eventStatus";

const TIER_PRIORITY: Record<string, number> = {
  platinum: 0,
  gold: 1,
  silver: 2,
  bronze: 3,
};

/** All events, status-normalized, locale-resolved for given locale */
export async function getAllEvents(locale: Locale): Promise<EventEntry[]> {
  const entries = await getCollection("events");
  return entries.map((e) => resolveLocaleContent(e.data, locale));
}

/** Events with derived status "upcoming", sorted ascending by startDate */
export async function getUpcomingEvents(locale: Locale): Promise<EventEntry[]> {
  const all = await getAllEvents(locale);
  return all
    .filter((e) => deriveEventStatus(e) === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** Events with derived status "past", sorted descending by startDate (most recent first) */
export async function getArchivedEvents(locale: Locale): Promise<EventEntry[]> {
  const all = await getAllEvents(locale);
  return all
    .filter((e) => deriveEventStatus(e) === "past")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** First upcoming event, or null */
export async function getFeaturedEvent(locale: Locale): Promise<EventEntry | null> {
  const upcoming = await getUpcomingEvents(locale);
  return upcoming[0] ?? null;
}

/** Latest N news items sorted descending by publishedAt */
export async function getLatestNews(locale: Locale, limit?: number): Promise<NewsEntry[]> {
  const entries = await getCollection("news");
  const resolved = entries
    .map((e) => resolveLocaleContent(e.data, locale))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return limit !== undefined ? resolved.slice(0, limit) : resolved;
}

/** Speaker by slug, locale-resolved */
export async function getSpeakerBySlug(slug: string, locale: Locale): Promise<SpeakerEntry | undefined> {
  const entries = await getCollection("speakers");
  const match = entries.find((e) => e.data.slug === slug);
  return match ? resolveLocaleContent(match.data, locale) : undefined;
}

/** All speakers, locale-resolved */
export async function getAllSpeakers(locale: Locale): Promise<SpeakerEntry[]> {
  const entries = await getCollection("speakers");
  return entries.map((e) => resolveLocaleContent(e.data, locale));
}

/** Events where speakerSlugs includes the given slug, locale-resolved, descending by date */
export async function getRelatedEventsForSpeaker(
  speakerSlug: string,
  locale: Locale
): Promise<EventEntry[]> {
  const all = await getAllEvents(locale);
  return all
    .filter((e) => e.speakerSlugs?.includes(speakerSlug))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** Sponsors with featured=true, sorted by tier priority (platinum > gold > silver > bronze > other) */
export async function getFeaturedSponsors(locale: Locale): Promise<SponsorEntry[]> {
  const entries = await getCollection("sponsors");
  return entries
    .map((e) => resolveLocaleContent(e.data, locale))
    .filter((s) => s.featured === true)
    .sort((a, b) => {
      const pa = a.tier ? (TIER_PRIORITY[a.tier] ?? 99) : 99;
      const pb = b.tier ? (TIER_PRIORITY[b.tier] ?? 99) : 99;
      return pa - pb;
    });
}

/** All sponsors, locale-resolved */
export async function getAllSponsors(locale: Locale): Promise<SponsorEntry[]> {
  const entries = await getCollection("sponsors");
  return entries.map((e) => resolveLocaleContent(e.data, locale));
}
