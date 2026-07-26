"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps old deep links alive.
 *
 * /services used to be a two-tab page, so every audience and every reading had
 * an anchor on it: `/services#individuals`, `/services#birth-chart-analysis`,
 * and so on. Those fragments are out in the wild — in the glossary, in the
 * llms.txt documents that answer engines have already fetched, and in anything
 * anyone has linked. Each one now maps to a real page instead.
 *
 * A fragment is never sent to the server, so this can't be a 301 — it has to
 * happen in the browser. `router.replace` keeps the old URL out of the back
 * history, so Back still leaves the site rather than bouncing.
 *
 * Anchors that still exist on the page itself (the two group headings) are
 * deliberately absent from the map and left to the browser.
 */
export function LegacyHashRedirect({
  map,
}: {
  /** Fragment (without `#`) → the path that replaces it. */
  map: Record<string, string>;
}) {
  const router = useRouter();

  useEffect(() => {
    const go = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const target = map[hash];
      if (target) router.replace(target);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [map, router]);

  return null;
}
