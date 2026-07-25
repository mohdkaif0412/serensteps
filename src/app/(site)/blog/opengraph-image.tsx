import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = "The Serene Step journal — gentle reads for the journey";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "The journal",
    headline:
      "Honest, practical reflections on the things we carry — and small, kind ways to feel a little lighter.",
  });
}
