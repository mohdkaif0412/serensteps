import type { NextAuthConfig } from "next-auth";

/**
 * Base auth config shared by `auth.ts`. The Credentials provider and DB lookup
 * are added in `auth.ts` (Node runtime). Route protection is handled by
 * `middleware.ts` (cookie presence) plus the admin layout's `auth()` guard.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig;
