-- Create stay_rooms table for different room types and pricing
CREATE TABLE IF NOT EXISTS public.stay_rooms (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	stay_id TEXT NOT NULL, -- References stays.id (can be UUID or string)
	
	-- Room Information
	room_type TEXT NOT NULL, -- e.g., 'Standard Room', 'Deluxe Suite', 'Family Room'
	name TEXT NOT NULL,
	description TEXT,
	
	-- Pricing
	base_price DECIMAL(10,2) NOT NULL,
	currency TEXT DEFAULT 'USD',
	per_night BOOLEAN DEFAULT TRUE,
	
	-- Capacity
	max_guests INTEGER NOT NULL DEFAULT 2,
	max_adults INTEGER,
	max_children INTEGER,
	
	-- Room Details
	bed_configuration TEXT, -- e.g., '1 Queen bed', '2 Twin beds'
	size_sqm INTEGER,
	
	-- Images
	images TEXT[] DEFAULT '{}',
	primary_image TEXT,
	
	-- Amenities specific to this room type
	amenities TEXT[] DEFAULT '{}',
	
	-- Availability
	is_active BOOLEAN DEFAULT TRUE,
	total_rooms INTEGER DEFAULT 1, -- How many rooms of this type exist
	
	-- Metadata
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create stay_gallery table for property images
CREATE TABLE IF NOT EXISTS public.stay_gallery (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	stay_id TEXT NOT NULL, -- References stays.id
	
	-- Image Information
	image_url TEXT NOT NULL,
	thumbnail_url TEXT,
	caption TEXT,
	alt_text TEXT,
	
	-- Categorization
	category TEXT, -- e.g., 'exterior', 'room', 'amenity', 'restaurant', 'pool', 'view'
	
	-- Display Options
	is_featured BOOLEAN DEFAULT FALSE,
	sort_order INTEGER DEFAULT 0,
	
	-- Metadata
	uploaded_by UUID REFERENCES auth.users(id),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stay_rooms_stay_id ON public.stay_rooms(stay_id);
CREATE INDEX IF NOT EXISTS idx_stay_rooms_is_active ON public.stay_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_stay_rooms_base_price ON public.stay_rooms(base_price);

CREATE INDEX IF NOT EXISTS idx_stay_gallery_stay_id ON public.stay_gallery(stay_id);
CREATE INDEX IF NOT EXISTS idx_stay_gallery_is_featured ON public.stay_gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_stay_gallery_sort_order ON public.stay_gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_stay_gallery_category ON public.stay_gallery(category);

-- Create updated_at trigger for stay_rooms
CREATE TRIGGER update_stay_rooms_updated_at 
	BEFORE UPDATE ON public.stay_rooms
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.stay_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stay_rooms

-- Public can view active rooms for active stays
CREATE POLICY "Anyone can view active stay rooms"
	ON public.stay_rooms
	FOR SELECT
	USING (is_active = TRUE);

-- Service providers can view all rooms for their stays
CREATE POLICY "Service providers can view their stay rooms"
	ON public.stay_rooms
	FOR SELECT
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Service providers can insert rooms for their stays
CREATE POLICY "Service providers can insert stay rooms"
	ON public.stay_rooms
	FOR INSERT
	WITH CHECK (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Service providers can update their stay rooms
CREATE POLICY "Service providers can update stay rooms"
	ON public.stay_rooms
	FOR UPDATE
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Service providers can delete their stay rooms
CREATE POLICY "Service providers can delete stay rooms"
	ON public.stay_rooms
	FOR DELETE
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- RLS Policies for stay_gallery

-- Public can view gallery images for active stays
CREATE POLICY "Anyone can view stay gallery"
	ON public.stay_gallery
	FOR SELECT
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE is_active = TRUE AND deleted_at IS NULL
		)
	);

-- Service providers can view all gallery images for their stays
CREATE POLICY "Service providers can view their stay gallery"
	ON public.stay_gallery
	FOR SELECT
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Service providers can insert gallery images for their stays
CREATE POLICY "Service providers can insert stay gallery"
	ON public.stay_gallery
	FOR INSERT
	WITH CHECK (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Service providers can update their stay gallery
CREATE POLICY "Service providers can update stay gallery"
	ON public.stay_gallery
	FOR UPDATE
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Service providers can delete their stay gallery
CREATE POLICY "Service providers can delete stay gallery"
	ON public.stay_gallery
	FOR DELETE
	USING (
		stay_id IN (
			SELECT id::TEXT FROM public.stays 
			WHERE provider_id IN (
				SELECT id FROM public.service_providers 
				WHERE user_id = auth.uid()
			)
		)
	);

-- Insert sample room types for Victoria Falls Hotel
INSERT INTO public.stay_rooms (stay_id, room_type, name, description, base_price, max_guests, max_adults, max_children, bed_configuration, amenities, is_active, total_rooms, primary_image, images)
VALUES 
(
	'victoria-falls-hotel',
	'standard',
	'Standard Room',
	'Elegant room with garden or courtyard views',
	89,
	2,
	2,
	0,
	'1 Queen bed',
	ARRAY['WiFi', 'Air Conditioning', 'Minibar', 'Safe', 'TV'],
	TRUE,
	20,
	'https://picsum.photos/800/600?random=201',
	ARRAY['https://picsum.photos/800/600?random=201', 'https://picsum.photos/800/600?random=202']
),
(
	'victoria-falls-hotel',
	'deluxe',
	'Deluxe Room',
	'Spacious room with partial views of the Victoria Falls Bridge',
	135,
	2,
	2,
	1,
	'1 King bed or 2 Twin beds',
	ARRAY['WiFi', 'Air Conditioning', 'Minibar', 'Safe', 'TV', 'Balcony', 'Coffee Machine'],
	TRUE,
	15,
	'https://picsum.photos/800/600?random=203',
	ARRAY['https://picsum.photos/800/600?random=203', 'https://picsum.photos/800/600?random=204', 'https://picsum.photos/800/600?random=205']
),
(
	'victoria-falls-hotel',
	'luxury_suite',
	'Luxury Suite',
	'Premium suite with stunning views of the Victoria Falls Bridge and spray',
	289,
	4,
	2,
	2,
	'1 King bed + Sofa bed',
	ARRAY['WiFi', 'Air Conditioning', 'Minibar', 'Safe', 'TV', 'Balcony', 'Coffee Machine', 'Living Area', 'Bathtub'],
	TRUE,
	5,
	'https://picsum.photos/800/600?random=206',
	ARRAY['https://picsum.photos/800/600?random=206', 'https://picsum.photos/800/600?random=207', 'https://picsum.photos/800/600?random=208', 'https://picsum.photos/800/600?random=209']
)
ON CONFLICT DO NOTHING;

-- Insert sample gallery images for Victoria Falls Hotel
INSERT INTO public.stay_gallery (stay_id, image_url, caption, category, is_featured, sort_order)
VALUES 
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=101', 'Historic hotel exterior', 'exterior', TRUE, 1),
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=102', 'Elegant dining room', 'restaurant', FALSE, 2),
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=103', 'Swimming pool area', 'pool', TRUE, 3),
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=104', 'Spa and wellness center', 'amenity', FALSE, 4),
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=105', 'View of Victoria Falls Bridge', 'view', TRUE, 5),
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=106', 'Hotel gardens', 'exterior', FALSE, 6),
('victoria-falls-hotel', 'https://picsum.photos/800/800?random=107', 'Bar and lounge', 'amenity', FALSE, 7)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stay_rooms TO authenticated;
GRANT SELECT ON public.stay_rooms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stay_gallery TO authenticated;
GRANT SELECT ON public.stay_gallery TO anon;

COMMENT ON TABLE public.stay_rooms IS 'Different room types and pricing for each stay/accommodation';
COMMENT ON TABLE public.stay_gallery IS 'Gallery images for stays/accommodations organized by category';
