-- Add event organizers to service_providers table
-- Make user_id nullable to allow system providers without auth accounts
ALTER TABLE public.service_providers ALTER COLUMN user_id DROP NOT NULL;

-- Add provider_id to events if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='events' AND column_name='provider_id') THEN
        ALTER TABLE public.events ADD COLUMN provider_id uuid REFERENCES public.service_providers(id);
    END IF;
END $$;

-- Insert HIFA Trust
INSERT INTO public.service_providers (
	business_name,
	business_type,
	contact_person_name,
	email,
	phone,
	address,
	city,
	country,
	description,
	verification_status
) VALUES (
	'HIFA Trust',
	'events',
	'Festival Director',
	'info@hifa.co.zw',
	'+263 4 708478',
	'Reps Theatre, Belgravia',
	'Harare',
	'Zimbabwe',
	'Zimbabwe''s premier arts festival organizer, promoting African creativity and culture',
	'verified'
);

-- Insert VF Events Ltd
INSERT INTO public.service_providers (
	business_name,
	business_type,
	contact_person_name,
	email,
	phone,
	address,
	city,
	country,
	description,
	verification_status
) VALUES (
	'VF Events Ltd',
	'events',
	'Events Manager',
	'info@vfevents.co.zw',
	'+263 13 44737',
	'Victoria Falls',
	'Victoria Falls',
	'Zimbabwe',
	'Premier event organizers in Victoria Falls, specializing in music and cultural festivals',
	'verified'
);

-- Insert Zimbabwe Tourism Events
INSERT INTO public.service_providers (
	business_name,
	business_type,
	contact_person_name,
	email,
	phone,
	address,
	city,
	country,
	description,
	verification_status
) VALUES (
	'Zimbabwe Tourism Events',
	'events',
	'Events Coordinator',
	'events@zimtourism.co.zw',
	'+263 4 793666',
	'Tourism House, Samora Machel Avenue',
	'Harare',
	'Zimbabwe',
	'Official tourism events and activities organizer',
	'verified'
);

-- Link events to providers
UPDATE public.events 
SET provider_id = (SELECT id FROM public.service_providers WHERE business_name = 'HIFA Trust')
WHERE name = 'Harare International Festival of Arts';

UPDATE public.events 
SET provider_id = (SELECT id FROM public.service_providers WHERE business_name = 'VF Events Ltd')
WHERE name = 'Victoria Falls Carnival';

UPDATE public.events 
SET provider_id = (SELECT id FROM public.service_providers WHERE business_name = 'Zimbabwe Tourism Events')
WHERE name IN ('Bulawayo Arts & Crafts Market', 'Great Zimbabwe Marathon', 'Lake Kariba Fishing Tournament');
