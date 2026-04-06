-- Add check-in and check-out time columns to stays table
ALTER TABLE stays
ADD COLUMN IF NOT EXISTS check_in_time TIME DEFAULT '14:00:00',
ADD COLUMN IF NOT EXISTS check_out_time TIME DEFAULT '11:00:00';

-- Add comments to explain the columns
COMMENT ON COLUMN stays.check_in_time IS 'Standard check-in time for the property (24-hour format)';
COMMENT ON COLUMN stays.check_out_time IS 'Standard check-out time for the property (24-hour format)';

-- Update the existing Bethel Suites record with check-in/out times
UPDATE stays
SET 
  check_in_time = '14:00:00',
  check_out_time = '11:00:00'
WHERE id = '07651e96-fbca-4263-9c24-1897e0b8f9c6';
