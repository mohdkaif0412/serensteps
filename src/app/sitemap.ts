import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPostSitemapEntries } from "@/lib/queries";
import { contentLastModified } from "@/lib/content-date";

// Regenerated every 10 minutes so a newly published post appears without a
// redeploy — and so a build that ran without a database (Docker/CI) doesn't
// serve a post-less sitemap for long. One cheap projection query.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  // Hand-written pages last changed when they were deployed. See content-date.ts.
  const now = contentLastModified();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Posts carry their real edit time, plus their cover as an image entry so the
  // artwork is discoverable in image search.
  const posts = await getPostSitemapEntries();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
    images: [post.coverImage],
  }));

  return [...staticRoutes, ...postRoutes];
}
