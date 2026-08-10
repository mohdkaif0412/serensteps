import { CalendarOff, Clock, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { AvailabilityForm } from "@/components/admin/AvailabilityForm";
import { ExceptionForm } from "@/components/admin/ExceptionForm";
import { deleteAvailabilityException } from "@/actions/admin-booking";
import { bookingConfig } from "@/lib/booking/config";
import { minutesToLabel } from "@/lib/booking/timezone";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Availability" };

export default async function AdminAvailabilityPage() {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [rules, exceptions] = await Promise.all([
    prisma.availabilityRule.findMany({ where: { active: true } }),
    prisma.availabilityException.findMany({
      where: { date: { gte: startOfToday } },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Availability"
        description="When you're open for sessions. Everything on the booking page is built from this."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-xl text-forest">
            <Clock className="size-5 text-mint-deep" strokeWidth={1.75} aria-hidden="true" />
            Your usual week
          </h2>
          <p className="mt-1 text-sm text-muted">
            Untick a day to close it. Changes take effect on the booking page
            straight away.
          </p>
          <div className="mt-5">
            <AvailabilityForm rules={rules} timeZone={bookingConfig.timeZone} />
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-xl text-forest">
              <CalendarOff
                className="size-5 text-mint-deep"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              One-off changes
            </h2>
            <p className="mt-1 text-sm text-muted">
              Holidays, a closed afternoon, or a Sunday you&rsquo;re happy to open.
            </p>
            <div className="mt-5">
              <ExceptionForm />
            </div>
          </section>

          <section className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
            <h2 className="font-display text-xl text-forest">Coming up</h2>
            {exceptions.length ? (
              <ul className="mt-4 divide-y divide-sage-deep/15">
                {exceptions.map((exception) => (
                  <li
                    key={exception.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-forest">
                        {formatDate(exception.date)}
                      </p>
                      <p className="text-xs text-muted">
                        {exception.blocked
                          ? "Closed all day"
                          : `Open ${minutesToLabel(exception.startMinute ?? 0)}–${minutesToLabel(
                              exception.endMinute ?? 0,
                            )}`}
                        {exception.note ? ` · ${exception.note}` : ""}
                      </p>
                    </div>
                    <ActionButton
                      action={deleteAvailabilityException}
                      id={exception.id}
                      title="Remove"
                      toastMessage="Removed"
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </ActionButton>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Nothing out of the ordinary coming up.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-sage-deep/20 bg-sage/20 p-5 sm:p-6">
            <h2 className="font-display text-lg text-forest">Booking settings</h2>
            <dl className="mt-3 space-y-1.5 text-sm text-forest/85">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Timezone</dt>
                <dd>{bookingConfig.timeZone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Notice needed</dt>
                <dd>{bookingConfig.leadTimeHours} hours</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Bookable ahead</dt>
                <dd>{bookingConfig.horizonDays} days</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Slots every</dt>
                <dd>{bookingConfig.slotStepMin} minutes</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">
              These come from the site&rsquo;s environment settings
              (BOOKING_TIMEZONE, BOOKING_LEAD_TIME_HOURS, BOOKING_HORIZON_DAYS,
              BOOKING_SLOT_STEP_MIN) — ask your developer to change them.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
