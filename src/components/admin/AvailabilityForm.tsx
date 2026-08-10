"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveAvailability } from "@/actions/admin-booking";
import { initialFormState } from "@/lib/form-state";
import { FormError, SubmitButton } from "@/components/admin/form-ui";
import { minutesToLabel } from "@/lib/booking/timezone";
import { cn } from "@/lib/utils";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export type WeeklyRule = {
  weekday: number;
  startMinute: number;
  endMinute: number;
};

/**
 * The weekly working hours. Every row posts together — the action replaces the
 * whole week in one transaction, so there's no way to end up with half a week
 * saved and half not.
 */
export function AvailabilityForm({
  rules,
  timeZone,
}: {
  rules: WeeklyRule[];
  timeZone: string;
}) {
  const [state, action, pending] = useActionState(saveAvailability, initialFormState);
  const announced = useRef(false);

  useEffect(() => {
    if (state.ok && !announced.current) {
      announced.current = true;
      toast.success("Hours saved");
    }
    if (!state.ok) announced.current = false;
  }, [state.ok]);

  return (
    <form action={action} className="space-y-5">
      <FormError message={state.error} />

      <div className="space-y-2">
        {DAYS.map((label, weekday) => (
          <DayRow
            key={label}
            label={label}
            weekday={weekday}
            rule={rules.find((rule) => rule.weekday === weekday)}
          />
        ))}
      </div>

      <p className="text-xs text-muted">
        All times are in {timeZone}. Sessions are offered inside these hours, minus
        the notice period and the quiet time after each session.
      </p>

      <SubmitButton pending={pending}>Save hours</SubmitButton>
    </form>
  );
}

function DayRow({
  label,
  weekday,
  rule,
}: {
  label: string;
  weekday: number;
  rule?: WeeklyRule;
}) {
  const [open, setOpen] = useState(Boolean(rule));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border p-3 transition-colors",
        open ? "border-sage-deep/25 bg-paper" : "border-sage-deep/15 bg-sage/15",
      )}
    >
      <label className="flex w-36 shrink-0 items-center gap-3 text-sm font-medium text-forest">
        <input
          type="checkbox"
          name={`active-${weekday}`}
          checked={open}
          onChange={(event) => setOpen(event.target.checked)}
          className="size-4 accent-forest"
        />
        {label}
      </label>

      {open ? (
        <div className="flex items-center gap-2">
          <input
            type="time"
            name={`start-${weekday}`}
            defaultValue={minutesToLabel(rule?.startMinute ?? 600)}
            aria-label={`${label} start time`}
            className="rounded-lg border border-field bg-paper px-3 py-2 text-sm text-forest"
          />
          <span className="text-sm text-muted">to</span>
          <input
            type="time"
            name={`end-${weekday}`}
            defaultValue={minutesToLabel(rule?.endMinute ?? 1080)}
            aria-label={`${label} finish time`}
            className="rounded-lg border border-field bg-paper px-3 py-2 text-sm text-forest"
          />
        </div>
      ) : (
        <span className="text-sm text-muted">Closed</span>
      )}
    </div>
  );
}
