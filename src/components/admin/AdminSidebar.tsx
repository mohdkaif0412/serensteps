"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  CircleHelp,
  Quote,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Blog posts", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/submissions", label: "Messages", icon: Inbox },
];

export function AdminSidebar({
  user,
  logoutAction,
}: {
  user: { name?: string | null; email?: string | null };
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on route change and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const navList = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl border-l-4 px-2.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "border-mint bg-forest text-paper shadow-soft"
                : "border-transparent text-forest/70 hover:translate-x-0.5 hover:bg-sage/60 hover:text-forest",
            )}
          >
            <Icon
              className={cn(
                "size-5 transition-transform duration-200 group-hover:scale-110",
                active ? "text-mint-pale" : "",
              )}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footerBlock = (
    <div className="border-t border-sage-deep/20 pt-4">
      <Link
        href="/"
        target="_blank"
        className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-forest/70 transition-colors hover:bg-sage/60 hover:text-forest"
      >
        <ExternalLink className="size-5" strokeWidth={1.75} aria-hidden="true" />
        View website
      </Link>
      <p className="truncate px-3 pt-1 text-xs text-muted">{user.email}</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-forest/70 transition-colors hover:bg-sage/60 hover:text-forest"
        >
          <LogOut className="size-5" strokeWidth={1.75} aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-sage-deep/20 bg-paper/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 sm:px-5">
          <Link href="/admin" aria-label="Go to dashboard">
            <Logo priority className="h-7" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open menu"
            className="rounded-lg p-2 text-forest transition-colors hover:bg-sage/60"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-forest-deep/50 backdrop-blur-[2px] transition-opacity duration-300 ease-soft",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col overflow-y-auto border-r border-sage-deep/20 bg-paper px-4 py-5 shadow-float transition-transform duration-300 ease-soft",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-2">
            <Link href="/admin" aria-label="Go to dashboard">
              <Logo className="h-8" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-2 text-forest transition-colors hover:bg-sage/60"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-8 flex-1">{navList}</div>
          {footerBlock}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto border-r border-sage-deep/20 bg-paper px-4 py-6 lg:flex">
        <Link href="/admin" className="px-2" aria-label="Go to dashboard">
          <Logo priority className="h-8" />
        </Link>
        {/* <p className="mt-2 px-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          Content admin
        </p> */}
        <div className="mt-8 flex-1">{navList}</div>
        {footerBlock}
      </aside>
    </>
  );
}
