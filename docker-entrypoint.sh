#!/bin/sh
# Serene Step — container entrypoint.
#
# Brings the database schema up to date, then hands off to the Next.js server
# (via `exec`, so node is PID 1 and receives SIGTERM cleanly).
#
# `prisma migrate deploy` is tried first. This project manages its schema with
# `prisma db push` rather than a migrations folder, so when there are no
# migrations to deploy we fall back to `db push` — which is non-destructive and
# a no-op once the schema matches.
#
# Set SKIP_DB_MIGRATE=1 to skip this entirely (e.g. a read-only replica).

set -e

PRISMA_CLI="/app/node_modules/prisma/build/index.js"
SCHEMA="/app/prisma/schema.prisma"
MAX_ATTEMPTS="${DB_WAIT_ATTEMPTS:-15}"
RETRY_DELAY="${DB_WAIT_DELAY:-2}"

log() { echo "[entrypoint] $*"; }

run_prisma() {
  node "$PRISMA_CLI" "$@" --schema "$SCHEMA"
}

apply_schema() {
  if run_prisma migrate deploy; then
    return 0
  fi
  log "migrate deploy did not apply (no migrations folder?) — trying db push"
  run_prisma db push --skip-generate
}

if [ "$SKIP_DB_MIGRATE" = "1" ]; then
  log "SKIP_DB_MIGRATE=1 — leaving the schema alone."
elif [ -z "$DATABASE_URL" ]; then
  log "DATABASE_URL is not set — starting without touching the schema."
elif [ ! -f "$PRISMA_CLI" ]; then
  log "Prisma CLI not found at $PRISMA_CLI — skipping schema step."
else
  attempt=1
  while :; do
    if apply_schema; then
      log "schema is up to date."
      break
    fi
    if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
      # Don't wedge the container: the site's copy is static and still serves.
      log "could not apply the schema after $attempt attempts — starting anyway."
      break
    fi
    log "database not ready (attempt $attempt/$MAX_ATTEMPTS) — retrying in ${RETRY_DELAY}s"
    sleep "$RETRY_DELAY"
    attempt=$((attempt + 1))
  done
fi

log "starting: $*"
exec "$@"
