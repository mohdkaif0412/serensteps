import Link from "next/link";
import {
  FileText,
  CircleHelp,
  Quote,
  Inbox,
  Plus,
  ArrowRight,
  Circle,
  CalendarDays,
  CalendarClock,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { bookingConfig } from "@/lib/booking/config";
import { formatTime, utcToZoned } from "@/lib/booking/timezone";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const weekAhead = new Date(now.getTime() + 7 * 86_400_000);

  const [
    published,
    drafts,
    faqCount,
    testimonialCount,
    newMessages,
    pendingBookings,
    clientCount,
    todaysSessions,
    upcoming,
    recentPosts,
    recentMessages,
  ] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.faq.count(),
    prisma.testimonial.count(),
    prisma.contactSubmission.count({ where: { handled: false } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.client.count(),
    prisma.booking.count({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        startsAt: { gte: now, lte: endOfToday },
      },
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        startsAt: { gte: now, lte: weekAhead },
      },
      include: { client: true, sessionType: true },
      orderBy: { startsAt: "asc" },
      take: 6,
    }),
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Booking first: it's what the practice actually runs on day to day.
  const stats = [
    { label: "Requests waiting", value: pendingBookings, href: "/admin/bookings?view=pending", icon: CalendarDays, highlight: pendingBookings > 0 },
    { label: "Sessions today", value: todaysSessions, href: "/admin/bookings?view=upcoming", icon: CalendarClock },
    { label: "Clients", value: clientCount, href: "/admin/clients", icon: Users },
    { label: "New messages", value: newMessages, href: "/admin/submissions", icon: Inbox, highlight: newMessages > 0 },
    { label: "Published posts", value: published, href: "/admin/posts", icon: FileText },
    { label: "Drafts", value: drafts, href: "/admin/posts", icon: FileText },
    { label: "FAQs", value: faqCount, href: "/admin/faqs", icon: CircleHelp },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials", icon: Quote },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A quick look at your content and recent activity."
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

      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group relative flex items-center gap-3 rounded-2xl border border-sage-deep/20 bg-paper p-3.5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sage-deep/50 hover:shadow-lift sm:flex-col sm:items-start sm:gap-0 sm:p-5"
            >
              {s.highlight && (
                <span className="absolute right-3 top-3 rounded-full bg-mint-deep/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-mint-deep">
                  New
                </span>
              )}
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full transition-transform duration-200 group-hover:scale-110 sm:size-10 ${
                  s.highlight ? "bg-mint text-forest" : "bg-sage text-forest"
                }`}
              >
                <Icon className="size-4 sm:size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0 sm:mt-4">
                <p className="font-display text-xl text-forest sm:text-3xl">{s.value}</p>
                <p className="truncate text-sm text-muted">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* The next week of sessions — the thing worth seeing first each morning. */}
      <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:mt-8 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-forest">Next seven days</h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-forest"
          >
            All bookings <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        {upcoming.length ? (
          <ul className="divide-y divide-sage-deep/15">
            {upcoming.map((booking) => {
              const when = utcToZoned(booking.startsAt, bookingConfig.timeZone);
              return (
                <li key={booking.id} className="min-w-0">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="flex min-w-0 items-center gap-3 py-3 transition-colors hover:text-mint-deep"
                  >
                    <span className="grid w-14 shrink-0 place-items-center rounded-lg bg-sage py-1 text-forest">
                      <span className="font-display text-lg leading-none">
                        {when.day}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-[0.12em]">
                        {formatTime(booking.startsAt, bookingConfig.timeZone)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-forest">
                        {booking.client.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {booking.sessionType.name}
                      </span>
                    </span>
                    {booking.status === "PENDING" && (
                      <span className="shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-forest">
                        Needs confirming
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted">
            Nothing booked in the next week.
          </p>
        )}
      </section>

      <div className="mt-6 grid gap-5 sm:gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Recent posts</h2>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-forest"
            >
              All posts <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          {recentPosts.length ? (
            <ul className="divide-y divide-sage-deep/15">
              {recentPosts.map((post) => (
                <li key={post.id} className="min-w-0">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="flex min-w-0 items-center justify-between gap-3 py-3 transition-colors hover:text-forest"
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
        <section className="min-w-0 overflow-hidden rounded-2xl border border-sage-deep/20 bg-paper p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Recent messages</h2>
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-forest"
            >
              All messages <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          {recentMessages.length ? (
            <ul className="divide-y divide-sage-deep/15">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex min-w-0 items-center gap-3 py-3">
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
