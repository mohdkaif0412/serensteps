"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { addAvailabilityException } from "@/actions/admin-booking";
import { initialFormState } from "@/lib/form-state";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";
import { toDateInputValue } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * A single dated override — a day off, or extra hours outside the usual week.
 * Days off are the common case, so that's what the form opens on.
 */
export function ExceptionForm() {
  const [state, action, pending] = useActionState(
    addAvailabilityException,
    initialFormState,
  );
  const [blocked, setBlocked] = useState(true);
  const announced = useRef(false);

  useEffect(() => {
    if (state.ok && !announced.current) {
      announced.current = true;
      toast.success(blocked ? "Day blocked" : "Extra hours added");
    }
    if (!state.ok) announced.current = false;
  }, [blocked, state.ok]);

  return (
    <form action={action} className="space-y-5">
      <FormError message={state.error} />

      <div className="flex flex-wrap gap-2">
        {[
          { value: true, label: "Block a day" },
          { value: false, label: "Add extra hours" },
        ].map((option) => (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={blocked === option.value}
            onClick={() => setBlocked(option.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              blocked === option.value
                ? "border-forest bg-forest text-paper"
                : "border-sage-deep/25 bg-paper text-forest hover:bg-sage/40",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {/* The toggle above is the source of truth; this carries it to the action. */}
      <input type="hidden" name="blocked" value={blocked ? "on" : "off"} />

      <Field label="Date" htmlFor="exception-date" required error={state.fieldErrors?.date?.[0]}>
        <input
          id="exception-date"
          name="date"
          type="date"
          defaultValue={toDateInputValue(Date.now())}
          className={`${adminField} max-w-[14rem]`}
        />
      </Field>

      {!blocked && (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="From" htmlFor="exception-start">
            <input
              id="exception-start"
              name="startMinute"
              type="time"
              defaultValue="10:00"
              className={`${adminField} max-w-[9rem]`}
            />
          </Field>
          <Field
            label="To"
            htmlFor="exception-end"
            error={state.fieldErrors?.endMinute?.[0]}
          >
            <input
              id="exception-end"
              name="endMinute"
              type="time"
              defaultValue="14:00"
              className={`${adminField} max-w-[9rem]`}
            />
          </Field>
        </div>
      )}

      <Field
        label="Note (optional)"
        htmlFor="exception-note"
        hint="Just for you — e.g. 'Eid', 'conference', 'clinic morning'."
      >
        <input
          id="exception-note"
          name="note"
          className={adminField}
          placeholder="Why this day is different"
        />
      </Field>

      <SubmitButton pending={pending}>
        {blocked ? "Block this day" : "Add these hours"}
      </SubmitButton>
    </form>
  );
}
