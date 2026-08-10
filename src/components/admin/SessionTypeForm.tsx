"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveSessionType } from "@/actions/admin-booking";
import { initialFormState } from "@/lib/form-state";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";
import {
  MODE_BLURBS,
  MODE_LABELS,
  SESSION_MODES,
  type SessionMode,
} from "@/lib/booking/constants";
import { slugify } from "@/lib/utils";

export type SessionTypeFormData = {
  id?: string;
  name?: string;
  slug?: string;
  blurb?: string | null;
  durationMin?: number;
  bufferMin?: number;
  modes?: string[];
  price?: string | null;
  order?: number;
  active?: boolean;
};

/** Create or edit a bookable offering. */
export function SessionTypeForm({ type }: { type?: SessionTypeFormData }) {
  const [state, action, pending] = useActionState(saveSessionType, initialFormState);
  const fe = state.fieldErrors ?? {};
  const [slug, setSlug] = useState(type?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(type?.slug));

  return (
    <form
      action={action}
      className="mx-auto w-full max-w-3xl space-y-6 rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-8"
    >
      {type?.id && <input type="hidden" name="id" value={type.id} />}
      <FormError message={state.error} />

      <Field label="Name" htmlFor="name" required error={fe.name?.[0]}>
        <input
          id="name"
          name="name"
          defaultValue={type?.name}
          className={adminField}
          placeholder="e.g. Individual counselling"
          onChange={(event) => {
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
        />
      </Field>

      <Field
        label="Web address (slug)"
        htmlFor="slug"
        required
        error={fe.slug?.[0]}
        hint="Used internally and in the booking link. Lowercase, hyphens only."
      >
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          className={adminField}
        />
      </Field>

      <Field
        label="Short description"
        htmlFor="blurb"
        error={fe.blurb?.[0]}
        hint="One or two warm sentences. Shown under the name on the booking page."
      >
        <textarea
          id="blurb"
          name="blurb"
          rows={3}
          defaultValue={type?.blurb ?? ""}
          className={adminField}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field
          label="Length (minutes)"
          htmlFor="durationMin"
          required
          error={fe.durationMin?.[0]}
        >
          <input
            id="durationMin"
            name="durationMin"
            type="number"
            min={5}
            max={480}
            defaultValue={type?.durationMin ?? 50}
            className={adminField}
          />
        </Field>
        <Field
          label="Quiet time after"
          htmlFor="bufferMin"
          error={fe.bufferMin?.[0]}
          hint="Minutes kept free afterwards."
        >
          <input
            id="bufferMin"
            name="bufferMin"
            type="number"
            min={0}
            max={240}
            defaultValue={type?.bufferMin ?? 15}
            className={adminField}
          />
        </Field>
        <Field
          label="Display order"
          htmlFor="order"
          error={fe.order?.[0]}
          hint="Lower appears first."
        >
          <input
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={type?.order ?? 0}
            className={adminField}
          />
        </Field>
      </div>

      <Field
        label="Price (optional)"
        htmlFor="price"
        error={fe.price?.[0]}
        hint="Shown on the booking page as written, e.g. “₹1,200” or “Free”. Nothing is charged online — leave blank to show no price at all."
      >
        <input
          id="price"
          name="price"
          defaultValue={type?.price ?? ""}
          className={`${adminField} max-w-[12rem]`}
        />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-forest">
          How can this session be held?
        </legend>
        {fe.modes?.[0] && (
          <p className="mb-2 text-sm text-red-700" role="alert">
            {fe.modes[0]}
          </p>
        )}
        <div className="space-y-2">
          {SESSION_MODES.map((mode: SessionMode) => (
            <label
              key={mode}
              className="flex items-start gap-3 rounded-xl border border-sage-deep/20 p-3"
            >
              <input
                type="checkbox"
                name={`mode-${mode}`}
                defaultChecked={(type?.modes ?? ["ONLINE"]).includes(mode)}
                className="mt-0.5 size-4 accent-forest"
              />
              <span>
                <span className="block text-sm font-medium text-forest">
                  {MODE_LABELS[mode]}
                </span>
                <span className="block text-xs text-muted">{MODE_BLURBS[mode]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="active"
          defaultChecked={type?.active ?? true}
          className="size-4 accent-forest"
        />
        <span className="text-sm text-forest">
          Bookable (shown on the booking page)
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4 border-t border-sage-deep/15 pt-6">
        <SubmitButton pending={pending}>
          {type?.id ? "Save changes" : "Add session type"}
        </SubmitButton>
        <Link
          href="/admin/session-types"
          className="text-sm text-muted transition-colors hover:text-forest"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
