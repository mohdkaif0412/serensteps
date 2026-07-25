# Serene Step

[![CI](https://github.com/mohdkaif0412/serensteps/actions/workflows/ci.yml/badge.svg)](https://github.com/mohdkaif0412/serensteps/actions/workflows/ci.yml)
[![Docker image](https://github.com/mohdkaif0412/serensteps/actions/workflows/docker-image.yml/badge.svg)](https://github.com/mohdkaif0412/serensteps/actions/workflows/docker-image.yml)

A warm, editorial website and content admin panel for **Serene Step** ("Step into your light"), a mental-wellness / therapy practice. Built to feel gentle, human, and trustworthy — with a signature wave-of-faces path that traces the journey down each page, brightening as you scroll.

- **Public site:** Home, About, Services (tabbed — Counselling & Testing / Astrology & Tarot), Blog, FAQ, Contact (+ booking), Privacy, Terms.
- **Admin panel** (`/admin`): manage blog posts, FAQs, testimonials, and contact messages — no code required.

> **Naming:** the brand displays as *Serene Step* (singular, matching the logo) while the domain and mailbox keep the plural — `serenesteps.net`, `steps@serenesteps.net`. That's intentional. Everything the owner might change (name, tagline, email, phone/WhatsApp, socials) lives in [`src/lib/site.ts`](src/lib/site.ts) and is env-overridable.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript (strict), React 19 |
| Styling | Tailwind CSS v4 (design tokens in `src/app/globals.css`) |
| Animation | Framer Motion (`motion/react`), reduced-motion aware |
| Database | Prisma ORM + PostgreSQL (Docker Compose locally, Neon in production) |
| Auth | Auth.js (NextAuth v5), Credentials, bcrypt, single admin |
| Editor | Tiptap (rich text, stores HTML) |
| Images | Cloudinary uploads (optional) + `next/image` |
| Email | Resend (contact-form notifications, optional) |
| Booking | Cal.com embed (optional, swappable) |
| Forms | React Hook Form + Zod |

---

## Getting started (local development)

**Prerequisites:** Node.js 20+ and npm, plus a PostgreSQL database. Either run one with `docker compose up db`, or point `DATABASE_URL` at a free [Neon](https://neon.tech) branch. (To run the *whole stack* in containers instead, jump to [Running with Docker](#running-with-docker).)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
#   → then open .env and set AUTH_SECRET (run `npx auth secret`),
#     pick an ADMIN_EMAIL / ADMIN_PASSWORD, and point DATABASE_URL
#     at your Postgres instance.

# 3. Start Postgres (skip if you're using Neon)
docker compose up -d db

# 4. Create the tables and seed them
npm run db:push      # syncs the schema
npm run db:seed      # creates the admin user + sample content

# 5. Start the dev server
npm run dev
```

Visit **http://localhost:3000**. The admin panel is at **http://localhost:3000/admin** — sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint the code |
| `npm run db:push` | Sync the database to the Prisma schema |
| `npm run db:seed` | Seed the admin user + sample content |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

---

## Managing content (for the practice)

Everything on the site's Blog, FAQ, and testimonials, plus contact messages, is managed from **`/admin`**:

- **Dashboard** — counts and recent activity at a glance.
- **Blog posts** — write with a rich-text editor, add a cover image, set a category, save as Draft, then Publish when ready.
- **FAQs** — grouped by category, with a display order and a show/hide toggle.
- **Testimonials** — keep these anonymous (the admin reminds you not to publish identifying client details without written consent).
- **Messages** — read contact-form submissions and mark them handled.

Changes appear on the public site immediately after saving.

---

## Optional integrations

All of these are optional — the site works without them, degrading gracefully.

- **Booking calendar:** connect a calendar and the contact page shows a live inline booking widget, and every "Book" button reads **"Book Now"** and jumps to it. Leave it unconfigured and those buttons instead read **"Request a session"** and route to the contact form — so nothing implies instant booking that isn't there.
  - **Cal.com:** set `NEXT_PUBLIC_CALCOM_LINK` to your `username/event` link (from your Cal.com event URL).
  - **Calendly:** set `NEXT_PUBLIC_CALENDLY_URL` to your full event URL instead.
  - (If both are set, Cal.com wins.)
- **Cloudinary uploads:** set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + an unsigned `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Without it, the post editor lets you paste an image URL instead.
- **Resend email:** set `RESEND_API_KEY` and `CONTACT_FROM` (an address on a domain you've verified in Resend). Without it, contact submissions are still saved and visible in the admin — just no email is sent.

---

## Images

Curated, license-clean photos live in `/public/images/` and are wired through a single registry, **`src/lib/images.ts`**. To change any photo, drop a replacement into `/public/images/` using the same filename — no code change needed:

`hero-path.jpg`, `welcome-window.jpg`, `service-teens.jpg`, `service-individual.jpg`, `service-couples.jpg`, `approach-hands.jpg`, `about-portrait.jpg`, `cta-leaves.jpg`.

Use only royalty-free sources (Unsplash / Pexels / Pixabay) that allow free commercial use.

---

## Running with Docker

The image is a multi-stage build on `node:20-alpine`: install → `prisma generate` + `next build` (Next.js `output: "standalone"`) → a runtime stage carrying only the standalone server, the Prisma engine, and the Prisma CLI. It runs as a non-root user, exposes **3000**, and has a `HEALTHCHECK` against `/api/health`.

```bash
cp .env.example .env          # then set AUTH_SECRET (npx auth secret)
docker compose up --build     # web + postgres:16-alpine with a named volume
```

→ **http://localhost:3000**. Compose waits for Postgres to pass `pg_isready` before starting the web container, and [`docker-entrypoint.sh`](docker-entrypoint.sh) applies the schema on boot (`prisma migrate deploy`, falling back to `prisma db push` — this project manages its schema with `db push` rather than a migrations folder). Set `SKIP_DB_MIGRATE=1` to bypass that step.

Standalone image, without Compose:

```bash
docker build -t serene-step .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://…" \
  -e AUTH_SECRET="…" -e AUTH_TRUST_HOST=true \
  serene-step
```

### The build does not need a database

`next build` prerenders pages, `sitemap.ts`, the RSS feed and `generateStaticParams` — all of which read Postgres. Every one of those reads goes through `withDbFallback` in [`src/lib/db.ts`](src/lib/db.ts), which swallows *connection-level* failures only (unreachable server, missing schema) and returns an empty result. A genuine query bug still throws, so real mistakes aren't hidden.

So the image builds with no database reachable, and the DB-backed content arrives at runtime: `generateStaticParams` returns `[]`, posts render on demand, and the pages that read content carry a short `revalidate` (5 min for pages, 10 min for the sitemap/feed/`llms-full.txt`) so a database-less build self-heals instead of serving empty strips forever. Publishing from `/admin` still calls `revalidatePath`, so edits appear immediately.

### `NEXT_PUBLIC_*` and build args

`NEXT_PUBLIC_*` values are inlined into the browser bundle by `next build`, so they must be present **at build time**, not just at runtime. The Dockerfile accepts each one as an `ARG`, `docker-compose.yml` forwards them, and the image workflow reads them from GitHub Actions **variables**. Change one → rebuild (`docker compose up --build`).

---

## Continuous integration

Two workflows, both visible under the repo's **Actions** tab.

### [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — on every push and pull request

Node 20 with npm caching → `npm ci` → `prisma generate` → `npm run lint` → `npx tsc --noEmit` → `prisma db push` + `npm run db:seed` against a **real `postgres:16-alpine` service container** → `npm run build`. Building against actual seeded data (rather than the empty fallbacks) is what proves the whole pipeline compiles green.

### [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml) — on pushes to `main` and `v*.*.*` tags

Builds the image with Buildx (GitHub Actions layer cache) and pushes to **GHCR** at `ghcr.io/<owner>/<repo>`, tagged by branch, short SHA, semver from tags, and `latest` on the default branch.

### Required secrets and variables

| What | Where | Needed? |
| --- | --- | --- |
| `GITHUB_TOKEN` | provided automatically | Yes — the image workflow declares `packages: write` to use it. Nothing to create. |
| Repository **secrets** | — | **None.** CI uses deterministic throwaway values for `AUTH_SECRET`, `DATABASE_URL` and the admin seed, so a fork builds green with zero setup. |
| Repository **variables** (optional) | Settings → Secrets and variables → Actions → *Variables* | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_PHONE_COUNTRY`, `NEXT_PUBLIC_CALCOM_LINK` / `NEXT_PUBLIC_CALENDLY_URL`, the social URLs, the Cloudinary pair, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Only affects the published image; unset simply falls back to the defaults in `src/lib/site.ts`. |

First push to `main` publishes a **private** package — make it public (or grant pull access) at `github.com/<owner>?tab=packages` if you want to `docker pull` it without authenticating.

---

## Deploying to production (Vercel + Neon)

The Docker path above is self-contained. For Vercel:

1. **Create a Neon Postgres database** and copy its pooled connection string.
2. `prisma/schema.prisma` is already on the `postgresql` provider — nothing to change.
3. **Push to GitHub** and import the repo into **Vercel**.
4. In Vercel → Project → Settings → **Environment Variables**, add everything from `.env.example` with production values:
   - `DATABASE_URL` → your Neon connection string
   - `AUTH_SECRET` → a fresh secret (`npx auth secret`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - `NEXT_PUBLIC_SITE_URL` → your live domain (used for canonical URLs, sitemap, robots, JSON-LD)
   - plus any optional integrations (booking / Cloudinary / Resend) and `NEXT_PUBLIC_CONTACT_EMAIL` / social links
5. **Deploy.** `prisma generate` runs automatically on install.
6. **Initialize the production database** (once), from your machine with the production `DATABASE_URL` set locally:
   ```bash
   npx prisma db push     # create the tables
   npm run db:seed        # create the admin user + sample content
   ```
7. Contact email, social links, and the site URL are all env vars (see `.env.example`) — no code edit needed to update them. Sample blog posts, FAQs, and testimonials can be edited or deleted anytime from **`/admin`**.

---

## Project structure

```
src/
  app/
    (site)/            Public pages (Header/Footer layout) + template.tsx (route transition)
      blog/feed.xml/   RSS 2.0 feed
      resources/       Plain-language glossary (the definitional / GEO hub)
      */opengraph-image.tsx   Per-route social cards
    admin/             Login + protected admin panel
    api/auth/          Auth.js route handler
    api/health/        Liveness probe (used by the Docker HEALTHCHECK)
    llms.txt/, llms-full.txt/   Generated plain-text documents for AI crawlers
    sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
  actions/             Server Actions (posts, faqs, testimonials, contact, auth)
  components/
    ui/                Primitives: Button, Container, Section, Reveal, RevealText,
                       StepsPath, WaveEdge, WaveMark, Magnetic, …
    sections/          Page sections (Hero, WelcomeLetter, ApproachBand, …)
    layout/            Header, Footer
    admin/             Admin UI (forms, editor, sidebar)
    forms/             ContactForm
    seo/               JsonLd, Analytics
  lib/                 db, auth, queries, validation, images, site, utils,
                       structured-data, llms, og-image, content-date
    content/           Editorial copy: about, services, faqs, posts, resources
  generated/prisma/    Generated Prisma client (git-ignored)
prisma/
  schema.prisma        Data models
  seed.ts              Admin + sample content seed
public/                Curated images, brand lockups, icon
```

---

## Accessibility

- WCAG AA contrast, visible keyboard focus, semantic HTML, alt text on every image.
- `prefers-reduced-motion` honored throughout. Every JS animation is gated on `useReducedMotion()`, and every CSS animation is collapsed by the global floor at the foot of `globals.css` — so new CSS motion gets an instant, static fallback automatically.
- Motion is transform/opacity only, so nothing animated can shift layout.

## SEO

- Per-page metadata, Open Graph + Twitter cards, canonical URLs (including self-referencing canonicals on paginated blog pages).
- Templated social cards for every static page, from one renderer ([`src/lib/og-image.tsx`](src/lib/og-image.tsx)); blog posts use their cover image.
- `sitemap.xml` with real `lastModified` from `post.updatedAt` and image entries for post covers; `robots.txt` (welcomes AI crawlers — remove those entries in [`src/app/robots.ts`](src/app/robots.ts) to opt out); `manifest.webmanifest`; `theme-color`.
- RSS 2.0 feed at **`/blog/feed.xml`**, advertised as `rel="alternate"` from the blog metadata.
- **JSON-LD** ([`src/lib/structured-data.ts`](src/lib/structured-data.ts)) — one `@graph` of `Organization` + `MedicalBusiness` (multi-typed, so there is exactly **one** business entity, `@id` `#organization`) plus `WebSite`; `BreadcrumbList` on every inner page; per-service `Service` / `MedicalTherapy` mirroring both service tabs and their sub-services; `BlogPosting` with `wordCount`, `timeRequired`, derived `keywords` and a real `dateModified`; `FAQPage`; `DefinedTermSet` for the glossary; and `Person` for the practitioner once named.

### Set up Search Console

1. Add the property in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), choosing the **HTML tag** method.
2. Put the token values in `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` (the content value only, not the whole `<meta>` tag) and redeploy — they're rendered into root `metadata.verification`.
3. Submit `https://<your-domain>/sitemap.xml`.
4. If the practice has a physical location, also claim a **Google Business Profile** and a **Bing Places** listing, and keep the name, address and phone byte-identical to what `src/lib/site.ts` renders — that consistency is what local search matches on.
5. Validate the markup with the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).

### GEO / AI discoverability

- **`/llms.txt`** — the curated index: who the practice is, what it offers, where to look.
- **`/llms-full.txt`** — the complete plain text of every key page (about, both service tabs, the glossary, FAQ, journal index, contact) in one fetch.

Both are **generated** from the same content modules the pages render ([`src/lib/llms.ts`](src/lib/llms.ts)) rather than hand-maintained, so they can't drift and both carry a real "last updated" date. Set `SITE_LAST_MODIFIED` to pin that date (the release commit date is a good choice in CI).

- **`/resources`** is the definitional hub: ~24 terms, each an answer-first one-sentence definition followed by detail, clustered by topic and internally linked to the relevant service and to booking. Answer-first, self-contained definitions are what search snippets and answer engines quote.
- All content is server-rendered text. Keep it that way — don't move key copy behind client-only rendering.

## Analytics

Cookieless, privacy-friendly, and off by default — nothing third-party is loaded unless you ask for it, which matters on a mental-health site. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to switch on [Plausible](https://plausible.io); point `NEXT_PUBLIC_PLAUSIBLE_SRC` at your own instance to self-host (an Umami script URL works too). Loaded `afterInteractive`, well clear of LCP. See [`src/components/seo/Analytics.tsx`](src/components/seo/Analytics.tsx).

## Motion & performance

The rule that shapes the motion layer: **above the fold animates in CSS, below the fold animates in JavaScript.**

A JS-driven reveal can't start until the bundle has downloaded and hydrated, which keeps the LCP heading invisible until then. So the hero and every page header now animate with CSS from the first paint — a per-word staggered rise ([`RevealText`](src/components/ui/RevealText.tsx), a server component with zero JS) and `.rise-in` for the surrounding blocks. Word reveals rise from a low opacity rather than out of a clipping mask, because a fully clipped word paints nothing and would push LCP out to the end of the stagger.

Below the fold, `<Reveal>` still uses a scroll observer, because it genuinely needs one.

Other notes:
- `StepsPath` derives everything from the scroll `MotionValue` with `useTransform`, so **nothing re-renders while scrolling** — values go straight to the compositor. Faces crossfade between two `currentColor` copies (sage → mint), so brightening is pure opacity and no colour is hardcoded.
- Route transitions are one CSS class applied by [`(site)/template.tsx`](src/app/(site)/template.tsx). Fill mode is `backwards`, so no transform lingers to create a containing block, and opacity starts at 0.3 so the page is LCP-eligible on the first frame.
- `Magnetic` measures its box once on pointer-enter (not per frame), writes only `x`/`y`, ignores coarse pointers, and disables itself under reduced motion.
- Ambient hero drift is desktop-only (`@media (min-width: 1024px)`) to keep low-end phones cheap.

### Measured

Lighthouse 12, desktop preset, against `next start` on localhost:

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 99 | 100 | 100 | 100 | 0.87s | 0.041 | 27ms |
| `/about` | 99 | 100 | 100 | 100 | 0.88s | 0.001 | 0ms |
| `/services` | 100 | 100 | 100 | 100 | 0.74s | 0.005 | 32ms |
| `/resources` | 100 | 100 | 100 | 100 | 0.70s | 0.014 | 0ms |

Two LCP regressions were found and fixed during this pass, both worth knowing about when adding motion:

- **`/about` 93 → 99** (LCP 1.20s → 0.88s). The story portrait was the desktop LCP element while being both `loading="lazy"` and wrapped in `<Reveal>`. It's now `priority` and un-gated.
- **`/resources` 98 → 100** (LCP 1.10s → 0.70s). The intro paragraph animated from `opacity: 0`, and Chrome excludes fully-transparent elements from LCP candidacy — so LCP was reported at the *end* of the animation. `.rise-in` now starts at `opacity: 0.1`.

Localhost numbers are optimistic on network but pessimistic on caching; re-measure behind your CDN after deploying. Note that a running `next dev` shares `.next` with `next build` — stop it before measuring a production build, or the output gets clobbered mid-run.
