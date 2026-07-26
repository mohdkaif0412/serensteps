import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { GlossaryExplorer, GlossaryTerm } from "@/components/sections/Glossary";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, glossaryJsonLd } from "@/lib/structured-data";
import {
  glossary,
  glossaryEntries,
  resourcesIntro,
  resourcesNote,
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
 * Every word of it is server-rendered, including the nuance behind each term:
 * the expandable detail is collapsed with CSS, never unmounted, so nothing here
 * depends on JavaScript to be readable or indexable. The client layer adds only
 * navigation — a scroll-spy rail and a filter over terms already on the page.
 */
export default function ResourcesPage() {
  const clusters = glossary.map((cluster) => ({
    slug: cluster.slug,
    title: cluster.title,
    count: cluster.entries.length,
  }));

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
        <Container>
          {/* Orientation note first: this is information, not diagnosis. */}
          <Reveal>
            <aside className="flex max-w-3xl items-start gap-4 rounded-[1.5rem] border border-mint-deep/25 bg-mint-soft/70 p-5 sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-mint">
                <Info className="size-5" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <p className="leading-[1.7] text-forest">{resourcesNote}</p>
            </aside>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <GlossaryExplorer clusters={clusters} totalTerms={glossaryEntries.length}>
            <div className="space-y-14">
              {glossary.map((cluster, i) => (
                <section
                  key={cluster.slug}
                  id={cluster.slug}
                  data-glossary-cluster=""
                  className="scroll-mt-28"
                >
                  {i > 0 && (
                    <WaveEdge className="mb-12 h-6 text-sage-mist sm:h-8" animate={false} />
                  )}
                  <Reveal>
                    <Eyebrow>
                      {String(i + 1).padStart(2, "0")} — {cluster.entries.length} terms
                    </Eyebrow>
                    <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.15] text-forest">
                      {cluster.title}
                    </h2>
                    <p className="mt-3 max-w-[62ch] text-lg leading-[1.8] text-muted">
                      {cluster.intro}
                    </p>
                  </Reveal>

                  <div className="mt-7 space-y-4">
                    {cluster.entries.map((entry, j) => (
                      <GlossaryTerm key={entry.slug} entry={entry} index={j} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </GlossaryExplorer>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
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
