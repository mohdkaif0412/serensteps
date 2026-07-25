import { llmsFull } from "@/lib/llms";
import { getPublishedFaqGroups, getPublishedPosts } from "@/lib/queries";

// Includes DB-backed FAQ and journal sections, so it refreshes on the same
// 10-minute cadence as the sitemap and feed.
export const revalidate = 600;

/**
 * /llms-full.txt — the complete plain text of every key page (about, both
 * service tabs, the resources glossary, FAQ, journal index, contact), so a model
 * can ingest the whole practice in one fetch instead of crawling six pages.
 *
 * The FAQ and journal sections come from the database; a build without one
 * simply omits them (see withDbFallback in src/lib/db.ts).
 */
export async function GET() {
  const [faqGroups, { posts }] = await Promise.all([
    getPublishedFaqGroups(),
    getPublishedPosts({ page: 1, pageSize: 100 }),
  ]);

  return new Response(llmsFull({ faqGroups, posts }), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
