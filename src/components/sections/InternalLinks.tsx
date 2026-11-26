import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { serviceLinks, type ServiceLink } from "@/lib/links";
import type { GlossaryEntry } from "@/lib/content/resources";
import type { PublicPost } from "@/lib/queries";

/**
 * Contextual internal links: the ones that sit in a page's content and carry
 * meaning ("Individual counselling for adults"), as opposed to the header and
 * footer menus every page shares. Each one is derived — see `src/lib/links.ts`.
 */

const linkClass =
  "text-forest underline decoration-mint-deep/50 underline-offset-4 transition-colors hover:decoration-forest";

/* ── Service pages: where to read more before deciding ────────────── */

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xl text-forest">{title}</h3>
      <div className="mt-4 border-t border-sage-deep/25 pt-4">{children}</div>
    </div>
  );
}

/**
 * Articles, glossary terms and the FAQ, for a reader who isn't ready to book.
 * The FAQ column is always there, so the section can never render empty — on a
 * build with no database there are no posts, and that's fine.
 */
export function KeepReading({
  posts,
  terms,
}: {
  posts: PublicPost[];
  terms: GlossaryEntry[];
}) {
  return (
    <Section surface="mist" spacing="lg">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Keep reading</Eyebrow>
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.15] text-forest">
            Want to know <em>more first</em>?
          </h2>
          <p className="mt-4 text-lg leading-[1.8] text-muted">
            Plain-language answers and gentle reads, so you can take your time
            before deciding anything.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 grid gap-10 lg:grid-cols-3">
          {posts.length > 0 && (
            <Column title="From the journal">
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className={linkClass}>
                      {post.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {post.category} · {post.readingMinutes} min read
                    </p>
                  </li>
                ))}
              </ul>
            </Column>
          )}

          {terms.length > 0 && (
            <Column title="Terms, explained">
              <ul className="space-y-4">
                {terms.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/resources#${entry.slug}`} className={linkClass}>
                      {entry.term}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                      {entry.short}
                    </p>
                  </li>
                ))}
              </ul>
            </Column>
          )}

          <Column title="Common questions">
            <p className="leading-relaxed text-muted">
              What a first session is like, how long therapy takes, and how your
              information is kept private.
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/faq" className={linkClass}>
                  Questions about starting therapy
                </Link>
              </li>
              <li>
                <Link href="/resources" className={linkClass}>
                  All therapy terms in plain language
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkClass}>
                  Our approach and values
                </Link>
              </li>
            </ul>
          </Column>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ── Any page: the four services, plus a few supporting pages ─────── */

export function ExploreServices({
  eyebrow = "Our services",
  heading,
  intro,
  extra = [],
  surface = "paper",
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  intro?: string;
  /** Plain text links under the cards — the FAQ, the glossary, the journal. */
  extra?: ServiceLink[];
  surface?: "paper" | "mist" | "sand";
}) {
  return (
    <Section surface={surface} spacing="md">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.15] text-forest">
            {heading}
          </h2>
          {intro && <p className="mt-4 text-lg leading-[1.8] text-muted">{intro}</p>}
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {serviceLinks.map((service, i) => (
            <Reveal as="li" key={service.href} delay={i * 0.04} className="h-full">
              <Link
                href={service.href}
                className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-sage-deep/25 bg-cream px-5 py-4 text-forest shadow-soft transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-mint-deep/40 hover:shadow-lift"
              >
                <span>{service.label}</span>
                <ArrowRight
                  className="size-4 shrink-0 text-mint-deep transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          ))}
        </ul>

        {extra.length > 0 && (
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
            {extra.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </p>
        )}
      </Container>
    </Section>
  );
}

/* ── Blog posts: what this article leads to ───────────────────────── */

/**
 * Placed after an article's body: the service pages it relates to and the
 * glossary terms it actually uses. Renders nothing when there is nothing to say.
 */
export function PostNextSteps({
  services,
  terms,
}: {
  services: ServiceLink[];
  terms: GlossaryEntry[];
}) {
  if (!services.length && !terms.length) return null;

  return (
    <aside
      aria-labelledby="post-next-steps"
      className="mt-14 rounded-[1.75rem] border border-sage-deep/25 bg-cream p-6 sm:p-8"
    >
      <h2 id="post-next-steps" className="font-display text-2xl text-forest">
        Where to go <em>from here</em>
      </h2>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {services.length > 0 && (
          <div>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Related support
            </h3>
            <ul className="mt-3 space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className={linkClass}>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {terms.length > 0 && (
          <div>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Terms in this article
            </h3>
            <ul className="mt-3 space-y-2">
              {terms.map((entry) => (
                <li key={entry.slug}>
                  <Link href={`/resources#${entry.slug}`} className={linkClass}>
                    {entry.term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
