import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered once at build time, which is also when the logo file is readable
// from the project root.
export const dynamic = "force-static";

// Brand tokens can't be read from CSS here (Satori has no cascade), so the
// two brand greens are repeated literally. Keep them in step with globals.css.
const FOREST = "#174238";
const MINT = "#4dbb94";
const MINT_PALE = "#a9dcc8";

/**
 * Default social share image: the mint lockup on deep forest, with the logo's
 * wave motif running along the foot. Pages that need their own card set it
 * themselves (blog posts use their cover image).
 *
 * The logo is read off disk and inlined as a data URI. It's deliberately NOT
 * imported or reached via `new URL(…, import.meta.url)` — webpack rewrites those
 * to a `/_next/static/…` path, which has no origin to fetch from during the
 * build.
 */
export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "brand", "serene-step-mint.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  // The journey wave, echoing the mark: unsettled crest into a joyful trough.
  const wave = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="150" viewBox="0 0 1200 150">
       <g fill="none" stroke="${MINT}" stroke-width="5" stroke-linecap="round" opacity="0.32">
         <path d="M-20 96C60 96 100 40 200 40C300 40 340 116 440 116C540 116 580 48 680 48C780 48 820 116 920 116C1020 116 1060 44 1160 44C1200 44 1210 52 1230 56"/>
       </g>
     </svg>`,
  ).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: FOREST,
          padding: "84px 88px 0",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: MINT,
            fontFamily: "sans-serif",
          }}
        >
          Counselling · Testing · Reflective guidance
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={620} height={248} />
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: MINT_PALE,
              fontFamily: "sans-serif",
              maxWidth: 900,
            }}
          >
            A gentle place to heal and grow — for children &amp; teens,
            individuals, couples &amp; families.
          </div>
        </div>

        <div style={{ display: "flex", height: 150, marginLeft: -88 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wave} alt="" width={1200} height={150} />
        </div>
      </div>
    ),
    { ...size },
  );
}
