-- Function to allow users to delete their account and related data
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

  -- Clear admin references to avoid foreign key violations
  update public.service_providers
    set verified_by = null
    where verified_by = v_user_id;

  update public.destinations
    set approved_by = null
    where approved_by = v_user_id;

  update public.stays
    set approved_by = null
    where approved_by = v_user_id;

  update public.events
    set approved_by = null
    where approved_by = v_user_id;

  update public.content_reviews
    set reviewer_id = null
    where reviewer_id = v_user_id;

  delete from public.content_reviews
    where submitted_by = v_user_id;

  -- Remove provider account (cascades to provider_* tables)
  delete from public.service_providers
    where user_id = v_user_id;

  -- Remove profile row (cascades would also handle this, but we do it explicitly for clarity)
  delete from public.profiles
    where id = v_user_id;

  -- Delete the user from auth (cascades to tables with ON DELETE CASCADE)
  delete from auth.users
    where id = v_user_id;
end;
$$;

revoke all on function public.delete_account_and_data() from public;
grant execute on function public.delete_account_and_data() to authenticated;
