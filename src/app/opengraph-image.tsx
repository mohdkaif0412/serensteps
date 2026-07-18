import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share image (used sitewide except where a page sets its own,
// e.g. blog posts use their cover image).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F6F3EC",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              backgroundColor: "#24352F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E3A857",
              fontSize: 36,
            }}
          >
            S
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#6B7A70",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            Mental wellness &amp; therapy
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 80, color: "#24352F", lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 40, color: "#24352F", fontStyle: "italic" }}>
            Healing, one step at a time.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 26,
            color: "#6B7A70",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#E3A857",
            }}
          />
          Children &amp; Teens · Individuals · Couples &amp; Families
        </div>
      </div>
    ),
    { ...size },
  );
}
