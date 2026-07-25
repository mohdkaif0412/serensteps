import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = "Serene Step FAQ — questions, gently answered";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "Questions & answers",
    headline:
      "First sessions, our approach, booking, confidentiality — the questions we hear most, answered honestly.",
  });
}
