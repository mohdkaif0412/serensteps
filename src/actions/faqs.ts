"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, type FormState } from "@/lib/admin-auth";
import { faqSchema } from "@/lib/validation";

function revalidateAll() {
  revalidatePath("/faq");
  revalidatePath("/admin");
  revalidatePath("/admin/faqs");
}

export async function saveFaq(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = formData.get("id")?.toString() || null;

  const parsed = faqSchema.safeParse({
    question: formData.get("question")?.toString() ?? "",
    answer: formData.get("answer")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    order: formData.get("order")?.toString() ?? "0",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const d = parsed.data;
  const data = {
    question: d.question,
    answer: d.answer,
    category: d.category || null,
    order: d.order,
    published: d.published,
  };

  if (id) {
    await prisma.faq.update({ where: { id }, data });
  } else {
    await prisma.faq.create({ data });
  }

  revalidateAll();
  redirect("/admin/faqs?flash=saved");
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id: String(formData.get("id")) } });
  revalidateAll();
}

export async function toggleFaqPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) return;
  await prisma.faq.update({
    where: { id },
    data: { published: !faq.published },
  });
  revalidateAll();
}
