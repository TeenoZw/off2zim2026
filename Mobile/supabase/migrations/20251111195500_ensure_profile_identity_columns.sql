-- Ensure all identity metadata columns exist on profiles for verification trigger
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS id_type text,
  ADD COLUMN IF NOT EXISTS identity_number text,
  ADD COLUMN IF NOT EXISTS date_of_birth text,
  ADD COLUMN IF NOT EXISTS nationality text;
