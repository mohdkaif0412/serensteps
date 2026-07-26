"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";

/**
 * The first-load moment: the wave of faces drawing itself in mint over the
 * brand forest, then getting out of the way.
 *
 * It is a curtain, never a gate. Everything it must not do:
 *
 *   · It must not delay the hero. The page underneath renders normally; this is
 *     a fixed overlay that fades the instant the fonts resolve, with a hard cap
 *     so a slow font can never hold it open.
 *   · It must not become the LCP element. There is no <img> in here and no
 *     large block of text — only an inline SVG, which Chrome never treats as an
 *     LCP candidate, and one small caption.
 *   · It must not shift layout on the way out. Fixed positioning and an opacity
 *     transition; nothing in the flow ever moves.
 *   · It must not repeat. `BootLoaderFlag` writes a session flag *before* this
 *     element is parsed, so every page after the first skips it with no flash.
 *   · Under `prefers-reduced-motion` the drawing is collapsed by the global
 *     floor in globals.css and the curtain leaves immediately.
 *
 * The geometry is the same sine construction as the logo mark and StepsPath —
 * one period per pair of faces.
 */

const W = 320;
const H = 88;
const MID = H / 2;
const AMP = 22;
const PERIODS = 2.5;
const SAMPLES = 120;

const yAt = (t: number) => MID - AMP * Math.sin(t * Math.PI * 2 * PERIODS);

const PATH = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const t = i / SAMPLES;
  return `${i === 0 ? "M" : "L"}${(t * W).toFixed(1)} ${yAt(t).toFixed(1)}`;
}).join(" ");

// A face on every crest and trough — they wake in turn, just behind the line.
const FACES = Array.from({ length: Math.round(PERIODS * 2) }, (_, i) => {
  const t = (0.25 + i * 0.5) / PERIODS;
  return { at: t, x: t * W, y: yAt(t), crest: i % 2 === 0 };
});

/** Shortest visible moment — below this the curtain reads as a flicker. */
const MIN_MS = 420;
/** Longest, whatever the fonts are doing. */
const MAX_MS = 1100;

export function BootLoader() {
  const [done, setDone] = useState(false);
  const started = useRef(Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const finish = () => {
      setDone(true);
      try {
        sessionStorage.setItem("serene-booted", "1");
      } catch {
        // Private mode, or storage disabled. The curtain simply shows again.
      }
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      finish();
      return;
    }

    // Fonts are `display: swap`, so this is usually quick — but it's exactly
    // the swap this curtain exists to cover.
    const ready =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();

    ready.then(() => {
      const elapsed = Date.now() - started.current;
      timer = setTimeout(finish, Math.max(0, MIN_MS - elapsed));
    });
    const cap = setTimeout(finish, MAX_MS);

    return () => {
      clearTimeout(timer);
      clearTimeout(cap);
    };
  }, []);

  return (
    <div
      className="boot fixed inset-0 z-[95] grid place-items-center bg-forest"
      data-done={done}
      role="status"
      aria-busy={!done}
      aria-hidden={done || undefined}
      // Once it has faded it must never intercept a click, even for the frame
      // before React removes `aria-busy`.
      style={done ? ({ pointerEvents: "none" } as CSSProperties) : undefined}
    >
      <div className="flex flex-col items-center gap-5 px-6">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${W} ${H}`}
          className="h-16 w-[min(18rem,72vw)] text-mint"
          fill="none"
        >
          <path
            d={PATH}
            pathLength={1}
            className="mark-draw"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {FACES.map((face, i) => (
            <g
              key={i}
              className="face-wake"
              style={{ "--wake-delay": `${(0.2 + face.at * 0.9).toFixed(2)}s` } as CSSProperties}
            >
              <circle cx={face.x - 4.5} cy={face.y - 4} r="2" fill="currentColor" />
              <circle cx={face.x + 4.5} cy={face.y - 4} r="2" fill="currentColor" />
              <path
                d={
                  face.crest
                    ? `M${face.x - 5.5} ${face.y + 3}C${face.x - 2.5} ${face.y + 7.5} ${face.x + 2.5} ${face.y + 7.5} ${face.x + 5.5} ${face.y + 3}`
                    : `M${face.x - 5.5} ${face.y + 4.5}C${face.x - 2.5} ${face.y + 6.5} ${face.x + 2.5} ${face.y + 6.5} ${face.x + 5.5} ${face.y + 4.5}`
                }
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>

        <p className="rise-in rise-delay-4 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-mint-pale">
          {site.name}
        </p>
      </div>

      <span className="sr-only">Loading {site.name}</span>
    </div>
  );
}

/**
 * Written into the document *before* the curtain is parsed, so a reader moving
 * around the site never sees it a second time — and never sees it flash before
 * a `useEffect` could hide it.
 */
export function BootLoaderFlag() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html:
          'try{if(sessionStorage.getItem("serene-booted"))document.documentElement.setAttribute("data-booted","");}catch(e){}',
      }}
    />
  );
}
