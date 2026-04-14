import type { EventEntry } from "../../content/config";

/** Derives the event status from dates vs. now. Explicit status field takes precedence. */
export function deriveEventStatus(
  entry: Omit<Pick<EventEntry, "status" | "startDate" | "endDate">, "status"> & {
    status?: EventEntry["status"];
  }
): "upcoming" | "past" | "cancelled" {
  if (entry.status === "cancelled") return "cancelled";
  if (entry.status === "upcoming" || entry.status === "past") return entry.status;
  return new Date(entry.startDate) > new Date() ? "upcoming" : "past";
}
