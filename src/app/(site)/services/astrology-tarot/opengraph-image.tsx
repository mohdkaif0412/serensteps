import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt =
  "Astrology & tarot at Serene Step — reflective guidance, never prediction";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "Astrology & tarot",
    // The framing has to survive being shared as a link, so the card carries it
    // rather than a generic invitation.
    headline:
      "Reflective tools for exploring patterns, emotions and decisions — never prediction, never a substitute for care.",
  });
}
