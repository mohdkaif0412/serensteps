import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { services, servicePath, REFLECTIVE_PATH } from "@/lib/content/services";
import { img, type SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

// Each row steps a little further right — a quiet staircase, one step at a time.
const stepIndent = ["", "lg:ml-16", "lg:ml-32", "lg:ml-48"];

type Row = {
  key: string;
  href: string;
  title: string;
  blurb: string;
  image: SiteImage;
};

/** The three counselling audiences, plus the optional reflective offering. */
const rows: Row[] = [
  ...services.map((service) => ({
    key: service.slug,
    href: servicePath(service.slug),
    title: service.title,
    blurb: service.intro,
    image: service.image,
  })),
  {
    key: "astrology-tarot",
    href: REFLECTIVE_PATH,
    title: "Astrology & Tarot",
    blurb:
      "Entirely optional, and never a substitute for counselling: reflective tools for exploring patterns, emotions, and decisions alongside evidence-based psychological understanding.",
    image: img.astrologyTarot,
  },
];

/**
 * The services as an editorial index — numbered rows with arched thumbnails —
 * rather than a set of identical cards. Every row carries a real photograph
 * through the same arch and the same green duotone, the reflective offering
 * included: a placeholder glyph in one of four prominent slots reads as
 * unfinished next to three photographs.
 */
export function ServicesPreview() {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          eyebrow="How we help"
          title={
            <>
              Support for <em>every step</em> of the journey
            </>
          }
          intro="Whoever you are and whatever you're facing, there's a gentle place to begin. We offer counselling and psychological testing across three areas of life — and, if it's meaningful to you, reflective guidance alongside it."
        />

        <div className="mt-10">
          {rows.map((row, i) => (
            <Reveal key={row.key} delay={i * 0.05} className={cn(stepIndent[i])}>
              <Link
                href={row.href}
                className="group grid items-center gap-x-8 gap-y-4 border-t border-sage-deep/25 py-6 transition-colors duration-300 last:border-b sm:grid-cols-[auto_1fr_auto] sm:py-7"
              >
                <div className="flex items-center gap-6">
                  <Photo
                    image={row.image}
                    mask="arch"
                    sizes="112px"
                    className="hidden h-32 w-24 shrink-0 shadow-soft transition-transform duration-500 ease-soft group-hover:-translate-y-1 group-hover:rotate-2 sm:block"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-forest transition-colors duration-300 sm:text-3xl">
                    <span className="link-underline group-hover:bg-[length:100%_1px]">
                      {row.title}
                    </span>
                  </h3>
                  <p className="mt-2 line-clamp-2 max-w-[58ch] leading-relaxed text-muted">
                    {row.blurb}
                  </p>
                </div>

                <span
                  className="grid size-11 shrink-0 place-items-center justify-self-start rounded-full border border-sage-deep/40 text-forest transition-all duration-300 ease-soft group-hover:border-mint group-hover:bg-mint group-hover:shadow-soft sm:justify-self-end"
                  aria-hidden="true"
                >
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 hidden sm:inline-block" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
