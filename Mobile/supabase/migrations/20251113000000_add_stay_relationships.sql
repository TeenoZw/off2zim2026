-- Drop ALL existing policies on stay_rooms
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'stay_rooms' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON stay_rooms';
    END LOOP;
END $$;

-- Drop ALL existing policies on stay_gallery
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'stay_gallery' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON stay_gallery';
    END LOOP;
END $$;

-- Drop all policies on stay_rooms and stay_gallery first
DO $$ 
DECLARE 
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('stay_rooms', 'stay_gallery')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, policy_record.tablename);
  END LOOP;
END $$;

-- Delete test/sample data with non-UUID stay_id values
-- This removes sample data like 'victoria-falls-hotel', 'bethel-suites' etc.
DELETE FROM stay_rooms 
WHERE stay_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

DELETE FROM stay_gallery 
WHERE stay_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Now convert stay_id in stay_rooms from text to uuid
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stay_rooms' 
    AND column_name = 'stay_id'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE stay_rooms 
    ALTER COLUMN stay_id TYPE UUID USING stay_id::uuid;
  END IF;
END $$;

-- Convert stay_id in stay_gallery from text to uuid
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stay_gallery' 
    AND column_name = 'stay_id'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE stay_gallery 
    ALTER COLUMN stay_id TYPE UUID USING stay_id::uuid;
  END IF;
END $$;

-- Add foreign key constraint from stay_rooms to stays if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'stay_rooms_stay_id_fkey'
    AND table_name = 'stay_rooms'
  ) THEN
    ALTER TABLE stay_rooms 
    ADD CONSTRAINT stay_rooms_stay_id_fkey 
    FOREIGN KEY (stay_id) 
    REFERENCES stays(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint from stay_gallery to stays if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'stay_gallery_stay_id_fkey'
    AND table_name = 'stay_gallery'
  ) THEN
    ALTER TABLE stay_gallery 
    ADD CONSTRAINT stay_gallery_stay_id_fkey 
    FOREIGN KEY (stay_id) 
    REFERENCES stays(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint from stays_bookings to stay_rooms if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'stays_bookings_room_id_fkey'
    AND table_name = 'stays_bookings'
  ) THEN
    -- First add the column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'stays_bookings' 
      AND column_name = 'room_id'
    ) THEN
      ALTER TABLE stays_bookings ADD COLUMN room_id UUID;
    END IF;
    
    -- Then add the foreign key
    ALTER TABLE stays_bookings 
    ADD CONSTRAINT stays_bookings_room_id_fkey 
    FOREIGN KEY (room_id) 
    REFERENCES stay_rooms(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stay_rooms_stay_id ON stay_rooms(stay_id);
CREATE INDEX IF NOT EXISTS idx_stay_gallery_stay_id ON stay_gallery(stay_id);
CREATE INDEX IF NOT EXISTS idx_stay_gallery_sort_order ON stay_gallery(stay_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_stays_bookings_room_id ON stays_bookings(room_id);

-- Recreate RLS policies for stay_rooms
CREATE POLICY "Anyone can view stay rooms for active stays"
ON stay_rooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_rooms.stay_id
    AND stays.is_active = TRUE
    AND stays.deleted_at IS NULL
  )
);

CREATE POLICY "Service providers can view their stay rooms"
ON stay_rooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_rooms.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Service providers can insert their stay rooms"
ON stay_rooms FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_rooms.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Service providers can update their stay rooms"
ON stay_rooms FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_rooms.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Service providers can delete their stay rooms"
ON stay_rooms FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_rooms.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

-- Recreate RLS policies for stay_gallery
CREATE POLICY "Anyone can view stay gallery for active stays"
ON stay_gallery FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_gallery.stay_id
    AND stays.is_active = TRUE
    AND stays.deleted_at IS NULL
  )
);

CREATE POLICY "Service providers can view their stay gallery"
ON stay_gallery FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_gallery.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Service providers can insert their stay gallery"
ON stay_gallery FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_gallery.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Service providers can update their stay gallery"
ON stay_gallery FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_gallery.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Service providers can delete their stay gallery"
ON stay_gallery FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM stays
    WHERE stays.id = stay_gallery.stay_id
    AND stays.provider_id IN (
      SELECT id FROM service_providers
      WHERE user_id = auth.uid()
    )
  )
);
