-- Run this in Supabase SQL Editor

-- Add display_order column
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add helpful comment
COMMENT ON COLUMN public.destinations.display_order IS 'Lower numbers appear first in featured destination lists. 0 = default order.';

-- Update existing rows to have sequential display_order based on created_at
UPDATE public.destinations 
SET display_order = subquery.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
    FROM public.destinations
    WHERE display_order IS NULL OR display_order = 0
) AS subquery
WHERE public.destinations.id = subquery.id;

-- Create index for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_destinations_display_order 
ON public.destinations(display_order ASC, created_at DESC);

-- Show results
SELECT id, name, display_order, created_at 
FROM public.destinations 
ORDER BY display_order ASC, created_at DESC 
LIMIT 10;