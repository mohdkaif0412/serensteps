import type { Metadata } from "next";
import { NotFound } from "@/components/sections/NotFound";
import { notFoundPage } from "@/lib/content/not-found";

export const metadata: Metadata = {
  title: notFoundPage.metaTitle,
  robots: { index: false, follow: true },
};

/** Any unknown URL, or a `notFound()` thrown by a public page (a missing blog
 *  post, an expired booking token) lands here — inside the site layout. */
export default function SiteNotFound() {
  return <NotFound />;
}
