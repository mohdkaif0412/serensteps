import { site } from "@/lib/site";
import { getPublishedPosts } from "@/lib/queries";

// Rebuilt every 10 minutes — quick enough that a build without a database
// (Docker/CI) doesn't serve an empty feed for long. Cheap either way.
export const revalidate = 600;

/** Escape the five XML entities. Post titles and excerpts are author-supplied. */
function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed for the journal, at /blog/feed.xml.
 *
 * Advertised from the blog page's metadata as `rel="alternate"`, so readers,
 * newsreaders and content ingesters can all find it. Excerpts only — the full
 * article lives on the site, where the crisis note and the booking path are.
 */
export async function GET() {
  const { posts } = await getPublishedPosts({ page: 1, pageSize: 50 });
  const self = `${site.url}/blog/feed.xml`;
  const updated = posts[0]?.updatedAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${xml(post.category)}</category>
      <description>${xml(post.excerpt)}</description>
      <enclosure url="${xml(post.coverImage)}" type="image/jpeg" length="0" />
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.name)} — Journal</title>
    <link>${site.url}/blog</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>Gentle, practical writing on anxiety, relationships, parenting, starting therapy, and reflective practice.</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <managingEditor>${xml(site.email)} (${xml(site.practitioner?.name ?? site.name)})</managingEditor>
    <image>
      <url>${site.url}${site.logo.onLight}</url>
      <title>${xml(site.name)}</title>
      <link>${site.url}</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
