import type { SVGProps } from "react";

/**
 * Minimal brand glyphs. lucide-react removed brand icons (trademark reasons),
 * so we ship tiny inline SVGs for the socials we link to.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 8.5V7c0-1 .4-1.5 1.5-1.5H17V2.5h-2.3C11.9 2.5 11 4.2 11 6.4V8.5H8.5V12H11v9.5h3V12h2.3l.4-3.5H14Z" />
    </svg>
  );
}
