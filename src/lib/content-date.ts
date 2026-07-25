/**
 * When the site's own copy last changed.
 *
 * Set `SITE_LAST_MODIFIED` to an ISO date (the release commit date is a good
 * choice in CI) and everything that needs to state a freshness date — the
 * sitemap's static routes, llms.txt, llms-full.txt — agrees on it. Without it,
 * the deploy/render time is used, which is the honest answer for hand-written
 * pages that ship with the build.
 */
export function contentLastModified(): Date {
  const fromEnv = process.env.SITE_LAST_MODIFIED?.trim();
  if (fromEnv) {
    const parsed = new Date(fromEnv);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

/** The same date as `YYYY-MM-DD`, for the plain-text documents. */
export function contentLastModifiedDate(): string {
  return contentLastModified().toISOString().slice(0, 10);
}
