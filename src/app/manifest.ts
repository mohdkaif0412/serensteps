import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Web app manifest — "PWA-lite": no service worker, but a proper installable
 * identity, so saving the site to a phone home screen gives the brand mark and
 * the paper background instead of a screenshot and a grey splash.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f3ec", // paper
    theme_color: "#174238", // forest
    lang: "en",
    categories: ["health", "medical", "lifestyle"],
    // The same two assets the <head> icons use — public/icon.svg scales to any
    // size, and src/app/apple-icon.png covers the raster fallback.
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
