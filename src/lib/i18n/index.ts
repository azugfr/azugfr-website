import { fr, type UiDictionary } from "../../data/i18n/fr";
import { en } from "../../data/i18n/en";

export type Locale = "fr" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

const dictionaries: Record<Locale, UiDictionary> = { fr, en };

export function getSupportedLocales(): Locale[] {
  return SUPPORTED_LOCALES;
}

export function getDefaultLocale(): Locale {
  return DEFAULT_LOCALE;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}

export function getUiDictionary(locale: Locale): UiDictionary {
  return dictionaries[locale];
}

/**
 * Returns the canonical localised URL path for a given route key + optional slug.
 * Example: getLocalizedRoute("fr", "events", "global-azure-2024") → "/fr/events/global-azure-2024"
 */
export function getLocalizedRoute(
  locale: Locale,
  routeKey: string,
  slug?: string,
): string {
  const base = `/${locale}/${routeKey}`;
  return slug ? `${base}/${slug}` : base;
}

/**
 * Merges locale-specific translation fields on top of a bilingual content entry.
 * Falls back to the entry's own fields when no translation is available.
 */
export function resolveLocaleContent<
  T extends { locale: Locale; translations?: Record<string, Partial<T>> },
>(entry: T, locale: Locale): T {
  if (entry.locale === locale) return entry;
  const translation = entry.translations?.[locale];
  if (!translation) return entry;
  return { ...entry, ...translation };
}
