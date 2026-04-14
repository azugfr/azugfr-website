import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getAlternateLocale,
  getDefaultLocale,
  getLocalizedRoute,
  getSupportedLocales,
  resolveLocaleContent,
} from "./index";

describe("i18n primitives", () => {
  it("returns configured supported locales and default locale", () => {
    expect(getSupportedLocales()).toEqual(SUPPORTED_LOCALES);
    expect(getDefaultLocale()).toBe(DEFAULT_LOCALE);
    expect(getDefaultLocale()).toBe("fr");
  });

  it("returns the alternate locale", () => {
    expect(getAlternateLocale("fr")).toBe("en");
    expect(getAlternateLocale("en")).toBe("fr");
  });

  it("builds localized routes with and without slug", () => {
    expect(getLocalizedRoute("fr", "events")).toBe("/fr/events");
    expect(getLocalizedRoute("en", "news", "my-post")).toBe("/en/news/my-post");
  });
});

describe("resolveLocaleContent", () => {
  it("returns entry unchanged for canonical locale", () => {
    const entry = {
      locale: "fr" as const,
      title: "Titre FR",
      summary: "Resume FR",
      translations: {
        en: { title: "Title EN" },
      },
    };

    expect(resolveLocaleContent(entry, "fr")).toEqual(entry);
  });

  it("merges translated fields when translation exists", () => {
    const entry = {
      locale: "fr" as const,
      title: "Titre FR",
      summary: "Resume FR",
      translations: {
        en: { title: "Title EN" },
      },
    };

    expect(resolveLocaleContent(entry, "en")).toEqual({
      ...entry,
      title: "Title EN",
    });
  });

  it("falls back to canonical fields when translation is missing", () => {
    const entry = {
      locale: "fr" as const,
      title: "Titre FR",
      summary: "Resume FR",
    };

    expect(resolveLocaleContent(entry, "en")).toEqual(entry);
  });
});
