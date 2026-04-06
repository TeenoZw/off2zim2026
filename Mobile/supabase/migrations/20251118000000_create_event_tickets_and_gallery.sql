-- Create event_tickets table for different ticket types and pricing
CREATE TABLE IF NOT EXISTS public.event_tickets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
	
	-- Ticket Information
	ticket_type TEXT NOT NULL, -- e.g., 'general_admission', 'vip', 'early_bird', 'group'
	name TEXT NOT NULL, -- Display name: 'General Admission', 'VIP Pass', 'Early Bird Special'
	description TEXT,
	
	-- Pricing
	base_price DECIMAL(10,2) NOT NULL,
	currency TEXT DEFAULT 'USD',
	original_price DECIMAL(10,2), -- For showing discounts
	
	-- Availability
	total_tickets INTEGER, -- NULL means unlimited
	tickets_sold INTEGER DEFAULT 0,
	tickets_available INTEGER, -- Calculated: total_tickets - tickets_sold
	
	-- Restrictions
	min_purchase INTEGER DEFAULT 1,
	max_purchase INTEGER DEFAULT 10,
	
	-- Ticket Benefits/Perks
	perks TEXT[] DEFAULT '{}', -- e.g., ['Free Drink', 'Meet & Greet', 'Priority Entry']
	
	-- Validity
	sale_start_date TIMESTAMP WITH TIME ZONE,
	sale_end_date TIMESTAMP WITH TIME ZONE,
	is_active BOOLEAN DEFAULT TRUE,
	
	-- Metadata
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create event_gallery table for event images
CREATE TABLE IF NOT EXISTS public.event_gallery (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
	
	-- Image Information
	image_url TEXT NOT NULL,
	thumbnail_url TEXT,
	caption TEXT,
	alt_text TEXT,
	
	-- Categorization
	category TEXT, -- e.g., 'venue', 'performer', 'previous_event', 'promo', 'stage'
	
	-- Display Options
	is_featured BOOLEAN DEFAULT FALSE,
	sort_order INTEGER DEFAULT 0,
	
	-- Metadata
	uploaded_by UUID REFERENCES auth.users(id),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add additional event fields to match the Event type
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS venue TEXT,
ADD COLUMN IF NOT EXISTS start_time TEXT,
ADD COLUMN IF NOT EXISTS end_time TEXT,
ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS organizer JSONB, -- {name, contact, verified}
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS tickets_available INTEGER,
ADD COLUMN IF NOT EXISTS age_restriction TEXT,
ADD COLUMN IF NOT EXISTS accessibility TEXT[] DEFAULT '{}';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON public.event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_is_active ON public.event_tickets(is_active);
CREATE INDEX IF NOT EXISTS idx_event_tickets_base_price ON public.event_tickets(base_price);
CREATE INDEX IF NOT EXISTS idx_event_tickets_ticket_type ON public.event_tickets(ticket_type);

CREATE INDEX IF NOT EXISTS idx_event_gallery_event_id ON public.event_gallery(event_id);
CREATE INDEX IF NOT EXISTS idx_event_gallery_is_featured ON public.event_gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_event_gallery_sort_order ON public.event_gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_event_gallery_category ON public.event_gallery(category);

-- Create updated_at trigger for event_tickets
CREATE TRIGGER update_event_tickets_updated_at 
	BEFORE UPDATE ON public.event_tickets
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate tickets_available
CREATE OR REPLACE FUNCTION calculate_tickets_available()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.total_tickets IS NOT NULL THEN
		NEW.tickets_available := NEW.total_tickets - NEW.tickets_sold;
	ELSE
		NEW.tickets_available := NULL; -- Unlimited
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate tickets_available
CREATE TRIGGER calculate_event_tickets_available
	BEFORE INSERT OR UPDATE ON public.event_tickets
	FOR EACH ROW
	EXECUTE FUNCTION calculate_tickets_available();

-- Enable Row Level Security
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_tickets

-- Public can view active tickets for active events
CREATE POLICY "Anyone can view active event tickets"
	ON public.event_tickets
	FOR SELECT
	USING (is_active = TRUE);

-- RLS Policies for event_gallery

-- Public can view gallery images for active events
CREATE POLICY "Anyone can view event gallery"
	ON public.event_gallery
	FOR SELECT
	USING (
		event_id IN (
			SELECT id FROM public.events 
			WHERE featured = TRUE OR start_date >= NOW()
		)
	);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_tickets TO authenticated;
GRANT SELECT ON public.event_tickets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_gallery TO authenticated;
GRANT SELECT ON public.event_gallery TO anon;

COMMENT ON TABLE public.event_tickets IS 'Different ticket types and pricing for each event';
COMMENT ON TABLE public.event_gallery IS 'Gallery images for events organized by category';
