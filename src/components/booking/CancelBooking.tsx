"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { cancelBookingByToken } from "@/actions/booking";
import { bookingField } from "@/components/booking/shared";
import { managePage } from "@/lib/content/booking";

/**
 * Cancelling from the link in the confirmation email. Two taps rather than one:
 * an accidental cancel means someone loses a session they were counting on.
 */
export function CancelBooking({ token }: { token: string }) {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!confirming) {
    return (
      <div className="rounded-2xl border border-sage-deep/20 bg-cream p-5">
        <h3 className="font-display text-lg text-forest">{managePage.cancelPrompt}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {managePage.cancelHint}
        </p>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 text-sm font-medium text-forest underline underline-offset-4 transition-colors hover:text-mint-deep"
        >
          {managePage.cancelAction}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sage-deep/20 bg-cream p-5">
      <h3 className="font-display text-lg text-forest">{managePage.cancelConfirm}</h3>
      <label
        htmlFor="cancel-reason"
        className="mb-1.5 mt-4 block text-sm font-medium text-forest"
      >
        Anything you&rsquo;d like us to know? (optional)
      </label>
      <textarea
        id="cancel-reason"
        rows={3}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className={`${bookingField} resize-y`}
        placeholder="You don't have to give a reason."
      />

      {error && (
        <p className="mt-3 flex items-start gap-2 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const result = await cancelBookingByToken({ token, reason });
              if (result.ok) {
                router.refresh();
              } else {
                setError(result.error ?? "Please try again.");
              }
            })
          }
          className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep disabled:opacity-70"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Yes, cancel it
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-forest"
        >
          Keep my session
        </button>
      </div>
    </div>
  );
}
