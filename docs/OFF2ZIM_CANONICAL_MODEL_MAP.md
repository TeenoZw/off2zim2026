# Off2Zim Canonical Model Map

Last updated: 2026-04-05

## Purpose

This document maps the old mobile/Supabase-shaped concepts to the target single-source-of-truth Prisma/backend model.

The goal is:

- one schema
- one backend-owned data contract
- no direct frontend-to-database access

## Canonical Ownership

- Canonical schema owner: `prisma/schema.prisma`
- Canonical runtime owner: Next.js backend/API routes under `src/app/api/*`
- Canonical business rules: backend utilities/services under `src/lib/*` and `src/services/*`
- Frontend role: consume HTTP contracts only

## Entity Mapping

### Auth User

Current sources:

- Web auth/session model in Prisma + backend routes
- Legacy mobile Supabase auth semantics and `user_metadata`

Canonical target:

- `User`
- `Session`

Notes:

- Mobile UI may still consume a compatibility-shaped `user_metadata` object, but backend auth is the source of truth.
- Long term, mobile screens should consume explicit typed user/profile payloads rather than Supabase-like session objects.

### Profile

Current sources:

- Legacy mobile `profiles` table assumptions
- Partial user fields in Prisma `User`
- Compatibility storage in `User.preferences.mobileProfile`

Canonical target:

- `User` core fields:
- `email`
- `firstName`
- `lastName`
- `name`
- `phone`
- `nationality`
- `image`
- optional structured profile extension stored in backend-owned format until a dedicated Prisma profile model is introduced

Recommendation:

- Short term: keep backend-owned profile shape via `/api/profile`
- Medium term: introduce a dedicated Prisma `UserProfile` model if profile complexity keeps growing

### Favorites

Current sources:

- Legacy mobile `favorites` table assumptions
- Backend compatibility stored in `User.preferences.favorites`

Canonical target:

- Short term: backend-owned favorites stored in user preferences and exposed via `/api/favorites`
- Medium term: Prisma `Favorite` model if we need richer querying, analytics, uniqueness guarantees, or joins

Recommendation:

- Add a real Prisma `Favorite` model in a later migration once Postgres is active

### Destinations

Current sources:

- Legacy mobile `destinations` table assumptions
- Web/static content
- Derived backend aggregation from hotels, activities, restaurants, and events

Canonical target:

- Dedicated Prisma `Destination` model

Interim state:

- Backend derives destination responses from current tourism entities

Recommendation:

- Introduce first-class `Destination` records once Postgres migration is complete

### Stays

Current sources:

- Legacy mobile `stays`, `stay_rooms`, `stay_gallery`
- Current Prisma `Hotel` and `Room`

Canonical target:

- `Hotel`
- `Room`

Possible rename later:

- `Hotel` can remain as the underlying schema model while API contracts expose the concept as `stay`

### Activities

Current sources:

- Legacy mobile activity/provider assumptions
- Current Prisma `Activity`

Canonical target:

- `Activity`

### Restaurants

Current sources:

- Web/static restaurant flows
- Prisma `Restaurant`

Canonical target:

- `Restaurant`

### Events

Current sources:

- Legacy mobile `events`, `event_tickets`, `event_gallery`
- Current Prisma `Event`

Canonical target:

- `Event`

Recommendation:

- Add normalized event ticket and gallery models if those concepts need to become first-class in the backend

### Bookings

Current sources:

- Legacy mobile `stays_bookings`
- Web/backend `Booking`
- Payments coupled through backend services

Canonical target:

- `Booking`
- `Payment`

Notes:

- The backend should expose booking-type-specific serializers as needed
- The storage format should not leak database-specific table shapes into mobile UI

### Provider Company

Current sources:

- Legacy mobile `service_providers` assumptions
- Backend Prisma `ProviderCompany`

Canonical target:

- `ProviderCompany`
- `ProviderDocument`
- `ProviderVerificationReview`

### Listings

Current sources:

- Backend Prisma provider listing system
- Partial mobile provider content assumptions

Canonical target:

- `ProviderListing`
- `ListingAvailability`

### Admin Review and Moderation

Current sources:

- Backend provider/admin routes
- Legacy mobile provider review assumptions

Canonical target:

- backend-only moderation workflows using:
- `ProviderVerificationReview`
- `AdminAuditLog`
- `Dispute`

## API Contract Direction

Canonical shared routes:

- `/api/auth/*`
- `/api/profile`
- `/api/favorites`
- `/api/bookings`
- `/api/destinations`
- `/api/stays`
- `/api/events`
- `/api/provider/*`
- `/api/admin/*`

Temporary compatibility routes:

- `/api/mobile/*`

Target:

- `/api/mobile/*` should shrink and eventually disappear once all mobile calls use the shared domain routes directly.

## Technical Debt to Remove

- Supabase-shaped mobile session assumptions
- direct frontend-to-database mental model
- compatibility storage hacks in user preferences where dedicated Prisma models are better
- duplicate provider/content assumptions between legacy mobile and backend models

## Next Schema Candidates After Postgres Cutover

- `UserProfile`
- `Favorite`
- `Destination`
- `StayImage` or generalized media model
- `EventTicket`
- `EventMedia`

