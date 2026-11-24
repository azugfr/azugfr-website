import { getBuildNow, toInstant } from "../dates";

export type DerivedStatus = "upcoming" | "past" | "cancelled";

/**
 * Derives the event status from its dates. Only a stored "cancelled" is
 * honoured; stored "upcoming" / "past" values are ignored.
 */
export function deriveEventStatus(
  entry: { status?: string; startDate: string; endDate?: string; timezone?: string },
  now: Date = getBuildNow(),
): DerivedStatus {
  if (entry.status === "cancelled") return "cancelled";
  const tz = entry.timezone ?? "Europe/Paris";
  const end = entry.endDate
    ? toInstant(entry.endDate, tz)
    : toInstant(entry.startDate.slice(0, 10) + "T23:59:59", tz); // no end: end of start day
  return end.getTime() >= now.getTime() ? "upcoming" : "past"; // ongoing counts as upcoming
}
