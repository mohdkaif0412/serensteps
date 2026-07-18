import Image from "next/image";
import { Clock, Heart, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/images";

const pillars = [
  {
    icon: Clock,
    title: "In its own time",
    text: "Healing can't be rushed. We move at a pace that honors exactly where you are.",
  },
  {
    icon: Heart,
    title: "With real care",
    text: "This is honest, human work — built on trust, warmth, and genuine emotional involvement.",
  },
  {
    icon: Sprout,
    title: "Toward growth",
    text: "We help you gently clear what's been holding you back, and grow toward who you want to be.",
  },
];

export function ApproachBand() {
  return (
    <Section surface="sage">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src={img.approach.src}
                alt={img.approach.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Our approach"
              title="We walk alongside you, step by step"
              intro="We believe healing and growth take time, trust, care, and real emotional involvement. Our unprocessed emotions and beliefs quietly keep shaping our lives — so we look at them gently, together, and work them through."
            />
            <div className="mt-8 space-y-5">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.title} delay={i * 0.06} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-pine shadow-soft">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-pine">{pillar.title}</h3>
                      <p className="mt-1 leading-relaxed text-muted">{pillar.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
