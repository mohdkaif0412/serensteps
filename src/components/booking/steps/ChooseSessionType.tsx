"use client";

import { CalendarDays } from "lucide-react";
import { OptionCard, formatDuration } from "@/components/booking/shared";
import type { BookingFlowState } from "@/components/booking/useBookingFlow";

/**
 * Step one. Just the choices — the shell above provides the question, so this
 * renders identically in the page stepper and in the chat bubble.
 */
export function ChooseSessionType({ flow }: { flow: BookingFlowState }) {
  if (flow.sessionTypes.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-sage-deep/40 bg-cream/80 p-5 leading-relaxed text-muted">
        Online booking isn&rsquo;t available at the moment. Please send us a message
        and we&rsquo;ll find a time together.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {flow.sessionTypes.map((type) => (
        <OptionCard
          key={type.slug}
          icon={<CalendarDays className="size-5" strokeWidth={1.75} aria-hidden="true" />}
          title={type.name}
          description={type.blurb}
          meta={[formatDuration(type.durationMin), type.price].filter(Boolean).join(" · ")}
          selected={flow.sessionType?.slug === type.slug}
          onClick={() => flow.chooseSessionType(type)}
        />
      ))}
    </div>
  );
}
