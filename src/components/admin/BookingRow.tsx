import Link from "next/link";
import {
  Check,
  Mail,
  MapPin,
  Phone,
  UserX,
  Video,
  X,
} from "lucide-react";
import { StatusButton } from "@/components/admin/StatusButton";
import {
  MODE_LABELS,
  STATUS_LABELS,
  type BookingStatus,
  type SessionMode,
} from "@/lib/booking/constants";
import { bookingConfig } from "@/lib/booking/config";
import { formatTime, utcToZoned } from "@/lib/booking/timezone";
import { cn } from "@/lib/utils";
import type { Booking, Client, SessionType } from "@/generated/prisma";

export type AdminBooking = Booking & { client: Client; sessionType: SessionType };

const modeIcons: Record<SessionMode, typeof Video> = {
  ONLINE: Video,
  IN_PERSON: MapPin,
  PHONE: Phone,
};

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-sand text-forest",
  CONFIRMED: "bg-mint text-forest",
  COMPLETED: "bg-sage text-forest",
  CANCELLED: "bg-sage/60 text-muted",
  NO_SHOW: "bg-sage/60 text-muted",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * One booking in the admin list. Pending requests carry the same mint ring the
 * unread messages do — the two are the practice's real inbox, and they should
 * look like siblings.
 */
export function BookingRow({ booking }: { booking: AdminBooking }) {
  const { timeZone } = bookingConfig;
  const status = booking.status as BookingStatus;
  const mode = booking.mode as SessionMode;
  const ModeIcon = modeIcons[mode];
  const when = utcToZoned(booking.startsAt, timeZone);
  const pending = status === "PENDING";
  const past = booking.startsAt.getTime() < Date.now();

  return (
    <article
      className={cn(
        "rounded-2xl border bg-paper p-4 shadow-soft transition-shadow sm:p-5",
        pending
          ? "border-mint-deep/60 ring-1 ring-mint-deep/25 hover:shadow-lift"
          : "border-sage-deep/20",
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        {/* The date, as a small calendar chip */}
        <div className="grid w-16 shrink-0 place-items-center rounded-xl bg-sage py-2 text-forest">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
            {MONTHS[when.month - 1]}
          </span>
          <span className="font-display text-2xl leading-none">{when.day}</span>
          <span className="mt-0.5 text-[0.7rem] text-forest/70">
            {formatTime(booking.startsAt, timeZone)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/bookings/${booking.id}`}
              className="font-display text-lg text-forest underline-offset-4 hover:underline"
            >
              {booking.client.name}
            </Link>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                statusStyles[status],
              )}
            >
              {STATUS_LABELS[status]}
            </span>
            {booking.firstTime && (
              <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-medium text-forest">
                First time
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-forest/80">
            {booking.sessionType.name} ·{" "}
            <span className="inline-flex items-center gap-1 align-middle">
              <ModeIcon className="size-3.5" aria-hidden="true" />
              {MODE_LABELS[mode]}
            </span>
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            {/* max-w-full + break-all: a long address is one unbreakable word,
                and would otherwise widen the whole card on a phone. */}
            <a
              href={`mailto:${booking.client.email}`}
              className="inline-flex max-w-full items-center gap-1.5 break-all transition-colors hover:text-forest"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              {booking.client.email}
            </a>
            {booking.client.phone && (
              <a
                href={`tel:${booking.client.phone}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-forest"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                {booking.client.phone}
              </a>
            )}
          </div>

          {booking.message && (
            <p className="mt-3 line-clamp-2 border-t border-sage-deep/15 pt-3 text-sm leading-relaxed text-forest/80">
              {booking.message}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {pending && (
            // Confirming needs a link or an address, so it happens on the
            // detail page rather than as a one-tap action here.
            <Link
              href={`/admin/bookings/${booking.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper transition hover:bg-forest-deep"
            >
              <Check className="size-4" aria-hidden="true" />
              Review
            </Link>
          )}
          {past && (status === "CONFIRMED" || status === "PENDING") && (
            <>
              <StatusButton
                id={booking.id}
                status="COMPLETED"
                title="Mark as completed"
                toastMessage="Marked as completed"
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
              >
                <Check className="size-4" />
              </StatusButton>
              <StatusButton
                id={booking.id}
                status="NO_SHOW"
                title="Didn't attend"
                toastMessage="Marked as not attended"
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
              >
                <UserX className="size-4" />
              </StatusButton>
            </>
          )}
          {!past && status !== "CANCELLED" && (
            <StatusButton
              id={booking.id}
              status="CANCELLED"
              title="Cancel this session"
              confirm="Cancel this session? We'll email them to let them know."
              askReason
              toastMessage="Session cancelled"
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
            >
              <X className="size-4" />
            </StatusButton>
          )}
        </div>
      </div>
    </article>
  );
}
