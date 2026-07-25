# syntax=docker/dockerfile:1
#
# Serene Step — production image.
#
#   deps    → install the full dependency tree (dev deps included; the build
#             needs TypeScript, Tailwind and the Prisma CLI)
#   builder → prisma generate + next build, emitting .next/standalone
#   runner  → the standalone server, the Prisma engine, and the Prisma CLI
#             (so the entrypoint can apply the schema on boot)
#
# The build deliberately does NOT need a reachable database: every query that
# runs during prerendering is wrapped in `withDbFallback` (see src/lib/db.ts),
# so `next build` completes with a placeholder DATABASE_URL and the DB-backed
# content fills in at runtime.
#
#   docker build -t serene-step .
#   docker run -p 3000:3000 -e DATABASE_URL=... -e AUTH_SECRET=... serene-step

# ── Shared base ───────────────────────────────────────────────────
FROM node:20-alpine AS base
# libc6-compat + openssl are what the Prisma query engine needs on musl.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ── Stage 1: dependencies ─────────────────────────────────────────
FROM base AS deps
# The schema is copied first because `npm ci` triggers the `postinstall`
# script, which runs `prisma generate` and needs prisma/schema.prisma.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ── Stage 2: build ────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
# A syntactically valid but unreachable URL: Prisma needs *a* connection string
# to initialise, and the fallbacks in src/lib/db.ts absorb the failed queries.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?connect_timeout=2"

# NEXT_PUBLIC_* values are inlined into the browser bundle by `next build`, so
# they must be present *here*, not just at runtime. Everything is optional —
# src/lib/site.ts falls back to sensible defaults for anything left blank.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_CONTACT_PHONE
ARG NEXT_PUBLIC_PHONE_COUNTRY
ARG NEXT_PUBLIC_CALCOM_LINK
ARG NEXT_PUBLIC_CALENDLY_URL
ARG NEXT_PUBLIC_INSTAGRAM_URL
ARG NEXT_PUBLIC_FACEBOOK_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_PLAUSIBLE_SRC
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_CONTACT_PHONE=$NEXT_PUBLIC_CONTACT_PHONE \
    NEXT_PUBLIC_PHONE_COUNTRY=$NEXT_PUBLIC_PHONE_COUNTRY \
    NEXT_PUBLIC_CALCOM_LINK=$NEXT_PUBLIC_CALCOM_LINK \
    NEXT_PUBLIC_CALENDLY_URL=$NEXT_PUBLIC_CALENDLY_URL \
    NEXT_PUBLIC_INSTAGRAM_URL=$NEXT_PUBLIC_INSTAGRAM_URL \
    NEXT_PUBLIC_FACEBOOK_URL=$NEXT_PUBLIC_FACEBOOK_URL \
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_PUBLIC_PLAUSIBLE_SRC=$NEXT_PUBLIC_PLAUSIBLE_SRC

RUN npx prisma generate && npm run build

# ── Stage 3: runtime ──────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Never run the server as root.
RUN addgroup -S -g 1001 nodejs \
 && adduser -S -u 1001 -G nodejs nextjs

# Static assets and the self-contained server.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma runtime: the generated client (with its musl query engine) is copied
# explicitly so it can't be missed by output-file tracing.
COPY --from=builder --chown=nextjs:nodejs /app/src/generated/prisma ./src/generated/prisma
# Schema + CLI, so docker-entrypoint.sh can apply migrations before serving.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# ISR / image-optimisation cache must be writable by the app user.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 3000

# Shell form so ${PORT} expands. /api/health reports DB state without failing
# on it — see src/app/api/health/route.ts.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -q --spider "http://127.0.0.1:${PORT:-3000}/api/health" || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
