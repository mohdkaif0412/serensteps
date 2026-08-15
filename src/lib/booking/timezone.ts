/**
 * Timezone helpers for the booking calendar — built on `Intl.DateTimeFormat`,
 * so there's no date library to add or keep patched.
 *
 * The practice thinks in wall clock ("Tuesdays, 10am to 6pm") and the database
 * thinks in instants (UTC). Everything in here converts between the two for one
 * fixed zone: `bookingConfig.timeZone`. Availability is stored as minutes from
 * local midnight; bookings are stored as UTC `DateTime`s.
 *
 * Client-safe: pure functions, no server imports. The zone itself is passed in
 * rather than read from the environment, because the browser can't see
 * server-only env vars.
 */

export type ZonedParts = {
  year: number;
  /** 1–12, not the 0-based nonsense. */
  month: number;
  day: number;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** Minutes from local midnight. */
  minutes: number;
};

// Intl formatters are expensive to build and get used per slot, so cache them.
const partsCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  let formatter = partsCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23", // "24" for midnight is a real hour12:false footgun
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    partsCache.set(timeZone, formatter);
  }
  return formatter;
}

function readParts(date: Date, timeZone: string) {
  const parts = partsFormatter(timeZone).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** How far ahead of UTC the zone is, in ms, at this particular instant. */
function offsetMs(date: Date, timeZone: string) {
  const p = readParts(date, timeZone);
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  // Drop sub-second precision on both sides so the difference is a clean offset.
  return asIfUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Split an instant into practice-local calendar parts. */
export function utcToZoned(date: Date, timeZone: string): ZonedParts {
  const p = readParts(date, timeZone);
  return {
    year: p.year,
    month: p.month,
    day: p.day,
    weekday: weekdayOf(p.year, p.month, p.day),
    minutes: p.hour * 60 + p.minute,
  };
}

/**
 * Turn a practice-local date + minutes-from-midnight into a real instant.
 *
 * Two passes: the first guesses the offset from the naive timestamp, the second
 * re-checks it at the corrected instant. That second pass only matters on a DST
 * boundary — India doesn't observe DST, but the practice may not always be in
 * India, and getting this wrong shifts an hour of someone's day.
 */
export function zonedToUtc(
  { year, month, day, minutes }: { year: number; month: number; day: number; minutes: number },
  timeZone: string,
): Date {
  const naive = Date.UTC(year, month - 1, day) + minutes * 60_000;
  const firstPass = naive - offsetMs(new Date(naive), timeZone);
  const secondPass = naive - offsetMs(new Date(firstPass), timeZone);
  return new Date(secondPass);
}

/** Day of week for a calendar date, 0 = Sunday. */
export function weekdayOf(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** `YYYY-MM-DD` for a calendar date — the key the slot map is grouped by. */
export function toDateKey({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Parse a `YYYY-MM-DD` key back into calendar parts. */
export function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return { year, month, day, weekday: weekdayOf(year, month, day) };
}

/** Add whole days to a calendar date without ever touching local time. */
export function addDays(
  { year, month, day }: { year: number; month: number; day: number },
  amount: number,
) {
  const shifted = new Date(Date.UTC(year, month - 1, day + amount));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
  };
}

// ─── Display ─────────────────────────────────────────────────────
//
// All en-GB, matching `formatDate` in src/lib/utils.ts.

const displayCache = new Map<string, Intl.DateTimeFormat>();

function display(timeZone: string, options: Intl.DateTimeFormatOptions) {
  const key = `${timeZone}|${JSON.stringify(options)}`;
  let formatter = displayCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-GB", { timeZone, ...options });
    displayCache.set(key, formatter);
  }
  return formatter;
}

/** "3:30 pm" */
export function formatTime(date: Date, timeZone: string) {
  return display(timeZone, { hour: "numeric", minute: "2-digit", hour12: true })
    .format(date)
    .replace(/\s?([ap])m/i, (_, m: string) => ` ${m.toLowerCase()}m`);
}

/** "Tuesday, 12 August 2026" */
export function formatLongDate(date: Date, timeZone: string) {
  return display(timeZone, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** "Tue 12 Aug" — for the compact date strip. */
export function formatShortDate(date: Date, timeZone: string) {
  return display(timeZone, { weekday: "short", day: "numeric", month: "short" }).format(
    date,
  );
}

/** "GMT+5:30" / "IST", whatever the runtime knows the zone as. */
export function timeZoneLabel(date: Date, timeZone: string) {
  const parts = display(timeZone, { timeZoneName: "short" }).formatToParts(date);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
}

/** The visitor's own zone, for the "that's 11:00 am your time" line. */
export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/** True when two zones render the same clock time for this instant. */
export function sameWallClock(date: Date, a: string, b: string) {
  return formatTime(date, a) === formatTime(date, b);
}

/**
 * Minutes from practice-local midnight → "10:00 am".
 *
 * The chart's time axis is wall clock, not an instant — there is no single date
 * behind a row that spans a whole week. Formatting a fixed UTC date *as* UTC
 * turns the minutes into a label without inventing a day for them.
 */
export function formatMinutes(minutes: number) {
  return formatTime(new Date(Date.UTC(2000, 0, 1, 0, minutes)), "UTC");
}

/** Minutes from midnight → "10:00" / "6:30 pm"-free 24h label for the admin. */
export function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "10:00" → 600. Returns null for anything that isn't a valid time. */
export function labelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}
