"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A thread of mint across the top of the page while a navigation is in flight.
 *
 * Deliberately *not* a full-screen loader between pages — the route transition
 * in (site)/template.tsx already covers the change. This exists only so a slow
 * page (one waiting on the database, say) doesn't feel like a dead click.
 *
 * It starts on the click rather than on the render, because that is the moment
 * the reader is waiting from. `usePathname` changing is what ends it. Only
 * width and opacity animate, and the bar is fixed, so it can't shift layout.
 */

/** Below this a navigation was instant and the bar would only be a flicker. */
const GRACE_MS = 140;

export function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const grace = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settled = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Anything that isn't a plain left-click stays the browser's business.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, different anchor: no navigation to wait for.
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      if (grace.current) clearTimeout(grace.current);
      grace.current = setTimeout(() => setPhase("loading"), GRACE_MS);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      if (grace.current) clearTimeout(grace.current);
    };
  }, []);

  // Arrived. Run the bar out to full, then let it fade.
  useEffect(() => {
    if (grace.current) clearTimeout(grace.current);
    setPhase((current) => (current === "loading" ? "done" : "idle"));
  }, [pathname]);

  useEffect(() => {
    if (phase !== "done") return;
    settled.current = setTimeout(() => setPhase("idle"), 420);
    return () => {
      if (settled.current) clearTimeout(settled.current);
    };
  }, [phase]);

  /* The bar is drawn with scaleX rather than width — same picture, but it
     composites, so a navigation can never cost a layout pass. Starting narrow
     and bumping on the next frame is what gives the transition something to
     animate from. */
  const [scale, setScale] = useState(0.05);
  useEffect(() => {
    if (phase === "done") {
      setScale(1);
      return;
    }
    if (phase !== "loading") return;
    setScale(0.05);
    const frame = requestAnimationFrame(() => setScale(0.72));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5"
    >
      <div
        className="route-bar h-full w-full origin-left bg-mint"
        style={{ transform: `scaleX(${scale})`, opacity: phase === "done" ? 0 : 1 }}
      />
      <span className="sr-only">
        {phase === "done" ? "Page loaded" : "Loading page"}
      </span>
    </div>
  );
}
