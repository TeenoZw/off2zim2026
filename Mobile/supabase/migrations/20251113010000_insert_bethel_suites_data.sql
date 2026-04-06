-- Insert room types for Bethel Suites
-- First, get the stay_id for Bethel Suites
DO $$
DECLARE
  bethel_stay_id UUID;
BEGIN
  -- Get Bethel Suites stay ID
  SELECT id INTO bethel_stay_id FROM stays WHERE name = 'Bethel Suites' LIMIT 1;
  
  IF bethel_stay_id IS NOT NULL THEN
    -- Insert room types for Bethel Suites
    INSERT INTO stay_rooms (stay_id, room_type, name, description, base_price, currency, max_guests, max_adults, max_children, bed_configuration, amenities, is_active, total_rooms)
    VALUES 
    (
      bethel_stay_id,
      'standard',
      'Standard Room',
      'Comfortable room with modern amenities',
      75.00,
      'USD',
      2,
      2,
      0,
      '1 Queen bed',
      ARRAY['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Desk'],
      TRUE,
      15
    ),
    (
      bethel_stay_id,
      'deluxe',
      'Deluxe Suite',
      'Spacious suite with separate living area',
      120.00,
      'USD',
      3,
      2,
      1,
      '1 King bed + Sofa bed',
      ARRAY['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Desk', 'Mini Fridge', 'Coffee Maker', 'Balcony'],
      TRUE,
      10
    ),
    (
      bethel_stay_id,
      'family',
      'Family Room',
      'Large room perfect for families',
      95.00,
      'USD',
      4,
      2,
      2,
      '2 Queen beds',
      ARRAY['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Desk', 'Mini Fridge'],
      TRUE,
      8
    ),
    (
      bethel_stay_id,
      'executive',
      'Executive Suite',
      'Luxury suite with premium amenities and city views',
      180.00,
      'USD',
      2,
      2,
      0,
      '1 King bed',
      ARRAY['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Desk', 'Mini Fridge', 'Coffee Maker', 'Balcony', 'Bathtub', 'Work Area'],
      TRUE,
      5
    )
    ON CONFLICT DO NOTHING;
    
    -- Insert gallery images for Bethel Suites
    INSERT INTO stay_gallery (stay_id, image_url, caption, category, is_featured, sort_order)
    VALUES 
    (bethel_stay_id, 'https://picsum.photos/800/600?random=301', 'Hotel Exterior', 'exterior', TRUE, 1),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=302', 'Lobby Area', 'lobby', FALSE, 2),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=303', 'Standard Room', 'room', TRUE, 3),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=304', 'Deluxe Suite Living Area', 'room', FALSE, 4),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=305', 'Swimming Pool', 'amenity', TRUE, 5),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=306', 'Fitness Center', 'amenity', FALSE, 6),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=307', 'Restaurant', 'restaurant', FALSE, 7),
    (bethel_stay_id, 'https://picsum.photos/800/600?random=308', 'City View from Balcony', 'view', FALSE, 8)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Successfully inserted data for Bethel Suites (ID: %)', bethel_stay_id;
  ELSE
    RAISE NOTICE 'Bethel Suites stay not found';
  END IF;
END $$;
