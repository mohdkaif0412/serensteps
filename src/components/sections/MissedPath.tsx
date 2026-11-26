"use client";

import { usePathname } from "next/navigation";

/** A malformed escape like `%E0` would make decodeURIComponent throw. */
function safeDecode(path: string) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/**
 * Echoes the URL the visitor actually asked for, so a mistyped link is easy to
 * spot. The only client-side piece of the 404 page — `usePathname` is the one
 * thing a server-rendered not-found boundary can't read on its own.
 */
export function MissedPath({ label }: { label: string }) {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  return (
    <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-sage-deep/40 bg-cream/80 px-4 py-1.5 text-sm text-muted shadow-soft">
      <span className="shrink-0 font-medium">{label}</span>
      <code className="truncate font-mono text-[0.82rem] text-mint-deep">
        {safeDecode(pathname)}
      </code>
    </p>
  );
}
