/**
 * When the site's own copy last changed.
 *
 * Everything that states a freshness date — the sitemap's static routes,
 * llms.txt, llms-full.txt — agrees on `SITE_LAST_MODIFIED`. next.config.ts
 * fixes it at build time (an explicit env value, else the commit date, else
 * the build time), so it stays put between deploys. The `new Date()` below is
 * only a last resort for code run outside `next` (scripts, tests).
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
