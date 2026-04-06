-- Create dedicated carousel table for hero images
create table public.carousel (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  subtitle text,
  location text,
  image_url text not null,
  order_index integer default 0,
  active boolean default true,
  link_url text, -- Optional link when carousel item is clicked
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on carousel
alter table public.carousel enable row level security;

-- Create policy for carousel (public read)
create policy "Carousel items are viewable by everyone." on carousel for select using (true);

-- Add trigger for updated_at
create trigger update_carousel_updated_at before update on carousel for each row execute procedure update_updated_at_column();

-- Insert sample carousel data
INSERT INTO public.carousel (title, subtitle, location, image_url, order_index, active) VALUES
  ('Discover Zimbabwe', 'Experience the beauty of Southern Africa', 'Victoria Falls', 'https://picsum.photos/800/600?random=carousel1', 1, true),
  ('Wildlife Adventures', 'Safari experiences like no other', 'Hwange National Park', 'https://picsum.photos/800/600?random=carousel2', 2, true),
  ('Mountain Escapes', 'Breathtaking highland adventures', 'Eastern Highlands', 'https://picsum.photos/800/600?random=carousel3', 3, true),
  ('Cultural Heritage', 'Ancient civilizations and modern culture', 'Great Zimbabwe', 'https://picsum.photos/800/600?random=carousel4', 4, true);

-- Verify the data
SELECT title, location, order_index FROM public.carousel WHERE active = true ORDER BY order_index;