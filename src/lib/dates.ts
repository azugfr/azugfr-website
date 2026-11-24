/**
 * Date helpers. Event content stores local wall-clock times without offset
 * plus an IANA timezone; these helpers turn them into instants / strings that
 * do not depend on the machine's time zone.
 */

export type DateVariant = "date" | "dateLong" | "dateTime" | "time";

export function hasOffset(s: string): boolean {
  return /(Z|[+-]\d{2}:?\d{2})$/i.test(s);
}

function normaliseLocal(local: string): string {
  // "2026-04-18T09:00" -> "2026-04-18T09:00:00"; date-only -> midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(local)) return `${local}T00:00:00`;
  if (/T\d{2}:\d{2}$/.test(local)) return `${local}:00`;
  return local;
}

/** Offset string ("+02:00") of `timeZone` at the instant `at`. */
function offsetAt(at: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(at);
  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  if (raw === "GMT") return "+00:00";
  const m = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return "+00:00";
  return `${m[1]}${m[2].padStart(2, "0")}:${m[3] ?? "00"}`;
}

function offsetMs(offset: string): number {
  const sign = offset[0] === "-" ? -1 : 1;
  return sign * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6))) * 60_000;
}

export function toIsoWithOffset(local: string, timeZone = "Europe/Paris"): string {
  if (hasOffset(local)) return local;
  const base = normaliseLocal(local);
  // Treat the wall-clock time as UTC, take the zone offset at that guess, then
  // re-evaluate at the corrected instant so times near a DST change get the right offset.
  const guess = new Date(`${base}Z`);
  const first = offsetAt(guess, timeZone);
  const corrected = new Date(guess.getTime() - offsetMs(first));
  return `${base}${offsetAt(corrected, timeZone)}`;
}

export function toInstant(value: string, timeZone = "Europe/Paris"): Date {
  return new Date(toIsoWithOffset(value, timeZone));
}

const VARIANT_OPTIONS: Record<DateVariant, Intl.DateTimeFormatOptions> = {
  date: { year: "numeric", month: "long", day: "numeric" },
  dateLong: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  dateTime: {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
  time: { hour: "2-digit", minute: "2-digit" },
};

export function formatEventDate(
  value: string,
  locale: "fr" | "en",
  variant: DateVariant = "date",
  timeZone = "Europe/Paris",
): string {
  return toInstant(value, timeZone).toLocaleString(locale === "fr" ? "fr-FR" : "en-GB", {
    ...VARIANT_OPTIONS[variant],
    hourCycle: "h23",
    timeZone,
  });
}

/** Build-time "now"; AZUG_NOW overrides it for deterministic builds and tests. */
export function getBuildNow(): Date {
  const override = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.AZUG_NOW;
  return override ? new Date(override) : new Date();
}

export interface EventDateParts {
  /** Day of month without padding, e.g. "18" */
  day: string;
  /** Short month, e.g. "avr." (fr) or "Apr" (en) */
  month: string;
  year: string;
}

/** Day, short month and year of an event start in its own time zone (for date blocks). */
export function formatEventDateParts(
  value: string,
  locale: "fr" | "en",
  timeZone = "Europe/Paris",
): EventDateParts {
  const parts = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  }).formatToParts(toInstant(value, timeZone));
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: pick("day"), month: pick("month"), year: pick("year") };
}
