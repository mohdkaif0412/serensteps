import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  Video,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { computeSlotsFor } from "@/lib/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { ConfirmBookingForm } from "@/components/admin/ConfirmBookingForm";
import { RescheduleForm } from "@/components/admin/RescheduleForm";
import { NotesForm } from "@/components/admin/NotesForm";
import { StatusButton } from "@/components/admin/StatusButton";
import { deleteBooking } from "@/actions/admin-booking";
import { bookingConfig } from "@/lib/booking/config";
import {
  MODE_LABELS,
  STATUS_LABELS,
  type BookingStatus,
  type SessionMode,
} from "@/lib/booking/constants";
import { formatLongDate, formatTime, timeZoneLabel } from "@/lib/booking/timezone";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = { title: "Booking" };

const modeIcons: Record<SessionMode, typeof Video> = {
  ONLINE: Video,
  IN_PERSON: MapPin,
  PHONE: Phone,
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { client: true, sessionType: true },
  });
  if (!booking) notFound();

  const [history, slots] = await Promise.all([
    prisma.booking.findMany({
      where: { clientId: booking.clientId, id: { not: booking.id } },
      include: { sessionType: true },
      orderBy: { startsAt: "desc" },
      take: 10,
    }),
    computeSlotsFor(booking.sessionType, { excludeBookingId: booking.id }),
  ]);

  const { timeZone } = bookingConfig;
  const status = booking.status as BookingStatus;
  const mode = booking.mode as SessionMode;
  const ModeIcon = modeIcons[mode];
  const past = booking.startsAt.getTime() < Date.now();

  return (
    <>
      <Link
        href="/admin/bookings"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All bookings
      </Link>

      <AdminPageHeader
        title={booking.client.name}
        description={`${booking.sessionType.name} · ${formatLongDate(booking.startsAt, timeZone)} at ${formatTime(booking.startsAt, timeZone)} (${timeZoneLabel(booking.startsAt, timeZone)})`}
        action={
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]",
                status === "CONFIRMED" && "bg-mint text-forest",
                status === "PENDING" && "bg-sand text-forest",
                status !== "CONFIRMED" && status !== "PENDING" && "bg-sage text-forest",
              )}
            >
              {STATUS_LABELS[status]}
            </span>
            <ActionButton
              action={deleteBooking}
              id={booking.id}
              title="Delete this booking"
              confirm="Delete this booking entirely? Cancelling is usually better — it keeps the history and tells them. This cannot be undone."
              toastMessage="Booking deleted"
              className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="size-4" />
            </ActionButton>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Confirm / update the details they'll be sent */}
          <Panel
            title={status === "PENDING" ? "Confirm this request" : "Session details"}
            description={
              status === "PENDING"
                ? "Adding the link or address here sends them their confirmation."
                : "Changing these and saving re-sends their confirmation email."
            }
          >
            <ConfirmBookingForm
              booking={{
                id: booking.id,
                mode: booking.mode,
                meetingLink: booking.meetingLink,
                locationNote: booking.locationNote,
                adminNote: booking.adminNote,
              }}
              alreadyConfirmed={status === "CONFIRMED"}
            />
          </Panel>

          {!past && status !== "CANCELLED" && (
            <Panel
              title="Move this session"
              description="Only times that are genuinely free are offered."
            >
              <RescheduleForm
                bookingId={booking.id}
                days={slots}
                timeZone={timeZone}
              />
            </Panel>
          )}

          {booking.message && (
            <Panel title="What they told us">
              <p className="whitespace-pre-line leading-relaxed text-forest/90">
                {booking.message}
              </p>
            </Panel>
          )}

          <Panel title="Private note about this session">
            <NotesForm
              target="booking"
              id={booking.id}
              defaultValue={booking.adminNote ?? ""}
              label="Only you can see this"
              hint="Never included in any email to the client."
            />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Who">
            <dl className="space-y-3 text-sm">
              <Detail icon={<User className="size-4" />} label="Name">
                <Link
                  href={`/admin/clients/${booking.clientId}`}
                  className="text-forest underline underline-offset-4 hover:text-mint-deep"
                >
                  {booking.client.name}
                </Link>
              </Detail>
              <Detail icon={<Mail className="size-4" />} label="Email">
                <a
                  href={`mailto:${booking.client.email}`}
                  className="break-all text-forest hover:text-mint-deep"
                >
                  {booking.client.email}
                </a>
              </Detail>
              {booking.client.phone && (
                <Detail icon={<Phone className="size-4" />} label="Phone">
                  <a
                    href={`tel:${booking.client.phone}`}
                    className="text-forest hover:text-mint-deep"
                  >
                    {booking.client.phone}
                  </a>
                </Detail>
              )}
              <Detail icon={<ModeIcon className="size-4" />} label="How">
                {MODE_LABELS[mode]}
              </Detail>
              <Detail icon={<CalendarClock className="size-4" />} label="Requested">
                {formatDate(booking.createdAt)}
              </Detail>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-sage-deep/15 pt-4 text-sm">
              <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-forest">
                {booking.firstTime ? "First time" : "Been before"}
              </span>
              {booking.concern && (
                <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-forest">
                  {booking.concern}
                </span>
              )}
            </div>

            <p className="mt-4 break-all text-xs text-muted">
              Their own link:{" "}
              <a
                href={`${site.url}/booking/${booking.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                /booking/{booking.token}
              </a>
            </p>
          </Panel>

          {past && (status === "CONFIRMED" || status === "PENDING") && (
            <Panel title="How did it go?">
              <div className="flex flex-wrap gap-2">
                <StatusButton
                  id={booking.id}
                  status="COMPLETED"
                  title="Mark as completed"
                  toastMessage="Marked as completed"
                  className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper transition hover:bg-forest-deep"
                >
                  It happened
                </StatusButton>
                <StatusButton
                  id={booking.id}
                  status="NO_SHOW"
                  title="Didn't attend"
                  toastMessage="Marked as not attended"
                  className="rounded-full border border-sage-deep/30 px-4 py-2 text-sm font-medium text-forest transition hover:bg-sage/50"
                >
                  They didn&rsquo;t come
                </StatusButton>
              </div>
            </Panel>
          )}

          <Panel title="Their other sessions">
            {history.length ? (
              <ul className="divide-y divide-sage-deep/15 text-sm">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/admin/bookings/${entry.id}`}
                      className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:text-mint-deep"
                    >
                      <span className="min-w-0 truncate text-forest">
                        {entry.sessionType.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {formatDate(entry.startsAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">This is their first session with you.</p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
      <h2 className="font-display text-xl text-forest">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-sage text-forest">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </dt>
        <dd className="text-forest">{children}</dd>
      </div>
    </div>
  );
}
