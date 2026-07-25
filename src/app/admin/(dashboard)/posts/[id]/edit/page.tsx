import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { toDateInputValue } from "@/lib/utils";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <Link
        href="/admin/posts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to posts
      </Link>
      <AdminPageHeader title="Edit post" />
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          category: post.category,
          status: post.status,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          publishedAt: post.publishedAt
            ? toDateInputValue(post.publishedAt)
            : "",
        }}
      />
    </>
  );
}
