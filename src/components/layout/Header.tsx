"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Menu, X, Footprints } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site, bookingCta } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open, keep keyboard focus inside it, close on
  // Escape, and return focus to the toggle. (When closed the menu is `inert`,
  // so its links stay out of the tab order entirely.)
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;

    const focusables = () =>
      Array.from(
        menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-b border-sage-deep/15 bg-paper/80 shadow-soft backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${site.name} — home`}
          >
            <span className="grid size-9 place-items-center rounded-full bg-pine text-paper transition-transform duration-300 ease-soft group-hover:-rotate-6">
              <Footprints className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="font-display text-xl tracking-tight text-pine sm:text-[1.6rem]">
              {site.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href) ? "text-pine" : "text-muted hover:text-pine",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  // Shared layoutId → the honey underline glides between links
                  // as the route changes.
                  <motion.span
                    layoutId="nav-indicator"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 34 }
                    }
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-honey"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href={bookingCta.href} variant="primary" size="sm">
              {bookingCta.label}
            </Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-pine transition-colors hover:bg-sage/60 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu — `inert` when closed keeps its links out of the tab order
          and the accessibility tree even while it's in the DOM for the animation. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        inert={!open}
        className={cn(
          "overflow-hidden border-sage-deep/15 bg-paper/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-soft md:hidden",
          open ? "max-h-[480px] border-b opacity-100 shadow-soft" : "max-h-0 opacity-0",
        )}
      >
        <Container>
          <nav className="flex flex-col py-4" aria-label="Mobile">
            {site.nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-baseline gap-4 border-b border-sage-deep/10 px-2 py-3.5 transition-colors last:border-b-0",
                  isActive(item.href) ? "text-pine" : "text-muted hover:text-pine",
                )}
              >
                <span
                  className="w-6 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-honey-deep"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-display text-2xl leading-none",
                    isActive(item.href) && "italic",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="px-2 pb-3 pt-4">
              <Button href={bookingCta.href} variant="primary" size="md" className="w-full">
                {bookingCta.label}
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}
