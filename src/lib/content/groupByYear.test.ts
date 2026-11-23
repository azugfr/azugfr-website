import { describe, expect, it, vi } from "vitest";

// contentHelpers imports astro:content (virtual Astro module); stub it so the pure helper can load.
vi.mock("astro:content", () => ({ getCollection: async () => [] }));

const { groupByYear } = await import("./contentHelpers");

describe("groupByYear", () => {
  it("groups by the year of startDate, years descending, input order kept within a year", () => {
    const events = [
      { slug: "a", startDate: "2024-04-20T09:00:00" },
      { slug: "b", startDate: "2026-04-18T09:00:00" },
      { slug: "c", startDate: "2024-03-27T18:00:00" },
      { slug: "d", startDate: "2025-05-06T09:00:00" },
      { slug: "e", startDate: "2026-06-10T18:30:00" },
    ];
    const grouped = groupByYear(events);
    expect(grouped.map((g) => g.year)).toEqual([2026, 2025, 2024]);
    expect(grouped[0].events.map((e) => e.slug)).toEqual(["b", "e"]);
    expect(grouped[1].events.map((e) => e.slug)).toEqual(["d"]);
    expect(grouped[2].events.map((e) => e.slug)).toEqual(["a", "c"]);
  });

  it("returns an empty list for no events", () => {
    expect(groupByYear([])).toEqual([]);
  });
});
