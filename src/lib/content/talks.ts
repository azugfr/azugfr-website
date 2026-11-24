import type { TalkEntry } from "../../content/schemas";
import type { Locale } from "../i18n";

/**
 * Resolves a talk for `locale`. When the locale differs from the parent
 * event's canonical locale, the matching translation is merged on top.
 */
export function resolveTalk(talk: TalkEntry, eventLocale: Locale, locale: Locale): TalkEntry {
  if (eventLocale === locale) return talk;
  const t = talk.translations?.[locale];
  if (!t) return talk;
  return {
    ...talk,
    ...(t.title !== undefined ? { title: t.title } : {}),
    ...(t.abstract !== undefined ? { abstract: t.abstract } : {}),
  };
}
