"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  contactSchema,
  CONCERN_OPTIONS,
  type ContactInput,
} from "@/lib/validation";
import { submitContact } from "@/actions/contact";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

// Soft-filled, tactile inputs: a whisper of sage at rest, warming to cream on
// focus. (The form itself sits on a cream sheet.)
//
// `border-field` gives the control a 3.3:1 boundary against its own fill, and
// `text-hint` keeps placeholders at 4.6:1 — both were below AA before. The
// focus outline is left to the global `:focus-visible` rule rather than being
// swapped for a translucent ring, which never reached 3:1 on this fill.
const fieldStyles =
  "w-full rounded-xl border border-field bg-sage-mist/70 px-4 py-3 text-forest placeholder:text-hint shadow-[inset_0_1px_2px_rgba(15,44,37,0.04)] transition-all duration-200 focus:border-mint-deep focus:bg-cream";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    try {
      const result = await submitContact(data);
      if (result.ok) {
        setSubmitted(true);
        reset();
      } else {
        setServerError(
          result.error ??
            "Something went wrong sending your message. Please try again.",
        );
      }
    } catch {
      setServerError(
        "Something went wrong sending your message. Please try again, or email us directly.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-mint/30 bg-mint-soft/50 p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest shadow-soft">
          <Check className="size-7" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-forest">
          Thank you for reaching out.
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          Your message is on its way. We&rsquo;ll get back to you soon — usually
          within a couple of working days. Take a deep breath; you&rsquo;ve taken a
          good first step.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-forest underline underline-offset-4 hover:text-mint-deep"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            className={fieldStyles}
            autoComplete="name"
            placeholder="Jordan"
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            className={fieldStyles}
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone (optional)"
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <input
            id="phone"
            type="tel"
            className={fieldStyles}
            autoComplete="tel"
            placeholder="Optional"
            {...register("phone")}
          />
        </Field>
        <Field
          label="What's this about?"
          htmlFor="concern"
          error={errors.concern?.message}
        >
          <Controller
            name="concern"
            control={control}
            render={({ field }) => (
              <Select
                id="concern"
                options={CONCERN_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Choose one…"
                invalid={Boolean(errors.concern)}
                describedBy={errors.concern ? "concern-error" : undefined}
                buttonClassName={fieldStyles}
              />
            )}
          />
        </Field>
      </div>

      <Field label="How can we help?" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          className={cn(fieldStyles, "min-h-[140px] resize-y")}
          placeholder="Share as much or as little as you feel comfortable with…"
          {...register("message")}
        />
      </Field>

      {serverError && (
        <p className="flex items-center gap-2 text-sm text-red-700" role="alert">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 items-center justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-8 py-3.5 font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985] disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
        <p className="text-xs leading-relaxed text-muted">
          We&rsquo;ll only use your details to reply. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-forest">
            privacy note
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-forest">
        {label}
      </label>
      {children}
      {error && (
        <span
          id={`${htmlFor}-error`}
          className="mt-1.5 block text-sm text-red-700"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
