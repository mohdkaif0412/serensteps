import { llmsIndex } from "@/lib/llms";

// Regenerated hourly so the "last updated" line and the service copy stay true.
export const revalidate = 3600;

/**
 * /llms.txt — the curated index for answer engines and AI crawlers.
 *
 * Generated rather than kept as a static file in `public/`, so it carries a real
 * "last updated" date and can never drift from the pages it summarises.
 */
export async function GET() {
  return new Response(llmsIndex(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
