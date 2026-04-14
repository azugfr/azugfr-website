import { describe, expect, it } from "vitest";
import { eventSlug, newsSlug, slugify } from "./slugify";

describe("slugify", () => {
  it("normalizes accented characters and separators", () => {
    expect(slugify("Azure Été 2026: Paris & Cloud!")).toBe("azure-ete-2026-paris-cloud");
  });

  it("collapses repeated separators", () => {
    expect(slugify("  hello---world___test  ")).toBe("hello-world-test");
  });
});

describe("eventSlug", () => {
  it("prefers explicit slug when present", () => {
    expect(
      eventSlug({ slug: "custom-slug", title: "ignored", startDate: "2026-04-14T18:00:00Z" }),
    ).toBe("custom-slug");
  });

  it("builds deterministic slug from title and year", () => {
    expect(
      eventSlug({ title: "Global Azure Paris", startDate: "2026-11-03T18:00:00Z" }),
    ).toBe("global-azure-paris-2026");
  });
});

describe("newsSlug", () => {
  it("prefers explicit slug when present", () => {
    expect(
      newsSlug({ slug: "news-custom", title: "ignored", publishedAt: "2026-04-14T10:00:00Z" }),
    ).toBe("news-custom");
  });

  it("builds deterministic slug from title and published date", () => {
    expect(
      newsSlug({ title: "Nouveautes Azure FR", publishedAt: "2026-04-14T10:00:00Z" }),
    ).toBe("nouveautes-azure-fr-2026-04-14");
  });
});
