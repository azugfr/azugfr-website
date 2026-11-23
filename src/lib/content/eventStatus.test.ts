import { describe, expect, it } from "vitest";
import { deriveEventStatus } from "./eventStatus";

const at = (s: string) => new Date(s);

describe("deriveEventStatus", () => {
  // 1. cancelled wins over dates
  it("returns cancelled for a cancelled event even when its date is in the future", () => {
    expect(
      deriveEventStatus({ status: "cancelled", startDate: "2099-01-01T18:00:00" }, at("2026-11-23T12:00:00Z")),
    ).toBe("cancelled");
  });

  // 2. stored "upcoming" is ignored
  it("ignores a stored upcoming status once the end date has passed", () => {
    expect(
      deriveEventStatus(
        { status: "upcoming", startDate: "2026-04-18T09:00:00", endDate: "2026-04-18T14:00:00" },
        at("2026-11-23T12:00:00Z"),
      ),
    ).toBe("past");
  });

  // 3. stored "past" is ignored
  it("ignores a stored past status for a future event", () => {
    expect(deriveEventStatus({ status: "past", startDate: "2099-01-01T18:00:00" }, at("2026-11-23T12:00:00Z"))).toBe(
      "upcoming",
    );
  });

  const ga = { startDate: "2026-04-18T09:00:00", endDate: "2026-04-18T14:00:00", timezone: "Europe/Paris" };

  // 4. ongoing counts as upcoming (12:00 Paris)
  it("treats an ongoing event as upcoming", () => {
    expect(deriveEventStatus(ga, at("2026-04-18T10:00:00Z"))).toBe("upcoming");
  });

  // 5. after the end (14:30 Paris)
  it("is past once the end time has passed in the event timezone", () => {
    expect(deriveEventStatus(ga, at("2026-04-18T12:30:00Z"))).toBe("past");
  });

  const noEnd = { startDate: "2026-06-10T18:30:00" };

  // 6. no endDate: end of start day (22:00 Paris)
  it("uses the end of the start day when there is no endDate", () => {
    expect(deriveEventStatus(noEnd, at("2026-06-10T20:00:00Z"))).toBe("upcoming");
  });

  // 7. just after end of start day (02:30 Paris next day)
  it("is past after the end of the start day when there is no endDate", () => {
    expect(deriveEventStatus(noEnd, at("2026-06-11T00:30:00Z"))).toBe("past");
  });
});
