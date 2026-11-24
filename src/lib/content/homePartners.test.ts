import { describe, expect, it, vi } from "vitest";

vi.mock("astro:content", () => ({ getCollection: async () => [] }));

const { getHomePartners } = await import("./contentHelpers");

const sponsor = (slug: string, tier: string, logo?: string) =>
  ({ slug, name: slug, tier, website: "https://example.com", locale: "fr", featured: true, logo }) as never;

describe("getHomePartners", () => {
  it("excludes the annual and honor sponsors even when they carry a logo, and sponsors without a logo", () => {
    const annual = sponsor("annual", "annual", "/a.svg");
    const honor = sponsor("honor", "honor", "/h.svg");
    const gold = sponsor("gold", "gold", "/g.svg");
    const noLogo = sponsor("nologo", "silver");
    expect(getHomePartners([annual, honor, gold, noLogo], annual, honor)).toEqual([gold]);
  });
});
