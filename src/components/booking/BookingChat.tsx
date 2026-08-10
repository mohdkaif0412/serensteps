"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, X } from "lucide-react";
import { ChatLauncher } from "@/components/booking/ChatLauncher";
import { ChooseSessionType } from "@/components/booking/steps/ChooseSessionType";
import { ChooseMode } from "@/components/booking/steps/ChooseMode";
import { ChooseTime } from "@/components/booking/steps/ChooseTime";
import { YourDetails } from "@/components/booking/steps/YourDetails";
import { Done } from "@/components/booking/steps/Done";
import { useBookingFlow } from "@/components/booking/useBookingFlow";
import { bookingScript } from "@/lib/content/booking";
import { MODE_LABELS, type SessionMode } from "@/lib/booking/constants";
import { formatLongDate, formatTime } from "@/lib/booking/timezone";
import { LogoMark } from "@/components/ui/Logo";
import type { PublicSessionType } from "@/lib/queries";

/**
 * The booking assistant: the same flow as /book, wearing a conversation.
 *
 * Scripted rather than generative on purpose — this sits on a mental-wellness
 * site, and a made-up answer to "should I be worried about…" would be worse
 * than no widget at all. It asks, it listens, it books. Nothing else.
 *
 * Layout: a fixed three-part panel — header, one scrolling transcript, footer.
 * The transcript is the only scroll container, and it declares `@container` so
 * the shared step components lay themselves out for ~350px instead of for the
 * viewport. Hidden on /book (the page already is the flow) and on the admin.
 */
export function BookingChat({
  sessionTypes,
  timeZone,
}: {
  sessionTypes: PublicSessionType[];
  timeZone: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const flow = useBookingFlow(sessionTypes);
  const reduceMotion = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // Escape closes; focus returns to the launcher it came from.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the panel when it opens, so keyboard users aren't stranded
  // behind the whole page.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Follow the conversation down as each new question arrives.
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [flow.step, flow.loadingSlots, open, reduceMotion]);

  if (pathname === "/book" || pathname.startsWith("/admin")) return null;
  if (sessionTypes.length === 0) return null;

  const start = flow.startsAt ? new Date(flow.startsAt) : null;

  // What's already been answered, as their side of the conversation.
  const answers = [
    flow.sessionType && { key: "session", text: flow.sessionType.name, to: "session" as const },
    flow.mode &&
      flow.sessionType &&
      flow.sessionType.modes.length > 1 && {
        key: "mode",
        text: MODE_LABELS[flow.mode as SessionMode],
        to: "mode" as const,
      },
    start && {
      key: "time",
      text: `${formatLongDate(start, timeZone)}, ${formatTime(start, timeZone)}`,
      to: "time" as const,
    },
  ].filter(Boolean) as { key: string; text: string; to: "session" | "mode" | "time" }[];

  // Only show answers made *before* the step being asked now.
  const askedIndex = flow.activeSteps.indexOf(flow.step);
  const shown = answers.filter(
    (answer) => flow.activeSteps.indexOf(answer.to) < askedIndex,
  );

  const done = flow.step === "done";
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.99 },
        transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="false"
            aria-label={bookingScript.launcher.label}
            {...panelMotion}
            // Fixed height, not max-height: a panel that grows and shrinks as
            // each step swaps in reads as broken. `dvh` keeps it above the
            // mobile browser chrome and shrinks when the keyboard opens.
            className="fixed inset-x-3 bottom-3 top-3 z-50 flex flex-col overflow-hidden rounded-[1.5rem] border border-sage-deep/25 bg-paper shadow-float sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-auto sm:h-[min(38rem,calc(100dvh-6rem))] sm:w-[24rem] sm:rounded-[1.75rem]"
          >
            {/* Header — fixed */}
            <header className="on-forest flex shrink-0 items-center gap-3 bg-forest px-4 py-3">
              {flow.stepIndex > 0 && !done ? (
                <button
                  type="button"
                  onClick={flow.back}
                  aria-label="Back a step"
                  className="-ml-1.5 rounded-lg p-1.5 text-mint-pale transition-colors hover:bg-forest-soft hover:text-paper"
                >
                  <ChevronLeft className="size-5" />
                </button>
              ) : (
                <LogoMark tone="dark" className="h-6" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-paper">
                  {bookingScript.launcher.label}
                </p>
                <p className="truncate text-[0.7rem] text-mint-pale">
                  {done
                    ? "All done"
                    : `Step ${flow.stepIndex + 1} of ${flow.totalSteps}`}
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label={bookingScript.launcher.close}
                className="-mr-1.5 rounded-lg p-1.5 text-mint-pale transition-colors hover:bg-forest-soft hover:text-paper"
              >
                <X className="size-5" />
              </button>
            </header>

            {/* Progress — a thin rule under the header */}
            {!done && (
              <div className="h-0.5 shrink-0 bg-sage" role="presentation">
                <div
                  className="h-full bg-mint transition-[width] duration-500 ease-soft"
                  style={{
                    width: `${((flow.stepIndex + 1) / flow.totalSteps) * 100}%`,
                  }}
                />
              </div>
            )}

            {/* Transcript — the only scroll container, and the query container */}
            <div
              ref={scrollRef}
              className="@container min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
            >
              <Bubble>{bookingScript.greeting}</Bubble>

              {shown.map((answer) => (
                <div key={answer.key} className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => flow.goTo(answer.to)}
                    title="Change this answer"
                    className="max-w-[85%] rounded-2xl rounded-br-sm bg-forest px-4 py-2.5 text-left text-sm text-paper transition-opacity hover:opacity-90"
                  >
                    {answer.text}
                  </button>
                </div>
              ))}

              {/* Announced so a screen reader hears each new question. */}
              <div aria-live="polite">
                <Bubble>{bookingScript[flow.step].prompt}</Bubble>
              </div>

              <div className="pt-1">
                {flow.step === "session" && <ChooseSessionType flow={flow} />}
                {flow.step === "mode" && <ChooseMode flow={flow} />}
                {flow.step === "time" && <ChooseTime flow={flow} timeZone={timeZone} />}
                {flow.step === "details" && (
                  <YourDetails flow={flow} timeZone={timeZone} />
                )}
                {done && <Done flow={flow} timeZone={timeZone} />}
              </div>
            </div>

            {/* Footer — fixed, and clear of the iOS home indicator */}
            <footer className="shrink-0 border-t border-sage-deep/20 bg-cream px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
              {done ? (
                <button
                  type="button"
                  onClick={flow.restart}
                  className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-forest"
                >
                  Book another session
                </button>
              ) : (
                <p className="text-[0.7rem] leading-relaxed text-muted">
                  Nothing is confirmed until we write back — usually within a
                  couple of working days.
                </p>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The launcher hides while the panel is open — on a phone the panel
          covers the screen, and a button underneath it is just a trap. */}
      {!open && (
        <ChatLauncher
          sessionTypes={sessionTypes}
          onOpen={() => setOpen(true)}
          buttonRef={launcherRef}
        />
      )}
    </>
  );
}

/** The practice's side of the conversation. */
function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-sage-mist px-4 py-2.5 text-sm leading-relaxed text-forest">
        {children}
      </p>
    </div>
  );
}
