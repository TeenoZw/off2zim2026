-- Make handle_new_user resilient to downstream insert errors so email confirmation never fails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only sync after the email address has been confirmed
  IF NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;

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
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'user_type',
      NEW.raw_user_meta_data->>'business_name',
      NEW.raw_user_meta_data->>'title',
      NEW.raw_user_meta_data->>'gender',
      NEW.raw_user_meta_data->>'id_type',
      NEW.raw_user_meta_data->>'identity_number',
      NEW.raw_user_meta_data->>'date_of_birth',
      NEW.raw_user_meta_data->>'nationality'
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
