"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Link2, Plus, Search, X } from "lucide-react";
import type { GlossaryEntry } from "@/lib/content/resources";
import { cn } from "@/lib/utils";

/**
 * The glossary explorer on /resources.
 *
 * Two rules shape the whole thing:
 *
 *   1. Every word of every definition is server-rendered and stays in the DOM.
 *      This page exists to be quoted — by a search snippet, by an answer engine,
 *      by someone who lands on a term anchor. So the clusters are rendered on
 *      the server and passed in as `children`; the client layer only *hides*
 *      non-matching entries while someone is typing, and the expandable detail
 *      is collapsed with CSS (see `.disclosure` in globals.css), never unmounted.
 *
 *   2. Nothing here may become a scroll cost. Filtering touches the DOM once per
 *      keystroke, the scroll-spy is a single IntersectionObserver, and neither
 *      runs on scroll.
 */

export type ClusterSummary = { slug: string; title: string; count: number };

/* ── Explorer: rail + search + filtering ──────────────────────────── */

export function GlossaryExplorer({
  clusters,
  totalTerms,
  children,
}: {
  clusters: ClusterSummary[];
  totalTerms: number;
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(clusters[0]?.slug ?? "");
  const [matches, setMatches] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  /* Filtering. The entries are already in the document, so this walks them
     once per keystroke and flips `hidden` — no re-render of the copy itself,
     and the server HTML is untouched until someone actually types. */
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const needle = query.trim().toLowerCase();
    const entries = root.querySelectorAll<HTMLElement>("[data-glossary-entry]");

    if (!needle) {
      entries.forEach((el) => el.removeAttribute("hidden"));
      root
        .querySelectorAll<HTMLElement>("[data-glossary-cluster]")
        .forEach((el) => el.removeAttribute("hidden"));
      setMatches(null);
      return;
    }

    let found = 0;
    entries.forEach((el) => {
      const hit = (el.dataset.glossaryEntry ?? "").includes(needle);
      el.toggleAttribute("hidden", !hit);
      if (hit) found += 1;
    });
    // A cluster with nothing left in it goes too, heading and all.
    root.querySelectorAll<HTMLElement>("[data-glossary-cluster]").forEach((el) => {
      const anyVisible = el.querySelector("[data-glossary-entry]:not([hidden])");
      el.toggleAttribute("hidden", !anyVisible);
    });
    setMatches(found);
  }, [query]);

  /* Scroll-spy. One observer over the cluster sections, with a band across the
     upper third of the viewport — whichever cluster is in that band owns the
     rail. Nothing is measured on scroll. */
  useEffect(() => {
    const sections = clusters
      .map((cluster) => document.getElementById(cluster.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [clusters]);

  const clear = useCallback(() => setQuery(""), []);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
      {/* ── Rail (desktop) / segmented scroller (mobile) ─────────── */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <label htmlFor={searchId} className="sr-only">
          Search the glossary
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mint-deep"
            strokeWidth={2}
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms…"
            autoComplete="off"
            // The native WebKit clear affordance would sit alongside our own.
            className="w-full rounded-full border border-field bg-cream py-2.5 pl-11 pr-10 text-[0.95rem] text-forest placeholder:text-hint [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-sage/60 hover:text-forest"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Announced politely, so a screen-reader user knows the list changed. */}
        <p role="status" aria-live="polite" className="mt-3 text-sm text-muted">
          {matches === null
            ? `${totalTerms} terms`
            : matches === 0
              ? "No terms match — try a different word."
              : `${matches} of ${totalTerms} terms`}
        </p>

        <nav aria-label="Glossary sections" className="mt-6">
          {/* Mobile: a horizontal scroller. Desktop: the vertical rail. */}
          <ul className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
            {clusters.map((cluster) => {
              const current = cluster.slug === active;
              return (
                <li key={cluster.slug} className="shrink-0 snap-start lg:shrink">
                  <a
                    href={`#${cluster.slug}`}
                    aria-current={current ? "true" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors duration-300 lg:rounded-xl lg:border-0 lg:border-l-2 lg:px-3 lg:py-2",
                      current
                        ? "border-mint-deep bg-mint-soft font-semibold text-forest lg:bg-mint-soft/70"
                        : "border-sage-deep/30 text-muted hover:border-mint-deep/50 hover:text-forest lg:border-sage-deep/30",
                    )}
                  >
                    <span className="whitespace-nowrap lg:whitespace-normal">
                      {cluster.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "ml-auto hidden rounded-full px-1.5 py-0.5 text-[0.68rem] font-semibold lg:inline-block",
                        current ? "bg-mint text-forest" : "bg-sage/50 text-muted",
                      )}
                    >
                      {cluster.count}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div ref={contentRef} className="min-w-0">
        {children}
      </div>
    </div>
  );
}

/* ── One term ─────────────────────────────────────────────────────── */

/**
 * A term, its definition, and the nuance behind it.
 *
 * The one-sentence answer is always visible and never inside the collapsible
 * region — it's the sentence that gets quoted out of context, so it has to
 * stand alone on the page as well as in the markup. The detail collapses with
 * CSS and carries `inert` while closed, which keeps it crawlable but out of
 * the tab order.
 */
export function GlossaryTerm({
  entry,
  index,
}: {
  entry: GlossaryEntry;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `${entry.slug}-detail`;
  const buttonId = `${entry.slug}-toggle`;

  // A deep link to a term should land on it *open* — otherwise the reader
  // arrives at a heading and has to guess there's more.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash.slice(1) === entry.slug) setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [entry.slug]);

  return (
    <article
      id={entry.slug}
      // Everything the search box matches on, lower-cased once at render time.
      data-glossary-entry={`${entry.term} ${entry.short} ${entry.detail.join(" ")}`.toLowerCase()}
      className={cn(
        "scroll-mt-28 rounded-[1.5rem] border bg-cream/70 p-5 transition-colors duration-300 sm:p-6",
        open ? "border-mint-deep/40 bg-cream" : "border-sage-deep/25 hover:border-mint-deep/30",
      )}
    >
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="flex items-baseline gap-3">
            <span aria-hidden="true" className="font-display text-sm italic text-mint-deep">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl leading-tight text-forest sm:text-2xl">
              {entry.term}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-soft",
              open
                ? "rotate-45 border-mint bg-mint text-forest"
                : "border-sage-deep/40 text-muted group-hover:border-mint-deep group-hover:text-forest",
            )}
          >
            <Plus className="size-4" strokeWidth={2} />
          </span>
        </button>
      </h3>

      {/* The definition, first and complete. Never inside the disclosure. */}
      <p className="mt-3 border-l-2 border-mint-deep/50 pl-4 text-[1.02rem] font-medium leading-[1.7] text-forest">
        {entry.short}
      </p>

      <div id={panelId} className="disclosure" data-open={open} inert={!open}>
        <div>
          <div className="pt-4">
            <div className="space-y-3 leading-[1.8] text-muted">
              {entry.detail.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            {entry.related && entry.related.length > 0 && (
              <div className="mt-5 border-t border-sage-deep/20 pt-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-forest/70">
                  Where to go next
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {entry.related.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 rounded-full border border-mint-deep/30 bg-mint-soft/60 px-3.5 py-1.5 text-[0.88rem] font-medium text-mint-deep transition-colors duration-300 hover:border-mint-deep hover:bg-mint-soft"
                      >
                        {link.label}
                        <ArrowRight
                          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-5">
              <a
                href={`#${entry.slug}`}
                className="inline-flex items-center gap-1.5 text-[0.82rem] text-muted transition-colors hover:text-mint-deep"
              >
                <Link2 className="size-3.5" aria-hidden="true" />
                <span className="link-underline">Link to this term</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
