-- Add available_rooms column to stay_rooms table
-- This tracks how many rooms are currently available for booking
-- total_rooms is the total capacity, available_rooms is what's left

ALTER TABLE public.stay_rooms 
ADD COLUMN IF NOT EXISTS available_rooms INTEGER;

-- Add stay_name column to store the hotel/property name for easier querying
ALTER TABLE public.stay_rooms 
ADD COLUMN IF NOT EXISTS stay_name TEXT;

-- Set default available_rooms to equal total_rooms for existing records
UPDATE public.stay_rooms 
SET available_rooms = COALESCE(total_rooms, 1)
WHERE available_rooms IS NULL;

-- Populate stay_name from stays table for existing records
UPDATE public.stay_rooms sr
SET stay_name = s.name
FROM public.stays s
WHERE sr.stay_id::uuid = s.id
AND sr.stay_name IS NULL;

-- Add check constraint to ensure available_rooms doesn't exceed total_rooms
ALTER TABLE public.stay_rooms
ADD CONSTRAINT check_available_rooms_valid 
CHECK (available_rooms >= 0 AND available_rooms <= total_rooms);

-- Create index on stay_name for faster queries
CREATE INDEX IF NOT EXISTS idx_stay_rooms_stay_name ON public.stay_rooms(stay_name);

-- Add comment
COMMENT ON COLUMN public.stay_rooms.available_rooms IS 'Number of rooms currently available for booking';
COMMENT ON COLUMN public.stay_rooms.stay_name IS 'Name of the hotel/property for easier querying';
