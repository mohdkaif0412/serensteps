"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchSlots, requestBooking } from "@/actions/booking";
import { slotsFromGrid, EMPTY_SLOT_GRID, type SlotGrid } from "@/lib/booking/slots";
import type { PublicSessionType } from "@/lib/queries";
import type { SessionMode } from "@/lib/booking/constants";
import { bookingSchema } from "@/lib/validation";

/**
 * The whole booking conversation as one headless state machine.
 *
 * Two shells render it — the full-page stepper at /book and the floating chat
 * assistant — and they must never drift apart on what's asked, what's valid, or
 * what's already been answered. So all of that lives here, and neither shell
 * knows anything the other doesn't.
 */

export const BOOKING_STEPS = ["session", "mode", "time", "details", "done"] as const;
export type BookingStep = (typeof BOOKING_STEPS)[number];

export type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  firstTime: boolean;
  concern: string;
  message: string;
  consent: boolean;
  /** Honeypot — stays empty for real people. */
  website: string;
};

const emptyDetails: BookingDetails = {
  name: "",
  email: "",
  phone: "",
  firstTime: true,
  concern: "",
  message: "",
  consent: false,
  website: "",
};

export function useBookingFlow(sessionTypes: PublicSessionType[]) {
  const [step, setStep] = useState<BookingStep>("session");
  const [sessionType, setSessionType] = useState<PublicSessionType | null>(null);
  const [mode, setMode] = useState<SessionMode | null>(null);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [details, setDetails] = useState<BookingDetails>(emptyDetails);

  // The chart is the source of truth; `days` below is just it, filtered.
  const [grid, setGrid] = useState<SlotGrid>(EMPTY_SLOT_GRID);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);

  // Guards a slow slot fetch from overwriting a newer one when someone changes
  // their mind about the session type mid-request.
  const requestId = useRef(0);

  const loadSlots = useCallback(async (slug: string) => {
    const id = ++requestId.current;
    setLoadingSlots(true);
    try {
      const result = await fetchSlots(slug);
      if (requestId.current === id) setGrid(result);
    } catch {
      if (requestId.current === id) setGrid(EMPTY_SLOT_GRID);
    } finally {
      if (requestId.current === id) setLoadingSlots(false);
    }
  }, []);

  const days = useMemo(() => slotsFromGrid(grid), [grid]);

  const chooseSessionType = useCallback(
    (type: PublicSessionType) => {
      setSessionType(type);
      setStartsAt(null);
      setError(null);
      void loadSlots(type.slug);
      // Nothing to ask when a session is only offered one way.
      if (type.modes.length === 1) {
        setMode(type.modes[0]);
        setStep("time");
      } else {
        setMode(null);
        setStep("mode");
      }
    },
    [loadSlots],
  );

  const chooseMode = useCallback((next: SessionMode) => {
    setMode(next);
    setStep("time");
  }, []);

  const chooseSlot = useCallback((iso: string) => {
    setStartsAt(iso);
    setError(null);
    setStep("details");
  }, []);

  const updateDetails = useCallback((patch: Partial<BookingDetails>) => {
    setDetails((current) => ({ ...current, ...patch }));
    setFieldErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }, []);

  /** Steps in play for this answer set — the mode step drops out when fixed. */
  const activeSteps = useMemo<BookingStep[]>(
    () =>
      sessionType && sessionType.modes.length === 1
        ? ["session", "time", "details", "done"]
        : [...BOOKING_STEPS],
    [sessionType],
  );

  const goTo = useCallback(
    (target: BookingStep) => {
      setError(null);
      setStep(target);
    },
    [],
  );

  const back = useCallback(() => {
    const index = activeSteps.indexOf(step);
    if (index > 0) goTo(activeSteps[index - 1]);
  }, [activeSteps, goTo, step]);

  const submit = useCallback(async () => {
    if (!sessionType || !mode || !startsAt) return;
    setError(null);
    setFieldErrors({});

    const payload = {
      sessionTypeSlug: sessionType.slug,
      mode,
      startsAt,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim() || undefined,
      firstTime: details.firstTime,
      concern: details.concern || undefined,
      message: details.message.trim() || undefined,
      consent: details.consent,
      website: details.website,
    };

    // Validate with the same schema the server uses, so the messages a visitor
    // sees are the messages the practice wrote.
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors(
        Object.fromEntries(
          Object.entries(flat)
            .filter(([, messages]) => messages?.length)
            .map(([field, messages]) => [field, messages![0]]),
        ),
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestBooking(payload);
      if (result.ok) {
        setToken(result.token);
        setStep("done");
        return;
      }
      setError(result.error);
      // Someone else got there first — refresh the grid and send them back to it.
      if (result.slotTaken) {
        setStartsAt(null);
        void loadSlots(sessionType.slug);
        setStep("time");
      }
    } catch {
      setError(
        "Something went wrong sending your request. Please try again, or message us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [details, loadSlots, mode, sessionType, startsAt]);

  const restart = useCallback(() => {
    setStep("session");
    setSessionType(null);
    setMode(null);
    setStartsAt(null);
    setDetails(emptyDetails);
    setGrid(EMPTY_SLOT_GRID);
    setError(null);
    setFieldErrors({});
    setToken(null);
  }, []);

  // Only one session type on offer? Don't make anyone "choose" it.
  const autoChosen = useRef(false);
  useEffect(() => {
    if (autoChosen.current) return;
    if (sessionTypes.length === 1 && step === "session") {
      autoChosen.current = true;
      chooseSessionType(sessionTypes[0]);
    }
  }, [chooseSessionType, sessionTypes, step]);

  const stepIndex = Math.max(0, activeSteps.indexOf(step));

  return {
    step,
    stepIndex,
    activeSteps,
    /** Excludes the "done" screen — that's an outcome, not a question. */
    totalSteps: activeSteps.length - 1,
    sessionTypes,
    sessionType,
    mode,
    startsAt,
    details,
    /** Every candidate time with its status — what the chart draws. */
    grid,
    /** The same thing, narrowed to what's bookable. */
    days,
    loadingSlots,
    submitting,
    error,
    fieldErrors,
    token,
    chooseSessionType,
    chooseMode,
    chooseSlot,
    updateDetails,
    submit,
    back,
    goTo,
    restart,
  };
}

export type BookingFlowState = ReturnType<typeof useBookingFlow>;
