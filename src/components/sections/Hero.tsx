import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-14">
      {/* soft warm glow behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-honey/10 blur-3xl"
      />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-sage-deep/40 bg-sage/50 px-4 py-1.5 text-xs font-medium text-pine/80 sm:text-sm">
                <span className="size-1.5 rounded-full bg-honey" aria-hidden="true" />
                A gentle place to begin
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] text-pine sm:text-5xl lg:text-[3.75rem]">
                Healing isn&rsquo;t about fixing what&rsquo;s broken.
                <span className="mt-2 block italic text-pine/90">
                  It&rsquo;s discovering the strength already inside you.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                At Serene Steps, mental wellness isn&rsquo;t a destination — it&rsquo;s a
                journey. We&rsquo;re just here to help you find the way, one step at a time.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="accent" size="lg">
                  Take a step forward — Book Now
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <Button href="/services" variant="outline" size="lg">
                  Explore our services
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Not wrapped in Reveal: this image is the LCP element and must
              paint immediately (no opacity gate) for good performance. */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src={img.hero.src}
                alt={img.hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-pine/25 via-transparent to-transparent"
              />
            </div>

            {/* Floating philosophy card */}
            <div className="absolute -bottom-6 -left-4 max-w-[16rem] rounded-2xl border border-sage-deep/20 bg-paper/95 p-5 shadow-lift backdrop-blur sm:-left-8">
              <p className="font-display text-lg italic leading-snug text-pine">
                &ldquo;One step at a time.&rdquo;
              </p>
              <p className="mt-1.5 text-sm text-muted">
                Every journey begins with a single, gentle step forward.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
