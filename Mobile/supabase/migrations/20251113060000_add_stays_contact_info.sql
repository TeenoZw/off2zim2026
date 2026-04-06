-- Add location, phone number, and total reviews columns to stays table
ALTER TABLE stays
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS full_location TEXT,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add comment to explain the columns
COMMENT ON COLUMN stays.phone IS 'Contact phone number for the stay/property';
COMMENT ON COLUMN stays.full_location IS 'Full address/location details for the stay';
COMMENT ON COLUMN stays.total_reviews IS 'Total count of reviews for this stay';

-- Update the existing Bethel Suites record with contact information
UPDATE stays
SET 
  phone = '+263714776555',
  full_location = '123 Victoria Falls Road, Harare, Zimbabwe',
  total_reviews = 127
WHERE id = '07651e96-fbca-4263-9c24-1897e0b8f9c6';
