import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BookingCalendar } from "@/components/admin/BookingCalendar";
import { getAdminCalendar } from "@/lib/queries";
import { bookingConfig } from "@/lib/booking/config";
import {
  addDays,
  formatShortDate,
  fromDateKey,
  timeZoneLabel,
  toDateKey,
  utcToZoned,
} from "@/lib/booking/timezone";
import { cn } from "@/lib/utils";

export const metadata = { title: "Calendar" };

const WEEK = 7;

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  const { timeZone } = bookingConfig;

  const thisWeek = weekStartFor(todayKey(timeZone));
  const startKey = weekStartFor(validKey(start) ?? thisWeek);

  const calendar = await getAdminCalendar({ startKey, dayCount: WEEK });

  const previous = shift(startKey, -WEEK);
  const next = shift(startKey, WEEK);

  const sessions = calendar.days.reduce((total, day) => total + day.bookings.length, 0);
  const pending = calendar.days.reduce(
    (total, day) =>
      total + day.bookings.filter((booking) => booking.status === "PENDING").length,
    0,
  );

  return (
    <>
      <AdminPageHeader
        title="Calendar"
        description={`Your week to scale — every session over the hours you work. Times in ${timeZoneLabel(new Date(), timeZone)}.`}
        action={
          <Link
            href="/admin/bookings"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sage-deep/30 px-5 py-2.5 text-sm font-medium text-forest transition hover:bg-sage/50 sm:w-auto"
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            List view
          </Link>
        }
      />

      {/* Week navigation. The range reads first on a phone — knowing *which*
          week you're looking at matters more than the controls to change it. */}
      <div className="mb-5 flex flex-col-reverse gap-3 rounded-2xl border border-sage-deep/20 bg-paper p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2">
          <WeekLink href={`/admin/calendar?start=${previous}`} label="Previous week">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </WeekLink>
          <WeekLink href={`/admin/calendar?start=${next}`} label="Next week">
            <ChevronRight className="size-4" aria-hidden="true" />
          </WeekLink>
          <Link
            href="/admin/calendar"
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              startKey === thisWeek
                ? "border-forest bg-forest text-paper"
                : "border-sage-deep/25 text-forest hover:bg-sage/50",
            )}
          >
            This week
          </Link>
        </div>

        <div className="min-w-0 sm:text-right">
          <p className="truncate text-sm font-medium text-forest">
            {rangeLabel(startKey)}
          </p>
          <p className="text-xs text-muted">
            {sessions === 0
              ? "Nothing booked"
              : `${sessions} session${sessions === 1 ? "" : "s"}`}
            {pending > 0 && ` · ${pending} awaiting your answer`}
          </p>
        </div>
      </div>

      <BookingCalendar calendar={calendar} />
    </>
  );
}

function WeekLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full border border-sage-deep/25 text-forest transition-colors hover:bg-sage/50"
    >
      {children}
    </Link>
  );
}

// ─── Which week are we looking at ────────────────────────────────

/** Today's date in the practice's own timezone, not the server's. */
function todayKey(timeZone: string) {
  return toDateKey(utcToZoned(new Date(), timeZone));
}

/** Only accept a real `YYYY-MM-DD` from the query string. */
function validKey(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parts = fromDateKey(value);
  // Rejects 2026-02-31 and friends, which `fromDateKey` would happily roll over.
  return toDateKey(parts) === value ? value : null;
}

/** The Monday on or before a date — weeks read as weeks, not as rolling sevens. */
function weekStartFor(key: string) {
  const parts = fromDateKey(key);
  const backToMonday = (parts.weekday + 6) % 7; // Sunday (0) is 6 days into the week
  return toDateKey(addDays(parts, -backToMonday));
}

function shift(key: string, days: number) {
  return toDateKey(addDays(fromDateKey(key), days));
}

/** "Mon 10 Aug – Sun 16 Aug", built from pure calendar dates. */
function rangeLabel(startKey: string) {
  const label = (key: string) => {
    const parts = fromDateKey(key);
    return formatShortDate(
      new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)),
      "UTC",
    );
  };
  return `${label(startKey)} – ${label(shift(startKey, WEEK - 1))}`;
}
