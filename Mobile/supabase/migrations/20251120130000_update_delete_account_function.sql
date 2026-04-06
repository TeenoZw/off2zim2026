-- Update delete_account_and_data to check for optional columns/tables
create or replace function public.delete_account_and_data()
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Nullify admin references if column exists
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'service_providers' and column_name = 'verified_by'
  ) then
    execute 'update public.service_providers set verified_by = null where verified_by = $1' using v_user_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'destinations' and column_name = 'approved_by'
  ) then
    execute 'update public.destinations set approved_by = null where approved_by = $1' using v_user_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'stays' and column_name = 'approved_by'
  ) then
    execute 'update public.stays set approved_by = null where approved_by = $1' using v_user_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'approved_by'
  ) then
    execute 'update public.events set approved_by = null where approved_by = $1' using v_user_id;
  end if;

  if to_regclass('public.content_reviews') is not null then
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'content_reviews' and column_name = 'reviewer_id'
    ) then
      execute 'update public.content_reviews set reviewer_id = null where reviewer_id = $1' using v_user_id;
    end if;

    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'content_reviews' and column_name = 'submitted_by'
    ) then
      execute 'delete from public.content_reviews where submitted_by = $1' using v_user_id;
    end if;
  end if;

  if to_regclass('public.service_providers') is not null then
    execute 'delete from public.service_providers where user_id = $1' using v_user_id;
  end if;

  if to_regclass('public.profiles') is not null then
    execute 'delete from public.profiles where id = $1' using v_user_id;
  end if;

  delete from auth.users where id = v_user_id;
end;
$$;

revoke all on function public.delete_account_and_data() from public;
grant execute on function public.delete_account_and_data() to authenticated;
