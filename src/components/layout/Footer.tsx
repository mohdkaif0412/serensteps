import Link from "next/link";
import { Footprints, Mail, ArrowRight, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { site, bookingCta } from "@/lib/site";

const explore = site.nav.filter((item) => item.href !== "/");

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      {/* Organic top edge — the footer rises out of whatever section precedes it. */}
      <WaveEdge className="-mb-px text-pine-deep" />
      <div className="bg-pine-deep text-paper">
        <Container className="pb-12 pt-10 sm:pb-14 sm:pt-12">
          {/* Closing moment: one quiet, confident line. */}
          <div className="flex flex-col gap-8 border-b border-sage/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl font-display text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.2]">
              Mental wellness isn&rsquo;t a destination —{" "}
              <em className="text-honey">it&rsquo;s a journey.</em>
            </p>
            <Link
              href={bookingCta.href}
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-honey px-6 py-3 text-sm font-medium text-pine shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.985]"
            >
              {bookingCta.label}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-12 pt-12 lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* Brand */}
            <div className="max-w-sm">
              <Link
                href="/"
                className="group flex items-center gap-2.5"
                aria-label={`${site.name} — home`}
              >
                <span className="grid size-9 place-items-center rounded-full bg-honey text-pine transition-transform duration-300 ease-soft group-hover:-rotate-6">
                  <Footprints className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="font-display text-2xl tracking-tight">{site.name}</span>
              </Link>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-sage/80">
                We walk alongside you, one gentle step at a time.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {/* Social icons appear only when a real profile URL is configured
                    (see NEXT_PUBLIC_INSTAGRAM_URL / _FACEBOOK_URL) — no dead links. */}
                {site.socials.instagram && (
                  <SocialLink href={site.socials.instagram} label="Instagram">
                    <InstagramIcon className="size-4.5" />
                  </SocialLink>
                )}
                {site.socials.facebook && (
                  <SocialLink href={site.socials.facebook} label="Facebook">
                    <FacebookIcon className="size-4.5" />
                  </SocialLink>
                )}
                <SocialLink href={`mailto:${site.email}`} label="Email us">
                  <Mail className="size-4.5" strokeWidth={1.75} />
                </SocialLink>
              </div>
            </div>

            {/* Explore */}
            <nav aria-label="Footer" className="text-[0.95rem]">
              <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sage/70">
                Explore
              </h2>
              <ul className="mt-5 space-y-3">
                {explore.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline text-sage/80 transition-colors hover:text-paper"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Get in touch */}
            <div className="text-[0.95rem]">
              <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sage/70">
                Get in touch
              </h2>
              <p className="mt-5 leading-relaxed text-sage/80">
                Ready when you are — take the first step.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-4 inline-block text-sage/80 transition-colors hover:text-paper"
              >
                {site.email}
              </a>
            </div>
          </div>

          {/* Crisis note — deliberately the most visible card in the footer.
              Warm, human, and impossible to miss. */}
          <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-honey/25 bg-paper/[0.04] p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-honey/15 text-honey">
              <HeartHandshake className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-sage/90">
              If you or someone you love is in crisis or immediate danger, please
              don&rsquo;t wait for an appointment — contact your local emergency
              services or a 24/7 crisis line right away.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-sage/10 pt-8 text-sm text-sage/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {year} {site.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="link-underline transition-colors hover:text-paper">
                Privacy
              </Link>
              <Link href="/terms" className="link-underline transition-colors hover:text-paper">
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="grid size-10 place-items-center rounded-full border border-sage/20 text-sage/80 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-honey hover:text-honey"
    >
      {children}
    </a>
  );
}
