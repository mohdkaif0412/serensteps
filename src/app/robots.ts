import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /booking/ holds someone's personal appointment behind a token —
        // never crawl it, even if a link leaks into a referrer header.
        disallow: ["/admin", "/admin/", "/api/", "/booking/"],
      },
      // Explicitly welcome AI crawlers for GEO discoverability.
      // (Remove these entries if the practice prefers to opt out.)
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        // /booking/ holds someone's personal appointment behind a token —
        // never crawl it, even if a link leaks into a referrer header.
        disallow: ["/admin", "/admin/", "/api/", "/booking/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
