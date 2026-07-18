import Link from "next/link";
import { Footprints, Mail, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { site } from "@/lib/site";

const explore = site.nav.filter((item) => item.href !== "/");

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-pine text-paper">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
              <span className="grid size-9 place-items-center rounded-full bg-honey text-pine">
                <Footprints className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-display text-2xl tracking-tight">{site.name}</span>
            </Link>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-sage/80">
              Mental wellness isn&rsquo;t a destination — it&rsquo;s a journey. We walk
              alongside you, one gentle step at a time.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href={site.socials.instagram} label="Instagram">
                <InstagramIcon className="size-4.5" />
              </SocialLink>
              <SocialLink href={site.socials.facebook} label="Facebook">
                <FacebookIcon className="size-4.5" />
              </SocialLink>
              <SocialLink href={`mailto:${site.email}`} label="Email us">
                <Mail className="size-4.5" strokeWidth={1.75} />
              </SocialLink>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="text-[0.95rem]">
            <h2 className="font-display text-lg text-sage">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sage/75 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get in touch */}
          <div className="text-[0.95rem]">
            <h2 className="font-display text-lg text-sage">Get in touch</h2>
            <p className="mt-4 text-sage/75">
              Ready when you are — take the first step.
            </p>
            <Link
              href="/contact"
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-honey px-5 py-2.5 text-sm font-medium text-pine transition-transform hover:-translate-y-0.5"
            >
              Book Now
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 block text-sage/75 transition-colors hover:text-paper"
            >
              {site.email}
            </a>
          </div>
        </div>

        {/* Gentle crisis note — good practice for a wellness practice */}
        <p className="mt-14 rounded-2xl border border-sage/15 bg-paper/5 px-5 py-4 text-sm leading-relaxed text-sage/70">
          If you or someone you love is in crisis or immediate danger, please
          don&rsquo;t wait for an appointment — contact your local emergency
          services or a 24/7 crisis line right away.
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-sage/15 pt-8 text-sm text-sage/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms
            </Link>
          </div>
        </div>
      </Container>
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
      className="grid size-10 place-items-center rounded-full border border-sage/20 text-sage/80 transition-colors hover:border-honey hover:text-honey"
    >
      {children}
    </a>
  );
}
