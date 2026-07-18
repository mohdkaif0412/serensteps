"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { saveTestimonial } from "@/actions/testimonials";
import { initialFormState } from "@/lib/form-state";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";

export type TestimonialFormData = {
  id?: string;
  name?: string;
  role?: string | null;
  quote?: string;
  order?: number;
  published?: boolean;
};

export function TestimonialForm({
  testimonial,
}: {
  testimonial?: TestimonialFormData;
}) {
  const [state, action, pending] = useActionState(
    saveTestimonial,
    initialFormState,
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      {testimonial?.id && <input type="hidden" name="id" value={testimonial.id} />}
      <FormError message={state.error} />

      <div className="flex items-start gap-3 rounded-xl border border-honey/40 bg-honey/10 p-4 text-sm text-pine">
        <Info className="mt-0.5 size-5 shrink-0 text-honey" aria-hidden="true" />
        <p>
          Please keep testimonials anonymous. Never publish a client&rsquo;s real
          name or identifying details without their written consent — use initials
          or a generic label (e.g. &ldquo;Individual client&rdquo;).
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Name or label"
          htmlFor="name"
          required
          error={fe.name?.[0]}
          hint="e.g. “R.” or “A parent”"
        >
          <input
            id="name"
            name="name"
            defaultValue={testimonial?.name}
            className={adminField}
          />
        </Field>
        <Field
          label="Context"
          htmlFor="role"
          error={fe.role?.[0]}
          hint="e.g. “Individual client”"
        >
          <input
            id="role"
            name="role"
            defaultValue={testimonial?.role ?? ""}
            className={adminField}
          />
        </Field>
      </div>

      <Field label="Quote" htmlFor="quote" required error={fe.quote?.[0]}>
        <textarea
          id="quote"
          name="quote"
          defaultValue={testimonial?.quote}
          rows={4}
          className={adminField}
        />
      </Field>

      <Field
        label="Display order"
        htmlFor="order"
        error={fe.order?.[0]}
        hint="Lower numbers appear first."
      >
        <input
          id="order"
          name="order"
          type="number"
          min={0}
          defaultValue={testimonial?.order ?? 0}
          className={`${adminField} max-w-[8rem]`}
        />
      </Field>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={testimonial?.published ?? true}
          className="size-4 accent-pine"
        />
        <span className="text-sm text-pine">Published (visible on the site)</span>
      </label>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton pending={pending}>
          {testimonial?.id ? "Save changes" : "Add testimonial"}
        </SubmitButton>
        <Link
          href="/admin/testimonials"
          className="text-sm text-muted hover:text-pine"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
