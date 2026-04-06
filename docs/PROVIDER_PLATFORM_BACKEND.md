# Provider Platform Backend

This backend slice aligns Off2Zim more closely to the PRD's multi-role marketplace model.

## What Was Added

- Real API-backed auth instead of local-only mock login/register
- Provider company onboarding stored in Prisma
- Internal provider verification reviews for Off2Zim admins
- One-business-many-services listing model
- Listing availability support
- Provider order feed tied to company-owned listings
- Admin audit log and dispute-ready schema foundations

## Main Domain Models

- `User`
  - Stores role, password hash, verification status, explorer type, and explorer score
- `ProviderCompany`
  - Core company profile required for provider onboarding
- `ProviderDocument`
  - Tracks uploaded business and compliance documents
- `ProviderVerificationReview`
  - Internal review trail for basic review and premium verification
- `ProviderListing`
  - Category-driven listing entity for accommodation, experiences, shopping, transport, and dining
- `ListingAvailability`
  - Availability/calendar support for provider-managed listings
- `Booking`
  - Extended to point to provider companies and provider listings
- `Dispute`
  - Foundation for traveler/provider/admin dispute handling
- `AdminAuditLog`
  - Audit trail for admin review actions

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `GET /api/provider/company`
- `PATCH /api/provider/company`
- `POST /api/provider/company/review`
- `GET /api/provider/listings`
- `POST /api/provider/listings`
- `PATCH /api/provider/listings/[id]`
- `GET /api/provider/orders`
- `GET /api/admin/providers`
- `POST /api/admin/providers/[companyId]/review`

## Frontend Surfaces Connected

- Provider dashboard company profile
- Provider verification status and review submission
- Provider listing management and quick listing creation
- Admin provider review workspace
- Auth context now hydrates from backend session routes

## Notes

- Demo accounts are auto-seeded on first login attempt if the database is empty.
- Existing tourism content models remain in place, so the legacy booking/catalogue features can coexist while the marketplace model is expanded.
- The next logical step is to connect public listing discovery pages and booking creation directly to `ProviderListing` records.
