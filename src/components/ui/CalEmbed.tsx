"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Cal.com inline booking embed. Only rendered when NEXT_PUBLIC_CALCOM_LINK is
 * configured (see the contact page). Calendly is supported too — set
 * NEXT_PUBLIC_CALENDLY_URL instead and the contact page renders CalendlyEmbed.
 */
export function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <Cal
      calLink={calLink}
      // `overflow: auto` (not `scroll`): the embed resizes to its content, so
      // forcing `scroll` painted a permanent second scrollbar next to the
      // page's native one on Windows. The page owns the only scroll context.
      style={{ width: "100%", height: "100%", minHeight: 620, overflow: "auto" }}
      config={{ layout: "month_view" }}
    />
  );
}
