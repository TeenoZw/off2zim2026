# Off2Zim Architecture Consolidation Tracker

Last updated: 2026-04-05

## Objective

Consolidate Off2Zim onto:

- one backend API
- one Postgres database
- one Prisma-managed schema
- one shared auth/session model for web and mobile

This tracker is the living implementation document for each migration pass.

## Target Architecture

- Web client: Next.js app
- Mobile client: Expo app
- Backend: Next.js API/backend as the single application backend
- Database: Postgres
- ORM/schema: Prisma
- Auth: backend-managed auth/session flows shared by web and mobile
- Storage: one chosen strategy, optionally Supabase Storage only as infrastructure

## Current State Snapshot

- Web already uses Next.js API routes and Prisma-backed auth/provider flows.
- Mobile was originally built around direct Supabase auth/table access.
- A temporary mobile compatibility bridge now exists so mobile can begin using the shared backend without visual changes.
- The long-term goal is to remove compatibility shims and converge on domain APIs.

## Active Linear Project

- Project: `Off2Zim Architecture Consolidation`
- URL: <https://linear.app/omni-logistics/project/off2zim-architecture-consolidation-a9c13a8948c5>

## Linear Backlog

- `OMN-6` Audit current Supabase vs Prisma split and define canonical domain model
- `OMN-7` Migrate Off2Zim Prisma datasource from SQLite to Postgres
- `OMN-8` Consolidate auth and session flows so web and mobile use one backend auth system
- `OMN-9` Design and implement shared domain APIs for destinations, stays, events, favorites, and bookings
- `OMN-10` Refactor Expo mobile app to consume backend APIs only
- `OMN-11` Unify provider, admin, and listing workflows under the single backend model
- `OMN-12` Decide and implement file/image storage strategy
- `OMN-13` Add migration tracker, verification checklist, and rollout plan

## Workstreams

### 1. Domain Model Consolidation

- Map all current mobile Supabase-shaped entities to Prisma/domain entities.
- Identify duplicated concepts and choose canonical models.
- Define final API contract boundaries.

### 2. Database Migration

- Move Prisma datasource from SQLite to Postgres.
- Validate migrations, seeds, and local/dev workflow.
- Prepare for hosted Postgres deployment.

### 3. Auth and Profile Unification

- Standardize login/register/session/logout flows.
- Align profile payloads across web and mobile.
- Remove mobile dependency on Supabase auth semantics.

### 4. Shared Domain APIs

- Introduce stable backend APIs for:
- destinations
- stays
- events
- favorites
- bookings
- provider/admin flows

### 5. Mobile Refactor

- Replace direct mobile Supabase data access with backend API clients.
- Keep the visual/mobile UI unchanged.
- Remove temporary shims as shared APIs stabilize.

### 6. Storage Strategy

- Decide whether storage remains separate, moves to backend-managed object storage, or uses Supabase Storage only as infrastructure.
- Centralize upload/delete access patterns.

## Migration Principles

- Preserve the existing mobile visuals.
- Keep one source of truth for each domain concept.
- Prefer backend-owned business rules over frontend-owned database logic.
- Move incrementally with compatibility layers only where they reduce risk.
- Leave behind updated documentation after every pass.

## Progress Log

### Pass 1 - 2026-04-01

Completed:

- Mapped the recommended target architecture for the repo.
- Added a temporary mobile backend bridge so the mobile app can start using the same backend as the web without visual changes.
- Created the Linear project and initial migration backlog.
- Created this living tracker file.

In progress:

- Transitioning mobile core flows from direct Supabase access toward backend APIs.

Open concerns:

- Prisma is still using SQLite and needs migration planning for Postgres.
- Mobile still contains Supabase-era assumptions and compatibility code.
- Storage strategy is not yet unified.

### Pass 2 - 2026-04-01

Completed:

- Switched the Prisma datasource configuration from SQLite to PostgreSQL in the schema and migration lock.
- Added shared domain API routes:
- `/api/destinations`
- `/api/stays`
- `/api/events`
- `/api/favorites`
- `/api/bookings`
- `/api/profile`
- Repointed the mobile data/auth compatibility layer away from `/api/mobile/*` routes and onto the shared domain routes.
- Wired mobile account deletion to the shared backend profile delete route instead of the old Supabase RPC path.
- Added `.env.example` with the target Postgres and mobile API variables.

In progress:

- Mobile still has some Supabase-era compatibility wrappers and optional storage placeholders.
- Provider-specific mobile service flows are not fully migrated to backend-first APIs yet.

Open concerns:

- Existing local `.env` values still need to be updated to a real PostgreSQL connection before running Prisma database commands.
- Existing historical SQLite migrations are not a complete production-ready Postgres migration strategy by themselves.
- File/image upload flows still need a final backend-owned storage implementation.

### Pass 3 - 2026-04-05

Completed:

- Added the canonical model mapping document at `docs/OFF2ZIM_CANONICAL_MODEL_MAP.md`.
- Refactored the mobile profile screen away from direct Supabase-style profile reads/writes and onto backend profile helpers.
- Refactored the mobile push drawer profile fetches to use backend profile helpers.
- Kept the mobile visuals unchanged while reducing remaining direct data-source assumptions.
- Made the profile photo path explicit as pending backend storage work instead of leaving it as a hidden dependency.

In progress:

- Provider-specific mobile flows still lean on compatibility layers and are not fully backend-first yet.
- Storage upload/delete is still awaiting the final shared backend storage implementation.

Open concerns:

- The tracker now reflects the target canonical models, but several of them still need proper first-class Prisma models after the Postgres cutover.
- Some legacy compatibility code remains in `Mobile/lib/supabase.ts` to keep the current UI stable during migration.

### Pass 4 - 2026-04-05

Completed:

- Replaced the remaining provider/admin mobile service implementation in `Mobile/services/serviceProvider.ts` so it now talks to the shared Next backend instead of using Supabase-style table and storage access.
- Mapped mobile provider registration, profile updates, verification submission, admin review queue loading, provider verification approval, and provider dashboard analytics onto the canonical backend provider routes.
- Kept the provider and admin mobile screens visually unchanged by preserving the existing service interface and adapting the backend payloads inside the service layer.
- Converted provider listing and order analytics reads to backend API calls and removed the last direct provider/admin content query assumptions from the mobile client service.
- Verified the root source tree again with `npx tsc --noEmit` after clearing stale generated `.next` types.

In progress:

- Provider document upload and content image upload are still temporary placeholders until the shared storage strategy is finalized.
- `Mobile/lib/supabase.ts` still exists as a compatibility shim for older mobile assumptions outside the provider/admin flows.

Open concerns:

- The Prisma datasource is configured for PostgreSQL, but the real local and deployed environments still need the actual `DATABASE_URL` cutover and Prisma migration validation against a live Postgres instance.
- Provider content creation currently maps into canonical provider listings, but the final UX and schema naming for destination/stay/event authoring still need to be consolidated around the shared listing model.
- Storage is still the biggest architectural gap before the Supabase compatibility layer can shrink further.

### Pass 5 - 2026-04-05

Completed:

- Added backend-owned upload infrastructure in `src/lib/uploads.ts` with a local, swappable storage root controlled by `LOCAL_UPLOADS_DIR`.
- Added provider upload endpoints:
- `/api/provider/uploads/documents`
- `/api/provider/uploads/content`
- Added a backend file-serving route at `/api/uploads/[bucket]/[...]` with authorization for provider verification documents.
- Switched the mobile API client to support multipart `FormData` without forcing JSON headers.
- Replaced the provider mobile service's fake upload URLs with real backend multipart uploads for verification documents and provider content media.
- Added `.data` to `.gitignore` and documented `LOCAL_UPLOADS_DIR` in `.env.example`.
- Verified the root source tree with `npx tsc --noEmit`.

In progress:

- Uploaded provider verification documents now persist through the shared backend, but the web onboarding experience still needs to be pointed at the same upload routes.
- The local file storage path is ready for development and controlled environments; a cloud/object storage backend can now replace the storage adapter later without changing the mobile screens.

Open concerns:

- This storage pass uses local filesystem persistence, which is appropriate as a backend-owned transition path but is not yet the final production object-storage design.
- The actual PostgreSQL runtime cutover is still pending because the live `DATABASE_URL` has not yet been switched and validated against Prisma migrations and seeding.
- `Mobile/lib/supabase.ts` still remains as a compatibility shim for other non-provider legacy mobile assumptions.

### Pass 6 - 2026-04-06

Completed:

- Updated the shared web client API helper to support multipart `FormData` without forcing JSON headers.
- Extended the backend auth serialization and web auth types so provider business documents now carry backend file URLs instead of acting like file-only placeholders.
- Refactored the web `ServiceProviderOnboarding` flow to upload real verification files through `/api/provider/uploads/documents` before submitting the provider profile for review.
- Replaced the missing `/dashboard` import path with a lightweight shared explorer dashboard shell so the route is no longer broken.
- Removed a leftover mobile featured-screen dependency on the Supabase compatibility shim.
- Switched mobile image URL normalization to resolve backend upload paths through the shared API base URL instead of relying on Supabase public URL semantics.
- Added `docs/OFF2ZIM_MIGRATION_INVENTORY.md` as the repo-wide implementation map of canonical, transitional, and remaining migration edges.
- Verified the root source tree with `npx tsc --noEmit`.

In progress:

- The repo now has both a canonical model document and a migration inventory, but `Mobile/lib/supabase.ts` still needs to be shrunk route by route until it can be removed.
- Backend-owned uploads are active for provider onboarding and provider mobile flows, but profile avatar uploads still need the same treatment.

Open concerns:

- PostgreSQL is still configured but not yet fully cut over in the active runtime environment.
- Production storage is still undecided; the current local filesystem adapter is an intentional transition layer.
- Some auth/profile types still carry compatibility-shaped fields for UI stability and should be simplified once the last dependent flows are migrated.

### Pass 7 - 2026-04-06

Completed:

- Added a repeatable local Postgres runtime path with `docker-compose.postgres.yml`.
- Added `.env.postgres.example` so the repo has an explicit Postgres-first environment template instead of only SQLite-era local env files.
- Added package scripts for the Postgres lifecycle:
- `db:dev:up`
- `db:dev:down`
- `db:dev:logs`
- `db:bootstrap:postgres`
- `db:reset:postgres`
- Made `prisma/seed.ts` idempotent for local Postgres bootstrap by clearing tourism demo data before reseeding.
- Added `docs/POSTGRES_CUTOVER_PLAYBOOK.md` to document the practical fresh-Postgres bootstrap path and the reasons for using `prisma db push` first.
- Updated the migration inventory to distinguish between local Postgres readiness and the still-pending active runtime cutover.

In progress:

- The repo is now ready for a fresh local Postgres bootstrap, but the active `.env` and `.env.local` files still point to SQLite.
- A clean Postgres-native migration baseline still needs to be established after the first successful Postgres validation pass.

Open concerns:

- The historical Prisma migration SQL was created during the SQLite phase and should not be treated as the final production-grade Postgres migration history.
- We still need one real validation pass against a live Postgres `DATABASE_URL` to confirm auth, provider, booking, and upload flows end to end.
- `Mobile/lib/supabase.ts` remains the main remaining compatibility layer after the database cutover path.

### Pass 8 - 2026-04-06

Completed:

- Switched the active local `.env` and `.env.local` database settings from SQLite to PostgreSQL using the existing local Postgres role.
- Created the `off2zim` database in the running local Postgres server and validated direct connectivity.
- Applied the full current Prisma schema to Postgres and seeded the tourism demo data successfully.
- Replaced the broken `db:bootstrap:postgres`/`db:reset:postgres` implementation with a working generated-SQL bootstrap script at `scripts/bootstrap-postgres.sh`.
- Validated the new bootstrap path end to end with `npm run db:reset:postgres`.
- Verified seeded Postgres counts directly:
- hotels: 2
- activities: 3
- restaurants: 2
- events: 2
- Updated the cutover playbook and migration inventory to reflect the now-validated local Postgres runtime and the Prisma `db push` schema-engine workaround.

In progress:

- The local runtime is now on Postgres, but we still need an app-level validation pass with the Next server running against this live Postgres database.
- A clean Postgres-native Prisma migration baseline still needs to be established after this validated local cutover.

Open concerns:

- Prisma `db push` is still failing opaquely on this machine, so the repo now relies on the generated-SQL bootstrap path for local Postgres setup.
- The local Postgres server is using an existing machine-level role and server rather than the Docker path, because Docker Desktop was not running.
- `Mobile/lib/supabase.ts` is still the main compatibility layer left to shrink after the database cutover.

### Pass 9 - 2026-04-06

Completed:

- Started the app against the live local Postgres runtime and verified the Next server boots cleanly on PostgreSQL.
- Verified the shared destination API against the running app:
- `GET /api/destinations` returned seeded Postgres-backed data successfully.
- Verified shared auth against the running app:
- explorer registration succeeded on Postgres
- explorer login succeeded on Postgres
- Confirmed the earlier failed new-user login checks were caused by parallel validation timing, not an auth bug in the backend.
- Stopped the dev server cleanly after validation to avoid leaving background processes behind.

In progress:

- The local runtime cutover is now proven, but the repo still needs a clean Postgres-native migration baseline to replace the SQLite-era migration history.
- The remaining major consolidation work has shifted away from the database layer and back to shrinking compatibility code and finalizing production storage.

Open concerns:

- Prisma `db push` still has an opaque schema-engine failure on this machine, so the generated-SQL bootstrap path remains the working local standard.
- Docker-based local Postgres is still unverified because Docker Desktop was not running during this pass.
- `Mobile/lib/supabase.ts` remains the largest leftover compatibility layer after the successful Postgres cutover.

### Pass 10 - 2026-04-06

Completed:

- Added the first safe merge wave from the legacy Supabase-style schema into the canonical Prisma schema:
- `Destination`
- `Favorite`
- `StayGallery`
- `EventTicket`
- `EventGallery`
- Added optional destination relations to the current `Hotel`, `Activity`, `Restaurant`, and `Event` models.
- Updated the Postgres seed so the new canonical tables are populated with:
- 2 destinations
- 4 stay gallery records
- 2 event tickets
- 4 event gallery records
- Moved `/api/favorites` onto the real Prisma `Favorite` model with automatic migration from the old preference-based favorite storage.
- Updated destination aggregation to prefer first-class `Destination` rows when present and fall back to derived location aggregation only when needed.
- Rebuilt and reseeded the live local Postgres database successfully with the expanded schema.
- Verified the new merged Postgres tables directly:
- destinations: 2
- event_tickets: 2
- event_gallery: 4
- stay_gallery: 4
- Updated the canonical model map and migration inventory to reflect that these models are now active, not just candidates.

In progress:

- The schema now contains the first merged legacy concepts, but the remaining “stays” and “profiles” legacy tables still need careful consolidation instead of direct copying.
- Favorites now use a real table, but older preference-stored favorites will only migrate as users interact with the API.

Open concerns:

- We still need to decide whether `Hotel`/`Room` remains the canonical stay model or whether a future `Stay`/`StayRoom` layer should replace it.
- Destination reads now prefer real `Destination` rows, but more route-level adoption is still possible as other areas start consuming first-class destination relations.
- `Mobile/lib/supabase.ts` remains the biggest remaining compatibility surface after this schema merge.

### Pass 11 - 2026-04-06

Completed:

- Updated the shared mobile/backend stay serializer to prefer first-class `StayGallery` rows over legacy `images` arrays while preserving the exact mobile response shape.
- Updated the shared mobile/backend event serializer to prefer first-class `EventGallery` and `EventTicket` rows over synthesized fallback values.
- Added destination relation projection to stay/event payloads so shared APIs now return canonical destination metadata when available.
- Removed the mobile favorites utility's dependency on `supabase.auth.getUser()` and pointed it directly at the backend-backed session store in `Mobile/lib/api.ts`.

In progress:

- The mobile compatibility shim still exists, but more of the runtime behavior now flows through canonical backend tables rather than shimmed assumptions.
- Destination detail routes still resolve through the shared aggregate adapter rather than dedicated direct-read serializers.

Open concerns:

- `Mobile/lib/supabase.ts` is still present for older compatibility edges even though favorites no longer depend on its auth helper.
- Stay/event payloads still preserve some legacy fields for UI stability, so the transport contract remains broader than the canonical database models.
- We still need a clean Postgres-native Prisma migration baseline to replace the generated-SQL bootstrap workaround.

### Pass 12 - 2026-04-06

Completed:

- Removed `Mobile/context/AuthContext.tsx`'s dependency on the Supabase compatibility shim and moved it fully onto backend-native session/auth primitives from `Mobile/lib/api.ts`.
- Added a shared backend response type at `Mobile/types/backend.ts` so destination screens no longer need shim-owned table typings.
- Removed `Mobile/app/screens/DestinationDetail.tsx`'s type-only import from `Mobile/lib/supabase.ts`.

In progress:

- `Mobile/lib/supabase.ts` is now isolated to the dedicated auth screen's legacy verification/resend UX and no longer participates in normal session hydration or destination browsing flows.
- The auth screen still exposes legacy verification affordances even though the shared backend currently returns stubbed verification/reset behavior.

Open concerns:

- `Mobile/app/auth.tsx` remains the last direct runtime import of `Mobile/lib/supabase.ts`.
- The email verification UI path is still compatibility-shaped and should either be backed by a real backend flow or removed in a future product pass.
- Password reset remains intentionally unsupported in the shared mobile backend.

### Pass 13 - 2026-04-06

Completed:

- Brought the mobile sign-up flow closer to the PRD by adding explicit `Local` / `Foreign` explorer selection in the mobile auth screen.
- Replaced placeholder provider registration payloads with real mobile form capture for:
- business name
- trading name
- business registration number
- main contact person
- business phone
- physical address
- Updated the mobile auth context to submit those real provider fields and explorer type to the shared backend registration route.
- Removed the misleading mobile sign-up copy that claimed a verification code was being sent even though the current shared backend signs the user in immediately.
- Added explorer type into the mobile auth user metadata mapping so the mobile session shape now preserves that PRD field.

In progress:

- Mobile authentication now reflects the currently supported backend registration model more accurately, but the social and verification affordances still need either real backend support or UI cleanup.

Open concerns:

- Mobile still shows social sign-up options, but they are not yet wired to real backend OAuth flows.
- The dedicated verification/resend flow in `Mobile/app/auth.tsx` still depends on compatibility stubs and does not represent a production-ready verification backend.
- Password reset remains unsupported in the shared mobile backend and still needs a real implementation if it is required by the PRD.

### Pass 14 - 2026-04-06

Completed:

- Added shared backend email verification and password reset routes for mobile and web:
- `/api/auth/verify-email/request`
- `/api/auth/verify-email/confirm`
- `/api/auth/password-reset/request`
- `/api/auth/password-reset/confirm`
- Added token lifecycle helpers for verification and password reset in `src/lib/auth-tokens.ts`.
- Added shared auth email delivery helpers in `src/lib/auth-email.ts` with fallback URLs when outbound email is not configured.
- Updated the register route so new accounts trigger a real verification flow instead of fake mobile verification messaging.
- Wired the mobile auth stack to backend-backed password reset requests and verification-aware session mapping.
- Updated the mobile auth screen so sign-up now surfaces real verification next steps and forgot-password now starts a real reset flow.
- Updated the mobile profile screen so password reset now uses the shared backend instead of a stub.
- Added email delivery environment variables to `.env.example`.

In progress:

- Mobile and web now share real verification and password reset endpoints, but the resend-verification affordance is not yet surfaced prominently in the signed-in mobile UI.

Open concerns:

- Social login remains intentionally deferred and is still not wired to backend OAuth.
- If `RESEND_API_KEY` and `AUTH_EMAIL_FROM` are not configured, verification and password reset fall back to direct links instead of delivered emails.
- `Mobile/app/auth.tsx` still carries now-unused legacy verification styles that can be cleaned up in a future pass without affecting behavior.

## Verification Checklist

- Auth works on web and mobile against the same backend flow
- Session hydration works on web and mobile
- Profile read/update works from one backend source
- Favorites read/write works from one backend source
- Destination/stay/event reads come from backend APIs
- Booking creation/read/update/delete comes from backend APIs
- Provider listing/admin review flows use one backend model
- Prisma runs against Postgres
- Temporary compatibility shims are identified and shrinking

## Next Recommended Pass

- Progress `OMN-7` by establishing a clean Postgres-native Prisma migration baseline now that the live local Postgres runtime is validated.
- Continue `OMN-12` by reusing the new backend upload routes from the web onboarding/profile flows and deciding whether production storage lands on Supabase Storage or another object-store backend.
- Continue `OMN-10` by shrinking `Mobile/lib/supabase.ts` to only the remaining unsupported compatibility edges, then remove those edges route by route using `docs/OFF2ZIM_MIGRATION_INVENTORY.md` as the implementation map.
- Start the next schema consolidation decision: either keep `Hotel`/`Room` as canonical stays or plan a controlled migration toward a real `Stay`/`StayRoom` model.
