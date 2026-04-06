-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Polymorphic booking (can be stay, event, or custom)
  booking_type text not null check (booking_type in ('stay', 'event', 'custom')),
  stay_id uuid references public.stays(id),
  event_id uuid references public.events(id),
  
  -- Booking details
  check_in_date date,
  check_out_date date,
  guests_count integer default 1,
  total_amount decimal(10,2),
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Contact and special requests
  contact_info jsonb,
  special_requests text,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on bookings
alter table public.bookings enable row level security;

-- Create policies for bookings
create policy "Users can view own bookings." on bookings for select using (auth.uid() = user_id);
create policy "Users can create own bookings." on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings." on bookings for update using (auth.uid() = user_id);

-- Create itineraries table
create table public.itineraries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  start_date date,
  end_date date,
  destinations uuid[] default '{}', -- Array of destination IDs
  bookings uuid[] default '{}', -- Array of booking IDs
  notes text,
  is_public boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on itineraries
alter table public.itineraries enable row level security;

-- Create policies for itineraries
create policy "Users can view own itineraries." on itineraries for select using (auth.uid() = user_id);
create policy "Users can view public itineraries." on itineraries for select using (is_public = true);
create policy "Users can create own itineraries." on itineraries for insert with check (auth.uid() = user_id);
create policy "Users can update own itineraries." on itineraries for update using (auth.uid() = user_id);

-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Polymorphic favorites (destinations, stays, events)
  item_type text not null check (item_type in ('destination', 'stay', 'event')),
  item_id uuid not null,
  
  -- Ensure unique favorites per user per item
  unique(user_id, item_type, item_id)
);

-- Enable RLS on favorites
alter table public.favorites enable row level security;

-- Create policies for favorites
create policy "Users can manage own favorites." on favorites for all using (auth.uid() = user_id);

-- Create messages table (for user support/communication)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  recipient_id uuid references auth.users(id) on delete cascade,
  subject text,
  content text not null,
  message_type text default 'general' check (message_type in ('general', 'booking', 'support')),
  read boolean default false,
  booking_id uuid references public.bookings(id), -- Optional link to booking
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- Create policies for messages
create policy "Users can view messages they sent or received." on messages 
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send messages." on messages 
  for insert with check (auth.uid() = sender_id);
create policy "Recipients can update message read status." on messages 
  for update using (auth.uid() = recipient_id);

-- Add triggers for updated_at
create trigger update_bookings_updated_at before update on bookings for each row execute procedure update_updated_at_column();
create trigger update_itineraries_updated_at before update on itineraries for each row execute procedure update_updated_at_column();
create trigger update_messages_updated_at before update on messages for each row execute procedure update_updated_at_column();

-- Create function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();