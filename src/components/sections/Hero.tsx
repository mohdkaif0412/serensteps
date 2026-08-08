import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Parallax";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealText, RiseIn } from "@/components/ui/RevealText";
import { img } from "@/lib/images";
import { bookingCta, site } from "@/lib/site";

/**
 * The hero is the one place on the site where nothing may wait for JavaScript.
 * The whole composition animates in with CSS from the first paint — the copy
 * used to sit behind `<Reveal>`, which meant it stayed invisible until the
 * bundle hydrated. The photograph is still un-gated and `priority`.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-6 sm:pb-20 sm:pt-10">
      {/* Soft washes of warmth behind the composition, drifting almost
          imperceptibly on desktop (transform only — see globals.css). */}
      <div
        aria-hidden="true"
        className="wash-drift pointer-events-none absolute -right-40 top-8 h-[30rem] w-[30rem] rounded-full bg-mint/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="wash-drift-slow pointer-events-none absolute -left-48 -top-24 h-[26rem] w-[26rem] rounded-full bg-sage/50 blur-3xl"
      />
      {/* A low mint gradient rising under the copy — depth without a shape. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-mint-soft/45 to-transparent"
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Copy — deliberately wider than half, so the composition is off-center */}
          <div className="relative z-10 lg:col-span-7">
            <Eyebrow className="rise-in">A gentle place to begin</Eyebrow>

            {/* The tagline leads — it's the brand's promise, so it gets the
                display scale rather than being tucked under the logo. */}
            <h1 className="font-display text-[clamp(2.6rem,5.4vw,4.3rem)] leading-[1.04] text-forest">
              <RevealText>
                <>
                  Step into <em className="font-light">your light.</em>
                  {/* The philosophy steps inward — an editorial indent, not a centered stack */}
                  <span className="mt-4 block pl-6 text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.35] text-forest-soft sm:pl-14">
                    Healing isn&rsquo;t about fixing what&rsquo;s broken — it&rsquo;s
                    about discovering the strength that was already inside you.
                  </span>
                </>
              </RevealText>
            </h1>

            <RiseIn
              as="p"
              delay={3}
              className="mt-6 max-w-[52ch] pl-6 text-lg leading-[1.75] text-muted sm:pl-14"
            >
              At {site.name}, mental wellness isn&rsquo;t a destination — it&rsquo;s a
              journey. And you don&rsquo;t have to walk it alone.
            </RiseIn>

            <RiseIn
              delay={4}
              className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:pl-14"
            >
              <Magnetic>
                <Button href={bookingCta.href} variant="accent" size="lg">
                  Take a step forward — {bookingCta.label}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 hidden sm:inline-block"
                    aria-hidden="true"
                  />
                </Button>
              </Magnetic>
              <Link
                href="/services"
                className="link-underline text-[0.95rem] font-medium text-forest"
              >
                Explore our services
              </Link>
            </RiseIn>
          </div>

          {/* Image — arched like a doorway, layered on a tilted sand panel.
              Not wrapped in any reveal: this is the LCP element and must paint
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
                toned
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="aspect-[4/5] w-full shadow-lift"
              />
            </Parallax>

            {/* Floating card, breaking the image's left margin */}
            <RiseIn
              delay={4}
              className="absolute -bottom-8 -left-4 max-w-[16.5rem] rounded-2xl border border-sage-deep/20 bg-cream p-5 shadow-float sm:-left-10"
            >
              <p className="font-display text-lg italic leading-snug text-forest">
                &ldquo;We are here for you.&rdquo;
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                One step at a time — we walk alongside you, at your pace.
              </p>
              <span aria-hidden="true" className="mt-3 block h-px w-8 bg-mint-deep" />
            </RiseIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
