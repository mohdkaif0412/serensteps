"use client";

import { ShieldAlert, Loader2 } from "lucide-react";
import { AvailabilityChart } from "@/components/booking/AvailabilityChart";
import { bookingLabels, crisisNote } from "@/lib/content/booking";
import type { BookingFlowState } from "@/components/booking/useBookingFlow";

/**
 * Step three: the availability chart — the whole week, with free, booked and
 * unavailable times all visible — and the crisis note that must stay beside it.
 *
 * The chart itself lives in AvailabilityChart; this step only decides between
 * it, the loading line, and "nothing at all". Times are shown in the practice's
 * timezone with the visitor's own underneath whenever the two differ — a missed
 * session because someone read 3pm as their own 3pm is the failure that
 * prevents.
 */
export function ChooseTime({
  flow,
  timeZone,
}: {
  flow: BookingFlowState;
  /** The practice timezone, passed down from the server. */
  timeZone: string;
}) {
  const anyFree = flow.grid.days.some((day) => day.freeCount > 0);

  if (flow.loadingSlots) {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {bookingLabels.loadingTimes}
      </p>
    );
  }

  if (!anyFree) {
    return (
      <p className="rounded-2xl border border-dashed border-sage-deep/40 bg-cream/80 p-5 leading-relaxed text-muted">
        {bookingLabels.noTimesAtAll}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <AvailabilityChart
        grid={flow.grid}
        timeZone={timeZone}
        selected={flow.startsAt}
        onSelect={flow.chooseSlot}
      />

      {/* Not decoration — see content/booking.ts. */}
      <div className="flex items-start gap-3 rounded-2xl border border-sage-deep/25 bg-sand p-3.5 @md:p-4">
        <ShieldAlert
          className="mt-0.5 size-4 shrink-0 text-mint-deep @md:size-5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p className="text-[0.8rem] leading-relaxed text-forest/90 @md:text-sm">
          <span className="font-semibold text-forest">{crisisNote.title}. </span>
          {crisisNote.text}
        </p>
      </div>
    </div>
  );
}
