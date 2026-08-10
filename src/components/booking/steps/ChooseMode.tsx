"use client";

import { MapPin, Phone, Video } from "lucide-react";
import { OptionCard } from "@/components/booking/shared";
import {
  MODE_BLURBS,
  MODE_LABELS,
  type SessionMode,
} from "@/lib/booking/constants";
import type { BookingFlowState } from "@/components/booking/useBookingFlow";

const icons: Record<SessionMode, typeof Video> = {
  ONLINE: Video,
  IN_PERSON: MapPin,
  PHONE: Phone,
};

/** Step two — only ever shown when the session is offered more than one way. */
export function ChooseMode({ flow }: { flow: BookingFlowState }) {
  const modes = flow.sessionType?.modes ?? [];

  return (
    <div className="space-y-3">
      {modes.map((mode) => {
        const Icon = icons[mode];
        return (
          <OptionCard
            key={mode}
            icon={<Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />}
            title={MODE_LABELS[mode]}
            description={MODE_BLURBS[mode]}
            selected={flow.mode === mode}
            onClick={() => flow.chooseMode(mode)}
          />
        );
      })}
    </div>
  );
}
