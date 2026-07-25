import Link from "next/link";
import {
  FileText,
  CircleHelp,
  Quote,
  Inbox,
  Plus,
  ArrowRight,
  Circle,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [
    published,
    drafts,
    faqCount,
    testimonialCount,
    newMessages,
    recentPosts,
    recentMessages,
  ] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.faq.count(),
    prisma.testimonial.count(),
    prisma.contactSubmission.count({ where: { handled: false } }),
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Published posts", value: published, href: "/admin/posts", icon: FileText },
    { label: "Drafts", value: drafts, href: "/admin/posts", icon: FileText },
    { label: "FAQs", value: faqCount, href: "/admin/faqs", icon: CircleHelp },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials", icon: Quote },
    { label: "New messages", value: newMessages, href: "/admin/submissions", icon: Inbox, highlight: newMessages > 0 },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A quick look at your content and recent activity."
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft transition-colors hover:border-sage-deep/50"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-9 place-items-center rounded-full ${
                    s.highlight ? "bg-mint text-forest" : "bg-sage text-forest"
                  }`}
                >
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 font-display text-3xl text-forest">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <section className="rounded-2xl border border-sage-deep/20 bg-paper p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Recent posts</h2>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-forest"
            >
              All posts <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          {recentPosts.length ? (
            <ul className="divide-y divide-sage-deep/15">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="flex items-center justify-between gap-3 py-3 hover:text-forest"
                  >
                    <span className="min-w-0 truncate text-sm text-forest">
                      {post.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === "PUBLISHED"
                          ? "bg-sage text-forest"
                          : "bg-mint/20 text-forest"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted">No posts yet.</p>
          )}
        </section>

        {/* Recent messages */}
        <section className="rounded-2xl border border-sage-deep/20 bg-paper p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Recent messages</h2>
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-forest"
            >
              All messages <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          {recentMessages.length ? (
            <ul className="divide-y divide-sage-deep/15">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  {!m.handled && (
                    <Circle
                      className="size-2 shrink-0 fill-mint-deep text-mint-deep"
                      aria-label="New"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-forest">{m.name}</p>
                    <p className="truncate text-xs text-muted">
                      {m.concern ?? "General"} · {formatDate(m.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted">
              No messages yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
