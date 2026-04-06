-- Improve handle_new_user metadata resolution and backfill confirmed users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  meta_raw jsonb;
  resolved_user_type text;
  resolved_business_name text;
  resolved_date_of_birth date;
BEGIN
  -- Only sync after the email address has been confirmed
  IF NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;

  meta_raw := NULLIF(NEW.raw_user_meta_data, '{}'::jsonb);

  resolved_user_type := COALESCE(meta_raw->>'user_type', 'individual');
  resolved_business_name := CASE
    WHEN resolved_user_type = 'business' THEN meta_raw->>'business_name'
    ELSE NULL
  END;
  resolved_date_of_birth := CASE
    WHEN meta_raw->>'date_of_birth' ~ '^\d{4}-\d{2}-\d{2}$' THEN to_date(meta_raw->>'date_of_birth', 'YYYY-MM-DD')
    WHEN meta_raw->>'date_of_birth' ~ '^\d{2}/\d{2}/\d{4}$' THEN to_date(meta_raw->>'date_of_birth', 'DD/MM/YYYY')
    ELSE NULL
  END;

  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      phone,
      user_type,
      business_name,
      title,
      gender,
      id_type,
      identity_number,
      date_of_birth,
      nationality
    )
    VALUES (
      NEW.id,
  NEW.email,
  COALESCE(meta_raw->>'full_name', NEW.email),
  meta_raw->>'phone',
  resolved_user_type,
  resolved_business_name,
  meta_raw->>'title',
  meta_raw->>'gender',
  meta_raw->>'id_type',
  meta_raw->>'identity_number',
  resolved_date_of_birth,
  meta_raw->>'nationality'
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      user_type = EXCLUDED.user_type,
      business_name = EXCLUDED.business_name,
      title = EXCLUDED.title,
      gender = EXCLUDED.gender,
      id_type = EXCLUDED.id_type,
      identity_number = EXCLUDED.identity_number,
      date_of_birth = EXCLUDED.date_of_birth,
      nationality = EXCLUDED.nationality,
      updated_at = timezone('utc'::text, now());
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill existing confirmed users into profiles using the new resolution logic
WITH source_users AS (
  SELECT
    u.id,
    u.email,
    NULLIF(u.raw_user_meta_data, '{}'::jsonb) AS meta_raw
  FROM auth.users u
  WHERE u.email_confirmed_at IS NOT NULL
), resolved AS (
  SELECT
    su.id,
    su.email,
    COALESCE(su.meta_raw->>'full_name', su.email) AS full_name,
    su.meta_raw->>'phone' AS phone,
    COALESCE(su.meta_raw->>'user_type', 'individual') AS user_type,
    su.meta_raw->>'business_name' AS business_name,
    su.meta_raw->>'title' AS title,
    su.meta_raw->>'gender' AS gender,
    su.meta_raw->>'id_type' AS id_type,
    su.meta_raw->>'identity_number' AS identity_number,
    CASE
      WHEN su.meta_raw->>'date_of_birth' ~ '^\d{4}-\d{2}-\d{2}$' THEN to_date(su.meta_raw->>'date_of_birth', 'YYYY-MM-DD')
      WHEN su.meta_raw->>'date_of_birth' ~ '^\d{2}/\d{2}/\d{4}$' THEN to_date(su.meta_raw->>'date_of_birth', 'DD/MM/YYYY')
      ELSE NULL
    END AS date_of_birth,
    su.meta_raw->>'nationality' AS nationality
  FROM source_users su
)
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  phone,
  user_type,
  business_name,
  title,
  gender,
  id_type,
  identity_number,
  date_of_birth,
  nationality
)
SELECT
  r.id,
  r.email,
  r.full_name,
  r.phone,
  r.user_type,
  CASE WHEN r.user_type = 'business' THEN r.business_name ELSE NULL END,
  r.title,
  r.gender,
  r.id_type,
  r.identity_number,
  r.date_of_birth,
  r.nationality
FROM resolved r
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  user_type = EXCLUDED.user_type,
  business_name = EXCLUDED.business_name,
  title = EXCLUDED.title,
  gender = EXCLUDED.gender,
  id_type = EXCLUDED.id_type,
  identity_number = EXCLUDED.identity_number,
  date_of_birth = EXCLUDED.date_of_birth,
  nationality = EXCLUDED.nationality,
  updated_at = timezone('utc'::text, now());
