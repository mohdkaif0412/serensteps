/**
 * Slot generation — the one genuinely fiddly piece of the booking engine, kept
 * pure and dependency-free so it can be reasoned about (and tested) on its own.
 *
 * Inputs are the practitioner's weekly rules, any dated exceptions, and the
 * bookings already holding time.
 *
 * `buildSlotGrid` is the one real output: every candidate time across the
 * horizon with *why* it is or isn't offerable (free / booked / too soon /
 * closed). That's what the availability chart draws.
 *
 * `slotsFromGrid` narrows the same grid to the free starts, and is what the
 * booking flow and the server-side re-check on submit both go through — a slot
 * the visitor sends back must still appear there, or the booking is refused.
 * Deriving one from the other means the chart and the guard cannot disagree
 * about what is actually bookable.
 */

import {
  addDays,
  fromDateKey,
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

/**
 * Why a candidate time is or isn't offerable. The chart draws all four; the
 * booking flow only ever lets someone press a `free` one.
 */
export const SLOT_STATUSES = ["free", "booked", "past", "closed"] as const;
export type SlotStatus = (typeof SLOT_STATUSES)[number];

export type GridSlot = {
  minute: number;
  status: SlotStatus;
  start: string | null;
};

export type DayGrid = {
  date: string;
  weekday: number;
  blocked: boolean;
  slots: GridSlot[];
  freeCount: number;
  bookedCount: number;
};

export type SlotGrid = {
  timeZone: string;
  durationMin: number;
  /**
   * Minutes-from-midnight of every time that appears on *any* day, ascending.
   * The shared axis — days with narrower hours simply read `closed` there.
   */
  axis: number[];
  days: DayGrid[];
};

export const EMPTY_SLOT_GRID: SlotGrid = {
  timeZone: "UTC",
  durationMin: 0,
  axis: [],
  days: [],
};

/** The practitioner's open hours for one date, weekly rules and overrides merged. */
export type DayWindows = {
  date: string;
  weekday: number;
  blocked: boolean;
  windows: Window[];
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

/**
 * The practitioner's open hours for each date in the horizon — weekly rules,
 * with dated exceptions layered over the top.
 *
 * Split out because two very different things need it: the slot grid below,
 * and the admin calendar, which shades working hours behind real bookings and
 * has no session length to step through.
 */
export function buildDayWindows({
  timeZone,
  rules,
  exceptions,
  horizonDays,
  from,
}: Pick<
  BuildSlotsInput,
  "timeZone" | "rules" | "exceptions" | "horizonDays" | "from"
>): DayWindows[] {
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

  const days: DayWindows[] = [];
  const today: ZonedParts = utcToZoned(from, timeZone);

  for (let offset = 0; offset <= horizonDays; offset++) {
    const date = addDays(today, offset);
    const key = toDateKey(date);
    const blocked = blockedDates.has(key);
    days.push({
      date: key,
      weekday: date.weekday,
      blocked,
      windows: blocked
        ? []
        : mergeWindows([
            ...activeRules.filter((rule) => rule.weekday === date.weekday),
            ...(extraWindows.get(key) ?? []),
          ]),
    });
  }

  return days;
}

/**
 * Every candidate time across the horizon, each labelled with why it is or
 * isn't offerable. Days are padded onto a shared axis so the result can be
 * drawn straight as a chart: one row per time, one column per day.
 */
export function buildSlotGrid(input: BuildSlotsInput): SlotGrid {
  const { timeZone, busy, durationMin, bufferMin, slotStepMin, leadTimeHours, from } =
    input;
  const earliest = from.getTime() + leadTimeHours * 3_600_000;

  // First pass: walk each day's windows, keeping only the minutes that a
  // session of this length actually fits into, and collect the shared axis.
  const axisMinutes = new Set<number>();
  const drafts = buildDayWindows(input).map((day) => {
    const parts = fromDateKey(day.date);
    const byMinute = new Map<number, GridSlot>();

    for (const window of day.windows) {
      for (
        let minute = window.startMinute;
        minute + durationMin <= window.endMinute;
        minute += slotStepMin
      ) {
        const start = zonedToUtc({ ...parts, minutes: minute }, timeZone);

        // The slot needs its own quiet time afterwards, and must not land
        // inside anything already booked (whose end already includes ITS
        // buffer — see collectBusy in src/lib/queries.ts).
        const end = start.getTime() + (durationMin + bufferMin) * 60_000;
        const taken = busy.some(
          (interval) =>
            start.getTime() < interval.endsAt.getTime() &&
            end > interval.startsAt.getTime(),
        );

        // Order matters: a time inside the notice period is reported as `past`
        // whether or not it's also taken, so the public chart never says who is
        // sitting in a slot nobody could have booked anyway.
        const status: SlotStatus =
          start.getTime() < earliest ? "past" : taken ? "booked" : "free";

        byMinute.set(minute, { minute, status, start: start.toISOString() });
        axisMinutes.add(minute);
      }
    }

    return { day, byMinute };
  });

  // Second pass: pad every day out to the full axis. A day whose hours are
  // narrower than the week's simply reads `closed` in the gaps.
  const axis = [...axisMinutes].sort((a, b) => a - b);
  const days: DayGrid[] = drafts.map(({ day, byMinute }) => {
    let freeCount = 0;
    let bookedCount = 0;
    const slots = axis.map((minute) => {
      const slot = byMinute.get(minute);
      if (!slot) return { minute, status: "closed" as const, start: null };
      if (slot.status === "free") freeCount++;
      if (slot.status === "booked") bookedCount++;
      return slot;
    });
    return {
      date: day.date,
      weekday: day.weekday,
      blocked: day.blocked,
      slots,
      freeCount,
      bookedCount,
    };
  });

  return { timeZone, durationMin, axis, days };
}

/** The grid narrowed to what can actually be booked. */
export function slotsFromGrid(grid: SlotGrid): DaySlots[] {
  return grid.days.map((day) => ({
    date: day.date,
    slots: day.slots
      .filter((slot) => slot.status === "free")
      .map((slot) => slot.start as string),
  }));
}

/** True when `iso` is one of the offerable slots. The guard used on submit. */
export function isOfferedSlot(days: DaySlots[], iso: string) {
  const target = new Date(iso).getTime();
  return days.some((day) =>
    day.slots.some((slot) => new Date(slot).getTime() === target),
  );
}
