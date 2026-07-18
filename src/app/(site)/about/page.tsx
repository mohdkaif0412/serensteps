import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Heart, Clock, Sprout } from "lucide-react";
import { StepsPath } from "@/components/ui/StepsPath";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

export default function AboutPage() {
  return (
    <StepsPath steps={4}>
      <PageHeader
        eyebrow="About Serene Steps"
        title="A gentle, human place to heal and grow"
        intro="We're a warm, non-clinical practice built around one belief: the strength to heal is already inside you. Our role is simply to help you find the way."
      />

      <Section spacing="md">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-lift">
                <Image
                  src={img.about.src}
                  alt={img.about.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted">
                  <span className="size-1.5 rounded-full bg-honey" aria-hidden="true" />
                  Our story
                </p>
                <h2 className="font-display text-3xl leading-tight text-pine sm:text-4xl">
                  We walk alongside you, step by step
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                  <p>
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
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="sage">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="What we believe"
            title="The values that guide every session"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {beliefs.map((belief, i) => {
              const Icon = belief.icon;
              return (
                <Reveal key={belief.title} delay={i * 0.05} className="h-full">
                  <div className="flex h-full gap-4 rounded-3xl border border-sage-deep/20 bg-paper p-6 shadow-soft">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-pine">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-pine">{belief.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-muted">{belief.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <FinalCta />
    </StepsPath>
  );
}
