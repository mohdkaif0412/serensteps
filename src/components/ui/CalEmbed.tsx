"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Cal.com inline booking embed. Only rendered when a real
 * NEXT_PUBLIC_CALCOM_LINK is configured (see the contact page). Swappable for
 * Calendly by replacing this component behind the same env flag.
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
      style={{ width: "100%", height: "100%", minHeight: 620, overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
