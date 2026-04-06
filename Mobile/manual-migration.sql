-- Manual migration for display_order column
-- Copy and paste this into your Supabase SQL Editor

-- Step 1: Add the display_order column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'destinations' 
        AND column_name = 'display_order'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.destinations
        ADD COLUMN display_order INTEGER DEFAULT 0;
        
        RAISE NOTICE 'Added display_order column to destinations table';
    ELSE
        RAISE NOTICE 'display_order column already exists';
    END IF;
END
$$;

-- Step 2: Add comment
COMMENT ON COLUMN public.destinations.display_order IS 'Lower numbers appear first in featured destination lists.';

-- Step 3: Backfill existing rows with sequential numbers based on creation date
WITH ordered AS (
  SELECT id,
         ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM public.destinations
  WHERE display_order IS NULL OR display_order = 0
)
UPDATE public.destinations d
SET display_order = ordered.rn
FROM ordered
WHERE d.id = ordered.id;

-- Step 4: Create index for performance
CREATE INDEX IF NOT EXISTS idx_destinations_display_order
  ON public.destinations(display_order ASC, created_at DESC);

-- Step 5: Verify the migration
SELECT 
    id, 
    name, 
    display_order, 
    created_at
FROM public.destinations 
ORDER BY display_order ASC 
LIMIT 10;