import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = "About Serene Step — a gentle place to heal and grow";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "About us",
    headline:
      "Healing isn’t about fixing what’s broken — it’s about discovering the strength already inside you.",
  });
}
