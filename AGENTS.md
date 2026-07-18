# Serene Steps — agent notes

Warm, editorial marketing site + content admin for a mental-wellness practice.

## Stack

- Next.js 15 (App Router) + TypeScript (strict), React 19
- Tailwind CSS v4 (tokens defined in `src/app/globals.css` via `@theme`)
- Framer Motion (`motion/react`) — restrained, reduced-motion aware
- Prisma + PostgreSQL, Auth.js (NextAuth v5) Credentials, Tiptap, Cloudinary, Resend, Cal.com
- Server Actions for mutations; Route Handlers only for webhooks/endpoints

## Conventions

- **Never hardcode hex colors** in components. Use the theme tokens: `paper`, `pine`,
  `sage`, `sage-deep`, `honey`, `muted` (e.g. `bg-paper`, `text-pine`, `border-sage-deep`).
- Fonts: `font-display` (Newsreader, headings), `font-sans` (Plus Jakarta Sans, body).
- Reusable primitives live in `src/components/ui`: `Button`, `Container`, `Section`,
  `Reveal` (scroll wrapper), plus `StepsPath` / `Accordion` (added in Phase 2).
- Sections/blocks in `src/components/sections`; layout in `src/components/layout`.
- Zod schemas in `src/lib`; infer types from them (`z.infer`). Validate every form.
- Respect `prefers-reduced-motion` everywhere (see `Reveal` and `globals.css`).

## Local dev

- `npm run dev` — start the site at http://localhost:3000
- `npx tsc --noEmit` — typecheck · `npx next lint` — lint · `npm run build` — full build
