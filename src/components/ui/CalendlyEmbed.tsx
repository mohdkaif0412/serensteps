"use client";

import { useEffect } from "react";

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

/**
 * Calendly inline booking widget. Only rendered when NEXT_PUBLIC_CALENDLY_URL
 * is set (see the contact page) — the Calendly counterpart to CalEmbed. Loads
 * Calendly's embed script once, then mounts the inline widget.
 */
export function CalendlyEmbed({ url }: { url: string }) {
  useEffect(() => {
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: 320, height: 700 }}
    />
  );
}
