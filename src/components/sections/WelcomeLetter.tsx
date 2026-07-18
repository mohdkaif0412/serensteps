import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/images";

export function WelcomeLetter() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative aspect-[5/6] w-full max-w-md overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src={img.welcome.src}
                alt={img.welcome.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted">
                <span className="size-1.5 rounded-full bg-honey" aria-hidden="true" />
                A warm welcome
              </p>
              <h2 className="font-display text-3xl leading-tight text-pine sm:text-4xl">
                Hello, and welcome.{" "}
                <span className="italic text-pine/90">
                  You are in the right place.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                <p>
                  If you&rsquo;ve found your way here, chances are you or someone you
                  love is navigating a heavy season. Maybe you&rsquo;re carrying the
                  weight of anxiety, feeling stuck in your career, or trying to figure
                  out how best to support your child.
                </p>
                <p>
                  Whatever it is — take a deep breath. At Serene Steps, we believe
                  mental wellness isn&rsquo;t a destination; it&rsquo;s a journey. And
                  you don&rsquo;t have to walk it alone.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8">
                <Button href="/contact" variant="accent">
                  Take a step forward — book your first session
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
