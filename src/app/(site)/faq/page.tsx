import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { getPublishedFaqGroups } from "@/lib/queries";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about starting therapy at Serene Step — first sessions, our approach, booking, confidentiality, and how astrology and tarot are used.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const groups = await getPublishedFaqGroups();

  return (
    <>
      <JsonLd data={faqPageJsonLd(groups)} />
      <PageHeader
        eyebrow="Questions & answers"
        title={
          <>
            Questions, <em>gently answered</em>
          </>
        }
        intro="It's completely normal to have questions before you begin. Here are some of the ones we hear most — and if yours isn't here, we'd love to hear from you."
      />

      <Section spacing="lg">
        <Container size="prose">
          <div className="space-y-11">
            {groups.map((group, groupIndex) => (
              <Reveal key={group.category}>
                {/* Group opener: numbered small-caps label + display heading */}
                <p className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-mint-deep">
                  <span aria-hidden="true">0{groupIndex + 1}</span>
                  <span className="inline-block h-px w-8 bg-mint-deep" aria-hidden="true" />
                </p>
                <h2 className="mb-5 mt-2 font-display text-[1.65rem] leading-tight text-forest sm:text-3xl">
                  {group.category}
                </h2>
                <Accordion
                  items={group.items.map((item) => ({
                    question: item.question,
                    answer: item.answer,
                  }))}
                  defaultOpen={groupIndex === 0 ? 0 : null}
                />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-sand p-8 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-mint/15 blur-2xl"
              />
              <div className="relative max-w-md">
                <h2 className="font-display text-2xl leading-tight text-forest sm:text-[1.75rem]">
                  Still have a <em>question?</em>
                </h2>
                <p className="mt-3 leading-[1.75] text-muted">
                  There&rsquo;s no such thing as a silly question when it comes to your
                  wellbeing. Reach out and we&rsquo;ll answer honestly.
                </p>
                <Link
                  href="/contact"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
                >
                  Get in touch
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
