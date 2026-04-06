-- Add traveling_with_infant column to stays_bookings table
ALTER TABLE public.stays_bookings 
ADD COLUMN traveling_with_infant boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.stays_bookings.traveling_with_infant IS 'Indicates if the user toggled traveling with an infant during booking';

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_stays_bookings_traveling_with_infant 
ON public.stays_bookings(traveling_with_infant) 
WHERE traveling_with_infant = true;
