"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A quiet mint ring that follows the pointer.
 *
 * It is an *accent*, not a replacement: the native cursor stays visible and
 * keeps its own precision, so nothing you click is ever a guess. The ring is
 * centred on the true pointer hotspot, carries no words, and never covers a
 * label — over a link or a button it simply opens a little and softens.
 *
 * Guardrails, all of them deliberate:
 *
 *   · Nothing renders unless `(pointer: fine)` matches and the pointer isn't a
 *     touch one. Both media queries are watched, so plugging a mouse into a
 *     tablet turns it on and unplugging turns it off.
 *   · `prefers-reduced-motion` disables it outright.
 *   · The native cursor is never hidden — no `cursor: none` anywhere — so text
 *     fields keep their caret and every hit target keeps its own affordance.
 *     Over a field the ring fades out entirely rather than crowd the caret.
 *   · The layer is `pointer-events-none` and `aria-hidden`: hit targets, focus
 *     rings and keyboard navigation are untouched.
 *   · One rAF loop that only runs while the ring is still catching up, writing
 *     a single transform. State changes are written as data attributes on the
 *     element itself, so hovering a link never re-renders React. No layout is
 *     read and no scroll listener exists.
 */

/** Anything that should make the ring open. */
const INTERACTIVE =
  'a[href], button:not([disabled]), summary, [role="button"], [role="tab"]';

/** Anything you type into — the ring gets out of the caret's way entirely. */
const TEXT_FIELD =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

/** How much of the remaining distance is closed each frame. Nearly 1:1. */
const EASE = 0.35;

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  /* Should this exist at all? */
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !still.matches);
    sync();
    fine.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  /* Tracking. Added only while enabled, removed the moment it isn't. */
  useEffect(() => {
    if (!enabled) return;
    const box = layer.current;
    const dot = ring.current;
    if (!box || !dot) return;

    let toX = 0;
    let toY = 0;
    let atX = 0;
    let atY = 0;
    let frame = 0;
    let seen = false;

    const draw = () => {
      atX += (toX - atX) * EASE;
      atY += (toY - atY) * EASE;
      // Centred on the pointer hotspot: the -50% is of the ring's own box, so
      // it is never offset from what you are actually clicking.
      box.style.transform = `translate3d(${atX}px, ${atY}px, 0) translate(-50%, -50%)`;
      frame =
        Math.abs(toX - atX) > 0.1 || Math.abs(toY - atY) > 0.1
          ? requestAnimationFrame(draw)
          : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      toX = event.clientX;
      toY = event.clientY;
      if (!seen) {
        // Arrive where the pointer already is rather than flying in.
        seen = true;
        atX = toX;
        atY = toY;
        box.dataset.here = "true";
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      // Written straight to the element — a hover never re-renders React.
      dot.dataset.text = target.closest(TEXT_FIELD) ? "true" : "false";
      dot.dataset.open = target.closest(INTERACTIVE) ? "true" : "false";
      dot.dataset.tone = target.closest(".on-forest") ? "light" : "dark";
    };

    const leave = () => {
      box.dataset.here = "false";
      seen = false;
    };
    const press = (state: string) => () => {
      dot.dataset.press = state;
    };
    const down = press("true");
    const up = press("false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layer}
      aria-hidden="true"
      data-here="false"
      className="cursor-ring pointer-events-none fixed left-0 top-0 z-[85]"
    >
      <div
        ref={ring}
        data-open="false"
        data-text="false"
        data-tone="dark"
        data-press="false"
        className="cursor-ring-mark size-9 rounded-full border"
      />
    </div>
  );
}
