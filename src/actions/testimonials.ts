"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, type FormState } from "@/lib/admin-auth";
import { testimonialSchema } from "@/lib/validation";

function revalidateAll() {
  revalidatePath("/"); // testimonials strip on home
  revalidatePath("/admin");
  revalidatePath("/admin/testimonials");
}

export async function saveTestimonial(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = formData.get("id")?.toString() || null;

  const parsed = testimonialSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    role: formData.get("role")?.toString() ?? "",
    quote: formData.get("quote")?.toString() ?? "",
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
    name: d.name,
    role: d.role || null,
    quote: d.quote,
    order: d.order,
    published: d.published,
  };

  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
  } else {
    await prisma.testimonial.create({ data });
  }

  revalidateAll();
  redirect("/admin/testimonials?flash=saved");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidateAll();
}

export async function toggleTestimonialPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return;
  await prisma.testimonial.update({
    where: { id },
    data: { published: !testimonial.published },
  });
  revalidateAll();
}
