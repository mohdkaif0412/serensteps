"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  contactSchema,
  CONCERN_OPTIONS,
  type ContactInput,
} from "@/lib/validation";
import { submitContact } from "@/actions/contact";
import { cn } from "@/lib/utils";

// Soft-filled, tactile inputs: a whisper of sage at rest, warming to cream
// with a honey ring on focus. (The form itself sits on a cream sheet.)
const fieldStyles =
  "w-full rounded-xl border border-sage-deep/35 bg-sage-mist/70 px-4 py-3 text-pine placeholder:text-muted/50 shadow-[inset_0_1px_2px_rgba(26,39,35,0.04)] transition-all duration-200 focus:border-honey focus:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey/35";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
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
      <div className="rounded-[1.5rem] border border-honey/30 bg-honey-soft/50 p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-honey text-pine shadow-soft">
          <Check className="size-7" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-pine">
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
          className="mt-6 text-sm font-medium text-pine underline underline-offset-4 hover:text-honey"
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
          <select
            id="concern"
            defaultValue=""
            className={cn(fieldStyles, "appearance-none bg-[right_1rem_center] pr-10")}
            {...register("concern")}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {CONCERN_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
          className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-8 py-3.5 font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey active:translate-y-0 active:scale-[0.985] disabled:opacity-70"
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
          <Link href="/privacy" className="underline underline-offset-2 hover:text-pine">
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
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-pine">
        {label}
      </label>
      {children}
      {error && (
        <span className="mt-1.5 block text-sm text-red-700" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
