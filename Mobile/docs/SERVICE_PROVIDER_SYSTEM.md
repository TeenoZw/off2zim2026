# Service Provider Platform Implementation Guide

This document outlines the complete multi-tenant service provider system for your tourism app, allowing businesses to manage their own content while maintaining quality control.

## 🏗️ System Architecture

### Database Schema

The system adds a multi-tenant layer to your existing tourism platform:

```
Users (auth.users)
├── Profiles (role: user/provider/admin)
├── Service Providers (business info & verification)
│   ├── Destinations (provider-owned)
│   ├── Stays (provider-owned)
│   └── Events (provider-owned)
└── Content Reviews (approval workflow)
```

## 📋 Implementation Steps

### 1. Database Migration

Run the migration file to add service provider functionality:

```sql
-- Apply the migration
\i supabase/migrations/005_service_providers.sql
```

This creates:

- `service_providers` table
- `content_reviews` table
- Adds `provider_id` and approval fields to existing tables
- Updates RLS policies for multi-tenant access
- Creates indexes for performance

### 2. Storage Buckets

Create Supabase storage buckets for:

```bash
# In Supabase dashboard, create these buckets:
verification-documents  # For business verification docs
content-images         # For provider-uploaded content images
provider-logos         # For business logos
```

Set appropriate RLS policies for each bucket.

### 3. User Roles & Permissions

The system supports three user roles:

- **User**: Regular app users (default)
- **Provider**: Service providers who can manage content
- **Admin**: Platform administrators who approve content

### 4. Provider Registration Flow

1. User completes provider registration form (`/provider-register`)
2. Business information is stored with `verification_status: 'pending'`
3. Provider uploads verification documents (`/provider-verification`)
4. Admin reviews and approves/rejects verification
5. Verified providers can create and manage content

## 🎯 Key Features

### For Service Providers

**Dashboard** (`/provider/dashboard`)

- Business overview and statistics
- Content management shortcuts
- Verification status
- Quick actions

**Content Management**

- Create destinations, stays, and events
- Upload images and manage descriptions
- Track approval status
- Edit existing content

**Verification System**

- Upload business documents
- Track verification progress
- Resubmit if rejected

### For Administrators

**Content Review** (`/admin/content-review`)

- Review pending content submissions
- Approve, reject, or request changes
- Leave review notes
- Track review history

**Provider Management**

- Verify new providers
- Manage provider status
- View business documents

## 🔐 Security & Access Control

### Row Level Security (RLS)

All tables use RLS policies to ensure:

- Providers can only access their own content
- Only approved content is visible to public
- Admins have full access
- Users can only see approved content

### Content Approval Workflow

1. Provider creates content → Status: `draft`
2. Provider submits for review → Status: `pending_review`
3. Admin reviews content:
   - Approve → Status: `approved` (visible to public)
   - Reject → Status: `rejected` (with reason)
   - Request changes → Status: `changes_requested`

## 📱 UI Components

### Provider Components

- `ProviderDashboard` - Main dashboard with stats and navigation
- `ProviderRegistration` - Business registration form
- `ProviderVerification` - Document upload interface

### Admin Components

- `AdminContentReview` - Content approval interface
- `AdminProviderManagement` - Provider verification

### User Components

The existing user interface continues to work, now showing only approved content from verified providers.

## 🔧 Services

### ServiceProviderService

```typescript
// Register new provider
serviceProviderService.register(providerData);

// Get current provider profile
serviceProviderService.getCurrentProvider();

// Upload verification documents
serviceProviderService.uploadVerificationDocument(file, fileName);

// Submit for verification
serviceProviderService.submitForVerification(documentUrls, notes);
```

### ProviderContentService

```typescript
// Create content
providerContentService.createDestination(data);
providerContentService.createStay(data);
providerContentService.createEvent(data);

// Manage content
providerContentService.getMyDestinations();
providerContentService.updateDestination(id, updates);
```

### ContentReviewService

```typescript
// Admin functions
contentReviewService.getPendingReviews();
contentReviewService.reviewContent(reviewId, approved, notes);

// Provider functions
contentReviewService.getMyReviews();
```

## 🚀 Getting Started

### 1. Apply Database Changes

```bash
# Run the migration
supabase db reset
# or
supabase migration up
```

### 2. Set up Storage

Create the required storage buckets in your Supabase dashboard with appropriate RLS policies.

### 3. Update Environment

Ensure your app has the necessary permissions for:

- Document uploads
- Image management
- File access

### 4. Navigation Setup

Add routes for provider functionality:

```typescript
// Add to your app router
/provider-register     // Provider registration
/provider-verification // Document upload
/admin/content-review  // Admin review panel
```

### 5. Update Existing Services

Update your existing `database.ts` service to respect the new approval system:

```typescript
// Only show approved content to regular users
const { data, error } = await supabase
  .from('destinations')
  .select('*')
  .eq('approval_status', 'approved');
```

## 🎨 Customization

### Business Types

Modify the `business_type` enum in the schema to match your market:

```sql
-- Add new business types
ALTER TYPE business_type ADD VALUE 'restaurant';
ALTER TYPE business_type ADD VALUE 'car_rental';
```

### Approval Workflow

Customize the approval workflow by:

- Adding more status types
- Implementing auto-approval for verified providers
- Adding category-specific review processes

### Content Guidelines

Create content guidelines by:

- Adding validation rules
- Implementing image quality checks
- Setting content standards

## 📊 Analytics & Monitoring

### Provider Analytics

Track key metrics:

- Content approval rates
- Revenue generated
- Booking conversions
- Customer ratings

### Platform Analytics

Monitor:

- Provider registration trends
- Content quality scores
- Review processing times
- User engagement with provider content

## 🔄 Migration Strategy

### From Manual to Provider-Managed

1. **Identify existing content owners**
2. **Create provider accounts for existing businesses**
3. **Transfer content ownership**
4. **Set up approval workflows**
5. **Train providers on the system**

### Data Migration Script

```sql
-- Example: Transfer existing destinations to providers
UPDATE destinations
SET provider_id = (
  SELECT id FROM service_providers
  WHERE business_name = destinations.owner_name
),
approval_status = 'approved'
WHERE provider_id IS NULL;
```

## 🛠️ Maintenance

### Regular Tasks

- Review pending verifications
- Monitor content quality
- Update provider guidelines
- Backup verification documents

### Performance Optimization

- Index provider_id columns
- Cache approved content
- Optimize image uploads
- Monitor database performance

## 📞 Support

### For Providers

- Document upload troubleshooting
- Content creation guidance
- Verification process help
- Technical support

### For Admins

- Review workflow training
- Content quality guidelines
- Provider management tools
- Analytics dashboards

---

This system provides a complete foundation for allowing service providers to manage their own content while maintaining quality control through the approval workflow. The modular design allows for easy customization and scaling as your platform grows.
