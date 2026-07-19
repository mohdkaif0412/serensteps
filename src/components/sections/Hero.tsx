import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Parallax";
import { img } from "@/lib/images";
import { bookingCta } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-8 sm:pb-28 sm:pt-14">
      {/* Soft washes of warmth behind the composition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-8 h-[30rem] w-[30rem] rounded-full bg-honey/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 -top-24 h-[26rem] w-[26rem] rounded-full bg-sage/50 blur-3xl"
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Copy — deliberately wider than half, so the composition is off-center */}
          <div className="relative z-10 lg:col-span-7">
            <Reveal>
              <Eyebrow>A gentle place to begin</Eyebrow>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="font-display text-[clamp(2.6rem,5.4vw,4.3rem)] leading-[1.04] text-pine">
                Healing isn&rsquo;t about fixing what&rsquo;s broken.
                {/* The italic line steps inward — an editorial indent, not a centered stack */}
                <em className="mt-3 block pl-6 font-light text-pine/90 sm:pl-14">
                  It&rsquo;s discovering the strength already inside you.
                </em>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[52ch] pl-6 text-lg leading-[1.75] text-muted sm:pl-14">
                At Serene Steps, mental wellness isn&rsquo;t a destination — it&rsquo;s a
                journey. We&rsquo;re just here to help you find the way, one step at a time.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-col items-start gap-5 pl-6 sm:flex-row sm:items-center sm:pl-14">
                <Button href={bookingCta.href} variant="accent" size="lg">
                  Take a step forward — {bookingCta.label}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <Link
                  href="/services"
                  className="link-underline text-[0.95rem] font-medium text-pine"
                >
                  Explore our services
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Image — arched like a doorway, layered on a tilted sand panel.
              Not wrapped in Reveal: this is the LCP element and must paint
              immediately (no opacity gate). Parallax drifts subtly on scroll. */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-x-5 bottom-6 top-14 -rotate-2 rounded-[2.5rem] bg-sand"
            />
            <Parallax range={18} className="relative">
              <Photo
                image={img.hero}
                mask="arch"
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="aspect-[4/5] w-full shadow-lift"
              />
            </Parallax>

            {/* Floating philosophy card, breaking the image's left margin */}
            <div className="absolute -bottom-8 -left-4 max-w-[16.5rem] rounded-2xl border border-sage-deep/20 bg-cream p-5 shadow-float sm:-left-10">
              <p className="font-display text-lg italic leading-snug text-pine">
                &ldquo;One step at a time.&rdquo;
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Every journey begins with a single, gentle step forward.
              </p>
              <span aria-hidden="true" className="mt-3 block h-px w-8 bg-honey" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
