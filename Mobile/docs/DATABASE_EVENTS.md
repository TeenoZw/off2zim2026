# Events Database Structure

This document describes the database structure for events, similar to how stays are structured with linked tables.

## Table Overview

### 1. `events` (Main Table)

The primary events table containing core event information.

```sql
CREATE TABLE public.events (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  description text,
  location text NOT NULL,
  venue text,
  destination_id uuid REFERENCES destinations(id),

  -- Date & Time
  start_date timestamp with time zone,
  start_time text,
  end_time text,
  end_date timestamp with time zone,

  -- Pricing & Ratings
  ticket_price decimal(10,2),
  rating decimal(2,1) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  currency text DEFAULT 'USD',

  -- Event Details
  category text,
  tags text[],
  organizer jsonb,
  capacity integer,
  tickets_available integer,
  age_restriction text,
  accessibility text[],

  -- Media
  image_url text,
  images text[],

  -- Status
  featured boolean DEFAULT false,

  -- Timestamps
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);
```

### 2. `event_tickets` (Linked Table)

Different ticket types and pricing for each event (similar to `stay_rooms`).

```sql
CREATE TABLE public.event_tickets (
  id uuid PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,

  -- Ticket Info
  ticket_type text NOT NULL,  -- 'general_admission', 'vip', 'early_bird'
  name text NOT NULL,          -- Display name
  description text,

  -- Pricing
  base_price decimal(10,2) NOT NULL,
  original_price decimal(10,2),  -- For showing discounts
  currency text DEFAULT 'USD',

  -- Availability
  total_tickets integer,       -- NULL = unlimited
  tickets_sold integer DEFAULT 0,
  tickets_available integer,   -- Auto-calculated

  -- Restrictions
  min_purchase integer DEFAULT 1,
  max_purchase integer DEFAULT 10,

  -- Benefits
  perks text[],               -- ['Free Drink', 'Meet & Greet']

  -- Validity
  sale_start_date timestamp with time zone,
  sale_end_date timestamp with time zone,
  is_active boolean DEFAULT TRUE,

  -- Timestamps
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);
```

**Auto-calculation trigger**: `tickets_available` is automatically calculated as `total_tickets - tickets_sold`.

### 3. `event_gallery` (Linked Table)

Gallery images for events organized by category (similar to `stay_gallery`).

```sql
CREATE TABLE public.event_gallery (
  id uuid PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,

  -- Image Info
  image_url text NOT NULL,
  thumbnail_url text,
  caption text,
  alt_text text,

  -- Categorization
  category text,  -- 'venue', 'performer', 'stage', 'promo', 'previous_event'

  -- Display
  is_featured boolean DEFAULT FALSE,
  sort_order integer DEFAULT 0,

  -- Metadata
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT NOW()
);
```

## Database Service Usage

### Fetching Events with Full Data

```typescript
// Get all events with tickets and gallery
const { data, error } = await eventsService.getAll();

// Get featured events only
const { data, error } = await eventsService.getAll(undefined, true);

// Get events by destination
const { data, error } = await eventsService.getAll(destinationId);

// Get single event with full details
const { data, error } = await eventsService.getById(eventId);
```

### Response Structure

```typescript
{
  id: 'uuid',
  name: 'Event Name',
  location: 'City',
  venue: 'Venue Name',
  start_date: '2025-12-31T16:00:00Z',
  start_time: '16:00',
  end_time: '02:00',

  // Joined from event_tickets
  event_tickets: [
    {
      id: 'uuid',
      ticket_type: 'general_admission',
      name: 'General Admission',
      base_price: 75.00,
      tickets_available: 1000,
      perks: ['Event Access', 'Free Water'],
      is_active: true
    },
    {
      id: 'uuid',
      ticket_type: 'vip',
      name: 'VIP Pass',
      base_price: 150.00,
      tickets_available: 200,
      perks: ['VIP Area', 'Bar Access', 'Priority Entry'],
      is_active: true
    }
  ],

  // Joined from event_gallery
  event_gallery: [
    {
      id: 'uuid',
      image_url: 'https://...',
      caption: 'Main stage',
      category: 'stage',
      is_featured: true,
      sort_order: 1
    },
    // ... more images
  ]
}
```

## Data Mapping in Events.tsx

```typescript
const mappedEvents: Event[] = data.map((event: any) => {
  // Map gallery images sorted by sort_order
  const galleryImages =
    event.event_gallery?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) ||
    [];

  // Map ticket types (active only)
  const ticketTypes =
    event.event_tickets
      ?.filter(ticket => ticket.is_active)
      .map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.base_price,
        description: ticket.description,
        available: ticket.tickets_available || 0,
        perks: ticket.perks || [],
      })) || [];

  // Get minimum ticket price
  const minTicketPrice =
    ticketTypes.length > 0 ? Math.min(...ticketTypes.map(t => t.price)) : event.ticket_price || 0;

  return {
    id: event.id,
    name: event.name,
    images: [...(event.images || []), ...galleryImages],
    ticketPrice: minTicketPrice,
    ticketTypes,
    // ... other fields
  };
});
```

## Comparison with Stays Structure

| Feature               | Stays                             | Events                                             |
| --------------------- | --------------------------------- | -------------------------------------------------- |
| Main Table            | `stays`                           | `events`                                           |
| Pricing/Options Table | `stay_rooms`                      | `event_tickets`                                    |
| Gallery Table         | `stay_gallery`                    | `event_gallery`                                    |
| Primary Price Field   | `price_per_night` from stay_rooms | `ticket_price` (minimum from event_tickets)        |
| Availability Field    | `is_active` in stay_rooms         | `is_active` + `tickets_available` in event_tickets |
| Benefits/Features     | `amenities` array in stays        | `perks` array in event_tickets                     |

## Sample Data

Sample events with tickets and gallery images are included in:

- Migration: `20251118000001_insert_sample_events_data.sql`
- Includes 5 events: HIFA, Victoria Falls Carnival, Bulawayo Arts Market, Great Zimbabwe Marathon, Lake Kariba Fishing Tournament
- Multiple ticket types per event
- Gallery images with categories and sort order

## Row Level Security (RLS)

- **Public Access**: Anyone can view active events, tickets, and gallery
- **Provider Access**: Service providers can manage their own events
- Policies match the stays structure for consistency
