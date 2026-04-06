-- Add soft delete column to stays_bookings
ALTER TABLE public.stays_bookings
  ADD COLUMN IF NOT EXISTS marked_as_deleted boolean DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_stays_bookings_marked_as_deleted 
  ON public.stays_bookings(marked_as_deleted);

-- Create index for user bookings query optimization
CREATE INDEX IF NOT EXISTS idx_stays_bookings_user_deleted 
  ON public.stays_bookings(user_id, marked_as_deleted);
