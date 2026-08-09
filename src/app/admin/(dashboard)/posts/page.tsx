import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActionButton } from "@/components/admin/ActionButton";
import { Flash } from "@/components/admin/Flash";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            New post
          </Link>
        }
      />

      {posts.length ? (
        <>
          {/* Mobile card list */}
          <ul className="space-y-3 md:hidden">
            {posts.map((post) => {
              const isPublished = post.status === "PUBLISHED";
              return (
                <li
                  key={post.id}
                  className="rounded-2xl border border-sage-deep/20 bg-paper p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="min-w-0 font-medium text-forest hover:underline"
                    >
                      {post.title}
                    </Link>
                    <StatusBadge tone={isPublished ? "sage" : "mint"}>
                      {isPublished ? "Published" : "Draft"}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {post.category && `${post.category} · `}
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </p>
                  <div className="mt-3 flex items-center justify-end gap-1 border-t border-sage-deep/15 pt-3">
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
                </li>
              );
            })}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-sage-deep/20 bg-paper shadow-soft md:block">
            <table className="w-full text-left text-sm">
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
                    <tr
                      key={post.id}
                      className="align-middle transition-colors hover:bg-sage/10"
                    >
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
                        <StatusBadge tone={isPublished ? "sage" : "mint"}>
                          {isPublished ? "Published" : "Draft"}
                        </StatusBadge>
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
                            toastMessage={
                              isPublished ? "Moved to drafts" : "Published"
                            }
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
        </>
      ) : (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description="Write your first article to share gentle, helpful reads with visitors."
          action={{ href: "/admin/posts/new", label: "New post", icon: Plus }}
        />
      )}
    </>
  );
}
