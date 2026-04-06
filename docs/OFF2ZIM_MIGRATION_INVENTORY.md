# Off2Zim Migration Inventory

Last updated: 2026-04-06

## Purpose

This document is the concrete implementation map for the architecture consolidation. It answers:

- what is already on the shared backend
- what is still transitional
- what still depends on compatibility layers
- what the next high-value migration cuts should be

## Target Summary

Target architecture:

- Web client: Next.js frontend
- Mobile client: Expo frontend
- Backend: Next.js route handlers and backend utilities
- Database: PostgreSQL
- ORM: Prisma
- Auth: shared backend session token model
- Files: backend-owned uploads, currently local filesystem-backed

## Canonical Paths Already In Place

### Shared auth and session

Canonical routes:

- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/session/route.ts`
- `src/app/api/auth/logout/route.ts`

Consumers:

- `src/contexts/AuthContext.tsx`
- `Mobile/context/AuthContext.tsx`
- `Mobile/lib/supabase.ts` (compatibility-shaped wrapper over backend auth)

Status:

- Shared backend auth is active for both web and mobile.

### Shared core data APIs

Canonical routes:

- `src/app/api/destinations/route.ts`
- `src/app/api/destinations/[id]/route.ts`
- `src/app/api/stays/route.ts`
- `src/app/api/stays/[id]/route.ts`
- `src/app/api/events/route.ts`
- `src/app/api/events/[id]/route.ts`
- `src/app/api/favorites/route.ts`
- `src/app/api/bookings/route.ts`
- `src/app/api/profile/route.ts`

Consumers:

- `Mobile/services/database.ts`
- web pages and components through `src/lib/client-api.ts`

Status:

- Shared backend APIs are active.
- Mobile data services for explorer flows already read and write through these routes.

### Shared provider/admin backend

Canonical routes:

- `src/app/api/provider/company/route.ts`
- `src/app/api/provider/company/review/route.ts`
- `src/app/api/provider/listings/route.ts`
- `src/app/api/provider/listings/[id]/route.ts`
- `src/app/api/provider/orders/route.ts`
- `src/app/api/admin/providers/route.ts`
- `src/app/api/admin/providers/[companyId]/review/route.ts`

Consumers:

- `src/components/provider-dashboard/*`
- `src/components/auth/ServiceProviderOnboarding.tsx`
- `Mobile/services/serviceProvider.ts`
- `Mobile/app/provider-register.tsx`
- `Mobile/app/provider-verification.tsx`
- `Mobile/app/provider/dashboard.tsx`
- `Mobile/app/admin/content-review.tsx`

Status:

- Shared provider/admin backend is active for web and mobile.

### Shared backend-owned uploads

Canonical backend:

- `src/lib/uploads.ts`
- `src/app/api/provider/uploads/documents/route.ts`
- `src/app/api/provider/uploads/content/route.ts`
- `src/app/api/uploads/[bucket]/[...segments]/route.ts`

Consumers:

- `src/components/auth/ServiceProviderOnboarding.tsx`
- `Mobile/services/serviceProvider.ts`
- `Mobile/utils/imageUtils.ts`

Status:

- Backend upload flow is active.
- Current storage adapter is local filesystem-backed through `LOCAL_UPLOADS_DIR`.
- The storage interface is ready to swap to object storage later.

## Transitional Layers Still Present

### Mobile Supabase compatibility shim

Files:

- `Mobile/lib/supabase.ts`

Why it still exists:

- Some mobile screens still expect Supabase-like auth/table/storage APIs.
- The shim now proxies a smaller set of calls into backend routes.

Current supported compatibility surfaces:

- `auth.getSession`
- `auth.getUser`
- `auth.signInWithPassword`
- `auth.signUp`
- `auth.signOut`
- `auth.updateUser`
- `from('profiles')`
- `from('favorites')` delete path
- `from('destinations')` select path
- `rpc('delete_account_and_data')`

Remaining gaps inside the shim:

- password reset still returns a not-supported response
- generic storage upload/remove is still not a real backend bridge
- arbitrary table access is intentionally unsupported

### Compatibility-shaped mobile auth metadata

Files:

- `Mobile/lib/supabase.ts`
- `Mobile/context/AuthContext.tsx`

Status:

- Mobile still consumes a `user_metadata` shape for UI stability.
- The data now originates from the backend, but the shape is still compatibility-oriented rather than fully domain-typed.

### Web auth profile projection

Files:

- `src/lib/auth.ts`
- `src/contexts/AuthContext.tsx`
- `src/types/auth.ts`

Status:

- Web auth state now projects backend provider documents into `businessDocuments`.
- This is correct for the current UI, but long term the web auth context should probably stop acting as a document transport layer for provider onboarding.

## Remaining Architecture Gaps

### 1. Real PostgreSQL runtime cutover

Current state:

- `prisma/schema.prisma` uses `postgresql`
- `prisma/migrations/migration_lock.toml` uses `postgresql`
- repo now includes a local Postgres bootstrap path:
  - `docker-compose.postgres.yml`
  - `.env.postgres.example`
  - `npm run db:dev:up`
  - `npm run db:bootstrap:postgres`
- the active local environment files have now been switched to Postgres values
- the local `off2zim` Postgres database has been created, schema-applied, and seeded successfully

Still needed:

- decide whether to standardize on Docker or the existing local Postgres instance for team onboarding
- establish a clean Postgres-native Prisma migration baseline after the successful local cutover
- continue route-by-route verification for provider, booking, and upload flows on the live Postgres runtime

### 2. First-class Prisma models still deferred

Completed in the current schema:

- `Favorite`
- `Destination`
- `StayGallery`
- `EventTicket`
- `EventGallery`

Current temporary/canonical-enough approach:

- destination responses still keep a derived-data fallback for resilience
- some legacy favorite data may still exist in user preference payloads until touched and migrated through the API

Likely future first-class models:

- possibly richer gallery/media models for listings, events, and stays
- `StayRoom` if we decide to fully absorb the old `stay_rooms` concept into the canonical backend model

### 3. Remaining mobile compatibility dependencies

Known remaining edges:

- `Mobile/lib/supabase.ts`
- any mobile screen or utility that still imports the compatibility shim instead of a backend service directly

Confirmed current examples:

- compatibility auth/table usage remains available for older mobile flows
- direct shim dependency was removed from `Mobile/app/screens/Featured.tsx`
- direct shim dependency was removed from `Mobile/utils/favoritesUtils.ts`
- direct shim dependency was removed from `Mobile/context/AuthContext.tsx`
- direct shim dependency was removed from `Mobile/app/screens/DestinationDetail.tsx`

### 4. Profile media and generalized storage unification

Current state:

- provider document and provider content uploads are backend-owned
- profile photo upload still remains a deferred/shared-storage task

Still needed:

- add backend upload route for user avatars/profile media
- update web/mobile profile screens to use the same upload contract

### 5. Production storage adapter decision

Current state:

- uploads are backend-owned but locally persisted

Still needed:

- decide production object storage target
- recommended candidates:
- Supabase Storage as infrastructure only
- Cloudinary
- S3-compatible object storage

Migration constraint:

- do not change frontend contracts; swap storage behind `src/lib/uploads.ts`

## File-by-File Practical Status

### Mobile

- `Mobile/services/database.ts`: canonical backend client for explorer flows
- `Mobile/services/serviceProvider.ts`: canonical backend client for provider/admin mobile flows
- `Mobile/lib/api.ts`: canonical mobile HTTP/session layer
- `Mobile/lib/supabase.ts`: transitional compatibility layer, shrinking
- `Mobile/utils/imageUtils.ts`: now resolves backend upload URLs instead of Supabase public URLs

### Web

- `src/lib/client-api.ts`: canonical web HTTP client
- `src/contexts/AuthContext.tsx`: shared auth context, still carries some compatibility-profile shaping
- `src/components/auth/ServiceProviderOnboarding.tsx`: now uses real backend upload routes
- `src/components/provider-dashboard/*`: uses canonical provider/admin backend routes

### Backend

- `src/lib/auth.ts`: canonical auth/session serialization
- `src/lib/platform.ts`: canonical provider/listing/order serializers
- `src/lib/uploads.ts`: canonical upload adapter
- `src/app/api/*`: canonical runtime contract layer

## Recommended Next Cuts

### Cut 1: Live Postgres cutover

Goal:

- move from configuration-only Postgres readiness to actual Postgres runtime usage

Tasks:

- set real `DATABASE_URL`
- run Prisma commands against Postgres
- validate auth, profile, provider, booking, and listing routes

### Cut 2: Remove more of `Mobile/lib/supabase.ts`

Goal:

- reduce mobile compatibility surface to near-zero

Tasks:

- inventory exact remaining imports of `@/lib/supabase`
- replace each with direct backend service or typed auth helper
- delete unsupported table/storage branches once unused

### Cut 3: Profile avatar upload unification

Goal:

- make user profile media backend-owned just like provider documents

Tasks:

- add avatar upload route
- persist avatar reference in backend profile model
- update mobile and web profile screens to use it

### Cut 4: Decide production storage backend

Goal:

- replace local filesystem storage with deploy-safe object storage

Tasks:

- select provider
- adapt `src/lib/uploads.ts`
- keep existing `/api/provider/uploads/*` and `/api/uploads/*` contracts unchanged
