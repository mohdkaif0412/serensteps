# Serene Steps: SEO & GEO Audit (Phase 1)

**Date:** 26 Nov 2026 · **Scope:** https://serenesteps.net and this repo · **Status:** audit only, no code changed

## How this was measured

| Source | What it tells us |
| --- | --- |
| Live production (`curl` of serenesteps.net) | What Google and the AI crawlers actually see today |
| The local working tree: `HEAD` plus uncommitted changes | What would ship next |
| A production build (`next build && next start`) in an isolated copy, plus Lighthouse 12.8 **mobile** preset | Performance baseline |
| Raw server HTML parsed per route (no JS executed) | What non-rendering crawlers (GPTBot, ClaudeBot, PerplexityBot) receive |

The local dev server had no `DATABASE_URL`, so DB-backed content (FAQs, posts, testimonials) was checked against **production**.

---

## 0. Blockers: decisions needed before Phase 2

| # | Decision | Why it blocks |
| --- | --- | --- |
| **D1** | **Is the brand "Serene Step" or "Serene Steps"?** Production and the last commit say **Serene Step**; the code there says the singular is "intentional and confirmed". An **uncommitted rebrand in the working tree** changes 85 lines to **Serene Steps** and swaps in a new logo. Your brief writes "Serene Step". | Entity consistency is the foundation of every GEO task. The name has to be identical on the site, in schema, in llms.txt, on Google Business Profile (GBP) and on social profiles. |
| **D2** | **Another session is editing this repo right now.** Session `kaif-internal-10` is mid-change on the rebrand and a new 404 flow (`(site)/[...missing]`, `not-found.tsx`). | Phase 2 touches the same files (`site.ts`, `structured-data.ts`, page metadata). That work must be committed or paused first, or the two sets of edits will clobber each other. |
| **D3** | **The sample testimonials are live** (see C1). Are there any **real, consented** testimonials? | Determines whether the testimonial sections stay and whether any Review markup is allowed. Today the answer must be no. |
| **D4** | **Practitioner facts:** name, qualifications, registration (for example RCI) and years of practice. | Schema type, `Person` markup, bylines, the About page and llms.txt all depend on these. None exist anywhere today. |
| **D5** | **Location model:** a physical address (NAP) or online only, and which city or region is served. | Local SEO, LocalBusiness fields, titles and GBP. Every location env var is unset in production. |
| **D6** | **AI training crawlers:** allow or block (GPTBot, Google-Extended, Applebot-Extended, ClaudeBot)? | Currently allowed. Your brief asks to confirm with the client first. |

### The stack differs from the brief

These items in the brief need adapting:

- **Booking:** there is **no Cal.com**. Booking is built in (`/book`, Prisma `SessionType`/`Booking`; see `AGENTS.md`). "Lazy-load the Cal.com embed" doesn't apply. Conversion events attach to the in-house `/book` flow instead.
- **Email:** **Nodemailer (SMTP)** is used, **not Resend**. A post-session review-request email would go through `src/lib/booking/emails.ts`.
- **Analytics:** Plausible (cookieless) is already wired. It's off unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. Recommend keeping this rather than GA4 on a mental-health site.
- **Docs:** `README.md` still describes Cal.com and Resend, which contradicts `AGENTS.md` and the code.

---

## Summary: ranked issues

Impact: **H**igh / **M**edium / **L**ow. Effort: **S** (< ½ day), **M** (½–2 days), **L** (> 2 days). "Client" means the fix needs facts from the client.

| ID | Issue | Impact | Effort |
| --- | --- | --- | --- |
| **C1** | Invented "sample" testimonials are published on the live site | **H** (trust/legal) | S |
| **C2** | Brand name split across prod, code and llms.txt; the rebrand drops `alternateName` | **H** | S + Client |
| **H1** | FAQ answers missing from server HTML: **1 of 13** present | **H** | S |
| **H2** | 9 pages inherit the homepage's `og:title` and `og:url` | **H** | S |
| **H3** | `/privacy` and `/terms` canonicalise to the homepage | **H** | S |
| **H4** | No named practitioner or credentials anywhere (YMYL E-E-A-T) | **H** | M + Client |
| **H5** | Schema says "Psychiatric" MedicalBusiness; the About page says "non-clinical" | **H** | S + Client |
| **H6** | Mobile LCP 3.0–7.3 s; `/services` weighs 7.35 MB (autoplay videos) | **H** | M |
| **H7** | Boot curtain is dismissed only by JS, with no CSS fallback | M–H | S |
| **H8** | No location or keyword targeting (all location env vars unset) | **H** | S + Client |
| **H9** | Blog: placeholder covers from picsum.photos, no author, no internal links | **H** | M |
| M1 | Titles are brand-led and keyword-free; service H1s read "Individual" etc. | M | S |
| M2 | 8 of 15 meta descriptions are outside 140–160 chars | M | S |
| M3 | `www` → apex uses a **307**; `http://www` takes two hops | M | S (Vercel) |
| M4 | robots.txt is missing OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Perplexity-User and others | M | S + Client |
| M5 | Weak internal linking; no breadcrumb UI | M | M |
| M6 | Admin has minimal SEO fields: no counters, preview, OG image, noindex, FAQ or cover alt | M | M |
| M7 | Sitemap `lastmod` for static pages = "now", refreshed every 10 minutes | M | S |
| M8 | FAQPage JSON-LD is emitted even when it has zero questions | L–M | S |
| M9 | Below-the-fold content is server-rendered at `opacity:0.001` (invisible without JS) | M | S |
| M10 | `/blog` is fully dynamic (no ISR); `?page=99` returns a 200 soft-404 | M | S–M |
| M11 | llms.txt gaps: wrong naming note, phone without +91, no people/place/FAQs | M | S |
| M12 | Terms page shows a "this is a template" note publicly; legal pages need review | M | S |
| M13 | Crisis note is generic, with no national helpline | M | S |
| L1 | No `error.tsx` / `global-error.tsx`; the 404 work is in progress in another session | L | S |
| L2 | Minor perf: unused/legacy JS ~38 KiB, responsive images, 8 font files | L | S |
| L3 | `x-powered-by` header, non-standard `Host:` line in robots.txt, RSS enclosure `length="0"` | L | S |

### Quick wins: high impact, small effort, no client input needed

C1 (unpublish), H1, H2, H3, H7, M3, M7, M8, M2.

---

## 1. Rendering

**Good:**
- Every public page is static or ISR, server-rendered in the App Router (build output: `○`/`●`). `/booking/[token]` and `/admin` are dynamic and `noindex`.
- Above-the-fold copy uses CSS-only entrances (`RevealText`, `.rise-in` starting at `opacity:0.1`). The hero image is `priority` and un-gated.
- The inactive Services tab is server-rendered with `hidden`, so its text is crawlable.
- Glossary detail is collapsed with CSS, not unmounted.

| ID | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| **H1** | `Accordion` unmounts closed answers with `AnimatePresence`. Production `/faq` ships **1 of 13** answers in its HTML. Non-JS AI crawlers see 12 questions and no answers, and the FAQPage JSON-LD claims content that isn't on the page. | [Accordion.tsx:68-85](src/components/ui/Accordion.tsx#L68-L85) | Always render every answer. Collapse with `<details>`/`<summary>`, or a CSS height/`hidden="until-found"` panel. Keep the animation on top. |
| **H7** | `BootLoader` is a full-viewport opaque `bg-forest` overlay. It is removed only by a `useEffect` after hydration. With no JS (or a failed hydration) the page stays covered forever; on slow phones it shows until hydration ends. | [BootLoader.tsx:96-151](src/components/ui/BootLoader.tsx#L96-L151), `.boot` in [globals.css:360](src/app/globals.css#L360) | Add a CSS-only `animation: boot-out … 1.1s forwards` so it always clears, and keep JS only to clear it sooner. Or drop it on mobile. |
| **M9** | `Reveal` server-renders `style="opacity:0.001; transform:…"` on all below-the-fold sections. Text is in the HTML (fine for crawlers), but it is invisible to no-JS users and some preview renderers. | [Reveal.tsx:54](src/components/ui/Reveal.tsx#L54) | Add `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>`, or gate the initial state on a `js` class set before paint. |

## 2. Metadata

`metadataBase` is set correctly ([layout.tsx:18](src/app/layout.tsx#L18)).

**Root cause of H2 and H3:** the root layout sets `alternates.canonical: "/"` and a full `openGraph` block. Next.js merges metadata shallowly, so any page that doesn't redefine those keys inherits the homepage's values.

| Route | Title (chars) | Desc (chars) | Canonical | og:title / og:url |
| --- | --- | --- | --- | --- |
| `/` | Serene Step — Step into your light (34) | **274** | ✓ | ✓ |
| `/about` | About Us — … (23) | **170** | ✓ | ✗ inherits home |
| `/services` | Services — … (23) | **222** | ✓ | ✗ inherits home |
| `/services/children-teens` | Children & Teens Counselling — … (43) | 155 | ✓ | ✓ |
| `/services/individuals` | Individual Counselling — … (37) | 148 | ✓ | ✓ |
| `/services/couples-families` | Couples & Family Counselling — … (43) | 153 | ✓ | ✓ |
| `/services/astrology-tarot` | Astrology & Tarot — … (32) | **260** | ✓ | ✓ |
| `/resources` | Resources — a plain-language guide … — … (**66**) | **210** | ✓ | ✗ inherits home |
| `/blog` | Journal — … (22) | **138** | ✓ | ✗ inherits home |
| `/faq` | FAQ — … (18) | 162 | ✓ | ✗ inherits home |
| `/contact` | Contact & Booking — … (32) | **139** | ✓ | ✗ inherits home |
| `/book` | Book a session — … (29) | **186** | ✓ | ✗ inherits home |
| `/privacy` | Privacy Notice — … (29) | **72** | **✗ → `/`** | ✗ inherits home |
| `/terms` | Terms of Use — … (27) | **114** | **✗ → `/`** | ✗ inherits home |
| `/blog/[slug]` | from `seoTitle`/`title` (68 seen live) | from `seoDescription`/excerpt | ✓ | ✓ (image is picsum) |

- **H2:** sharing `/about` on WhatsApp, LinkedIn or Facebook shows "Serene Step — Step into your light" and links to the homepage. Fix: one `buildMetadata({ title, description, path, image? })` helper that always sets canonical, openGraph (title, description, url) and twitter together. Use it on every route.
- **H3:** add canonicals to [privacy/page.tsx:7](src/app/(site)/privacy/page.tsx#L7) and [terms/page.tsx:7](src/app/(site)/terms/page.tsx#L7). The helper above prevents this class of bug.
- **M1:** titles are brand-led and contain no search terms.
  - The home title has no "counselling/therapy" and no place.
  - Service H1s are just "Individual", "Children & Teens", "Couples & Family".
  - Recommended pattern: `{Service} Counselling {in City | Online} | Serene Steps` (50–60 chars). Keep the brand voice in the H1's styled line, but put the keyword in the H1 text.
  - The `/resources` title has a doubled em-dash.
- **M2:** bring all descriptions to 140–160 chars. Shorten the long ones (home, astrology, services, resources, book, about) and expand privacy and terms.
- No `twitter:site`, because there is no X account. That's fine.

## 3. Structured data

**What exists:**
- One `@graph`: Organization+MedicalBusiness (`#organization`) and WebSite.
- Service nodes (`MedicalTherapy`+`Service`) and an ItemList.
- BreadcrumbList on inner pages.
- BlogPosting, Blog, FAQPage, DefinedTermSet.
- Person, but only when env vars are set (not set in production).
- All of it is rendered server-side through [JsonLd.tsx](src/components/seo/JsonLd.tsx). The architecture is sound; the problems are in the facts.

| ID | Finding | Fix |
| --- | --- | --- |
| **H5** | `@type: MedicalBusiness` with `medicalSpecialty: ["Psychiatric", "Public Health"]` and `MedicalTherapy` service nodes ([structured-data.ts:155](src/lib/structured-data.ts#L155), [:172](src/lib/structured-data.ts#L172), [:292](src/lib/structured-data.ts#L292)). The About copy calls the practice **"non-clinical"**. "Psychiatric" implies psychiatry (medical doctors). On a YMYL site the markup must not claim more than the practice is. | Choose the type once D4 is answered. A registered clinical/counselling psychologist could fit `MedicalBusiness`/`MedicalClinic` without the "Psychiatric" specialty. A non-clinical counselling practice fits `ProfessionalService` (a LocalBusiness subtype) better. Drop "Public Health". |
| H5 | `availableLanguage: ["English","Hindi","Urdu"]` is hard-coded and unverified. | Confirm with the client or remove. |
| H5 | `areaServed: "Online and in person"` is not a place. | Use `Place`/`City`/`Country` values (from D5). Online reach goes in the `Service` description or `availableChannel`. |
| C2 | The rebrand removes `alternateName` ([structured-data.ts diff](src/lib/structured-data.ts#L134)). | After a rename, keep the **old** name as `alternateName` for 6–12 months so engines merge the two entities. |
| H4 | `BlogPosting.author` falls back to the Organization. No `Person` exists in production. | `Person` with `hasCredential`, `knowsAbout`, `sameAs`, plus `reviewedBy` on health articles, once D4 is answered. |
| M8 | `faqPageJsonLd([])` emits an FAQPage with an empty `mainEntity` when the DB is empty or unreachable. That's invalid. | Return `null` when there are no items. Note that Google limits FAQ rich results to authoritative health/government sites since 2023, so the value here is mostly for AI engines, and the answers must be visible (H1). |
| C1 | No Review/AggregateRating markup. **Correct; keep it that way.** The testimonials are samples. | Revisit only with real, consented, on-page reviews. |
| — | Missing: page-level `WebPage`/`AboutPage`/`ContactPage` with `dateModified`, and `Service.offers` (blocked on prices). | Phase 2. |

**Validation checklist for after Phase 2:**
- [Rich Results Test](https://search.google.com/test/rich-results): `/`, a service page, `/faq`, a blog post (Organization/LocalBusiness, Breadcrumb, Article).
- [Schema Markup Validator](https://validator.schema.org/): all of the above plus `/resources` (DefinedTermSet).

## 4. Crawlability

**Good:**
- `robots.ts` disallows `/admin`, `/api/` and `/booking/`.
- Admin and login pages are `noindex`; booking pages are `noindex` and excluded from the sitemap.
- The sitemap includes all services and published posts, with real `updatedAt` and image entries.
- HTTP → HTTPS is a 308. Trailing slashes are consistent (`/about/` → 308 → `/about`).
- No 404s in internal links among the pages tested.

| ID | Finding | Fix |
| --- | --- | --- |
| **M3** | `https://www.serenesteps.net/` → **307** (temporary) → apex. `http://www` → `https://www` → apex is two hops. | In Vercel → Domains, set the www redirect to **308 Permanent**. Ideally redirect `http://www` straight to the apex. |
| **M4** | robots.txt names only GPTBot, ClaudeBot, PerplexityBot and Google-Extended. | After D6: add OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, Perplexity-User, Applebot-Extended. Bingbot is already covered by `*`. Separate search/retrieval bots from training bots so the client can block training without losing citations. |
| **M7** | Static routes get `lastModified: new Date()` unless `SITE_LAST_MODIFIED` is set ([content-date.ts:16](src/lib/content-date.ts#L16)). Live, every static page claimed it was modified at 02:34 today. Google learns to ignore inaccurate `lastmod`. | Set `SITE_LAST_MODIFIED` in CI from the last commit date, or keep per-page dates in the content modules. |
| **M10** | `/blog` reads `searchParams`, which makes it dynamic (`ƒ`): it hits the DB on every request with no cache. `/blog?page=99` returns **200** with an empty state, a soft 404. | Move to `/blog/page/[n]` with `generateStaticParams` and ISR. Call `notFound()` when out of range. |
| L3 | `Host:` in robots.txt is non-standard (only Yandex reads it); it's harmless. `x-powered-by: Next.js` is exposed. | Remove `host`, set `poweredByHeader: false`. |

## 5. Headings & semantics

**Good:**
- Exactly one H1 on every page.
- Landmarks (`header`, `nav`, `main`, `footer`) are present, with a skip link.
- All `<img>` elements have `alt` attributes; the single empty alt per page is decorative.
- Video loops carry `aria-label`.

**Problems:**
- **The home H1** is the tagline plus a whole philosophy sentence, with no topic words.
- **Service H1s** are a single audience word (M1).
- **Section H2s** are emotive rather than descriptive, which affects GEO: "Any of this sound familiar?", "Three kinds of work, one young person". (See §10.)
- **`/services/astrology-tarot`** has two identical H2s ("Please read this first").
- **Blog cover alt text** is auto-generated: `Cover image for "<title>"` ([queries.ts:82](src/lib/queries.ts#L82)). That describes nothing.
- **Stock-photo alt texts** are mood descriptions ("Trees standing together in warm evening light"). That's acceptable for decorative stock images, but not useful for image search.

## 6. Performance / Core Web Vitals

**Baseline:** Lighthouse 12.8.2, **mobile** preset (simulated 4G + 4× CPU), local `next start` build. The README's 99–100 scores were measured on the **desktop** preset.

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 87 | 100 | 100 | 100 | 4.0 s | 0 | 0 ms |
| `/about` | 87 | 100 | 100 | 100 | 4.1 s | 0 | 0 ms |
| `/services` | **76** | 97 | 100 | 100 | **7.3 s** | 0 | 0 ms |
| `/services/individuals` | 90 | 100 | 100 | 100 | 3.5 s | 0 | 0 ms |
| `/resources` | 93 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms |
| `/faq` | 93 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms |
| `/contact` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 0 ms |
| `/book` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 90 ms |

**Reading the numbers:**
- CLS and TBT are excellent.
- Observed (unthrottled) LCP is 90–716 ms. The simulated mobile LCP is almost entirely "render delay", because heavy early requests compete with the critical path. On real mid-range phones on 4G that contention is real.
- Target after fixes: ≥ 90 on every page, LCP < 2.5 s.

| ID | Finding | Fix |
| --- | --- | --- |
| **H6** | `/services` transfers **7.35 MB**. Four autoplaying MP4s download on load: couples 3.0 MB, individual 1.5 MB, teens 0.97 MB, astrology 0.59 MB. The astrology clip sits in the **hidden** tab. Posters are raw `/images/*.jpg` (up to 256 KB) that bypass `next/image`. | `preload="none"`. Attach `src` and play only when in view (IntersectionObserver), and never inside a hidden tab panel. Show a static poster on mobile/`saveData`. Re-encode clips (≤ 600 KB, 720p H.264/AV1). Serve optimised posters (AVIF/WebP). |
| H6 | Render-blocking CSS: 270–450 ms estimated savings. | Tailwind v4 output is one stylesheet; inline critical CSS or trim `globals.css`. Re-measure after the video fix first, since that is the dominant cost. |
| H7 | Boot curtain (see §1). It covers the page on first visit until hydration. | CSS auto-dismiss, or skip it on mobile. |
| L2 | Unused JS ~21–27 KiB, legacy polyfills 12 KiB, responsive-image savings 23–46 KiB, Plus Jakarta Sans loaded as 4 weights × 2 styles. | Set a `browserslist` to modern browsers. Use the variable font axis or drop the italic weights you don't need. Tighten `sizes`. |
| H9 | Blog covers fall back to `https://picsum.photos/...` (third-party, uncached, placeholder). | Real covers through Cloudinary or `next/image`, with descriptive alt text. |

`next/font` with `display: swap` is already in place. There is no Cal.com embed. Plausible loads `afterInteractive` and only when enabled.

## 7. Internal linking

| Finding | Fix |
| --- | --- |
| The 5 seeded blog posts contain **zero** internal links ([posts.ts](src/lib/content/posts.ts)). | 2–4 contextual links per post to the matching service and glossary term, plus a "related service" block. |
| Service pages link to other services and `/book`, but **never** to the blog, `/resources` or `/faq`. | A "Read more" strip (related posts by category) and links to the relevant glossary terms and service FAQs. |
| `/about` links only to booking. | Link to services, the practitioner bio and the approach. |
| No breadcrumb UI; only JSON-LD and a "‹ All services" link. | A visible `<Breadcrumbs>` component that renders the same trail the JSON-LD uses. |
| `/resources` already links well to services. Good. | Keep it as the definitional hub. |

There are no orphan pages: everything is linked from the header or footer navigation.

## 8. Content gaps vs competitors

**Blocked: no competitor URLs were provided.** Gaps that are visible without them:
- No practitioner or bio page.
- No location page.
- No public session length or price on service pages. Durations exist in `session-types.ts`; prices are intentionally blank.
- No per-service FAQs.
- No "what to expect in your first session" page (only a glossary entry).
- 5 blog posts, all from August 2026.
- No content for "therapy vs counselling vs psychiatrist" or "online vs in-person" decision queries.

The full gap analysis comes with `CONTENT_PLAN.md` once competitors are named.

## 9. E-E-A-T (YMYL)

| ID | Finding | Fix |
| --- | --- | --- |
| **C1** | [testimonials.ts:8](src/lib/content/testimonials.ts#L8) labels them "Anonymized **sample** testimonials". They are seeded into the DB, and 3 of the 4 are **live on the homepage**; services pages show them too. Publishing invented client quotes on a mental-health site is a consumer-protection and trust risk, and a manual-action risk if it were ever marked up. | **Today:** unpublish them in `/admin/testimonials`. Then remove them from the seed. Render the testimonial sections only when real, consented items exist. |
| **H4** | No named person anywhere. The About page reads "Hey — I'm Serene Steps" ([about.ts:16](src/lib/content/about.ts#L16)). There are no qualifications, registration or experience, and blog posts have no byline or reviewer. | A practitioner section or page (photo, qualifications, registration number, years, approach), a byline plus "reviewed by" on articles, and Person schema. Needs D4. |
| H4 | "Evidence-based approaches" is stated, but no modality (for example CBT) is named. | Name the methods the client actually uses (D4). That is also what AI engines quote. |
| **M12** | The Terms page publicly renders "Note for the practice: this is a plain-language starting template…" ([terms/page.tsx:56-60](src/app/(site)/terms/page.tsx#L56-L60)). | Remove it from the public page. Have the Terms and Privacy pages reviewed for the client's jurisdiction; if India, against the DPDP Act 2023. |
| **M13** | The crisis note says "contact a 24/7 crisis line" without naming one. | For an India-based practice, name the national helpline: Tele-MANAS **14416**. The client should verify it before publishing. |
| — | Good: the crisis note appears in the footer and on articles, a privacy notice exists, contact details (email, phone, WhatsApp) are clear, and the astrology/tarot framing disclaims prediction and treatment. | Keep these. Add a short "not a substitute for diagnosis or emergency care" line on service pages. |

## 10. GEO readiness

**Good:**
- `/llms.txt` and `/llms-full.txt` are **generated from the same content modules** as the pages, so they can't drift.
- `/resources` is an answer-first glossary with DefinedTermSet markup.
- Copy is server-rendered (except the FAQ answers, H1).
- The astrology/tarot framing is explicitly addressed to LLMs.

| ID | Finding | Fix |
| --- | --- | --- |
| **C2** | llms.txt says: "the practice is called **Serene Steps** (singular)… the domain keeps the plural" ([llms.ts:32](src/lib/llms.ts#L32)). After the rebrand that sentence contradicts itself, and production says "Serene Step". | Rewrite it once D1 is settled. If renamed, say "formerly known as …". |
| **M11** | llms.txt has the phone as `7006788155` (no +91), no practitioner, no location, no FAQs, and no session lengths or formats. "Non-clinical" in the summary conflicts with the MedicalBusiness schema. | Generate these sections from the DB and config. Use the E.164 phone format. |
| — | Service pages open with emotive copy, not a direct answer. H2s aren't question-shaped. There is no FAQ, "last updated" date or author on service pages. | Answer-first restructure: a 2–3 sentence "What is X and who is it for", question H2s, a facts table (length, format, price, location), 5–8 FAQs, and a byline with date (Phase 3). |
| H1 | Only 1 of 13 FAQ answers is in the HTML. | See §1. |
| M4 | Retrieval bots are missing from robots.txt. | See §4. |

---

## What's already solid (don't redo)

- **Config:** central config in [src/lib/site.ts](src/lib/site.ts), env-overridable. Facts are omitted, not guessed, when unset. This is the right base for the "central SEO config" task, so extend it rather than replace it.
- **Entity graph:** one business entity with stable `@id`s, rendered server-side.
- **OG images:** per-route images from one renderer ([og-image.tsx](src/lib/og-image.tsx)), including per-service.
- **Feeds and AI docs:** RSS feed, manifest, generated llms files.
- **Verification:** Search Console and Bing verification meta tags are already wired (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`).
- **Accessibility and motion:** a11y is 100 on nearly every page, and the reduced-motion handling is exemplary.

## Client input needed (TODO)

- [ ] D1: exact brand name, and the legal name if different
- [ ] D3: real testimonials with written consent, or confirmation there are none
- [ ] D4: practitioner name(s), qualifications, registration body and number, years of experience, modalities used, photo
- [ ] D5: address and phone exactly as on GBP (or "online only"), city or region served, opening hours, map URL, lat/lng
- [ ] D6: allow or block AI **training** crawlers
- [ ] Session prices (lengths are in `session-types.ts`; please confirm those too)
- [ ] Languages offered (currently claimed: English, Hindi, Urdu)
- [ ] Social / profile URLs (Instagram, Facebook, LinkedIn, GBP, directory listings)
- [ ] Target keywords and 2–3 competitor URLs
- [ ] Real blog cover images, or permission to use licensed stock

## Proposed Phase 2 order (after D1–D3)

1. **Truth fixes:** unpublish sample testimonials (C1), the brand name everywhere plus `alternateName` (C2), and remove the Terms template note.
2. **Metadata helper:** fixes H2, H3, M1 and M2 in one change, plus FAQ answers in the HTML (H1).
3. **Schema corrections:** H5 and M8, plus breadcrumb UI.
4. **Performance:** videos, posters, boot curtain, then re-measure (H6, H7).
5. **Crawl hygiene:** M3 (Vercel setting), M7, M10, robots after D6.
6. **Admin SEO fields:** counters, SERP preview, OG image, canonical, noindex, FAQ block, cover alt. This needs a Prisma migration.

Phases 3–5 then build on facts from D4 and D5.
