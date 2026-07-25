import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never cached — the container HEALTHCHECK needs a live answer.
export const dynamic = "force-dynamic";

/**
 * Lightweight liveness probe for the Docker HEALTHCHECK and any uptime monitor.
 *
 * Database reachability is *reported*, not fatal: the marketing site is almost
 * entirely static copy and still serves usefully without Postgres, so a DB blip
 * shouldn't take the container out of rotation.
 */
export async function GET() {
  let database: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch {
    // Reported below.
  }

  return NextResponse.json(
    {
      status: "ok",
      database,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
