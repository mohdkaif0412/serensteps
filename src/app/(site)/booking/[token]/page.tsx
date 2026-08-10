import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus, Clock, MapPin, Phone, Video } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CancelBooking } from "@/components/booking/CancelBooking";
import { getBookingByToken } from "@/lib/queries";
import { bookingConfig } from "@/lib/booking/config";
import {
  MODE_LABELS,
  STATUS_LABELS,
  type BookingStatus,
  type SessionMode,
} from "@/lib/booking/constants";
import { formatLongDate, formatTime, timeZoneLabel } from "@/lib/booking/timezone";
import { managePage } from "@/lib/content/booking";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The client's own view of their booking, reached by the token in their email.
 * Never indexed, never linked from anywhere on the site — the token is the only
 * credential, so it must not leak into a sitemap or a search result.
 */
export const metadata: Metadata = {
  title: "Your booking",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const modeIcons: Record<SessionMode, typeof Video> = {
  ONLINE: Video,
  IN_PERSON: MapPin,
  PHONE: Phone,
};

const statusNotes: Record<BookingStatus, string> = {
  PENDING: managePage.pendingNote,
  CONFIRMED: managePage.confirmedNote,
  CANCELLED: managePage.cancelledNote,
  COMPLETED: managePage.completedNote,
  NO_SHOW: managePage.completedNote,
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const booking = await getBookingByToken(token);
  if (!booking) notFound();

  const { timeZone } = bookingConfig;
  const status = booking.status as BookingStatus;
  const mode = booking.mode as SessionMode;
  const ModeIcon = modeIcons[mode];
  const upcoming = booking.startsAt.getTime() > Date.now();
  const cancellable = upcoming && (status === "PENDING" || status === "CONFIRMED");

  return (
    <>
      <PageHeader
        eyebrow={managePage.title}
        title={
          <>
            {booking.client.name.split(" ")[0]}, here are your <em>details</em>
          </>
        }
        intro={statusNotes[status]}
      />

      <Section spacing="md">
        <Container>
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="rounded-[2rem] border border-sage-deep/20 bg-cream p-6 shadow-lift sm:p-8">
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                  status === "CONFIRMED" && "bg-mint text-forest",
                  status === "PENDING" && "bg-sand text-forest",
                  (status === "CANCELLED" || status === "NO_SHOW") &&
                    "bg-sage text-forest",
                  status === "COMPLETED" && "bg-sage text-forest",
                )}
              >
                {STATUS_LABELS[status]}
              </span>

              <h2 className="mt-4 font-display text-2xl text-forest sm:text-[1.7rem]">
                {booking.sessionType.name}
              </h2>

              <dl className="mt-6 space-y-4">
                <Row icon={<Clock className="size-5" strokeWidth={1.75} />} label="When">
                  {formatLongDate(booking.startsAt, timeZone)}
                  <br />
                  {formatTime(booking.startsAt, timeZone)} –{" "}
                  {formatTime(booking.endsAt, timeZone)} (
                  {timeZoneLabel(booking.startsAt, timeZone)})
                </Row>

                <Row
                  icon={<ModeIcon className="size-5" strokeWidth={1.75} />}
                  label={MODE_LABELS[mode]}
                >
                  {mode === "ONLINE" &&
                    (booking.meetingLink ? (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-mint-deep underline underline-offset-4"
                      >
                        {booking.meetingLink}
                      </a>
                    ) : (
                      "Your video link will reach you before the session."
                    ))}
                  {mode === "IN_PERSON" &&
                    (booking.locationNote ||
                      "We'll send you the address before your session.")}
                  {mode === "PHONE" &&
                    (booking.client.phone
                      ? `We'll call you on ${booking.client.phone}.`
                      : "We'll call you at the agreed time.")}
                </Row>
              </dl>

              {status === "CONFIRMED" && upcoming && (
                <a
                  href={`/api/bookings/${booking.token}/calendar.ics`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift"
                >
                  <CalendarPlus className="size-4" aria-hidden="true" />
                  Add to my calendar
                </a>
              )}
            </div>

            {cancellable ? (
              <CancelBooking token={booking.token} />
            ) : (
              <div className="rounded-2xl border border-sage-deep/20 bg-cream p-5">
                <p className="text-sm leading-relaxed text-muted">
                  Need anything? Message us on{" "}
                  <a
                    href={site.phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mint-deep underline underline-offset-4"
                  >
                    WhatsApp
                  </a>{" "}
                  or email{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-mint-deep underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                  .
                </p>
                {status === "CANCELLED" && (
                  <Link
                    href="/book"
                    className="mt-4 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep"
                  >
                    Book another time
                  </Link>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage text-forest">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">
          {label}
        </dt>
        <dd className="mt-0.5 leading-relaxed text-forest">{children}</dd>
      </div>
    </div>
  );
}
