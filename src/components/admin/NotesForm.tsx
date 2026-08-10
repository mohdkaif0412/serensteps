"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { saveBookingNote, saveClientNotes } from "@/actions/admin-booking";
import { initialFormState } from "@/lib/form-state";
import { FormError, SubmitButton, adminField } from "@/components/admin/form-ui";

/**
 * Private notes — on a single booking, or on the client as a whole.
 *
 * These are never emailed and never leave the admin. Kept deliberately plain:
 * this is not a clinical record system, and it shouldn't invite being used as
 * one.
 */
export function NotesForm({
  target,
  id,
  defaultValue,
  label,
  hint,
}: {
  target: "booking" | "client";
  id: string;
  defaultValue: string;
  label: string;
  hint?: string;
}) {
  const [state, action, pending] = useActionState(
    target === "booking" ? saveBookingNote : saveClientNotes,
    initialFormState,
  );
  const announced = useRef(false);

  useEffect(() => {
    if (state.ok && !announced.current) {
      announced.current = true;
      toast.success("Note saved");
    }
    if (!state.ok) announced.current = false;
  }, [state.ok]);

  const fieldName = target === "booking" ? "adminNote" : "notes";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <FormError message={state.error} />
      <div>
        <label
          htmlFor={`${target}-notes`}
          className="mb-1.5 block text-sm font-medium text-forest"
        >
          {label}
        </label>
        <textarea
          id={`${target}-notes`}
          name={fieldName}
          rows={5}
          defaultValue={defaultValue}
          className={adminField}
        />
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      <SubmitButton pending={pending}>Save note</SubmitButton>
    </form>
  );
}
