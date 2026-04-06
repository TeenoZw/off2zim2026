# Postgres Cutover Playbook

Last updated: 2026-04-06

## Goal

Move Off2Zim from the legacy local SQLite runtime to the target shared runtime:

- PostgreSQL
- Prisma
- Next.js backend APIs

This playbook is designed for a safe local cutover first.

## Important Context

- The active local environment files still point at SQLite:
  - `.env`
  - `.env.local`
- `prisma/schema.prisma` is already configured for PostgreSQL.
- The historical `prisma/migrations/*` SQL was generated during the SQLite phase and should not be treated as a trusted production migration path for a fresh Postgres database.

For a fresh local Postgres environment, the practical path is:

1. start local Postgres
2. switch env vars to Postgres
3. run the repo bootstrap script
4. seed
5. verify auth, provider, booking, and upload flows

## Local Bootstrap Path

### 1. Start local Postgres

Use the repo-provided Docker Compose file:

```bash
npm run db:dev:up
```

This starts:

- database: `off2zim`
- user: `postgres`
- password: `postgres`
- port: `5432`

To inspect logs:

```bash
npm run db:dev:logs
```

To stop it:

```bash
npm run db:dev:down
```

### 2. Switch the environment to Postgres

Use `.env.postgres.example` as the template.

Minimum values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/off2zim?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/off2zim?schema=public"
```

Also keep:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- payment credentials
- `EXPO_PUBLIC_API_BASE_URL`
- `LOCAL_UPLOADS_DIR`

### 3. Bootstrap Prisma into Postgres

For a clean local Postgres database:

```bash
npm run db:bootstrap:postgres
```

This runs:

1. `prisma generate`
2. `prisma migrate diff --from-empty --to-schema-datamodel ... --script`
3. apply generated SQL with `psql`
4. `tsx prisma/seed.ts`

If you need to wipe and rebuild the local Postgres schema:

```bash
npm run db:reset:postgres
```

## Verification Checklist

After bootstrap, verify:

- `npm run dev` starts cleanly
- register/login works
- `/api/auth/session` returns a valid user
- mobile app can sign in against the backend
- provider registration loads and saves
- provider document upload works
- provider review submission works
- admin provider review queue loads
- booking endpoints still work
- uploaded provider files resolve through `/api/uploads/*`

## Why the repo uses generated SQL instead of `db push`

Right now the repo is in an architecture transition:

- runtime target is PostgreSQL
- old migration history originated in the SQLite phase

On this machine, Prisma's `db push` schema engine reached the Postgres server but failed with a schema engine error without surfacing a useful database-level cause. Prisma can still generate the full PostgreSQL SQL diff correctly, so the repo bootstrap script now uses the generated SQL plus `psql` as the reliable local cutover path.

Once Postgres becomes the active runtime everywhere, the next step should be:

- establish a clean Postgres-native migration baseline
- then resume normal Prisma migration workflow from that baseline

## Recommended Next Step After Local Success

After local Postgres is validated:

1. create a clean Postgres baseline migration strategy
2. move shared environments to Postgres
3. validate seeding and all core backend routes again
4. continue removing the remaining compatibility layer in `Mobile/lib/supabase.ts`
