import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Per-page metadata, built in one place.
 *
 * Next merges metadata *shallowly*: a page that sets `title` but not
 * `openGraph` silently inherits the parent's whole `openGraph` object — so it
 * used to share the homepage's og:title and og:url, and a page that forgot
 * `alternates` inherited the root's `canonical: "/"` and told Google it was a
 * duplicate of the homepage. This helper always sets canonical, Open Graph and
 * Twitter together from the same three inputs, so they can't disagree.
 *
 * Open Graph images come from the route's `opengraph-image.tsx` file and are
 * merged in by Next on top of whatever this returns — pass `images` only to
 * override them (e.g. a blog post's cover).
 *
 * Keep `description` within 140–160 characters: long enough to use the
 * snippet, short enough not to be cut.
 */

type Image = { url: string; alt?: string };

export type PageSeo = {
  /** The page's own title; the root template appends " — <brand>". */
  title: string;
  description: string;
  /** Path from the site root, e.g. "/about". Becomes canonical and og:url. */
  path: string;
  /** Use `title` verbatim, without the brand template (the homepage). */
  absoluteTitle?: boolean;
  images?: Image[];
  /** Makes the page an og:type=article with these fields. */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    authors?: string[];
  };
  /** Extra <link rel="alternate"> types, e.g. the RSS feed. */
  alternateTypes?: Record<string, string>;
  robots?: Metadata["robots"];
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  images,
  article,
  alternateTypes,
  robots,
}: PageSeo): Metadata {
  const shared = {
    title,
    description,
    url: path,
    siteName: site.name,
    ...(images ? { images } : {}),
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      ...(alternateTypes ? { types: alternateTypes } : {}),
    },
    openGraph: article
      ? { type: "article", ...shared, ...article }
      : { type: "website", ...shared },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
    ...(robots ? { robots } : {}),
  };
}
