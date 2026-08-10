/**
 * Slot generation — the one genuinely fiddly piece of the booking engine, kept
 * pure and dependency-free so it can be reasoned about (and tested) on its own.
 *
 * Inputs are the practitioner's weekly rules, any dated exceptions, and the
 * bookings already holding time. Output is, for each day in the horizon, the
 * list of start instants that are actually offerable. The same function backs
 * the public slot picker and the server-side re-check on submit — a slot the
 * visitor sends back must still appear here, or the booking is refused.
 */

import {
  addDays,
  toDateKey,
  utcToZoned,
  zonedToUtc,
  type ZonedParts,
} from "@/lib/booking/timezone";

export type Window = { startMinute: number; endMinute: number };

export type AvailabilityRuleLike = Window & { weekday: number; active: boolean };

export type AvailabilityExceptionLike = {
  /** Stored as a date-only column, so it reads back as midnight UTC. */
  date: Date;
  blocked: boolean;
  startMinute: number | null;
  endMinute: number | null;
};

/** An interval already occupied, inclusive of the buffer after it. */
export type BusyInterval = { startsAt: Date; endsAt: Date };

export type BuildSlotsInput = {
  timeZone: string;
  rules: AvailabilityRuleLike[];
  exceptions: AvailabilityExceptionLike[];
  busy: BusyInterval[];
  /** Length of the session being booked. */
  durationMin: number;
  /** Quiet time this session needs afterwards. */
  bufferMin: number;
  slotStepMin: number;
  leadTimeHours: number;
  horizonDays: number;
  /** "now" — passed in so the caller controls the clock. */
  from: Date;
};

export type DaySlots = {
  /** `YYYY-MM-DD` in the practice timezone. */
  date: string;
  /** Start instants, ISO 8601 UTC. */
  slots: string[];
};

/** A date-only column reads back as midnight UTC, so read it in UTC too. */
function exceptionKey(date: Date) {
  return toDateKey({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  });
}

/** Merge overlapping/adjacent windows so a slot is never offered twice. */
function mergeWindows(windows: Window[]): Window[] {
  const sorted = [...windows]
    .filter((w) => w.endMinute > w.startMinute)
    .sort((a, b) => a.startMinute - b.startMinute);
  const merged: Window[] = [];
  for (const window of sorted) {
    const last = merged[merged.length - 1];
    if (last && window.startMinute <= last.endMinute) {
      last.endMinute = Math.max(last.endMinute, window.endMinute);
    } else {
      merged.push({ ...window });
    }
  }
  return merged;
}

export function buildSlots({
  timeZone,
  rules,
  exceptions,
  busy,
  durationMin,
  bufferMin,
  slotStepMin,
  leadTimeHours,
  horizonDays,
  from,
}: BuildSlotsInput): DaySlots[] {
  const earliest = from.getTime() + leadTimeHours * 3_600_000;
  const activeRules = rules.filter((rule) => rule.active);

  // Index the exceptions by day so the inner loop stays O(1) per date.
  const blockedDates = new Set<string>();
  const extraWindows = new Map<string, Window[]>();
  for (const exception of exceptions) {
    const key = exceptionKey(exception.date);
    if (exception.blocked) {
      blockedDates.add(key);
    } else if (exception.startMinute !== null && exception.endMinute !== null) {
      const list = extraWindows.get(key) ?? [];
      list.push({ startMinute: exception.startMinute, endMinute: exception.endMinute });
      extraWindows.set(key, list);
    }
  }

  const days: DaySlots[] = [];
  const today: ZonedParts = utcToZoned(from, timeZone);

  for (let offset = 0; offset <= horizonDays; offset++) {
    const date = addDays(today, offset);
    const key = toDateKey(date);
    if (blockedDates.has(key)) {
      days.push({ date: key, slots: [] });
      continue;
    }

    const windows = mergeWindows([
      ...activeRules.filter((rule) => rule.weekday === date.weekday),
      ...(extraWindows.get(key) ?? []),
    ]);

    const slots: string[] = [];
    for (const window of windows) {
      for (
        let minute = window.startMinute;
        minute + durationMin <= window.endMinute;
        minute += slotStepMin
      ) {
        const start = zonedToUtc({ ...date, minutes: minute }, timeZone);
        if (start.getTime() < earliest) continue;

        // The slot needs its own quiet time afterwards, and must not land
        // inside anything already booked (whose end already includes ITS
        // buffer — see collectBusy in src/lib/queries.ts).
        const end = start.getTime() + (durationMin + bufferMin) * 60_000;
        const clashes = busy.some(
          (interval) =>
            start.getTime() < interval.endsAt.getTime() &&
            end > interval.startsAt.getTime(),
        );
        if (!clashes) slots.push(start.toISOString());
      }
    }

    days.push({ date: key, slots });
  }

  return days;
}

/** True when `iso` is one of the offerable slots. The guard used on submit. */
export function isOfferedSlot(days: DaySlots[], iso: string) {
  const target = new Date(iso).getTime();
  return days.some((day) =>
    day.slots.some((slot) => new Date(slot).getTime() === target),
  );
}
