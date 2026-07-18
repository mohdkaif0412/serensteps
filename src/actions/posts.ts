"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  requireAdmin,
  isUniqueConstraintError,
  type FormState,
} from "@/lib/admin-auth";
import { postSchema } from "@/lib/validation";

function revalidatePublic(slug?: string | null) {
  revalidatePath("/"); // latest posts on home
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
}

export async function savePost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = formData.get("id")?.toString() || null;

  const parsed = postSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    excerpt: formData.get("excerpt")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    coverImage: formData.get("coverImage")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "DRAFT",
    seoTitle: formData.get("seoTitle")?.toString() ?? "",
    seoDescription: formData.get("seoDescription")?.toString() ?? "",
    publishedAt: formData.get("publishedAt")?.toString() ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const d = parsed.data;
  const publishedAt = d.publishedAt
    ? new Date(d.publishedAt)
    : d.status === "PUBLISHED"
      ? new Date()
      : null;

  const data = {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt || null,
    content: d.content,
    coverImage: d.coverImage || null,
    category: d.category || null,
    status: d.status,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
    publishedAt,
  };

  try {
    if (id) {
      await prisma.post.update({ where: { id }, data });
    } else {
      await prisma.post.create({ data });
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "That web address (slug) is already used by another post.",
        fieldErrors: { slug: ["Already in use — try another"] },
      };
    }
    return { ok: false, error: "Something went wrong saving the post." };
  }

  revalidatePublic(d.slug);
  revalidateAdmin();
  redirect("/admin/posts?flash=saved");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const post = await prisma.post.findUnique({
    where: { id },
    select: { slug: true },
  });
  await prisma.post.delete({ where: { id } });
  revalidatePublic(post?.slug);
  revalidateAdmin();
}

export async function togglePostStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;

  const status = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  await prisma.post.update({
    where: { id },
    data: {
      status,
      publishedAt:
        status === "PUBLISHED" && !post.publishedAt
          ? new Date()
          : post.publishedAt,
    },
  });
  revalidatePublic(post.slug);
  revalidateAdmin();
}
