-- Add manual ordering support for destinations
ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS display_order INTEGER;

COMMENT ON COLUMN public.destinations.display_order IS 'Lower numbers appear first in featured destination lists.';

WITH ordered AS (
  SELECT id,
         ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM public.destinations
)
UPDATE public.destinations d
SET display_order = ordered.rn
FROM ordered
WHERE d.id = ordered.id
  AND COALESCE(d.display_order, 0) = 0;

ALTER TABLE public.destinations
  ALTER COLUMN display_order SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_destinations_display_order
  ON public.destinations(display_order ASC, created_at DESC);
