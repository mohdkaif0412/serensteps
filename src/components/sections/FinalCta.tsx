import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/images";

export function FinalCta() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-pine px-6 py-16 text-center sm:px-16 sm:py-20">
            <Image
              src={img.cta.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-pine/70" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl leading-tight text-paper sm:text-4xl lg:text-5xl">
                Your journey can begin with a single step.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-sage/85">
                Whenever you&rsquo;re ready, we&rsquo;re here. Book a first session and
                let&rsquo;s take that step together.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/contact" variant="accent" size="lg">
                  Book Now
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  href="/services"
                  variant="ghost"
                  size="lg"
                  className="text-paper hover:bg-paper/10"
                >
                  Explore services
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
