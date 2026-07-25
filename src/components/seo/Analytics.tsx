import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Privacy-friendly, cookieless analytics — so Core Web Vitals and traffic are
 * actually measurable without asking visitors of a mental-health site to accept
 * tracking. Deliberately not Google Analytics.
 *
 * Renders nothing at all unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, so no
 * third-party request is made by default and the bundle stays untouched.
 * `afterInteractive` keeps it well clear of LCP.
 *
 * Works with a self-hosted Plausible or Umami instance too — point
 * NEXT_PUBLIC_PLAUSIBLE_SRC at your own script URL.
 */
export function Analytics() {
  const { plausibleDomain, plausibleSrc } = site.analytics;
  if (!plausibleDomain) return null;

  return (
    <Script
      src={plausibleSrc}
      data-domain={plausibleDomain}
      strategy="afterInteractive"
      defer
    />
  );
}
