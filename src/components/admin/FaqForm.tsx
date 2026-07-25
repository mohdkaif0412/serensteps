"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveFaq } from "@/actions/faqs";
import { initialFormState } from "@/lib/form-state";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";

export type FaqFormData = {
  id?: string;
  question?: string;
  answer?: string;
  category?: string | null;
  order?: number;
  published?: boolean;
};

export function FaqForm({
  faq,
  categories,
}: {
  faq?: FaqFormData;
  categories: string[];
}) {
  const [state, action, pending] = useActionState(saveFaq, initialFormState);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      {faq?.id && <input type="hidden" name="id" value={faq.id} />}
      <FormError message={state.error} />

      <Field label="Question" htmlFor="question" required error={fe.question?.[0]}>
        <input
          id="question"
          name="question"
          defaultValue={faq?.question}
          className={adminField}
        />
      </Field>

      <Field label="Answer" htmlFor="answer" required error={fe.answer?.[0]}>
        <textarea
          id="answer"
          name="answer"
          defaultValue={faq?.answer}
          rows={5}
          className={adminField}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Category"
          htmlFor="category"
          error={fe.category?.[0]}
          hint="Groups this question on the FAQ page."
        >
          <input
            id="category"
            name="category"
            defaultValue={faq?.category ?? ""}
            list="faq-categories"
            className={adminField}
            placeholder="e.g. Getting started"
          />
          <datalist id="faq-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
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
            defaultValue={faq?.order ?? 0}
            className={`${adminField} max-w-[8rem]`}
          />
        </Field>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={faq?.published ?? true}
          className="size-4 accent-forest"
        />
        <span className="text-sm text-forest">Published (visible on the site)</span>
      </label>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton pending={pending}>
          {faq?.id ? "Save changes" : "Add FAQ"}
        </SubmitButton>
        <Link href="/admin/faqs" className="text-sm text-muted hover:text-forest">
          Cancel
        </Link>
      </div>
    </form>
  );
}
