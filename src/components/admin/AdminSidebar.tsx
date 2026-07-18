"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  CircleHelp,
  Quote,
  Inbox,
  LogOut,
  ExternalLink,
  Footprints,
  Menu,
  X,
} from "lucide-react";
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
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-pine text-paper"
                : "text-pine/70 hover:bg-sage/60 hover:text-pine",
            )}
          >
            <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
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
        className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-pine/70 transition-colors hover:bg-sage/60 hover:text-pine"
      >
        <ExternalLink className="size-5" strokeWidth={1.75} aria-hidden="true" />
        View website
      </Link>
      <p className="truncate px-3 pt-1 text-xs text-muted">{user.email}</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-pine/70 transition-colors hover:bg-sage/60 hover:text-pine"
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
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-sage-deep/20 bg-paper px-5 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-pine text-paper">
              <Footprints className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="font-display text-lg text-pine">Serene Steps</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-pine hover:bg-sage/60"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="space-y-4 border-b border-sage-deep/20 bg-paper px-4 py-4">
            {navList}
            {footerBlock}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sage-deep/20 bg-paper px-4 py-6 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <span className="grid size-9 place-items-center rounded-full bg-pine text-paper">
            <Footprints className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="font-display text-xl text-pine">Serene Steps</span>
        </Link>
        <p className="mt-1 px-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          Content admin
        </p>
        <div className="mt-8 flex-1">{navList}</div>
        {footerBlock}
      </aside>
    </>
  );
}
