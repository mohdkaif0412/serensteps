import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Names Auth.js uses for the session cookie (dev + secure/prod, incl. chunks).
const SESSION_COOKIE_PREFIXES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function hasSessionCookie(req: NextRequest) {
  return req.cookies
    .getAll()
    .some((c) => SESSION_COOKIE_PREFIXES.some((p) => c.name.startsWith(p)));
}

/**
 * Lightweight, edge-safe gate: it only checks for the *presence* of a session
 * cookie to decide the redirect UX. The actual session is verified server-side
 * in the Node runtime — the admin layout's `auth()` guard and every mutation's
 * `requireAdmin()` — so a stale or forged cookie still can't do anything.
 *
 * (We avoid decoding the JWT here because NextAuth's JWE decode is unreliable in
 * the Edge runtime and interferes with Server Action POSTs.)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loggedIn = hasSessionCookie(req);

  if (pathname === "/admin/login") {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!loggedIn) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
