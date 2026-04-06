-- Allow users to delete their own stay bookings while preserving row level security
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'stays_bookings'
      AND policyname = 'Users can delete their own stay bookings'
  ) THEN
    CREATE POLICY "Users can delete their own stay bookings" ON public.stays_bookings
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END
$$;
