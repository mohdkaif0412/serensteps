import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { Flash } from "@/components/admin/Flash";
import { deletePost, togglePostStatus } from "@/actions/posts";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog posts" };

const flashMessages: Record<string, string> = {
  saved: "Post saved",
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>;
}) {
  const { flash } = await searchParams;
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <Flash message={flash ? flashMessages[flash] : undefined} />
      <AdminPageHeader
        title="Blog posts"
        description="Write, edit, and publish articles for the journal."
        action={
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:bg-forest/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New post
          </Link>
        }
      />

      {posts.length ? (
        <div className="overflow-x-auto rounded-2xl border border-sage-deep/20 bg-paper shadow-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-sage-deep/20 text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-deep/15">
              {posts.map((post) => {
                const isPublished = post.status === "PUBLISHED";
                return (
                  <tr key={post.id} className="align-middle">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-medium text-forest hover:underline"
                      >
                        {post.title}
                      </Link>
                      {post.category && (
                        <span className="ml-2 text-xs text-muted">
                          {post.category}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isPublished
                            ? "bg-sage text-forest"
                            : "bg-mint/20 text-forest"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {isPublished && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="View on site"
                            aria-label="View on site"
                            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                          >
                            <ExternalLink className="size-4" />
                          </Link>
                        )}
                        <ActionButton
                          action={togglePostStatus}
                          id={post.id}
                          title={isPublished ? "Unpublish" : "Publish"}
                          toastMessage={isPublished ? "Moved to drafts" : "Published"}
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                        >
                          {isPublished ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </ActionButton>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          title="Edit"
                          aria-label="Edit"
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sage/60 hover:text-forest"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <ActionButton
                          action={deletePost}
                          id={post.id}
                          title="Delete"
                          confirm={`Delete "${post.title}"? This cannot be undone.`}
                          toastMessage="Post deleted"
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-sage-deep/40 bg-paper/60 p-12 text-center">
          <h2 className="font-display text-xl text-forest">No posts yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Write your first article to share gentle, helpful reads with visitors.
          </p>
          <Link
            href="/admin/posts/new"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper hover:bg-forest/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New post
          </Link>
        </div>
      )}
    </>
  );
}
