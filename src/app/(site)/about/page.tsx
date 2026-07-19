import type { Metadata } from "next";
import { Compass, Heart, Clock, Sprout } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedTestimonial } from "@/components/sections/Testimonials";
import { getPublishedTestimonials } from "@/lib/queries";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Serene Steps is a warm, non-clinical practice built on one belief: the strength to heal is already inside you. Learn how we walk alongside you, step by step.",
};

const beliefs = [
  {
    icon: Compass,
    title: "Clarity over quick fixes",
    text: "We help you move forward with clarity, confidence, and balance — not band-aids. Real change takes real understanding.",
  },
  {
    icon: Heart,
    title: "You, not a diagnosis",
    text: "You're a whole person, not a label. Our work is honest and human, grounded in trust, care, and genuine emotional involvement.",
  },
  {
    icon: Clock,
    title: "Healing takes time",
    text: "Growth is a process, not an event. We move at a pace that honors where you are, without pressure or rush.",
  },
  {
    icon: Sprout,
    title: "The strength is already there",
    text: "We don't fix what's broken. We help you uncover and grow the strength that was inside you all along.",
  },
];

export default async function AboutPage() {
  const testimonials = await getPublishedTestimonials();
  // A steady, trust-forward voice to close the story (last one reads best here).
  const featured = testimonials.length > 3 ? testimonials[3] : testimonials[0];

  return (
    <StepsPath steps={4}>
      <PageHeader
        eyebrow="About Serene Steps"
        title={
          <>
            A gentle, human place to <em>heal and grow</em>
          </>
        }
        intro="We're a warm, non-clinical practice built around one belief: the strength to heal is already inside you. Our role is simply to help you find the way."
      />

      {/* Our story — portrait in the brand treatment, letter-like text with a drop cap */}
      <Section spacing="lg" className="overflow-hidden">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-5 bottom-6 top-16 rotate-2 rounded-[2.5rem] bg-sand"
                />
                <Photo
                  image={img.about}
                  mask="arch"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="relative aspect-[4/5] w-full shadow-lift"
                />
              </div>
            </Reveal>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <Eyebrow>Our story</Eyebrow>
                <h2 className="font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.12] text-pine">
                  We walk <em>alongside</em> you, step by step
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-5 max-w-[58ch] space-y-4 text-lg leading-[1.8] text-muted">
                  <p className="dropcap">
                    I&rsquo;m Serene Steps — here to help you move forward with clarity,
                    confidence, and balance, and to navigate life&rsquo;s challenges with
                    guidance and evidence-based support.
                  </p>
                  <p>
                    We believe healing and growth are processes that take time, trust,
                    care, and real emotional involvement. Our unprocessed emotions,
                    beliefs, and traumas quietly keep operating and controlling our
                    lives. We need to address them — to look at them, admit they&rsquo;re
                    there, and work through them — in order to clear them.
                  </p>
                  <p>
                    Whether you&rsquo;re seeking direction in your career, harmony in your
                    relationships, or peace within yourself, we walk alongside you, step
                    by step.
                  </p>
                </div>
                <span aria-hidden="true" className="mt-6 block h-px w-12 bg-honey" />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Beliefs as a designed sequence — numbered steps down the page, not a card grid */}
      <Section surface="mist" spacing="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <SectionHeading
              eyebrow="What we believe"
              title={
                <>
                  The values that guide <em>every session</em>
                </>
              }
              className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
            />
            <ol className="relative space-y-0 border-l border-dashed border-sage-deep/40 pl-10 lg:col-span-7 lg:col-start-6">
              {beliefs.map((belief, i) => {
                const Icon = belief.icon;
                return (
                  <Reveal
                    as="li"
                    key={belief.title}
                    delay={i * 0.05}
                    className="relative border-b border-sage-deep/20 py-6 last:border-b-0 lg:py-7"
                  >
                    <span
                      className="absolute -left-10 top-6 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-honey bg-paper font-display text-sm text-honey-deep shadow-soft lg:top-7"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="flex items-start gap-5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-pine">
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl text-pine">{belief.title}</h3>
                        <p className="mt-2 max-w-[52ch] leading-[1.75] text-muted">
                          {belief.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </Container>
      </Section>

      <FeaturedTestimonial item={featured} />

      <FinalCta />
    </StepsPath>
  );
}
