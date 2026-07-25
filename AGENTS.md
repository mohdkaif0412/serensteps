# Serene Step — agent notes

Warm, editorial marketing site + content admin for a mental-wellness practice.

**Naming:** the brand displays as **Serene Step** (singular, matching the logo),
while the domain and mailbox stay `serenesteps.net` / `steps@serenesteps.net`.
That mismatch is intentional — don't "fix" either side. Always read the display
name from `site.name` rather than hardcoding it.

## Stack

- Next.js 15 (App Router) + TypeScript (strict), React 19
- Tailwind CSS v4 (tokens defined in `src/app/globals.css` via `@theme`)
- Framer Motion (`motion/react`) — restrained, reduced-motion aware
- Prisma + PostgreSQL, Auth.js (NextAuth v5) Credentials, Tiptap, Cloudinary, Resend, Cal.com
- Server Actions for mutations; Route Handlers only for webhooks/endpoints

## Conventions

- **Never hardcode hex colors** in components. Use the theme tokens defined in
  `globals.css`: light surfaces `paper`, `cream`, `sand`, `sage-mist`, `sage`;
  deep surfaces `forest`, `forest-deep`, `forest-soft`; accents and text `mint`,
  `mint-deep`, `mint-pale`, `mint-soft`, `sage-deep`, `field`, `muted`, `hint`.
  `forest` (#174238) and `mint` (#4DBB94) are sampled from the client's logo.
- **The mint contrast rule.** `mint` is a *large-element* colour — headings,
  fills, chips, and any accent on a forest surface. On light surfaces it only
  reaches 2.1:1, so small text, thin rules, icons and focus rings use
  `mint-deep`. Body copy on forest uses `paper` or `mint-pale`, never `mint`.
  Form controls use `border-field` (3:1 against their fill) and
  `placeholder:text-hint` (4.6:1).
- **Focus rings** are owned by the global `:focus-visible` rule — don't set
  `focus-visible:outline-*` per component. Add `on-forest` to any deep-green
  band so rings inside it flip from `mint-deep` to `mint`.
- Fonts: `font-display` (Newsreader, headings), `font-sans` (Plus Jakarta Sans, body).
- Brand assets live in `public/brand/` (two inks of the same lockup — use the
  `Logo` component with `tone`), imagery in `public/images/`. Photography is
  green-duotoned by `Photo`; artwork the client already supplied on-brand passes
  `toned` to skip the grade.
- Reusable primitives live in `src/components/ui`: `Button`, `Container`, `Section`,
  `Reveal` (scroll wrapper), `RevealText`/`RiseIn` (CSS entrance), `Logo`, `Tabs`,
  `StepsPath` (the wave-of-faces journey motif), `WaveEdge`, `WaveMark`,
  `Magnetic`, `Accordion`.
- **Above the fold animates in CSS; below the fold animates in JS.** A Framer
  Motion reveal can't start until the bundle hydrates, which keeps the LCP
  heading invisible until then — so the hero and `PageHeader` use `RevealText` /
  `.rise-in` (zero JS, starts at first paint) and everything further down uses
  `Reveal`. Animate only transform and opacity. Never start an above-the-fold
  element at `opacity: 0` or behind a clipping mask: Chrome excludes those from
  LCP candidacy, which defers LCP to the end of the animation.
- Content copy lives in `src/lib/content/*` and is the single source for the
  pages, the JSON-LD, and the generated `llms.txt` / `llms-full.txt`. Edit copy
  there, never in a component — the plain-text documents are built from it, so
  they can't drift.
- Anything that reads the database from a public page goes through
  `withDbFallback` (`src/lib/db.ts`), so `next build` succeeds with no database.
  Pages that read content carry a short `revalidate` so a database-less build
  self-heals.
- Sections/blocks in `src/components/sections`; layout in `src/components/layout`.
- Zod schemas in `src/lib`; infer types from them (`z.infer`). Validate every form.
- Respect `prefers-reduced-motion` everywhere (see `Reveal` and `globals.css`).

## Local dev

- `npm run dev` — start the site at http://localhost:3000
- `npx tsc --noEmit` — typecheck · `npx next lint` — lint · `npm run build` — full build
