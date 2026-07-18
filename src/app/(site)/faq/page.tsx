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
    "Answers to common questions about starting therapy at Serene Steps — first sessions, our approach, booking, and confidentiality.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const groups = await getPublishedFaqGroups();

  return (
    <>
      <JsonLd data={faqPageJsonLd(groups)} />
      <PageHeader
        eyebrow="Questions & answers"
        title="Questions, gently answered"
        intro="It's completely normal to have questions before you begin. Here are some of the ones we hear most — and if yours isn't here, we'd love to hear from you."
      />

      <Section spacing="md">
        <Container size="prose">
          <div className="space-y-12">
            {groups.map((group, groupIndex) => (
              <Reveal key={group.category}>
                <h2 className="mb-1 font-display text-2xl text-pine">
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
            <div className="mt-14 rounded-3xl border border-sage-deep/25 bg-sage/40 p-8 text-center">
              <h2 className="font-display text-2xl text-pine">
                Still have a question?
              </h2>
              <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted">
                There&rsquo;s no such thing as a silly question when it comes to your
                wellbeing. Reach out and we&rsquo;ll answer honestly.
              </p>
              <Link
                href="/contact"
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper shadow-soft transition hover:bg-pine/90"
              >
                Get in touch
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
