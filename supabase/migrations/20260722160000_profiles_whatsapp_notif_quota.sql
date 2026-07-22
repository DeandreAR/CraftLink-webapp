-- Quota notifications WhatsApp artisan (30 / mois calendaire d'anniversaire).
alter table public.profiles
  add column if not exists whatsapp_quota_used integer not null default 0,
  add column if not exists quota_reset_date timestamptz;

comment on column public.profiles.whatsapp_quota_used is
  'Notifications WhatsApp (nouvelle demande) consommées sur la période courante.';
comment on column public.profiles.quota_reset_date is
  'Prochaine date de réinitialisation du quota WhatsApp (anniversaire +1 mois).';

-- Backfill : prochaine date = created_at + 1 mois (ou maintenant + 1 mois).
update public.profiles
set quota_reset_date = coalesce(created_at, now()) + interval '1 month'
where quota_reset_date is null;

alter table public.profiles
  alter column quota_reset_date set default (now() + interval '1 month');

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
    is_subscribed,
    whatsapp_quota_used,
    quota_reset_date
  )
  values (
    new.id,
    new.id,
    'ADMIN',
    'ALL_SOURCES',
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'whatsapp_number', null),
    now() + interval '14 days',
    false,
    0,
    now() + interval '1 month'
  )
  on conflict (id) do update set
    workspace_id = coalesce(public.profiles.workspace_id, excluded.workspace_id),
    role = coalesce(public.profiles.role, excluded.role),
    plan_tier = coalesce(public.profiles.plan_tier, excluded.plan_tier),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    whatsapp_number = coalesce(public.profiles.whatsapp_number, excluded.whatsapp_number),
    trial_ends_at = coalesce(public.profiles.trial_ends_at, excluded.trial_ends_at),
    quota_reset_date = coalesce(public.profiles.quota_reset_date, excluded.quota_reset_date);
  return new;
end;
$$;
