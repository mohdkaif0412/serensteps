import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = "Serene Step resources — a plain-language guide to therapy terms";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "Resources",
    headline:
      "The words for it, in plain language — counselling, anxiety, boundaries, burnout, assessment.",
  });
}
