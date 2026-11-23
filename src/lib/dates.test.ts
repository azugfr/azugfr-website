import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { formatEventDate, getBuildNow, toInstant, toIsoWithOffset } from "./dates";

describe("toIsoWithOffset", () => {
  it("adds the summer offset for Europe/Paris", () => {
    expect(toIsoWithOffset("2026-04-18T09:00:00")).toBe("2026-04-18T09:00:00+02:00");
  });

  it("adds the winter offset for Europe/Paris", () => {
    expect(toIsoWithOffset("2025-11-25T18:30:00")).toBe("2025-11-25T18:30:00+01:00");
  });

  it("leaves values that already carry an offset unchanged", () => {
    expect(toIsoWithOffset("2026-06-08T18:30:00+02:00")).toBe("2026-06-08T18:30:00+02:00");
    expect(toIsoWithOffset("2026-06-08T16:30:00Z")).toBe("2026-06-08T16:30:00Z");
  });
});

describe("toIsoWithOffset around DST transitions (Europe/Paris)", () => {
  // spring forward: 2026-03-29 02:00 local -> 03:00 (01:00Z)
  it("uses +01:00 just before the spring-forward gap", () => {
    expect(toIsoWithOffset("2026-03-29T01:30:00", "Europe/Paris")).toBe("2026-03-29T01:30:00+01:00");
  });
  it("uses +02:00 just after the spring-forward gap", () => {
    expect(toIsoWithOffset("2026-03-29T03:30:00", "Europe/Paris")).toBe("2026-03-29T03:30:00+02:00");
  });
  // fall back: 2026-10-25 03:00 local -> 02:00 (01:00Z)
  it("uses +02:00 before the fall-back overlap", () => {
    expect(toIsoWithOffset("2026-10-25T01:30:00", "Europe/Paris")).toBe("2026-10-25T01:30:00+02:00");
  });
  it("uses +01:00 after the fall-back overlap", () => {
    expect(toIsoWithOffset("2026-10-25T03:30:00", "Europe/Paris")).toBe("2026-10-25T03:30:00+01:00");
  });
});

describe("toInstant", () => {
  it("returns the UTC instant of a Paris wall-clock time", () => {
    expect(toInstant("2026-04-18T09:00:00").toISOString()).toBe("2026-04-18T07:00:00.000Z");
  });
});

describe("formatEventDate", () => {
  const savedTz = process.env.TZ;
  afterEach(() => {
    if (savedTz === undefined) delete process.env.TZ;
    else process.env.TZ = savedTz;
  });

  it("renders the Paris wall-clock time whatever the machine time zone is", () => {
    for (const tz of ["UTC", "America/New_York", "Pacific/Auckland", "Asia/Tokyo"]) {
      process.env.TZ = tz;
      expect(formatEventDate("2025-11-25T18:30:00", "fr", "time")).toBe("18:30");
      expect(formatEventDate("2025-11-25T18:30:00", "en", "time")).toBe("18:30");
    }
  });
});

describe("getBuildNow", () => {
  const saved = process.env.AZUG_NOW;
  beforeEach(() => {
    delete process.env.AZUG_NOW;
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.AZUG_NOW;
    else process.env.AZUG_NOW = saved;
  });

  it("honours the AZUG_NOW override", () => {
    process.env.AZUG_NOW = "2026-11-23T12:00:00Z";
    expect(getBuildNow().toISOString()).toBe("2026-11-23T12:00:00.000Z");
  });

  it("falls back to the real clock when AZUG_NOW is unset", () => {
    const before = Date.now();
    const now = getBuildNow().getTime();
    expect(now).toBeGreaterThanOrEqual(before);
    expect(now).toBeLessThanOrEqual(Date.now());
  });
});
