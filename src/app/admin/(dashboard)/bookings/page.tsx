import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Flash } from "@/components/admin/Flash";
import { BookingRow } from "@/components/admin/BookingRow";
import { cn } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma";

export const metadata = { title: "Bookings" };

const flashMessages: Record<string, string> = {
  confirmed: "Booking confirmed — they've been emailed",
  rescheduled: "Booking moved — they've been emailed",
  saved: "Saved",
};

const VIEWS = ["pending", "upcoming", "past", "cancelled"] as const;
type View = (typeof VIEWS)[number];

const VIEW_LABELS: Record<View, string> = {
  pending: "Requests",
  upcoming: "Upcoming",
  past: "Past",
  cancelled: "Cancelled",
};

const include = { client: true, sessionType: true } as const;

/** The filter and sort each tab means, in one place. */
function viewQuery(view: View, now: Date): Prisma.BookingFindManyArgs {
  switch (view) {
    case "pending":
      // Requests from the recent past stay visible — a missed one still needs
      // answering, and silently hiding it would be the worst outcome here.
      return {
        where: { status: "PENDING" },
        orderBy: { startsAt: "asc" },
      };
    case "upcoming":
      return {
        where: { status: "CONFIRMED", startsAt: { gte: now } },
        orderBy: { startsAt: "asc" },
      };
    case "past":
      return {
        where: {
          startsAt: { lt: now },
          status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] },
        },
        orderBy: { startsAt: "desc" },
      };
    case "cancelled":
      return { where: { status: "CANCELLED" }, orderBy: { startsAt: "desc" } };
  }
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; flash?: string }>;
}) {
  const { view: rawView, flash } = await searchParams;
  const now = new Date();
  const view: View = VIEWS.includes(rawView as View) ? (rawView as View) : "pending";

  const [bookings, counts] = await Promise.all([
    prisma.booking.findMany({ ...viewQuery(view, now), include }),
    Promise.all(
      VIEWS.map((name) =>
        prisma.booking.count({ where: viewQuery(name, now).where }),
      ),
    ),
  ]);

  return (
    <>
      <Flash message={flash ? flashMessages[flash] : undefined} />
      <AdminPageHeader
        title="Bookings"
        description={
          counts[0] > 0
            ? `${counts[0]} request${counts[0] === 1 ? "" : "s"} waiting for your answer.`
            : "Every session requested through the site."
        }
        action={
          <Link
            href="/admin/availability"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sage-deep/30 px-5 py-2.5 text-sm font-medium text-forest transition hover:bg-sage/50 sm:w-auto"
          >
            Edit availability
          </Link>
        }
      />

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Filter bookings">
        {VIEWS.map((name, index) => {
          const active = name === view;
          return (
            <Link
              key={name}
              href={`/admin/bookings?view=${name}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-forest bg-forest text-paper"
                  : "border-sage-deep/25 bg-paper text-forest hover:bg-sage/40",
              )}
            >
              {VIEW_LABELS[name]}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-forest-soft text-mint-pale" : "bg-sage text-forest",
                )}
              >
                {counts[index]}
              </span>
            </Link>
          );
        })}
      </nav>

      {bookings.length ? (
        <div className="space-y-3 sm:space-y-4">
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title={
            view === "pending"
              ? "No requests waiting"
              : `Nothing under ${VIEW_LABELS[view].toLowerCase()}`
          }
          description="Sessions booked through the website appear here, ready to confirm."
        />
      )}
    </>
  );
}
