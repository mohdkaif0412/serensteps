"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Footprints } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-sage-deep/20 bg-paper/85 backdrop-blur-md"
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
            <span className="grid size-9 place-items-center rounded-full bg-pine text-paper transition-transform duration-300 group-hover:-rotate-6">
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
                  isActive(item.href)
                    ? "text-pine"
                    : "text-muted hover:text-pine",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-honey" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href="/contact" variant="primary" size="sm">
              Book Now
            </Button>
          </div>

          <button
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

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-sage-deep/20 bg-paper/97 backdrop-blur-md transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[420px] border-b opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container>
          <nav className="flex flex-col py-3" aria-label="Mobile">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2 py-3 text-base transition-colors",
                  isActive(item.href)
                    ? "font-semibold text-pine"
                    : "text-muted hover:text-pine",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-2 pb-2 pt-3">
              <Button href="/contact" variant="primary" size="md" className="w-full">
                Book Now
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}
