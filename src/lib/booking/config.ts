/**
 * Booking settings that belong to the practice rather than to a session type.
 * Server-only: these are plain env vars (no NEXT_PUBLIC_ prefix), so anything
 * the browser needs — the timezone, mainly — is passed down as a prop from the
 * page that renders the flow.
 *
 * All documented in `.env.example`. Every one has a working default, so the
 * booking flow runs correctly with nothing configured at all.
 */

import { site } from "@/lib/site";

const fromEnv = (value: string | undefined) => value?.trim() ?? "";

function positiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(fromEnv(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Like `positiveInt`, but 0 is a real answer rather than "unset".
 *
 * Notice needed is the one setting where zero is meaningful and wanted: it says
 * "same day is fine, just not a time that has already gone". Running it through
 * `positiveInt` would silently swallow a deliberate 0 and fall back to the
 * default, which is exactly the sort of quiet wrong answer that's hard to spot.
 */
function nonNegativeInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(fromEnv(value), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/** A zone the runtime doesn't recognise would break every slot — check early. */
function validTimeZone(value: string, fallback: string) {
  if (!value) return fallback;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    console.warn(`[booking] Unknown BOOKING_TIMEZONE "${value}" — using ${fallback}.`);
    return fallback;
  }
}

export const bookingConfig = {
  /** The one zone the practice's working hours are expressed in. */
  timeZone: validTimeZone(fromEnv(process.env.BOOKING_TIMEZONE), "Asia/Kolkata"),
  /**
   * How much notice is needed — slots sooner than this aren't offered.
   * 0 means same-day booking is open right up to the next free time.
   */
  leadTimeHours: nonNegativeInt(process.env.BOOKING_LEAD_TIME_HOURS, 12),
  /** How far ahead people can book. */
  horizonDays: positiveInt(process.env.BOOKING_HORIZON_DAYS, 45),
  /** Slot granularity within a working window. */
  slotStepMin: positiveInt(process.env.BOOKING_SLOT_STEP_MIN, 30),
  /** Where new-request notifications go. Falls back to the contact mailbox. */
  notifyTo:
    fromEnv(process.env.BOOKING_NOTIFY_TO) ||
    fromEnv(process.env.CONTACT_NOTIFY_TO) ||
    site.email,
} as const;
