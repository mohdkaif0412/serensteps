"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { rescheduleBooking } from "@/actions/admin-booking";
import { initialFormState } from "@/lib/form-state";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";
import { formatShortDate, formatTime, fromDateKey } from "@/lib/booking/timezone";
import type { DaySlots } from "@/lib/booking/slots";

/**
 * Move a booking. Only genuinely free times are offered — the same availability
 * the public flow sees, minus this booking's own slot, so a session can be
 * nudged half an hour without appearing to clash with itself.
 */
export function RescheduleForm({
  bookingId,
  days,
  timeZone,
}: {
  bookingId: string;
  days: DaySlots[];
  timeZone: string;
}) {
  const [state, action, pending] = useActionState(rescheduleBooking, initialFormState);
  const openDays = useMemo(() => days.filter((day) => day.slots.length > 0), [days]);
  const [date, setDate] = useState(openDays[0]?.date ?? "");
  const announced = useRef(false);

  useEffect(() => {
    if (state.ok && !announced.current) {
      announced.current = true;
      toast.success("Moved — they've been emailed the new time");
    }
    if (!state.ok) announced.current = false;
  }, [state.ok]);

  if (openDays.length === 0) {
    return (
      <p className="text-sm text-muted">
        There are no free times to move this into. Open some hours in{" "}
        <a href="/admin/availability" className="underline underline-offset-4">
          Availability
        </a>{" "}
        first.
      </p>
    );
  }

  const slots = openDays.find((day) => day.date === date)?.slots ?? [];

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={bookingId} />
      <FormError message={state.error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New date" htmlFor="reschedule-date">
          <select
            id="reschedule-date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={adminField}
          >
            {openDays.map((day) => {
              const parts = fromDateKey(day.date);
              return (
                <option key={day.date} value={day.date}>
                  {formatShortDate(
                    new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)),
                    "UTC",
                  )}{" "}
                  ({day.slots.length} free)
                </option>
              );
            })}
          </select>
        </Field>

        <Field label="New time" htmlFor="startsAt">
          <select id="startsAt" name="startsAt" className={adminField}>
            {slots.map((iso) => (
              <option key={iso} value={iso}>
                {formatTime(new Date(iso), timeZone)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <SubmitButton pending={pending}>Move and email them</SubmitButton>
    </form>
  );
}
