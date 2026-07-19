import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { BLUR_DATA_URL, img } from "@/lib/images";
import { bookingCta } from "@/lib/site";

/**
 * The warm closing band: full-bleed pine with a faint duotone photograph,
 * organic top edge, and left-aligned editorial type — flowing straight into
 * the footer's deeper green.
 */
export function FinalCta() {
  return (
    <section className="relative mt-6">
      <WaveEdge className="-mb-px text-pine" />
      <div className="relative overflow-hidden bg-pine">
        <Image
          src={img.cta.src}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover opacity-[0.16] [filter:saturate(0.7)]"
        />
        {/* Scrim keeps paper-on-pine text comfortably AA over the photo */}
        <div aria-hidden="true" className="absolute inset-0 bg-pine/60" />

        <Container className="relative py-16 sm:py-24">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.3rem)] leading-[1.1] text-paper">
              Your journey can begin with a{" "}
              <em className="text-honey">single step</em>.
            </h2>
            <p className="mt-6 max-w-[52ch] text-lg leading-[1.75] text-sage/85">
              Whenever you&rsquo;re ready, we&rsquo;re here. Book a first session and
              let&rsquo;s take that step together.
            </p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Button href={bookingCta.href} variant="accent" size="lg">
                {bookingCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
              <Link
                href="/services"
                className="link-underline text-[0.95rem] font-medium text-paper"
              >
                Explore services
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
