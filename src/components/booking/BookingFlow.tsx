"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChooseSessionType } from "@/components/booking/steps/ChooseSessionType";
import { ChooseMode } from "@/components/booking/steps/ChooseMode";
import { ChooseTime } from "@/components/booking/steps/ChooseTime";
import { YourDetails } from "@/components/booking/steps/YourDetails";
import { Done } from "@/components/booking/steps/Done";
import { BackLink } from "@/components/booking/shared";
import { useBookingFlow } from "@/components/booking/useBookingFlow";
import { bookingScript } from "@/lib/content/booking";
import type { PublicSessionType } from "@/lib/queries";

/**
 * The full-page booking stepper. One of two shells over `useBookingFlow` — the
 * other is the floating assistant — so anything about *what* is asked belongs
 * in the hook or the step components, never here.
 */
export function BookingFlow({
  sessionTypes,
  timeZone,
}: {
  sessionTypes: PublicSessionType[];
  timeZone: string;
}) {
  const flow = useBookingFlow(sessionTypes);
  const reduceMotion = useReducedMotion();

  const heading = bookingScript[flow.step].heading;
  const done = flow.step === "done";

  const transition = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    // `@container` lets the step components size themselves from the space they
    // actually get, not from the viewport — the same components render inside a
    // 384px assistant panel. Never use `sm:`/`md:` inside a step for this reason.
    <div className="@container rounded-[2rem] border border-sage-deep/20 bg-cream p-5 shadow-lift sm:p-8">
      {!done && (
        <div className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl text-forest sm:text-[1.7rem]">
              {heading}
            </h2>
            <p className="shrink-0 text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Step {flow.stepIndex + 1} of {flow.totalSteps}
            </p>
          </div>
          {/* A thin rule needs mint-deep to be seen on cream. */}
          <div
            className="mt-3 h-1 overflow-hidden rounded-full bg-sage"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-mint-deep transition-[width] duration-500 ease-soft"
              style={{
                width: `${((flow.stepIndex + 1) / flow.totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={flow.step} {...transition}>
          {flow.step === "session" && <ChooseSessionType flow={flow} />}
          {flow.step === "mode" && <ChooseMode flow={flow} />}
          {flow.step === "time" && <ChooseTime flow={flow} timeZone={timeZone} />}
          {flow.step === "details" && <YourDetails flow={flow} timeZone={timeZone} />}
          {done && <Done flow={flow} timeZone={timeZone} />}
        </motion.div>
      </AnimatePresence>

      {!done && flow.stepIndex > 0 && (
        <div className="mt-6 border-t border-sage-deep/15 pt-4">
          <BackLink onClick={flow.back} />
        </div>
      )}

      {done && (
        <div className="mt-5 text-center">
          <BackLink onClick={flow.restart} label="Book another session" />
        </div>
      )}
    </div>
  );
}
