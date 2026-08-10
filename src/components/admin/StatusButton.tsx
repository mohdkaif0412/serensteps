"use client";

import { useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { setBookingStatus } from "@/actions/admin-booking";
import type { BookingStatus } from "@/lib/booking/constants";
import { cn } from "@/lib/utils";

/**
 * Move a booking to another status. Like `ActionButton`, but it carries the
 * target status — and, for a cancellation, prompts for the note the client will
 * read in their email.
 */
export function StatusButton({
  id,
  status,
  title,
  confirm,
  askReason,
  toastMessage,
  className,
  children,
}: {
  id: string;
  status: BookingStatus;
  title: string;
  confirm?: string;
  /** Ask for a short reason to include in the cancellation email. */
  askReason?: boolean;
  toastMessage?: string;
  className?: string;
  children: ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        let reason = "";
        if (askReason) {
          const answer = window.prompt(
            "Anything to tell them? This goes into their email. Leave blank to send just the cancellation.",
            "",
          );
          // A cancelled prompt means "don't do it after all".
          if (answer === null) return;
          reason = answer;
        }
        const formData = new FormData();
        formData.set("id", id);
        formData.set("status", status);
        formData.set("reason", reason);
        startTransition(async () => {
          await setBookingStatus(formData);
          if (toastMessage) toast.success(toastMessage);
        });
      }}
      className={cn(className, pending && "pointer-events-none opacity-50")}
    >
      {children}
    </button>
  );
}
