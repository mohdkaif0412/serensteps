import Link from "next/link";
import { MapPin, Phone, Video } from "lucide-react";
import {
  MODE_LABELS,
  STATUS_LABELS,
  type BookingStatus,
  type SessionMode,
} from "@/lib/booking/constants";
import { formatMinutes, formatShortDate, fromDateKey } from "@/lib/booking/timezone";
import { chartLabels } from "@/lib/content/booking";
import { cn } from "@/lib/utils";
import type { AdminCalendar, CalendarBooking, CalendarDay } from "@/lib/queries";
import type { Window } from "@/lib/booking/slots";

/**
 * The practitioner's week, drawn to scale.
 *
 * Two renderings of the same data, deliberately. The grid is the chart — hours
 * down the side, days across, sessions as blocks over them — and it is
 * `aria-hidden`, because absolutely-positioned boxes are a poor thing to
 * navigate with a screen reader. The agenda beneath it is the accessible
 * reading of the same week, and it's also what's genuinely useful on a phone.
 * Neither is decoration; keep both in step.
 *
 * Two rules this layout depends on, both learned the hard way:
 *
 *   · Shade what's CLOSED, never what's open. The axis is trimmed to the hours
 *     actually worked, so tinting the working hours tints practically the whole
 *     chart — seven identical green slabs with nothing to draw the eye. An open
 *     hour is blank canvas; only unavailable time gets ink.
 *   · The columns are one continuous grid separated by hairlines, not cards
 *     with gaps. Gaps read as seven separate lists rather than one week.
 */

/** Vertical scale — 8 working hours land at a comfortable ~580px. */
const PX_PER_MINUTE = 1.2;

/** Floor for a block, so a 15-minute session still fits a legible name. */
const MIN_BLOCK = 26;

const modeIcons: Record<SessionMode, typeof Video> = {
  ONLINE: Video,
  IN_PERSON: MapPin,
  PHONE: Phone,
};

/** Block fills. Confirmed is the loud one — it's the week as it will happen. */
const statusBlock: Record<BookingStatus, string> = {
  PENDING: "border-amber-300 bg-amber-50 text-forest",
  CONFIRMED: "border-mint-deep/40 bg-mint-soft text-forest",
  COMPLETED: "border-sage-deep/40 bg-sage text-forest",
  CANCELLED: "border-sage-deep/30 bg-sage/50 text-muted",
  NO_SHOW: "border-sage-deep/40 bg-sage/60 text-muted",
};

/** The accent rail down the left of a block — the status at a glance. */
const statusRail: Record<BookingStatus, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-forest",
  COMPLETED: "bg-sage-deep",
  CANCELLED: "bg-sage-deep/50",
  NO_SHOW: "bg-sage-deep/60",
};

/** A soft diagonal hatch, used wherever the practice isn't open. */
const HATCH =
  "bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,var(--color-sage-mist)_6px,var(--color-sage-mist)_12px)]";

export function BookingCalendar({ calendar }: { calendar: AdminCalendar }) {
  const { days, axisStart, axisEnd, nowMinute } = calendar;
  if (days.length === 0) return null;

  const span = Math.max(60, axisEnd - axisStart);
  const bodyHeight = span * PX_PER_MINUTE;

  // Rules every half hour, not every hour. Slots are offered on the half hour,
  // so an 11:30 session with only hour lines behind it floats between them and
  // looks misplaced. Only the hours are *labelled* though — a number against
  // every line turns the gutter into a wall of text.
  const hours: number[] = [];
  const halves: number[] = [];
  for (let minute = Math.ceil(axisStart / 30) * 30; minute <= axisEnd; minute += 30) {
    (minute % 60 === 0 ? hours : halves).push(minute);
  }

  const top = (minute: number) =>
    (clamp(minute, axisStart, axisEnd) - axisStart) * PX_PER_MINUTE;
  const height = (from: number, to: number) =>
    Math.max(
      0,
      (clamp(to, axisStart, axisEnd) - clamp(from, axisStart, axisEnd)) * PX_PER_MINUTE,
    );

  const columns = `4rem repeat(${days.length}, minmax(0, 1fr))`;
  const nowVisible =
    nowMinute !== null && nowMinute >= axisStart && nowMinute <= axisEnd;

  return (
    <div className="space-y-6">
      {/* ── The chart ────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-2xl border border-sage-deep/25 bg-paper shadow-soft"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[52rem]">
            {/* Day headings */}
            <div
              className="grid border-b border-sage-deep/25 bg-cream"
              style={{ gridTemplateColumns: columns }}
            >
              <span className="border-r border-sage-deep/15" />
              {days.map((day, index) => (
                <ColumnHeading
                  key={day.date}
                  day={day}
                  last={index === days.length - 1}
                />
              ))}
            </div>

            {/* Hours + columns */}
            <div className="grid" style={{ gridTemplateColumns: columns }}>
              {/* Time gutter */}
              <div
                className="relative border-r border-sage-deep/15 bg-cream/50"
                style={{ height: bodyHeight }}
              >
                {hours.map((minute) => (
                  <span
                    key={minute}
                    className="absolute right-2 -translate-y-1/2 text-[0.7rem] font-medium tabular-nums text-muted"
                    style={{ top: top(minute) }}
                  >
                    {formatMinutes(minute)}
                  </span>
                ))}
                {nowVisible && (
                  <span
                    className="absolute right-1.5 z-20 -translate-y-1/2 rounded-full bg-forest px-1.5 py-0.5 text-[0.6rem] font-semibold text-paper shadow-soft"
                    style={{ top: top(nowMinute) }}
                  >
                    {formatMinutes(nowMinute)}
                  </span>
                )}
              </div>

              {/* One column per day */}
              {days.map((day, index) => {
                const closed = day.windows.length === 0;
                const last = index === days.length - 1;
                return (
                  <div
                    key={day.date}
                    className={cn(
                      "relative",
                      !last && "border-r border-sage-deep/15",
                      closed && HATCH,
                      day.isToday && !closed && "bg-mint-soft/25",
                    )}
                    style={{ height: bodyHeight }}
                  >
                    {closed ? (
                      <ClosedColumn blocked={day.blocked} />
                    ) : (
                      <>
                        {/* Hours OUTSIDE the working windows. The open hours are
                            left as blank canvas so the sessions carry the colour. */}
                        {offHours(day.windows, axisStart, axisEnd).map((gap) => (
                          <div
                            key={`${gap.from}-${gap.to}`}
                            className={cn("absolute inset-x-0", HATCH)}
                            style={{ top: top(gap.from), height: height(gap.from, gap.to) }}
                          />
                        ))}

                        {/* Rules — half hours quieter than hours */}
                        {halves.map((minute) => (
                          <div
                            key={`h${minute}`}
                            className="absolute inset-x-0 border-t border-dotted border-sage-deep/25"
                            style={{ top: top(minute) }}
                          />
                        ))}
                        {hours.map((minute) => (
                          <div
                            key={minute}
                            className="absolute inset-x-0 border-t border-sage-deep/20"
                            style={{ top: top(minute) }}
                          />
                        ))}

                        {/* Where we are right now */}
                        {day.isToday && nowVisible && (
                          <div
                            className="absolute inset-x-0 z-10 border-t-2 border-forest"
                            style={{ top: top(nowMinute) }}
                          >
                            <span className="absolute -left-1 -top-[5px] size-2 rounded-full bg-forest" />
                          </div>
                        )}

                        {/* Sessions */}
                        {packLanes(day.bookings).map(({ booking, lane, lanes }) => {
                          const status = booking.status as BookingStatus;
                          const sessionHeight = Math.max(
                            MIN_BLOCK,
                            height(booking.startMinute, booking.endMinute),
                          );
                          const bufferHeight = height(
                            booking.endMinute,
                            booking.endMinute + booking.bufferMin,
                          );
                          return (
                            <div
                              key={booking.id}
                              className="absolute z-[5] pl-1 pr-1.5"
                              style={{
                                top: top(booking.startMinute),
                                left: `${(lane / lanes) * 100}%`,
                                width: `${100 / lanes}%`,
                              }}
                            >
                              {/* The session and its quiet time are one card:
                                  the buffer is a faded continuation, not a loose
                                  grey stub floating under the block. */}
                              <Link
                                href={`/admin/bookings/${booking.id}`}
                                className={cn(
                                  "flex flex-col overflow-hidden rounded-md border shadow-soft transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:shadow-lift",
                                  statusBlock[status],
                                )}
                                style={{ height: sessionHeight + bufferHeight }}
                              >
                                <span
                                  className="flex shrink-0"
                                  style={{ height: sessionHeight }}
                                >
                                  <span
                                    className={cn("w-1 shrink-0", statusRail[status])}
                                    aria-hidden="true"
                                  />
                                  <span className="min-w-0 flex-1 px-1.5 py-1">
                                    <span className="block truncate text-[0.7rem] font-semibold leading-tight">
                                      {booking.clientName}
                                    </span>
                                    {sessionHeight > 34 && (
                                      <span className="block truncate text-[0.65rem] leading-tight opacity-75">
                                        {formatMinutes(booking.startMinute)}
                                      </span>
                                    )}
                                    {sessionHeight > 58 && (
                                      <span className="mt-0.5 block truncate text-[0.62rem] leading-tight opacity-65">
                                        {booking.sessionTypeName}
                                      </span>
                                    )}
                                  </span>
                                </span>
                                {bufferHeight > 0 && (
                                  <span
                                    className={cn("shrink-0 opacity-60", HATCH)}
                                    style={{ height: bufferHeight }}
                                    aria-hidden="true"
                                  />
                                )}
                              </Link>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* A week to scale cannot honestly fit a phone, so it scrolls rather than
          being squashed — but say so, or it just looks cut off. The list below
          is the version that actually reads well at this width. */}
      <p className="-mt-2 text-xs text-muted lg:hidden">
        Swipe the chart sideways to see the rest of the week.
      </p>

      <Legend />

      {/* ── The same week, readable ──────────────────────────────── */}
      <Agenda days={days} />
    </div>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────

/**
 * One label down a closed day, instead of a column of identical empty cells.
 * `vertical-rl` plus a half turn reads bottom-to-top, keeping the text upright
 * for a left-to-right reader rather than leaving it on its head.
 */
function ClosedColumn({ blocked }: { blocked: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span
        className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-sage-deep"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {blocked ? chartLabels.holidayColumn : chartLabels.closedColumn}
      </span>
    </div>
  );
}

function ColumnHeading({ day, last }: { day: CalendarDay; last: boolean }) {
  const label = dayLabel(day.date);
  const count = day.bookings.length;
  const closed = day.windows.length === 0;

  return (
    <div
      className={cn(
        "px-1 py-2.5 text-center",
        !last && "border-r border-sage-deep/15",
        day.isToday && "bg-mint-soft/50",
      )}
    >
      <span className="block text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted">
        {label.weekday}
      </span>
      {/* Today is a filled disc around the date, the way a calendar marks it —
          rather than flooding the whole cell and shouting over the week. */}
      <span
        className={cn(
          "mx-auto mt-0.5 grid size-8 place-items-center rounded-full font-display text-lg leading-none",
          day.isToday ? "bg-forest text-paper" : "text-forest",
        )}
      >
        {label.day}
      </span>
      <span
        className={cn(
          "mt-1 block text-[0.62rem]",
          closed ? "text-muted" : count ? "font-medium text-mint-deep" : "text-transparent",
        )}
      >
        {closed
          ? day.blocked
            ? chartLabels.holidayColumn
            : chartLabels.closedColumn
          : count
            ? `${count} booked`
            : /* Keeps the row height steady without printing "Free" seven times */
              "·"}
      </span>
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
      <LegendItem className="border-mint-deep/40 bg-mint-soft">Confirmed</LegendItem>
      <LegendItem className="border-amber-300 bg-amber-50">
        Awaiting your answer
      </LegendItem>
      <LegendItem className="border-sage-deep/40 bg-sage">Been and gone</LegendItem>
      <LegendItem className={cn("border-sage-deep/25", HATCH)}>
        Closed / quiet time
      </LegendItem>
    </ul>
  );
}

function LegendItem({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-1.5">
      <span className={cn("size-3 rounded border", className)} />
      {children}
    </li>
  );
}

/** The week as a list — the accessible reading, and the one that works on a phone. */
function Agenda({ days }: { days: CalendarDay[] }) {
  const busyDays = days.filter((day) => day.bookings.length > 0);

  if (busyDays.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-sage-deep/30 bg-paper p-5 text-sm text-muted">
        No sessions booked this week.
      </p>
    );
  }

  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl text-forest">This week, in order</h2>
      {busyDays.map((day) => {
        const count = day.bookings.length;
        return (
          <div key={day.date}>
            {/* The date, a rule filling the gap, then the count — so each day
                reads as a band across the list rather than a stray bold line. */}
            <h3 className="flex items-center gap-3 text-sm font-semibold text-forest">
              <span className="shrink-0">{dayLabel(day.date).full}</span>
              {day.isToday && (
                <span className="shrink-0 rounded-full bg-mint px-2 py-0.5 text-[0.65rem] font-medium text-forest">
                  Today
                </span>
              )}
              <span className="h-px flex-1 bg-sage-deep/25" aria-hidden="true" />
              <span className="shrink-0 text-xs font-normal text-muted">
                {count} session{count === 1 ? "" : "s"}
              </span>
            </h3>
            <ul className="mt-2.5 divide-y divide-sage-deep/15 overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper shadow-soft">
              {day.bookings.map((booking) => (
                <li key={booking.id}>
                  <AgendaRow booking={booking} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

/**
 * One session in the list.
 *
 * A single compact card at every width, rather than a layout that reflows into
 * a different shape on a phone. Two earlier attempts failed the same way from
 * opposite directions: one row of four competing columns squashed the name to a
 * letter, and simply stacking those columns left a shapeless run of left-
 * aligned lines with an orphaned icon under it.
 *
 * What holds it together is a hierarchy that doesn't change with the viewport:
 * a status rail down the edge, the time and its status chip sharing the top
 * line, the client's name as the one prominent thing, and the softer detail
 * beneath in a single line that truncates as a unit.
 */
function AgendaRow({ booking }: { booking: CalendarBooking }) {
  const status = booking.status as BookingStatus;
  const mode = booking.mode as SessionMode;
  const ModeIcon = modeIcons[mode] ?? Video;
  const modeLabel = MODE_LABELS[mode] ?? booking.mode;

  return (
    <Link
      href={`/admin/bookings/${booking.id}`}
      className="flex items-stretch gap-3 px-3 py-2.5 transition-colors hover:bg-sage/30 sm:px-4 sm:py-3"
    >
      <span
        className={cn("w-1 shrink-0 rounded-full", statusRail[status])}
        aria-hidden="true"
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-semibold tabular-nums text-forest">
            {formatMinutes(booking.startMinute)} – {formatMinutes(booking.endMinute)}
          </span>
          <span
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.68rem] font-medium",
              statusBlock[status],
            )}
          >
            {STATUS_LABELS[status]}
          </span>
        </span>

        <span className="mt-1 block truncate text-sm font-medium text-forest">
          {booking.clientName}
          {booking.firstTime && (
            <span className="ml-2 align-middle text-[0.65rem] font-medium uppercase tracking-[0.1em] text-mint-deep">
              First time
            </span>
          )}
        </span>

        {/* Session type and mode truncate together — one quiet line, not two
            competing ones with a lone icon stranded on the end. */}
        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          <ModeIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {booking.sessionTypeName} · {modeLabel}
          </span>
        </span>
      </span>
    </Link>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────

function clamp(value: number, low: number, high: number) {
  return Math.min(high, Math.max(low, value));
}

/**
 * The stretches inside the drawn frame that the practice ISN'T open for.
 *
 * The complement of the working windows, which is what actually gets shaded —
 * on a week of identical hours this returns nothing at all, and the chart stays
 * clean. It only draws ink on the days that genuinely differ.
 */
function offHours(windows: Window[], axisStart: number, axisEnd: number) {
  const sorted = [...windows].sort((a, b) => a.startMinute - b.startMinute);
  const gaps: { from: number; to: number }[] = [];
  let cursor = axisStart;
  for (const window of sorted) {
    if (window.startMinute > cursor) gaps.push({ from: cursor, to: window.startMinute });
    cursor = Math.max(cursor, window.endMinute);
  }
  if (cursor < axisEnd) gaps.push({ from: cursor, to: axisEnd });
  return gaps.filter((gap) => gap.to > gap.from);
}

/**
 * Side-by-side placement for sessions that overlap.
 *
 * The slot engine won't produce a clash, but a hand-moved booking or a shortened
 * buffer can — and two blocks stacked exactly on top of each other would hide
 * one of them entirely, which is the one failure a diary must not have.
 */
function packLanes(bookings: CalendarBooking[]) {
  const sorted = [...bookings].sort(
    (a, b) => a.startMinute - b.startMinute || a.endMinute - b.endMinute,
  );
  const laneEnds: number[] = [];
  const placed = sorted.map((booking) => {
    let lane = laneEnds.findIndex((end) => end <= booking.startMinute);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = booking.endMinute;
    return { booking, lane };
  });
  return placed.map((entry) => ({ ...entry, lanes: Math.max(1, laneEnds.length) }));
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
