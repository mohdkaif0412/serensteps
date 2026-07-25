import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const alt = "Contact Serene Step — take the first step together";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-static";

export default function Image() {
  return renderOgImage({
    eyebrow: "Contact & booking",
    headline:
      "Let’s take the first step together — reach out whenever you’re ready. There’s no commitment in asking.",
  });
}
