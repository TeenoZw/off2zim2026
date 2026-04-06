-- Add amenities to Bethel Suites stay
DO $$
DECLARE
  harare_destination_id UUID;
  bethel_stay_id UUID;
  existing_stay_id UUID;
BEGIN
  -- Get Harare destination ID
  SELECT id INTO harare_destination_id FROM destinations WHERE name = 'Harare' LIMIT 1;
  
  IF harare_destination_id IS NOT NULL THEN
    -- Check if Bethel Suites already exists
    SELECT id INTO existing_stay_id FROM stays WHERE name = 'Bethel Suites' AND destination_id = harare_destination_id LIMIT 1;
    
    IF existing_stay_id IS NOT NULL THEN
      -- Update existing stay with amenities
      UPDATE stays 
      SET amenities = ARRAY['WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant', 'Bar', 'Parking', '24/7 Reception', 'Room Service', 'Laundry Service', 'Airport Shuttle', 'Conference Rooms', 'Business Center']
      WHERE id = existing_stay_id;
      
      RAISE NOTICE 'Updated Bethel Suites stay with amenities (ID: %)', existing_stay_id;
    ELSE
      -- Insert new stay with amenities
      INSERT INTO stays (
        name,
        destination_id,
        location,
        description,
        image_url,
        featured,
        amenities
      )
      VALUES (
        'Bethel Suites',
        harare_destination_id,
        'Harare',
        'Comfortable and affordable accommodation in the heart of Harare. Bethel Suites offers modern amenities, excellent service, and a variety of room types to suit every traveler.',
        'https://picsum.photos/800/600?random=301',
        TRUE,
        ARRAY['WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant', 'Bar', 'Parking', '24/7 Reception', 'Room Service', 'Laundry Service', 'Airport Shuttle', 'Conference Rooms', 'Business Center']
      )
      RETURNING id INTO bethel_stay_id;
      
      RAISE NOTICE 'Inserted Bethel Suites stay with amenities (ID: %)', bethel_stay_id;
    END IF;
  ELSE
    RAISE NOTICE 'Harare destination not found';
  END IF;
END $$;
