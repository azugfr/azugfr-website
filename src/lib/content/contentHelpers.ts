import { getCollection } from "astro:content";
import type {
  AboutOrganizer,
  EventEntry,
  NewsEntry,
  SpeakerEntry,
  SponsorEntry,
  TalkEntry,
} from "../../content/config";
import type { Locale } from "../i18n";
import { resolveLocaleContent } from "../i18n";
import { deriveEventStatus } from "./eventStatus";
import { getEventSpeakerSlugs } from "./speakerDerive";
import { resolveTalk } from "./talks";

const TIER_PRIORITY: Record<string, number> = {
  platinum: 0,
  gold: 1,
  silver: 2,
  bronze: 3,
};

/** All events, locale-resolved (talks resolved from the raw entry's locale) */
export async function getAllEvents(locale: Locale): Promise<EventEntry[]> {
  const entries = await getCollection("events");
  return entries.map((e) => {
    const resolved = resolveLocaleContent(e.data, locale);
    if (!e.data.talks) return resolved;
    return { ...resolved, talks: e.data.talks.map((t) => resolveTalk(t, e.data.locale, locale)) };
  });
}

/** Events with derived status "upcoming", sorted ascending by startDate */
export async function getUpcomingEvents(locale: Locale): Promise<EventEntry[]> {
  const all = await getAllEvents(locale);
  return all
    .filter((e) => deriveEventStatus(e) === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** Past and cancelled events, sorted descending by startDate (most recent first) */
export async function getArchivedEvents(locale: Locale): Promise<EventEntry[]> {
  const all = await getAllEvents(locale);
  return all
    .filter((e) => deriveEventStatus(e) !== "upcoming")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** First upcoming event, or null */
export async function getFeaturedEvent(locale: Locale): Promise<EventEntry | null> {
  const upcoming = await getUpcomingEvents(locale);
  return upcoming[0] ?? null;
}

/** Most recent past (non-cancelled) event, or null */
export async function getLatestPastEvent(locale: Locale): Promise<EventEntry | null> {
  const all = await getAllEvents(locale);
  const past = all
    .filter((e) => deriveEventStatus(e) === "past")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  return past[0] ?? null;
}

/** Groups events by calendar year of startDate; years descending, input order kept within a year */
export function groupByYear<T extends { startDate: string }>(events: T[]): { year: number; events: T[] }[] {
  const map = new Map<number, T[]>();
  for (const e of events) {
    const year = Number(e.startDate.slice(0, 4));
    const list = map.get(year);
    if (list) list.push(e);
    else map.set(year, [e]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, evs]) => ({ year, events: evs }));
}

/** Talks of past, non-cancelled events, newest event first, then talk order */
export async function getLatestTalks(
  locale: Locale,
  limit = 6
): Promise<{ talk: TalkEntry; event: EventEntry; speakers: SpeakerEntry[] }[]> {
  const all = await getAllEvents(locale);
  const speakers = await getAllSpeakers(locale);
  const bySlug = new Map(speakers.map((s) => [s.slug, s]));
  const past = all
    .filter((e) => deriveEventStatus(e) === "past")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  const out: { talk: TalkEntry; event: EventEntry; speakers: SpeakerEntry[] }[] = [];
  for (const event of past) {
    for (const talk of event.talks ?? []) {
      const resolved = talk.speakerSlugs.map((s) => bySlug.get(s));
      if (resolved.some((s) => !s)) continue; // unresolved speakers are skipped
      out.push({ talk, event, speakers: resolved as SpeakerEntry[] });
    }
  }
  return out.slice(0, limit);
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

/** Events where the speaker is listed (event-level or via a talk), descending by date */
export async function getRelatedEventsForSpeaker(
  speakerSlug: string,
  locale: Locale
): Promise<EventEntry[]> {
  const all = await getAllEvents(locale);
  return all
    .filter((e) => getEventSpeakerSlugs(e).includes(speakerSlug))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** Talks attributed to the speaker, with their event, descending by event date */
export async function getTalksForSpeaker(
  speakerSlug: string,
  locale: Locale
): Promise<{ talk: TalkEntry; event: EventEntry }[]> {
  const all = await getAllEvents(locale);
  const out: { talk: TalkEntry; event: EventEntry }[] = [];
  for (const event of [...all].sort((a, b) => b.startDate.localeCompare(a.startDate))) {
    for (const talk of event.talks ?? []) {
      if (talk.speakerSlugs.includes(speakerSlug)) out.push({ talk, event });
    }
  }
  return out;
}

/** Organizers, locale-resolved (role and bio), sorted by order */
export async function getOrganizers(locale: Locale): Promise<AboutOrganizer[]> {
  const entries = await getCollection("about");
  return entries
    .map((e) => e.data)
    .filter((d): d is AboutOrganizer => d.type === "organizer")
    .map((d) => {
      const t = d.translations?.[locale];
      if (d.locale === locale || !t) return d;
      return { ...d, role: t.role ?? d.role, bio: t.bio ?? d.bio, expertise: t.expertise ?? d.expertise };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getOrganizerBySlug(slug: string, locale: Locale): Promise<AboutOrganizer | undefined> {
  return (await getOrganizers(locale)).find((o) => o.slug === slug);
}

export type SpeakerProfile = SpeakerEntry & { isOrganizer: boolean; awards?: string[] };

/**
 * Speaker merged with organizer data when an organizer shares the slug.
 * Organizer fields only fill what the speaker file lacks.
 */
export async function getSpeakerProfile(slug: string, locale: Locale): Promise<SpeakerProfile | undefined> {
  const speaker = await getSpeakerBySlug(slug, locale);
  if (!speaker) return undefined;
  const org = await getOrganizerBySlug(slug, locale);
  if (!org) return { ...speaker, isOrganizer: false };
  return {
    ...speaker,
    photo: speaker.photo ?? org.photo,
    bio: speaker.bio ?? org.bio,
    headline: speaker.headline ?? org.role,
    company: speaker.company ?? org.company,
    links: { ...(org.links ?? {}), ...(speaker.links ?? {}) },
    expertise: speaker.expertise ?? org.expertise,
    isOrganizer: true,
    awards: org.awards,
  };
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
