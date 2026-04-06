-- Add logo column to service_providers table for provider branding
ALTER TABLE public.service_providers 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment
COMMENT ON COLUMN public.service_providers.logo_url IS 'URL to the service provider logo/brand image';

-- Create index for faster lookups when joining with stays
CREATE INDEX IF NOT EXISTS idx_service_providers_logo ON public.service_providers(logo_url) WHERE logo_url IS NOT NULL;
