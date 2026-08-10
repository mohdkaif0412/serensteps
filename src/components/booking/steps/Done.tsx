"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { bookingConfirmation } from "@/lib/content/booking";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";
import { formatLongDate, formatTime } from "@/lib/booking/timezone";
import type { BookingFlowState } from "@/components/booking/useBookingFlow";

/**
 * The end of the flow. Careful with the words here: what's been made is a
 * *request*, and saying "confirmed" would send someone to an appointment that
 * doesn't exist yet.
 */
export function Done({ flow, timeZone }: { flow: BookingFlowState; timeZone: string }) {
  const start = flow.startsAt ? new Date(flow.startsAt) : null;

  return (
    <div className="rounded-[1.5rem] border border-mint/30 bg-mint-soft/50 p-5 text-center @md:p-8">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest shadow-soft">
        <Check className="size-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-2xl text-forest">
        {bookingConfirmation.heading}
      </h3>

      {flow.sessionType && start && (
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-forest/85">
          {flow.sessionType.name} · {formatLongDate(start, timeZone)} at{" "}
          {formatTime(start, timeZone)}
          {flow.mode ? ` · ${MODE_LABELS[flow.mode as SessionMode]}` : ""}
        </p>
      )}

      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
        {bookingConfirmation.body}
      </p>

      {flow.token && (
        <Link
          href={`/booking/${flow.token}`}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift"
        >
          View your booking
        </Link>
      )}

      <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-muted">
        {bookingConfirmation.note}
      </p>
    </div>
  );
}
