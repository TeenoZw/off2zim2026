-- Create Bethel Suites as a service provider and link to the stay

DO $$
DECLARE
  bethel_provider_id UUID;
  bethel_stay_id UUID;
BEGIN
  -- Get the Bethel Suites stay ID
  SELECT id INTO bethel_stay_id FROM stays WHERE name = 'Bethel Suites' LIMIT 1;
  
  IF bethel_stay_id IS NOT NULL THEN
    -- Insert Bethel Suites as a service provider
    INSERT INTO service_providers (
      business_name,
      business_type,
      business_email,
      phone,
      address,
      city,
      country,
      description,
      logo_url,
      verification_status,
      setup_completed
    )
    VALUES (
      'Bethel Suites',
      'stays',
      'info@bethelsuites.co.zw',
      '+263 4 123 4567',
      '123 Victoria Falls Road',
      'Harare',
      'Zimbabwe',
      'Comfortable and affordable accommodation in the heart of Harare. Bethel Suites offers modern amenities, excellent service, and a variety of room types to suit every traveler.',
      'https://via.placeholder.com/200x200.png?text=Bethel+Suites',
      'verified',
      TRUE
    )
    RETURNING id INTO bethel_provider_id;
    
    -- Link the stay to the service provider
    UPDATE stays
    SET provider_id = bethel_provider_id
    WHERE id = bethel_stay_id;
    
    RAISE NOTICE 'Created service provider % and linked to stay %', bethel_provider_id, bethel_stay_id;
  ELSE
    RAISE NOTICE 'Bethel Suites stay not found';
  END IF;
END $$;
