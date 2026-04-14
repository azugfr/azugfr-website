import { describe, expect, it } from "vitest";
import { deriveEventStatus } from "./eventStatus";

describe("deriveEventStatus", () => {
  it("always respects cancelled status", () => {
    expect(
      deriveEventStatus({
        status: "cancelled",
        startDate: "2099-01-01T00:00:00Z",
      }),
    ).toBe("cancelled");
  });

  it("respects explicit upcoming and past statuses", () => {
    expect(
      deriveEventStatus({
        status: "upcoming",
        startDate: "2000-01-01T00:00:00Z",
      }),
    ).toBe("upcoming");

    expect(
      deriveEventStatus({
        status: "past",
        startDate: "2099-01-01T00:00:00Z",
      }),
    ).toBe("past");
  });

  it("derives status from startDate when status is not set", () => {
    expect(
      deriveEventStatus({
        status: undefined,
        startDate: "2099-01-01T00:00:00Z",
      }),
    ).toBe("upcoming");

    expect(
      deriveEventStatus({
        status: undefined,
        startDate: "2000-01-01T00:00:00Z",
      }),
    ).toBe("past");
  });
});
