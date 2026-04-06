-- Create stays_bookings table to persist detailed stay reservation data
create table if not exists public.stays_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  user_id uuid not null references auth.users(id) on delete cascade,
  stay_id uuid references public.stays(id),
  transaction_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  contact_details jsonb,
  check_in_date date not null,
  check_out_date date not null,
  guests_count integer not null default 1,
  adults_count integer not null default 1,
  children_count integer not null default 0,
  rooms_count integer not null default 1,
  room_type text,
  room_type_rate numeric(10,2),
  subtotal numeric(10,2),
  tax numeric(10,2),
  total_amount numeric(10,2) not null,
  payment_method text,
  payment_gateway jsonb,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'failed')),
  same_as_account_holder boolean not null default false
);

-- Ensure row level security and policies for user access
alter table public.stays_bookings enable row level security;

create policy "Users can view their own stay bookings" on public.stays_bookings
  for select using (auth.uid() = user_id);

create policy "Users can manage their own stay bookings" on public.stays_bookings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own stay bookings" on public.stays_bookings
  for update using (auth.uid() = user_id);

-- Reuse updated_at trigger helper
create trigger update_stays_bookings_updated_at
  before update on public.stays_bookings
  for each row execute procedure update_updated_at_column();

-- Helpful indexes
create index if not exists stays_bookings_user_id_idx on public.stays_bookings(user_id);
create index if not exists stays_bookings_transaction_number_idx on public.stays_bookings(transaction_number);
create index if not exists stays_bookings_stay_id_idx on public.stays_bookings(stay_id);
