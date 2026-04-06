-- Add new columns for storing the stay name and traveller identity details
alter table public.stays_bookings
  add column if not exists stay_name text,
  add column if not exists id_type text,
  add column if not exists identity_number text,
  add column if not exists date_of_birth date,
  add column if not exists nationality text;

-- Backfill stay names from the linked stays table when available
update public.stays_bookings sb
set stay_name = s.name
from public.stays s
where sb.stay_id = s.id
  and (sb.stay_name is null or sb.stay_name = '');

-- Attempt to populate the new identity columns from the legacy contact_details payload
update public.stays_bookings
set id_type = contact_details ->> 'idType',
    identity_number = contact_details ->> 'idNumber',
    date_of_birth = case
      when (contact_details ->> 'dateOfBirth') ~ '^\\d{2}/\\d{2}/\\d{4}$'
        then to_date(contact_details ->> 'dateOfBirth', 'DD/MM/YYYY')
      when (contact_details ->> 'dateOfBirth') ~ '^\\d{4}-\\d{2}-\\d{2}$'
        then to_date(contact_details ->> 'dateOfBirth', 'YYYY-MM-DD')
      else null
    end,
    nationality = contact_details ->> 'nationality'
where contact_details is not null;

-- Remove the deprecated contact_details column now that data has been migrated
alter table public.stays_bookings
  drop column if exists contact_details;
