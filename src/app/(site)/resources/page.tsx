import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, glossaryJsonLd } from "@/lib/structured-data";
import {
  glossary,
  glossaryEntries,
  resourcesIntro,
  resourcesNote,
  type GlossaryCluster,
  type GlossaryEntry,
} from "@/lib/content/resources";
import { contentLastModifiedDate } from "@/lib/content-date";

export const metadata: Metadata = {
  title: "Resources — a plain-language guide to therapy terms",
  description:
    "What counselling, anxiety, boundaries, burnout, psychometric testing and reflective guidance actually mean — short, plain-language definitions from Serene Step, with what each one looks like in a real session.",
  alternates: { canonical: "/resources" },
};

/**
 * The definitional hub.
 *
 * Deliberately answer-first: every term is an `h3`, its one-sentence definition
 * is the first thing under it, and each definition stands on its own if it's
 * lifted out of context. That's the shape search snippets and answer engines
 * quote, and it's also simply the clearest way to read a glossary.
 *
 * Server-rendered text, all of it — no client-only content, no accordions
 * hiding the answers. Every cluster links on to the relevant service and to
 * booking, so the page feeds the site instead of dead-ending.
 */
export default function ResourcesPage() {
  return (
    <StepsPath steps={glossary.length}>
      <JsonLd data={glossaryJsonLd(glossaryEntries)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Resources", path: "/resources" }])} />

      <PageHeader
        eyebrow="Resources"
        title={
          <>
            The words for it, <em>in plain language</em>
          </>
        }
        intro={resourcesIntro}
      />

      <Section spacing="sm">
        <Container size="prose">
          {/* Orientation note first: this is information, not diagnosis. */}
          <Reveal>
            <aside className="flex items-start gap-4 rounded-[1.5rem] border border-mint-deep/25 bg-mint-soft/70 p-5 sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-mint">
                <Info className="size-5" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <p className="leading-[1.7] text-forest">{resourcesNote}</p>
            </aside>
          </Reveal>

          {/* On-page contents — a real internal-link map for readers and crawlers. */}
          <Reveal delay={0.06}>
            <nav aria-label="On this page" className="mt-10">
              <Eyebrow>On this page</Eyebrow>
              <ol className="grid gap-2 sm:grid-cols-2">
                {glossary.map((cluster, i) => (
                  <li key={cluster.slug} className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="font-display text-sm italic text-mint-deep"
                    >
                      0{i + 1}
                    </span>
                    <Link
                      href={`#${cluster.slug}`}
                      className="link-underline font-medium text-forest"
                    >
                      {cluster.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        </Container>
      </Section>

      {glossary.map((cluster, i) => (
        <Cluster
          key={cluster.slug}
          cluster={cluster}
          index={i}
          surface={i % 2 === 1 ? "mist" : "paper"}
        />
      ))}

      <Section spacing="sm">
        <Container size="prose">
          <p className="text-sm text-muted">
            Last updated{" "}
            <time dateTime={contentLastModifiedDate()}>
              {contentLastModifiedDate()}
            </time>
            . Missing a word?{" "}
            <Link href="/contact" className="link-underline font-medium text-forest">
              Ask us
            </Link>{" "}
            and we&rsquo;ll add it.
          </p>
        </Container>
      </Section>

      <FinalCta />
    </StepsPath>
  );
}

function Cluster({
  cluster,
  index,
  surface,
}: {
  cluster: GlossaryCluster;
  index: number;
  surface: "paper" | "mist";
}) {
  return (
    <Section id={cluster.slug} surface={surface} spacing="lg">
      <Container size="prose">
        <Reveal>
          <p className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-mint-deep">
            <span aria-hidden="true">0{index + 1}</span>
            <span aria-hidden="true" className="inline-block h-px w-8 bg-mint-deep" />
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.15] text-forest">
            {cluster.title}
          </h2>
          <p className="mt-3 max-w-[60ch] text-lg leading-[1.8] text-muted">
            {cluster.intro}
          </p>
        </Reveal>

        <div className="mt-9 space-y-8">
          {cluster.entries.map((entry, i) => (
            <Entry key={entry.slug} entry={entry} delay={i * 0.04} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Entry({ entry, delay }: { entry: GlossaryEntry; delay: number }) {
  return (
    <Reveal as="article" id={entry.slug} delay={delay} className="scroll-mt-28">
      <h3 className="font-display text-2xl leading-tight text-forest">
        {entry.term}
      </h3>
      {/* The definition, first and complete — this is the sentence that gets
          quoted, so it never depends on the paragraphs below it. */}
      <p className="mt-2.5 border-l-2 border-mint-deep/50 pl-5 text-[1.05rem] font-medium leading-[1.7] text-forest">
        {entry.short}
      </p>
      <div className="mt-4 space-y-3 leading-[1.8] text-muted">
        {entry.detail.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      {entry.related && entry.related.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {entry.related.map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-mint-deep"
              >
                <span className="link-underline">{link.label}</span>
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
