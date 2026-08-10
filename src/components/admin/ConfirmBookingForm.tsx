"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { confirmBooking } from "@/actions/admin-booking";
import { initialFormState } from "@/lib/form-state";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";

/**
 * Confirming a request. The meeting link (or the address) is captured here
 * rather than left for later, because this is the form whose submit sends the
 * client their confirmation email — a confirmation with nowhere to go is worse
 * than no email at all.
 */
export function ConfirmBookingForm({
  booking,
  alreadyConfirmed,
}: {
  booking: {
    id: string;
    mode: string;
    meetingLink: string | null;
    locationNote: string | null;
    adminNote: string | null;
  };
  alreadyConfirmed: boolean;
}) {
  const [state, action, pending] = useActionState(confirmBooking, initialFormState);
  const fe = state.fieldErrors ?? {};
  const announced = useRef(false);

  useEffect(() => {
    if (state.ok && !announced.current) {
      announced.current = true;
      toast.success("Confirmed — they've been emailed the details");
    }
    if (!state.ok) announced.current = false;
  }, [state.ok]);

  const mode = booking.mode as SessionMode;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={booking.id} />
      <FormError message={state.error} />

      {mode === "ONLINE" && (
        <Field
          label="Meeting link"
          htmlFor="meetingLink"
          error={fe.meetingLink?.[0]}
          hint="Paste the Google Meet, Zoom, or Teams link. It goes into their confirmation email and their calendar invite."
        >
          <input
            id="meetingLink"
            name="meetingLink"
            type="url"
            defaultValue={booking.meetingLink ?? ""}
            placeholder="https://meet.google.com/…"
            className={adminField}
          />
        </Field>
      )}

      {mode === "IN_PERSON" && (
        <Field
          label="Where to come"
          htmlFor="locationNote"
          error={fe.locationNote?.[0]}
          hint="The address and any directions — which floor, where to wait, parking."
        >
          <textarea
            id="locationNote"
            name="locationNote"
            rows={3}
            defaultValue={booking.locationNote ?? ""}
            className={adminField}
          />
        </Field>
      )}

      {mode === "PHONE" && (
        <p className="rounded-xl bg-sage/40 px-4 py-3 text-sm text-forest">
          {MODE_LABELS.PHONE} — they&rsquo;ll be told you&rsquo;re calling the number
          on their booking.
        </p>
      )}

      <Field
        label="Private note (optional)"
        htmlFor="adminNote"
        error={fe.adminNote?.[0]}
        hint="Only you see this. Never included in any email."
      >
        <textarea
          id="adminNote"
          name="adminNote"
          rows={3}
          defaultValue={booking.adminNote ?? ""}
          className={adminField}
        />
      </Field>

      <SubmitButton pending={pending}>
        {alreadyConfirmed ? "Save and re-send details" : "Confirm and email them"}
      </SubmitButton>
    </form>
  );
}
