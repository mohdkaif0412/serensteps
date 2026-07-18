"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
}

export async function toggleSubmissionHandled(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
  });
  if (!submission) return;
  await prisma.contactSubmission.update({
    where: { id },
    data: { handled: !submission.handled },
  });
  revalidateAll();
}

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  await prisma.contactSubmission.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidateAll();
}
