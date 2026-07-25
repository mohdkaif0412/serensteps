import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { img } from "@/lib/images";
import { bookingCta, site } from "@/lib/site";

/**
 * A letter, not a hero-copy block: off-center measure, a drop cap, and a
 * quiet mint rule to close — set beside the client's own line illustration.
 */
export function WelcomeLetter() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="order-2 mx-auto w-full max-w-md lg:order-1 lg:col-span-5 lg:mx-0">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -left-6 top-10 w-2/3 rounded-[2rem] bg-sage-mist"
              />
              {/* The brand illustration, `toned` because its line work is
                  already drawn in the brand greens. */}
              <Photo
                image={img.hereForYou}
                toned
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="relative aspect-[5/6] w-full shadow-lift"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>A warm welcome</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.12] text-forest">
                Hello, and welcome.{" "}
                <em className="text-forest/90">You are in the right place.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-5 max-w-[58ch] space-y-4 text-lg leading-[1.8] text-muted">
                <p className="dropcap">
                  If you&rsquo;ve found your way here, chances are you or someone you
                  love is navigating a heavy season. Maybe you&rsquo;re carrying the
                  weight of anxiety, feeling stuck in your career, or trying to figure
                  out how best to support your child.
                </p>
                <p>
                  Whatever it is, take a deep breath. You are in the right place. At{" "}
                  {site.name}, we believe that mental wellness isn&rsquo;t a
                  destination — it&rsquo;s a journey.{" "}
                  <strong className="font-semibold text-forest">
                    And you don&rsquo;t have to walk it alone.
                  </strong>
                </p>
              </div>
              <span aria-hidden="true" className="mt-6 block h-px w-12 bg-mint-deep" />
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-6">
                <Button href={bookingCta.href} variant="accent">
                  Take a step forward — book your first session
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 hidden sm:inline-block"
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
