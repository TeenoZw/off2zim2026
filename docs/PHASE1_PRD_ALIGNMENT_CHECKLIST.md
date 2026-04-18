# Phase 1 PRD Alignment Checklist

This checklist keeps the project aligned to the PRD's Phase 1 / MVP scope.

Reference source:
- [docs/PRD](/Users/tinotendamutami/Off2Zim/off2zim-v.3/docs/PRD)

## Working Rule

Until Phase 1 is fully closed, new work should satisfy one of these conditions:
- Directly implements a missing Phase 1 / MVP requirement from the PRD
- Fixes a bug or regression in an already implemented Phase 1 feature
- Improves stability, data integrity, or deployment readiness for a Phase 1 feature

Work that belongs to Phase 2 or Phase 3 should be deferred unless it is required to unblock a Phase 1 acceptance criterion.

## Phase 1 Scope From The PRD

PRD Phase 1 includes:
- Public website with core discovery flows
- E-Commerce Seller onboarding and verification
- Listings creation and management
- Booking request and confirmation flow
- Admin management panel

Acceptance criteria:
- A user can discover, view, and request/book an experience
- A supplier can create, update, and manage availability for a listing
- An admin can approve suppliers, manage listings, and view bookings
- Payments can be processed or recorded successfully

## Current Status

### 1. Public discovery flows

Status: `In place`

Implemented:
- Public marketplace discovery and detail pages
- Hotels and activities pages reading from the shared provider listing backend
- Trip planner search and listing detail pages wired to live listing APIs
- Homepage search handoff into live marketplace and trip planner routes

Key surfaces:
- `/marketplace`
- `/marketplace/[slug]`
- `/hotels`
- `/activities`
- `/trip-planner/search`
- `/trip-planner/listing/[id]`

### 2. Provider onboarding and verification

Status: `In place for MVP`

Implemented:
- API-backed registration and session auth
- Core provider company profile
- Internal admin review workflow before provider approval
- Provider verification status and review submission UI
- Admin provider review workspace
- Admin audit log entries for provider review actions

Key routes and surfaces:
- `/api/auth/*`
- `/api/provider/company`
- `/api/provider/company/review`
- `/api/admin/providers`
- `/api/admin/providers/[companyId]/review`
- `/provider-dashboard`
- `/admin/providers`

### 3. Listings creation and management

Status: `In place for MVP`

Implemented:
- Provider listing creation and update
- Category-driven listing model
- Public/private visibility and listing status handling
- Availability support in provider listing payloads
- Public catalog reads from provider listings

Key routes and surfaces:
- `/api/provider/listings`
- `/api/provider/listings/[id]`
- `/api/listings`
- `/api/listings/[slug]`
- Provider listing management in `/provider-dashboard`

### 4. Booking request and confirmation flow

Status: `In place for MVP`

Implemented:
- Booking request and instant booking flow from live listing pages
- Booking creation tied to provider companies and provider listings
- Explorer booking history
- Provider order management
- Admin booking oversight
- Booking success page backed by live confirmation data
- Booking disputes for explorers, providers, and admins

Key routes and surfaces:
- `/api/listings/[slug]/book`
- `/api/bookings`
- `/api/bookings/[confirmation]`
- `/api/provider/orders`
- `/api/provider/orders/[id]`
- `/api/admin/bookings`
- `/api/admin/bookings/[id]`
- `/booking/success`
- `/provider-dashboard`
- `/admin/bookings`
- `/admin/disputes`

### 5. Payments

Status: `In place for MVP, still needs production hardening`

Implemented:
- Payment intent creation
- Payment confirmation handling
- Mobile money payment handling
- Payment status written back to booking records
- Admin booking view includes payment state

Key routes and services:
- `/api/payments/create-intent`
- `/api/payments/confirm`
- `/api/payments/mobile-money`
- `src/services/BookingService.ts`

Remaining Phase 1 concern:
- Production-grade payment provider configuration and final end-to-end QA

### 6. Admin management panel

Status: `Partially complete`

Implemented:
- Provider approval workspace
- Booking oversight workspace
- Dispute operations workspace
- Admin audit logs at the backend level

Still missing for cleaner PRD alignment:
- Admin listing management workspace
- Admin category management workspace

Note:
- Listings are indirectly managed today through provider tools and public listing APIs, but the PRD explicitly calls out admin listing management.

## Phase 1 Gaps To Prioritize Next

These are the highest-value remaining tasks if we stay strict about PRD Phase 1:

1. Admin listing management
- Review, pause, activate, or archive provider listings from an admin workspace
- Search and filter across all provider listings

2. Admin category management
- Even a lightweight MVP surface or config path for category oversight would align better with the PRD

3. Payment hardening and QA
- Confirm the booking-to-payment lifecycle is stable in the intended runtime
- Validate recorded payment states across explorer, provider, and admin views

4. Deployment and setup readiness
- Ensure deliverables in the PRD are tidy:
- Deployment instructions
- Database schema documentation
- Admin setup / credentials guidance

## Explicitly Deferred Until After Phase 1

These are in the PRD, but should not drive current build decisions unless they unblock MVP:
- Social login
- Reviews and ratings
- Advanced supplier analytics
- Featured / boosted listing tools
- Commission configuration
- Email notifications and reminders
- Community Guide / Ask a Local / Guide+
- Partner APIs
- B2B and group coordination

## Decision Filter For Future Work

Before starting new implementation work, ask:
- Does this close a Phase 1 acceptance criterion?
- Does this fix a broken Phase 1 flow?
- Does this improve deployment readiness for Phase 1?

If the answer is no, it should usually wait.
