-- Migration to add service provider functionality
-- This adds provider support to your existing tourism platform

-- 1. Create service providers table
create table public.service_providers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Authentication (links to auth.users)
  user_id uuid references auth.users(id) on delete cascade not null unique,
  
  -- Business Information
  business_name text not null,
  business_type text not null check (business_type in ('hotel', 'lodge', 'tour_operator', 'restaurant', 'transport', 'activity_provider', 'other')),
  business_registration_number text,
  tax_number text,
  
  -- Contact Information
  contact_person_name text not null,
  email text not null,
  phone text not null,
  website text,
  address text not null,
  city text not null,
  country text default 'Zimbabwe',
  
  -- Business Details
  description text,
  logo_url text,
  images text[], -- Business photos
  
  -- Verification Status
  verification_status text default 'pending' check (verification_status in ('pending', 'under_review', 'verified', 'rejected')),
  verification_documents text[], -- URLs to uploaded documents
  verification_notes text,
  verified_at timestamp with time zone,
  verified_by uuid references auth.users(id),
  
  -- Account Status
  status text default 'active' check (status in ('active', 'suspended', 'inactive')),
  subscription_tier text default 'basic' check (subscription_tier in ('basic', 'premium', 'enterprise')),
  
  -- Settings
  auto_approve_content boolean default false,
  notification_preferences jsonb default '{"email": true, "sms": false}'::jsonb
);

-- Enable RLS
alter table public.service_providers enable row level security;

-- RLS Policies for service providers
create policy "Service providers can view own profile" on service_providers 
  for select using (auth.uid() = user_id);

create policy "Service providers can update own profile" on service_providers 
  for update using (auth.uid() = user_id);

create policy "Admins can view all service providers" on service_providers 
  for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- 2. Add provider_id to existing tables
alter table public.destinations add column provider_id uuid references public.service_providers(id);
alter table public.stays add column provider_id uuid references public.service_providers(id);
alter table public.events add column provider_id uuid references public.service_providers(id);

-- Add content approval fields
alter table public.destinations add column approval_status text default 'draft' check (approval_status in ('draft', 'pending_review', 'approved', 'rejected'));
alter table public.destinations add column approved_at timestamp with time zone;
alter table public.destinations add column approved_by uuid references auth.users(id);
alter table public.destinations add column rejection_reason text;

alter table public.stays add column approval_status text default 'draft' check (approval_status in ('draft', 'pending_review', 'approved', 'rejected'));
alter table public.stays add column approved_at timestamp with time zone;
alter table public.stays add column approved_by uuid references auth.users(id);
alter table public.stays add column rejection_reason text;

alter table public.events add column approval_status text default 'draft' check (approval_status in ('draft', 'pending_review', 'approved', 'rejected'));
alter table public.events add column approved_at timestamp with time zone;
alter table public.events add column approved_by uuid references auth.users(id);
alter table public.events add column rejection_reason text;

-- 3. Update profiles table to include roles
alter table public.profiles add column role text default 'user' check (role in ('user', 'provider', 'admin'));

-- 4. Update RLS policies for content tables
-- Destinations policies
drop policy if exists "Destinations are viewable by everyone." on destinations;
create policy "Approved destinations are viewable by everyone" on destinations 
  for select using (approval_status = 'approved');

create policy "Providers can manage own destinations" on destinations 
  for all using (
    exists (
      select 1 from public.service_providers 
      where service_providers.id = destinations.provider_id 
      and service_providers.user_id = auth.uid()
    )
  );

create policy "Admins can manage all destinations" on destinations 
  for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- Stays policies  
drop policy if exists "Stays are viewable by everyone." on stays;
create policy "Approved stays are viewable by everyone" on stays 
  for select using (approval_status = 'approved');

create policy "Providers can manage own stays" on stays 
  for all using (
    exists (
      select 1 from public.service_providers 
      where service_providers.id = stays.provider_id 
      and service_providers.user_id = auth.uid()
    )
  );

create policy "Admins can manage all stays" on stays 
  for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- Events policies
drop policy if exists "Events are viewable by everyone." on events;
create policy "Approved events are viewable by everyone" on events 
  for select using (approval_status = 'approved');

create policy "Providers can manage own events" on events 
  for all using (
    exists (
      select 1 from public.service_providers 
      where service_providers.id = events.provider_id 
      and service_providers.user_id = auth.uid()
    )
  );

create policy "Admins can manage all events" on events 
  for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- 5. Create content approval workflow tables
create table public.content_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Content being reviewed
  content_type text not null check (content_type in ('destination', 'stay', 'event')),
  content_id uuid not null,
  provider_id uuid references public.service_providers(id) not null,
  
  -- Review details
  reviewer_id uuid references auth.users(id),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'changes_requested')),
  review_notes text,
  changes_requested text,
  reviewed_at timestamp with time zone,
  
  -- Submission info
  submitted_by uuid references auth.users(id) not null,
  submission_notes text
);

-- Enable RLS on content reviews
alter table public.content_reviews enable row level security;

-- Policies for content reviews
create policy "Providers can view own content reviews" on content_reviews 
  for select using (
    exists (
      select 1 from public.service_providers 
      where service_providers.id = content_reviews.provider_id 
      and service_providers.user_id = auth.uid()
    )
  );

create policy "Admins can manage all content reviews" on content_reviews 
  for all using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- 6. Add triggers for updated_at
create trigger update_service_providers_updated_at before update on service_providers for each row execute procedure update_updated_at_column();

-- 7. Create indexes for performance
create index idx_destinations_provider_id on destinations(provider_id);
create index idx_destinations_approval_status on destinations(approval_status);
create index idx_stays_provider_id on stays(provider_id);
create index idx_stays_approval_status on stays(approval_status);
create index idx_events_provider_id on events(provider_id);
create index idx_events_approval_status on events(approval_status);
create index idx_service_providers_user_id on service_providers(user_id);
create index idx_service_providers_verification_status on service_providers(verification_status);
create index idx_content_reviews_content on content_reviews(content_type, content_id);