"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import {
  browserTimeZone,
  formatShortDate,
  formatTime,
  fromDateKey,
  timeZoneLabel,
} from "@/lib/booking/timezone";
import { bookingLabels, crisisNote } from "@/lib/content/booking";
import { cn } from "@/lib/utils";
import type { BookingFlowState } from "@/components/booking/useBookingFlow";

/**
 * Step three: a strip of days that actually have space, then that day's times.
 *
 * Times are shown in the practice's timezone with the visitor's own time
 * underneath whenever the two differ — a missed session because someone read
 * 3pm as their own 3pm is the exact failure this prevents.
 */
export function ChooseTime({
  flow,
  timeZone,
}: {
  flow: BookingFlowState;
  /** The practice timezone, passed down from the server. */
  timeZone: string;
}) {
  const openDays = useMemo(
    () => flow.days.filter((day) => day.slots.length > 0),
    [flow.days],
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // Land on the first day with space, and re-land whenever availability changes
  // under us (a slot taken elsewhere can empty the day being looked at).
  useEffect(() => {
    setActiveDate((current) =>
      current && openDays.some((day) => day.date === current)
        ? current
        : (openDays[0]?.date ?? null),
    );
  }, [openDays]);

  const visitorZone = useMemo(browserTimeZone, []);
  const showLocalTime = visitorZone !== timeZone;

  const day = openDays.find((entry) => entry.date === activeDate);

  if (flow.loadingSlots) {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {bookingLabels.loadingTimes}
      </p>
    );
  }

  if (openDays.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-sage-deep/40 bg-cream/80 p-5 leading-relaxed text-muted">
        {bookingLabels.noTimesAtAll}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Day strip */}
      {/* A toggle group, not tabs: `role="tab"` would promise a tabpanel and
          arrow-key navigation that don't exist here. Plain buttons with
          aria-pressed describe what this actually is. */}
      <div
        role="group"
        aria-label="Available days"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
      >
        {openDays.map((entry) => {
          const parts = fromDateKey(entry.date);
          // Midday UTC, formatted as UTC — a pure calendar-date label with no
          // chance of tipping into the day either side.
          const label = formatShortDate(
            new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)),
            "UTC",
          );
          const [weekday, ...rest] = label.split(" ");
          const active = entry.date === activeDate;
          return (
            <button
              key={entry.date}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveDate(entry.date)}
              className={cn(
                "shrink-0 rounded-2xl border px-4 py-2.5 text-center transition-all duration-200 ease-soft",
                active
                  ? "border-forest bg-forest text-paper shadow-soft"
                  : "border-sage-deep/25 bg-cream text-forest hover:border-mint-deep/40 hover:-translate-y-0.5",
              )}
            >
              <span
                className={cn(
                  "block text-[0.68rem] uppercase tracking-[0.14em]",
                  active ? "text-mint-pale" : "text-muted",
                )}
              >
                {weekday}
              </span>
              <span className="block text-sm font-medium">{rest.join(" ")}</span>
              <span
                className={cn(
                  "block text-[0.68rem]",
                  active ? "text-mint-pale" : "text-muted",
                )}
              >
                {entry.slots.length} free
              </span>
            </button>
          );
        })}
      </div>

      {/* Times for the chosen day. Columns come from the *container* width, so
          the same grid works in the 384px assistant and on the full page. */}
      {day ? (
        <div className="grid grid-cols-2 gap-2 @md:grid-cols-3">
          {day.slots.map((iso) => {
            const start = new Date(iso);
            const selected = flow.startsAt === iso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => flow.chooseSlot(iso)}
                aria-pressed={selected}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-center transition-all duration-200 ease-soft",
                  selected
                    ? "border-forest bg-forest text-paper shadow-soft"
                    : "border-sage-deep/25 bg-cream text-forest hover:-translate-y-0.5 hover:border-mint-deep/40 hover:shadow-soft",
                )}
              >
                <span className="block text-sm font-medium">
                  {formatTime(start, timeZone)}
                </span>
                {showLocalTime && (
                  <span
                    className={cn(
                      "block text-[0.68rem]",
                      selected ? "text-mint-pale" : "text-muted",
                    )}
                  >
                    {formatTime(start, visitorZone)} your time
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted">{bookingLabels.noTimes}</p>
      )}

      <p className="text-xs text-muted">
        Times shown in {timeZoneLabel(new Date(), timeZone)}
        {showLocalTime ? ", with your own time beneath." : "."}
      </p>

      {/* Not decoration — see content/booking.ts. */}
      <div className="flex items-start gap-3 rounded-2xl border border-sage-deep/25 bg-sand p-3.5 @md:p-4">
        <ShieldAlert
          className="mt-0.5 size-4 shrink-0 text-mint-deep @md:size-5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p className="text-[0.8rem] leading-relaxed text-forest/90 @md:text-sm">
          <span className="font-semibold text-forest">{crisisNote.title}. </span>
          {crisisNote.text}
        </p>
      </div>
    </div>
  );
}
