-- Retrait du quota notifications WhatsApp Meta (lancement = Push PWA + Email uniquement).
alter table public.profiles
  drop column if exists whatsapp_quota_used,
  drop column if exists quota_reset_date;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    workspace_id,
    role,
    plan_tier,
    full_name,
    whatsapp_number,
    trial_ends_at,
    is_subscribed
  )
  values (
    new.id,
    new.id,
    'ADMIN',
    'ALL_SOURCES',
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'whatsapp_number', null),
    now() + interval '14 days',
    false
  )
  on conflict (id) do update set
    workspace_id = coalesce(public.profiles.workspace_id, excluded.workspace_id),
    role = coalesce(public.profiles.role, excluded.role),
    plan_tier = coalesce(public.profiles.plan_tier, excluded.plan_tier),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    whatsapp_number = coalesce(public.profiles.whatsapp_number, excluded.whatsapp_number),
    trial_ends_at = coalesce(public.profiles.trial_ends_at, excluded.trial_ends_at);
  return new;
end;
$$;
