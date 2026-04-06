-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policy for profiles
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Create destinations table
create table public.destinations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  location text not null,
  image_url text,
  images text[], -- Array of image URLs
  price_range text,
  rating decimal(2,1) default 0,
  weather text,
  featured boolean default false,
  category text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on destinations
alter table public.destinations enable row level security;

-- Create policy for destinations (public read)
create policy "Destinations are viewable by everyone." on destinations for select using (true);

-- Create stays table (hotels, lodges, etc.)
create table public.stays (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  location text not null,
  destination_id uuid references public.destinations(id),
  image_url text,
  images text[], -- Array of image URLs
  price_per_night decimal(10,2),
  rating decimal(2,1) default 0,
  amenities text[], -- Array of amenities
  room_types jsonb, -- Different room types and prices
  contact_info jsonb, -- Phone, email, website
  featured boolean default false,
  available boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on stays
alter table public.stays enable row level security;

-- Create policy for stays (public read)
create policy "Stays are viewable by everyone." on stays for select using (true);

-- Create events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  location text not null,
  destination_id uuid references public.destinations(id),
  image_url text,
  images text[],
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  price decimal(10,2),
  category text,
  featured boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on events
alter table public.events enable row level security;

-- Create policy for events (public read)
create policy "Events are viewable by everyone." on events for select using (true);

-- Function to automatically update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();
create trigger update_destinations_updated_at before update on destinations for each row execute procedure update_updated_at_column();
create trigger update_stays_updated_at before update on stays for each row execute procedure update_updated_at_column();
create trigger update_events_updated_at before update on events for each row execute procedure update_updated_at_column();