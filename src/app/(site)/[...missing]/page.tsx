import { notFound } from "next/navigation";

/**
 * Catch-all for any URL no other route claims.
 *
 * Next only renders the *root* `app/not-found.tsx` for unmatched URLs, which
 * sits outside the (site) layout — so the visitor would lose the header, footer
 * and booking assistant. Routing every unknown path here instead and throwing
 * `notFound()` hands it to `(site)/not-found.tsx`, inside the full site chrome,
 * with a real 404 status. Static and dynamic routes always win over a catch-all,
 * so this never shadows a real page.
 */
export default function Missing() {
  notFound();
}
