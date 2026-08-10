"use client";

import Link from "next/link";
import { AlertCircle, CalendarCheck, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { BookingField, bookingField } from "@/components/booking/shared";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";
import { formatLongDate, formatTime } from "@/lib/booking/timezone";
import { bookingLabels } from "@/lib/content/booking";
import { CONCERN_OPTIONS } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { BookingFlowState } from "@/components/booking/useBookingFlow";

/**
 * The last step: who to write back to, plus a plain summary of what's about to
 * be requested. The summary is here rather than on a separate review screen —
 * one fewer wall between someone and asking for help.
 */
export function YourDetails({
  flow,
  timeZone,
}: {
  flow: BookingFlowState;
  timeZone: string;
}) {
  const { details, fieldErrors } = flow;
  const phoneRequired = flow.mode === "PHONE";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void flow.submit();
      }}
      className="space-y-4 @md:space-y-5"
    >
      <Summary flow={flow} timeZone={timeZone} />

      {/* Honeypot: hidden from people, tempting to bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={details.website}
        onChange={(event) => flow.updateDetails({ website: event.target.value })}
      />

      <div className="grid gap-4 @md:grid-cols-2 @md:gap-5">
        <BookingField label="Your name" htmlFor="booking-name" error={fieldErrors.name}>
          <input
            id="booking-name"
            className={bookingField}
            autoComplete="name"
            placeholder="Jordan"
            value={details.name}
            onChange={(event) => flow.updateDetails({ name: event.target.value })}
          />
        </BookingField>
        <BookingField label="Email" htmlFor="booking-email" error={fieldErrors.email}>
          <input
            id="booking-email"
            type="email"
            className={bookingField}
            autoComplete="email"
            placeholder="you@example.com"
            value={details.email}
            onChange={(event) => flow.updateDetails({ email: event.target.value })}
          />
        </BookingField>
      </div>

      <div className="grid gap-4 @md:grid-cols-2 @md:gap-5">
        <BookingField
          label={phoneRequired ? "Phone" : "Phone (optional)"}
          htmlFor="booking-phone"
          error={fieldErrors.phone}
          hint={
            phoneRequired
              ? "The 10-digit number we'll call."
              : "10 digits, if you'd like us to be able to call."
          }
        >
          <input
            id="booking-phone"
            type="tel"
            inputMode="tel"
            className={bookingField}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={details.phone}
            onChange={(event) => flow.updateDetails({ phone: event.target.value })}
          />
        </BookingField>
        <BookingField label={bookingLabels.concernLabel} htmlFor="booking-concern">
          <Select
            id="booking-concern"
            options={CONCERN_OPTIONS}
            value={details.concern}
            onChange={(value) => flow.updateDetails({ concern: value })}
            placeholder="Choose one…"
            buttonClassName={bookingField}
          />
        </BookingField>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-forest">
          {bookingLabels.firstTimeQuestion}
        </legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: true, label: bookingLabels.firstTimeYes },
            { value: false, label: bookingLabels.firstTimeNo },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={details.firstTime === option.value}
              onClick={() => flow.updateDetails({ firstTime: option.value })}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-200 ease-soft",
                details.firstTime === option.value
                  ? "border-forest bg-forest text-paper"
                  : "border-sage-deep/30 bg-cream text-forest hover:border-mint-deep/40",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <BookingField
        label={bookingLabels.messageLabel}
        htmlFor="booking-message"
        error={fieldErrors.message}
      >
        <textarea
          id="booking-message"
          rows={4}
          className={cn(bookingField, "min-h-[110px] resize-y")}
          placeholder={bookingLabels.messagePlaceholder}
          value={details.message}
          onChange={(event) => flow.updateDetails({ message: event.target.value })}
        />
      </BookingField>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-forest">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-forest"
            checked={details.consent}
            onChange={(event) => flow.updateDetails({ consent: event.target.checked })}
          />
          <span>
            {bookingLabels.consent}{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-mint-deep"
            >
              Privacy note
            </Link>
            .
          </span>
        </label>
        {fieldErrors.consent && (
          <p className="mt-1.5 text-sm text-red-700" role="alert">
            {fieldErrors.consent}
          </p>
        )}
      </div>

      {flow.error && (
        <p className="flex items-start gap-2 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {flow.error}
        </p>
      )}

      <button
        type="submit"
        disabled={flow.submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-8 py-3.5 font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985] disabled:opacity-70 @md:w-auto"
      >
        {flow.submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {bookingLabels.submitting}
          </>
        ) : (
          bookingLabels.submit
        )}
      </button>
    </form>
  );
}

/** What they're about to ask for, in one glance. */
export function Summary({
  flow,
  timeZone,
}: {
  flow: BookingFlowState;
  timeZone: string;
}) {
  if (!flow.sessionType || !flow.mode || !flow.startsAt) return null;
  const start = new Date(flow.startsAt);

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-mint-deep/25 bg-mint-soft p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-mint">
        <CalendarCheck className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-lg text-forest">{flow.sessionType.name}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-forest/80">
          {formatLongDate(start, timeZone)} at {formatTime(start, timeZone)} ·{" "}
          {MODE_LABELS[flow.mode as SessionMode]}
        </p>
        <button
          type="button"
          onClick={() => flow.goTo("time")}
          className="mt-1.5 text-sm text-mint-deep underline underline-offset-4 hover:text-forest"
        >
          Change
        </button>
      </div>
    </div>
  );
}
