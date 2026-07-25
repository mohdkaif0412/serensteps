import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <>
      <Link
        href="/admin/posts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to posts
      </Link>
      <AdminPageHeader
        title="New post"
        description="Draft it privately, then publish when you're ready."
      />
      <PostForm />
    </>
  );
}
