-- Add missing columns to existing stays table

-- Add provider_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'stays' 
                   AND column_name = 'provider_id') THEN
        ALTER TABLE public.stays 
        ADD COLUMN provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add like_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'stays' 
                   AND column_name = 'like_count') THEN
        ALTER TABLE public.stays 
        ADD COLUMN like_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add is_active column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'stays' 
                   AND column_name = 'is_active') THEN
        ALTER TABLE public.stays 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Add is_featured column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'stays' 
                   AND column_name = 'is_featured') THEN
        ALTER TABLE public.stays 
        ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add deleted_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'stays' 
                   AND column_name = 'deleted_at') THEN
        ALTER TABLE public.stays 
        ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create index on provider_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_stays_provider_id ON public.stays(provider_id);
CREATE INDEX IF NOT EXISTS idx_stays_is_active ON public.stays(is_active);
CREATE INDEX IF NOT EXISTS idx_stays_is_featured ON public.stays(is_featured);

-- Update existing stays to have the demo provider_id
UPDATE public.stays 
SET provider_id = '00000000-0000-0000-0000-000000000001'
WHERE provider_id IS NULL;

-- Enable RLS if not already enabled
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;

-- Drop the old policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view active stays" ON public.stays;
DROP POLICY IF EXISTS "Service providers can view their own stays" ON public.stays;
DROP POLICY IF EXISTS "Service providers can insert their own stays" ON public.stays;
DROP POLICY IF EXISTS "Service providers can update their own stays" ON public.stays;
DROP POLICY IF EXISTS "Service providers can delete their own stays" ON public.stays;

-- Public can view active stays
CREATE POLICY "Anyone can view active stays"
	ON public.stays
	FOR SELECT
	USING (is_active = TRUE AND deleted_at IS NULL);

-- Service providers can view their own stays (including inactive)
CREATE POLICY "Service providers can view their own stays"
	ON public.stays
	FOR SELECT
	USING (
		provider_id IN (
			SELECT id FROM public.service_providers 
			WHERE user_id = auth.uid()
		)
	);

-- Service providers can insert their own stays
CREATE POLICY "Service providers can insert their own stays"
	ON public.stays
	FOR INSERT
	WITH CHECK (
		provider_id IN (
			SELECT id FROM public.service_providers 
			WHERE user_id = auth.uid()
		)
	);

-- Service providers can update their own stays
CREATE POLICY "Service providers can update their own stays"
	ON public.stays
	FOR UPDATE
	USING (
		provider_id IN (
			SELECT id FROM public.service_providers 
			WHERE user_id = auth.uid()
		)
	);

-- Service providers can soft delete their own stays
CREATE POLICY "Service providers can delete their own stays"
	ON public.stays
	FOR DELETE
	USING (
		provider_id IN (
			SELECT id FROM public.service_providers 
			WHERE user_id = auth.uid()
		)
	);
