import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { services, servicePath, REFLECTIVE_PATH } from "@/lib/content/services";
import { img, type SiteImage } from "@/lib/images";

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

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((row, i) => (
            <Reveal as="li" key={row.key} delay={i * 0.05} className="h-full">
              <Link
                href={row.href}
                className="group flex h-full flex-col rounded-[1.75rem] border border-sage-deep/25 bg-cream p-3 shadow-soft transition-all duration-500 ease-soft hover:-translate-y-1 hover:border-mint-deep/40 hover:shadow-lift"
              >
                <Photo
                  image={row.image}
                  mask="soft"
                  sizes="(max-width: 640px) 40vw, 22vw"
                  className="h-80 w-full rounded-[1.25rem] transition-transform duration-500 ease-soft group-hover:-translate-y-1"
                />

                <div className="mt-6 min-w-0 flex-1">
                  <h3 className="font-display text-xl leading-snug text-forest transition-colors duration-300 sm:text-2xl">
                    <span className="link-underline group-hover:bg-[length:100%_1px]">
                      {row.title}
                    </span>
                  </h3>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{row.blurb}</p>
                </div>

                <span className="w-full flex item-center justify-center mt-6 inline-flex items-center gap-2 self-start rounded-full bg-mint-soft px-5 py-2.5 text-sm font-semibold text-forest transition-all duration-300 ease-soft group-hover:bg-mint group-hover:shadow-soft">
                  Learn more
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
