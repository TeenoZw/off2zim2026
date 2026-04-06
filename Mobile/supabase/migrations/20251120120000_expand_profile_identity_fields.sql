-- Expand profile table to store identity details for booking autofill
alter table public.profiles
  add column if not exists title text,
  add column if not exists gender text,
  add column if not exists id_type text,
  add column if not exists identity_number text,
  add column if not exists date_of_birth text,
  add column if not exists nationality text;
