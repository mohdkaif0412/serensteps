# Serene Step

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
| Database | Prisma ORM — SQLite (local) / PostgreSQL (production, e.g. Neon) |
| Auth | Auth.js (NextAuth v5), Credentials, bcrypt, single admin |
| Editor | Tiptap (rich text, stores HTML) |
| Images | Cloudinary uploads (optional) + `next/image` |
| Email | Resend (contact-form notifications, optional) |
| Booking | Cal.com embed (optional, swappable) |
| Forms | React Hook Form + Zod |

---

## Getting started (local development)

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
#   → then open .env and set AUTH_SECRET (run `npx auth secret`)
#     and pick an ADMIN_EMAIL / ADMIN_PASSWORD.

# 3. Create the local database (SQLite) and seed it
npm run db:push      # creates prisma/dev.db from the schema
npm run db:seed      # creates the admin user + sample content

# 4. Start the dev server
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

## Deploying to production (Vercel + Neon)

1. **Create a Neon Postgres database** and copy its pooled connection string.
2. In **`prisma/schema.prisma`**, change the datasource provider to Postgres:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   (The schema avoids Postgres-only features, so it works on both SQLite and Postgres unchanged.)
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
    (site)/            Public pages (Header/Footer layout)
    admin/             Login + protected admin panel
    api/auth/          Auth.js route handler
    sitemap.ts, robots.ts, opengraph-image.tsx
  actions/             Server Actions (posts, faqs, testimonials, contact, auth)
  components/
    ui/                Primitives: Button, Container, Section, Reveal, StepsPath, …
    sections/          Page sections (Hero, WelcomeLetter, ApproachBand, …)
    layout/            Header, Footer
    admin/             Admin UI (forms, editor, sidebar)
    forms/             ContactForm
    seo/               JsonLd
  lib/                 db, auth, queries, validation, images, site, utils, structured-data
  generated/prisma/    Generated Prisma client (git-ignored)
prisma/
  schema.prisma        Data models
  seed.ts              Admin + sample content seed
public/                Curated images, llms.txt, icon
```

---

## Accessibility & SEO

- WCAG AA contrast, visible keyboard focus, semantic HTML, alt text on every image, `prefers-reduced-motion` honored.
- Per-page metadata, Open Graph + Twitter cards, canonical URLs.
- `sitemap.xml`, `robots.txt` (welcomes AI crawlers — remove those entries in `src/app/robots.ts` to opt out), `llms.txt`.
- JSON-LD structured data: MedicalBusiness (sitewide), Article (posts), FAQPage (FAQ).

Lighthouse (production build): Accessibility, Best Practices, and SEO score 100; Performance is strong (inner pages 90+; the image-heavy home is a touch lower on a local server and improves further behind a CDN like Vercel).
