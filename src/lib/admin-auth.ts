import { auth } from "@/auth";

export type { FormState } from "@/lib/form-state";

/** Guard used at the top of every admin mutation. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

/** True for Prisma "unique constraint failed" errors (P2002). */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
