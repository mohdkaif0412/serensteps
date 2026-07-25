import { PrismaClient } from "@/generated/prisma";

// Reuse a single PrismaClient across hot-reloads in dev to avoid exhausting
// database connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ─── Build-time resilience ───────────────────────────────────────
//
// `next build` prerenders the public pages, `sitemap.ts`, the blog feed and
// `generateStaticParams` — all of which read Postgres. In CI and in a Docker
// image build there is usually no database reachable, and a plain build would
// fail on connection refused.
//
// `withDbFallback` swallows *connection-level* failures only and returns an
// empty result, so the build completes and the DB-backed content fills in at
// runtime. Anything that isn't a connectivity problem (a genuine query bug)
// still throws, so real mistakes aren't hidden.

/** Prisma error codes that mean "the database isn't there", not "bad query". */
const UNREACHABLE_CODES = new Set([
  "P1000", // authentication failed
  "P1001", // can't reach database server
  "P1002", // connection timed out
  "P1003", // database file/schema does not exist
  "P1008", // operation timed out
  "P1010", // access denied
  "P1011", // TLS error
  "P1017", // server closed the connection
  "P2021", // table does not exist (schema not pushed yet)
  "P2022", // column does not exist (schema not pushed yet)
  // Raw socket failures, when Node fails before Prisma can classify them.
  "ECONNREFUSED",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
]);

function isDatabaseUnreachable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { name, code, message } = error as {
    name?: string;
    code?: string;
    message?: string;
  };
  // Thrown when the client can't initialise at all — no URL, no server.
  if (name === "PrismaClientInitializationError") return true;
  if (typeof code === "string" && UNREACHABLE_CODES.has(code)) return true;
  return /can't reach database|database server|environment variable not found|does not exist/i.test(
    message ?? "",
  );
}

/**
 * Run a read query, falling back to `fallback` when the database simply isn't
 * reachable. Use for anything that runs during `next build`.
 */
export async function withDbFallback<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (!isDatabaseUnreachable(error)) throw error;
    const first = (error as Error).message?.split("\n")[0] ?? String(error);
    console.warn(`[db] unreachable — serving empty content. ${first}`);
    return fallback;
  }
}
