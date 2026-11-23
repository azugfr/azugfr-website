import { describe, expect, it } from "vitest";
import { deriveEventStatus } from "./eventStatus";

const d = (s: string) => new Date(s);

describe("deriveEventStatus", () => {
  it("always respects cancelled status", () => {
    expect(deriveEventStatus({ status: "cancelled", startDate: "2099-01-01T18:00:00" }, d("2026-01-01T00:00:00Z"))).toBe(
      "cancelled",
    );
  });

  it("ignores stored upcoming/past values", () => {
    expect(
      deriveEventStatus(
        { status: "upcoming", startDate: "2026-04-18T09:00:00", endDate: "2026-04-18T14:00:00" },
        d("2026-11-23T12:00:00Z"),
      ),
    ).toBe("past");
    expect(deriveEventStatus({ status: "past", startDate: "2099-01-01T18:00:00" }, d("2026-11-23T12:00:00Z"))).toBe(
      "upcoming",
    );
  });

  const ga = { startDate: "2026-04-18T09:00:00", endDate: "2026-04-18T14:00:00", timezone: "Europe/Paris" };
  it("treats an ongoing event as upcoming", () => {
    expect(deriveEventStatus(ga, d("2026-04-18T10:00:00Z"))).toBe("upcoming");
  });
  it("is past once the end has passed in the event timezone", () => {
    expect(deriveEventStatus(ga, d("2026-04-18T12:30:00Z"))).toBe("past");
  });

  const noEnd = { startDate: "2026-06-10T18:30:00" };
  it("uses end of start day when there is no endDate", () => {
    expect(deriveEventStatus(noEnd, d("2026-06-10T20:00:00Z"))).toBe("upcoming");
    expect(deriveEventStatus(noEnd, d("2026-06-11T00:30:00Z"))).toBe("past");
  });
});
