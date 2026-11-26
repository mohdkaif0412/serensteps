"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BLUR_DATA_URL } from "@/lib/images";
import { cn } from "@/lib/utils";

type Mask = "soft" | "arch" | "arch-wide";

/* Same organic masks as `Photo`, so a video slots into the same layouts. */
const masks: Record<Mask, string> = {
  soft: "rounded-[2rem]",
  arch: "rounded-t-full rounded-b-[2rem]",
  "arch-wide": "rounded-t-[18%]",
};

const GRADE = "[filter:saturate(0.3)_hue-rotate(-10deg)_contrast(1.05)]";

export type SiteVideo = {
  src: string;
  /** Describes the scene. Used as the poster photograph's alt text. */
  label: string;
  /** A still from /public, shown until (or instead of) the clip. */
  poster: string;
};

type VideoProps = {
  video: SiteVideo;
  mask?: Mask;
  /** Aspect ratio, width constraints, shadows — composed by the caller. */
  className?: string;
  /** Skip the duotone for footage that already sits under a scrim. */
  grade?: boolean;
  /** Rendered width of the poster, for its srcset. */
  sizes?: string;
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** Data Saver on, or a connection too slow to spend a few MB on ambience. */
function constrainedNetwork(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (!connection) return false;
  return (
    Boolean(connection.saveData) ||
    ["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? "")
  );
}

/**
 * The video equivalent of `Photo`: same masks, same green duotone, same inset
 * ring — so a looping clip reads as part of the same curated set as the
 * site's photography, not a bolted-on media player.
 *
 * It is motion in place of a photograph, so it costs no more than one until
 * it's actually seen:
 *
 *   · The poster is an optimised `next/image` (AVIF/WebP, sized by `sizes`,
 *     lazy) underneath the video — not the `poster` attribute, which would
 *     fetch the full-size original JPEG.
 *   · The MP4 has no `src` in the HTML and `preload="none"`, so nothing is
 *     downloaded on page load. Once the page has loaded, an
 *     IntersectionObserver attaches the source and plays it only while it's
 *     on screen, and pauses it when it scrolls away.
 *     A clip inside a `hidden` tab panel never intersects, so it never loads.
 *     Four autoplaying clips used to make /services a 7 MB page.
 *   · Under `prefers-reduced-motion`, Data Saver, or a 2G/3G connection the
 *     clip is never loaded at all: the reader keeps the still photograph.
 *   · The video fades in over the poster only once it is actually playing, so
 *     there is never a blank or half-decoded frame.
 */
export function Video({
  video,
  mask = "soft",
  className,
  grade = true,
  sizes = "(max-width: 1024px) 100vw, 33vw",
}: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion || constrainedNetwork()) return;

    let observer: IntersectionObserver | undefined;
    const start = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Attached imperatively, once: React never renders a `src`, so the
            // server HTML carries no media request at all.
            if (!el.getAttribute("src")) el.src = video.src;
            // Autoplay can still be refused (e.g. iOS Low Power Mode); the
            // poster simply stays, which is the right fallback.
            el.play().catch(() => {});
          } else if (!el.paused) {
            el.pause();
          }
        },
        // Start a little early, so the clip is moving by the time it arrives.
        { rootMargin: "200px 0px" },
      );
      observer.observe(el);
    };

    // Not before the page has loaded: on a phone the first card already sits
    // near the fold, and its clip would otherwise compete with the CSS, fonts
    // and LCP for bandwidth.
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      observer?.disconnect();
    };
  }, [reduceMotion, video.src]);

  return (
    <div className={cn("relative overflow-hidden", masks[mask], className)}>
      <Image
        src={video.poster}
        alt={video.label}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={cn("object-cover", grade && GRADE)}
      />
      <video
        ref={ref}
        // The poster above carries the description; the clip is the same scene
        // in motion, so it would only be announced twice.
        aria-hidden="true"
        tabIndex={-1}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="none"
        onPlaying={() => setPlaying(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-soft",
          playing ? "opacity-100" : "opacity-0",
          grade && GRADE,
        )}
      />
      {grade && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-forest/50 mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-mint/40 mix-blend-screen"
          />
        </>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-forest/10"
      />
    </div>
  );
}
