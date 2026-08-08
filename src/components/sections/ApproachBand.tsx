import { Clock, Heart, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { WaveEdge } from "@/components/ui/WaveEdge";
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

/**
 * The grounding dark moment on the home page: a full-bleed forest band with
 * organic wave edges, and the three pillars set as a numbered sequence along
 * a drawn path — not a stack of icon cards.
 */
export function ApproachBand() {
  return (
    <section className="on-forest relative scroll-mt-24">
      <WaveEdge className="-mb-px text-forest" />
      <div className="bg-forest py-12 text-paper sm:py-18">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0">
              <Photo
                image={img.approach}
                mask="arch"
                toned
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="aspect-[4/5] w-full shadow-float"
              />
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <SectionHeading
                tone="light"
                eyebrow="Our approach"
                title={
                  <>
                    We walk <em>alongside</em> you, step by step
                  </>
                }
                intro="We believe healing and growth take time, trust, care, and real emotional involvement. Our unprocessed emotions and beliefs quietly keep shaping our lives — so we look at them gently, together, and work them through."
              />

              {/* The pillars as steps on a drawn path */}
              <ol className="relative mt-8 space-y-7 border-sage/30">
                {pillars.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <Reveal as="li" key={pillar.title} delay={i * 0.06} className="relative">
                      {/* <span
                        className="absolute -left-8 top-4 size-2.5 -translate-x-1/2 rounded-full bg-mint shadow-soft"
                        aria-hidden="true"
                      /> */}
                      <div className="flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/10 text-mint">
                          <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-display text-xl text-paper">{pillar.title}</h3>
                          <p className="mt-1.5 max-w-[48ch] leading-relaxed text-sage/85">
                            {pillar.text}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </div>
        </Container>
      </div>
      <WaveEdge flip className="-mt-px text-forest" />
    </section>
  );
}
