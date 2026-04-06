#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_SQL="${TMPDIR:-/tmp}/off2zim_schema.sql"
RESET="${1:-}"

cd "$ROOT_DIR"

if [[ -f ".env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env.local"
  set +a
elif [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required."
  exit 1
fi

PSQL_DATABASE_URL="${DATABASE_URL%%\?*}"

npx prisma generate
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > "$SCHEMA_SQL"

if [[ "$RESET" == "--reset" ]]; then
  psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
fi

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SCHEMA_SQL"
npx tsx prisma/seed.ts
