"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  browserTimeZone,
  formatMinutes,
  formatShortDate,
  formatTime,
  fromDateKey,
  sameWallClock,
  timeZoneLabel,
} from "@/lib/booking/timezone";
import { chartLabels } from "@/lib/content/booking";
import { cn } from "@/lib/utils";
import type { DayGrid, GridSlot, SlotGrid, SlotStatus } from "@/lib/booking/slots";

/**
 * The booking chart: a week of the practitioner's diary at a glance, with every
 * time reading as free, already booked, or unavailable.
 *
 * Showing the taken times rather than quietly omitting them is the whole point.
 * A grid with three slots in it looks arbitrary — the same grid with the rest
 * marked "booked" reads as a real diary, and someone can see at once whether
 * Tuesday mornings are worth waiting for or simply never open.
 *
 * Two layouts, chosen by *container* width so this works both on the booking
 * page and inside the 384px chat assistant: a days × times matrix when there's
 * room, and a day strip over a list of times when there isn't. Both are driven
 * by the same week state, so navigating in one moves the other.
 */

const DAYS_PER_WEEK = 7;

/** Stable reference, so an out-of-range week can't retrigger the day effect. */
const NO_DAYS: DayGrid[] = [];

export function AvailabilityChart({
  grid,
  timeZone,
  selected,
  onSelect,
}: {
  grid: SlotGrid;
  /** The practice timezone, passed down from the server. */
  timeZone: string;
  /** ISO 8601 UTC start of the chosen slot, if any. */
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  const weeks = useMemo(() => chunk(grid.days, DAYS_PER_WEEK), [grid.days]);

  // Open on the first week that has something to offer, so nobody lands on a
  // fully-booked strip and concludes there's nothing at all.
  const firstOpenWeek = useMemo(
    () => Math.max(0, weeks.findIndex((week) => week.some((day) => day.freeCount > 0))),
    [weeks],
  );
  const [weekIndex, setWeekIndex] = useState(firstOpenWeek);
  useEffect(() => setWeekIndex(firstOpenWeek), [firstOpenWeek]);

  const week = weeks[weekIndex] ?? NO_DAYS;

  // The narrow layout shows one day at a time. Land on a day with space, and
  // re-land whenever availability shifts under us.
  const [activeDate, setActiveDate] = useState<string | null>(null);
  useEffect(() => {
    setActiveDate((current) =>
      current && week.some((day) => day.date === current && day.freeCount > 0)
        ? current
        : (week.find((day) => day.freeCount > 0)?.date ?? week[0]?.date ?? null),
    );
  }, [week]);

  const visitorZone = useMemo(browserTimeZone, []);

  /**
   * The visitor's own time for an instant — or null when it's the same time
   * they're already reading.
   *
   * Comparing zone *names* is not enough: a browser reporting "Asia/Calcutta"
   * against a practice set to "Asia/Kolkata" is the same clock under two names,
   * and printing "10:00 am / 10:00 am your time" under every slot is noise that
   * makes the chart look broken. Comparing the rendered times settles it, and
   * as a bonus it drops the line on exactly the rows where a DST-observing
   * visitor happens to line up anyway.
   */
  const localTimeFor = useCallback(
    (date: Date) =>
      sameWallClock(date, timeZone, visitorZone) ? null : formatTime(date, visitorZone),
    [timeZone, visitorZone],
  );

  // Rows the visible week actually uses — a week that never opens before noon
  // shouldn't be padded with six empty morning rows.
  const rows = useMemo(
    () =>
      grid.axis.filter((minute, index) =>
        week.some((day) => day.slots[index]?.status !== "closed"),
      ),
    [grid.axis, week],
  );

  // Only promise a second time in the footer if one is actually being shown.
  const showLocalTime = useMemo(
    () =>
      rows.some((minute) => {
        const index = grid.axis.indexOf(minute);
        const anchor = week.map((day) => day.slots[index]).find((slot) => slot?.start)?.start;
        return anchor ? localTimeFor(new Date(anchor)) !== null : false;
      }),
    [rows, grid.axis, week, localTimeFor],
  );

  if (grid.days.length === 0 || grid.axis.length === 0) return null;

  const activeDay = week.find((day) => day.date === activeDate) ?? week[0];
  const freeThisWeek = week.reduce((total, day) => total + day.freeCount, 0);

  return (
    <div className="space-y-4">
      <WeekNav
        week={week}
        weekIndex={weekIndex}
        weekCount={weeks.length}
        freeThisWeek={freeThisWeek}
        onMove={(delta) => setWeekIndex((index) => index + delta)}
      />

      {/* ── Wide: the full days × times matrix ───────────────────── */}
      {/* `min-w` is kept at the `@md` threshold itself (28rem), so the matrix
          appears only where it already fits. Any wider and it would switch on
          at a size that immediately needs sideways scrolling. */}
      <div className="hidden @md:block">
        <div className="overflow-x-auto rounded-2xl border border-sage-deep/20 bg-cream p-1">
          <div className="min-w-[28rem]">
            {/* Day headings */}
            <div
              className="grid gap-1 border-b border-sage-deep/15 pb-1"
              style={{ gridTemplateColumns: `3.6rem repeat(${week.length}, minmax(0, 1fr))` }}
            >
              <span aria-hidden="true" />
              {week.map((day) => (
                <DayHeading key={day.date} day={day} />
              ))}
            </div>

            {/* Times.
                One grid rather than a grid per row, so a day that never opens
                can be a single banner spanning the column instead of a stack of
                identical empty cells. */}
            <div className="max-h-[24rem] overflow-y-auto">
              <div
                className="grid gap-1 py-0.5"
                style={{
                  gridTemplateColumns: `3.6rem repeat(${week.length}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows.length}, minmax(2rem, auto))`,
                }}
              >
                {rows.map((minute, row) => (
                  <RowLabel
                    key={`t${minute}`}
                    minute={minute}
                    slots={week.map((day) => day.slots[grid.axis.indexOf(minute)])}
                    localTimeFor={localTimeFor}
                    style={{ gridColumn: 1, gridRow: row + 1 }}
                  />
                ))}

                {week.map((day, column) =>
                  isFullyClosed(day) ? (
                    <ClosedColumn
                      key={day.date}
                      blocked={day.blocked}
                      style={{ gridColumn: column + 2, gridRow: "1 / -1" }}
                    />
                  ) : (
                    rows.map((minute, row) => (
                      <MatrixCell
                        key={`${day.date}-${minute}`}
                        day={day}
                        slot={day.slots[grid.axis.indexOf(minute)]}
                        minute={minute}
                        selected={selected}
                        onSelect={onSelect}
                        style={{ gridColumn: column + 2, gridRow: row + 1 }}
                      />
                    ))
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Narrow: a day at a time ──────────────────────────────── */}
      <div className="@md:hidden">
        <div
          role="group"
          aria-label="Days this week"
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2"
        >
          {week.map((day) => {
            const active = day.date === activeDay?.date;
            const label = dayLabel(day.date);
            return (
              <button
                key={day.date}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveDate(day.date)}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-2 text-center transition-all duration-200 ease-soft",
                  active
                    ? "border-forest bg-forest text-paper shadow-soft"
                    : "border-sage-deep/25 bg-cream text-forest hover:-translate-y-0.5 hover:border-mint-deep/40",
                )}
              >
                <span
                  className={cn(
                    "block text-[0.62rem] uppercase tracking-[0.14em]",
                    active ? "text-mint-pale" : "text-muted",
                  )}
                >
                  {label.weekday}
                </span>
                <span className="block text-sm font-medium">{label.day}</span>
                <span
                  className={cn(
                    "block text-[0.62rem]",
                    active ? "text-mint-pale" : day.freeCount ? "text-mint-deep" : "text-muted",
                  )}
                >
                  {day.freeCount
                    ? `${day.freeCount} free`
                    : isFullyClosed(day)
                      ? day.blocked
                        ? chartLabels.holidayColumn
                        : chartLabels.closedColumn
                      : "—"}
                </span>
              </button>
            );
          })}
        </div>

        {activeDay && (
          <DayList
            day={activeDay}
            localTimeFor={localTimeFor}
            selected={selected}
            onSelect={onSelect}
          />
        )}
      </div>

      <Legend />

      <p className="text-xs text-muted">
        Times shown in {timeZoneLabel(new Date(), timeZone)}
        {showLocalTime ? ", with your own time beneath." : "."} {chartLabels.note}
      </p>
    </div>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────

function WeekNav({
  week,
  weekIndex,
  weekCount,
  freeThisWeek,
  onMove,
}: {
  week: DayGrid[];
  weekIndex: number;
  weekCount: number;
  freeThisWeek: number;
  onMove: (delta: number) => void;
}) {
  const first = week[0];
  const last = week[week.length - 1];
  if (!first || !last) return null;

  const range =
    week.length === 1
      ? dayLabel(first.date).full
      : `${dayLabel(first.date).full} – ${dayLabel(last.date).full}`;

  return (
    <div className="flex items-center justify-between gap-3">
      <NavButton
        label="Previous week"
        disabled={weekIndex === 0}
        onClick={() => onMove(-1)}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </NavButton>

      <div className="min-w-0 text-center">
        <p className="truncate text-sm font-medium text-forest">{range}</p>
        <p className="text-[0.7rem] text-muted">
          {freeThisWeek
            ? `${freeThisWeek} time${freeThisWeek === 1 ? "" : "s"} free this week`
            : chartLabels.weekEmpty}
        </p>
      </div>

      <NavButton
        label="Next week"
        disabled={weekIndex >= weekCount - 1}
        onClick={() => onMove(1)}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </NavButton>
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-sage-deep/25 bg-cream text-forest transition-colors hover:border-mint-deep/40 hover:bg-sage/40 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-sage-deep/25 disabled:hover:bg-cream"
    >
      {children}
    </button>
  );
}

function DayHeading({ day }: { day: DayGrid }) {
  const label = dayLabel(day.date);
  return (
    <div className="px-1 pb-1 text-center">
      <span className="block text-[0.62rem] uppercase tracking-[0.12em] text-muted">
        {label.weekday}
      </span>
      <span className="block text-sm font-medium text-forest">{label.day}</span>
      <span
        className={cn(
          "block text-[0.62rem]",
          day.freeCount ? "text-mint-deep" : "text-muted",
        )}
      >
        {isFullyClosed(day)
          ? day.blocked
            ? chartLabels.holidayColumn
            : chartLabels.closedColumn
          : day.freeCount
            ? `${day.freeCount} free`
            : day.bookedCount
              ? "Full"
              : "—"}
      </span>
    </div>
  );
}

function RowLabel({
  minute,
  slots,
  localTimeFor,
  style,
}: {
  minute: number;
  slots: (GridSlot | undefined)[];
  localTimeFor: (date: Date) => string | null;
  style?: CSSProperties;
}) {
  // The visitor's own time needs a real instant, which closed cells don't have.
  const anchor = slots.find((slot) => slot?.start)?.start;
  const local = anchor ? localTimeFor(new Date(anchor)) : null;
  return (
    <div className="flex flex-col justify-center pr-1 text-right" style={style}>
      <span className="text-[0.72rem] font-medium text-forest">
        {formatMinutes(minute)}
      </span>
      {local && (
        <span className="text-[0.6rem] leading-tight text-muted">{local}</span>
      )}
    </div>
  );
}

/**
 * One label down a day that never opens, in place of a column of identical
 * empty cells. `vertical-rl` plus a half turn reads bottom-to-top, keeping the
 * text upright for a left-to-right reader rather than leaving it on its head.
 */
function ClosedColumn({
  blocked,
  style,
}: {
  blocked: boolean;
  style?: CSSProperties;
}) {
  const label = blocked ? chartLabels.holidayColumn : chartLabels.closedColumn;
  return (
    <div
      style={style}
      title={label}
      className="grid place-items-center rounded-xl border border-sage-deep/15 bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,var(--color-sage-mist)_6px,var(--color-sage-mist)_12px)]"
    >
      <span
        className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-sage-deep"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
    </div>
  );
}

function MatrixCell({
  day,
  slot,
  minute,
  selected,
  onSelect,
  style,
}: {
  day: DayGrid;
  slot: GridSlot | undefined;
  minute: number;
  selected: string | null;
  onSelect: (iso: string) => void;
  style?: CSSProperties;
}) {
  const status = slot?.status ?? "closed";

  if (status === "closed") {
    return (
      <div
        aria-hidden="true"
        style={style}
        className="min-h-8 rounded-lg border border-transparent bg-[repeating-linear-gradient(135deg,transparent,transparent_5px,var(--color-sage-mist)_5px,var(--color-sage-mist)_10px)] opacity-70"
      />
    );
  }

  const isSelected = status === "free" && slot?.start === selected;
  const description = `${formatMinutes(minute)} on ${dayLabel(day.date).full} — ${
    chartLabels.status[status]
  }`;

  return (
    <button
      type="button"
      disabled={status !== "free"}
      aria-pressed={status === "free" ? isSelected : undefined}
      aria-label={description}
      title={description}
      style={style}
      onClick={() => slot?.start && onSelect(slot.start)}
      className={cn(
        "grid min-h-8 place-items-center rounded-lg border text-[0.68rem] font-medium transition-all duration-200 ease-soft",
        status === "free" &&
          !isSelected &&
          "border-mint-deep/35 bg-mint-soft text-mint-deep hover:-translate-y-0.5 hover:border-mint-deep hover:shadow-soft",
        isSelected && "border-forest bg-forest text-paper shadow-soft",
        status === "booked" && "cursor-not-allowed border-sand bg-sand text-muted",
        status === "past" &&
          "cursor-not-allowed border-sage-deep/15 bg-sage-mist/60 text-hint",
      )}
    >
      {status === "booked" ? (
        <X className="size-3" strokeWidth={2.5} aria-hidden="true" />
      ) : status === "past" ? (
        <span aria-hidden="true">·</span>
      ) : (
        <span aria-hidden="true">{isSelected ? "✓" : chartLabels.freeCell}</span>
      )}
    </button>
  );
}

/** The narrow layout's list of one day's times, all statuses shown. */
function DayList({
  day,
  localTimeFor,
  selected,
  onSelect,
}: {
  day: DayGrid;
  localTimeFor: (date: Date) => string | null;
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  // Closed times are dropped here rather than drawn: in a single-day list they
  // carry no information, where in the matrix they're what gives a column shape.
  const slots = day.slots.filter(
    (slot): slot is GridSlot & { status: Exclude<SlotStatus, "closed"> } =>
      slot.status !== "closed",
  );

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-sage-deep/20 bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,var(--color-sage-mist)_6px,var(--color-sage-mist)_12px)] p-5 text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-sage-deep">
          {day.blocked ? chartLabels.holidayColumn : chartLabels.closedColumn}
        </p>
        <p className="mt-2 text-sm text-muted">
          {day.blocked ? chartLabels.dayClosed : chartLabels.dayNothing}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot) => {
        const isSelected = slot.status === "free" && slot.start === selected;
        const start = slot.start ? new Date(slot.start) : null;
        const local = start ? localTimeFor(start) : null;
        return (
          <button
            key={slot.minute}
            type="button"
            disabled={slot.status !== "free"}
            aria-pressed={slot.status === "free" ? isSelected : undefined}
            onClick={() => slot.start && onSelect(slot.start)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-center transition-all duration-200 ease-soft",
              slot.status === "free" &&
                !isSelected &&
                "border-mint-deep/35 bg-mint-soft text-forest hover:-translate-y-0.5 hover:border-mint-deep hover:shadow-soft",
              isSelected && "border-forest bg-forest text-paper shadow-soft",
              slot.status === "booked" &&
                "cursor-not-allowed border-sand bg-sand text-muted",
              slot.status === "past" &&
                "cursor-not-allowed border-sage-deep/15 bg-sage-mist/60 text-hint",
            )}
          >
            <span className="block text-sm font-medium">
              {formatMinutes(slot.minute)}
            </span>
            {slot.status === "free" && local ? (
              <span
                className={cn(
                  "block text-[0.66rem]",
                  isSelected ? "text-mint-pale" : "text-muted",
                )}
              >
                {local} your time
              </span>
            ) : (
              <span className="block text-[0.66rem]">
                {slot.status === "free"
                  ? chartLabels.freeCell
                  : chartLabels.status[slot.status]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] text-muted">
      <li className="flex items-center gap-1.5">
        <span className="size-3 rounded border border-mint-deep/35 bg-mint-soft" />
        {chartLabels.legend.free}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-3 rounded border border-sand bg-sand" />
        {chartLabels.legend.booked}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-3 rounded border border-sage-deep/15 bg-sage-mist/60" />
        {chartLabels.legend.unavailable}
      </li>
    </ul>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────

/** A day the practice never opens — as opposed to one merely fully booked. */
function isFullyClosed(day: DayGrid) {
  return day.slots.every((slot) => slot.status === "closed");
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    out.push(items.slice(index, index + size));
  }
  return out;
}

/**
 * A `YYYY-MM-DD` key as display parts. Formatted at midday UTC *as* UTC, so it
 * is a pure calendar label with no chance of tipping into the day either side.
 */
function dayLabel(key: string) {
  const parts = fromDateKey(key);
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
  const short = formatShortDate(date, "UTC"); // "Fri 15 Aug"
  const [weekday, day, month] = short.split(" ");
  return { weekday, day, month, full: short };
}
