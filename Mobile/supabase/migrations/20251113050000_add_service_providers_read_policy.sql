-- Enable RLS on service_providers if not already enabled
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Service providers are viewable by everyone" ON public.service_providers;

-- Create public read policy for service_providers
CREATE POLICY "Service providers are viewable by everyone"
ON public.service_providers
FOR SELECT
USING (true);

-- Grant select permission to anon role
GRANT SELECT ON public.service_providers TO anon;
GRANT SELECT ON public.service_providers TO authenticated;
