-- Mise à niveau idempotente : ajoute workspace_id / role / plan_tier si la table existait déjà sans ces colonnes.
-- À exécuter dans Supabase → SQL Editor si la connexion échoue avec :
--   column profiles.workspace_id does not exist (code 42703)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  workspace_id uuid references auth.users (id) on delete cascade,
  role text default 'ADMIN',
  plan_tier text default 'ALL_SOURCES',
  full_name text,
  whatsapp_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists workspace_id uuid references auth.users (id) on delete cascade;
alter table public.profiles add column if not exists role text default 'ADMIN';
alter table public.profiles add column if not exists plan_tier text default 'ALL_SOURCES';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists whatsapp_number text;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

update public.profiles
set
  workspace_id = coalesce(workspace_id, id),
  role = coalesce(nullif(trim(role), ''), 'ADMIN')
where workspace_id is null
   or role is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'plan_tier'
      and data_type = 'text'
  ) then
    execute $sql$
      update public.profiles
      set plan_tier = coalesce(nullif(trim(plan_tier), ''), 'ALL_SOURCES')
      where plan_tier is null
    $sql$;
  else
    update public.profiles
    set plan_tier = 'ALL_SOURCES'
    where plan_tier is null;
  end if;
end $$;

alter table public.profiles alter column workspace_id set not null;
alter table public.profiles alter column role set default 'ADMIN';
alter table public.profiles alter column role set not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, workspace_id, role, plan_tier, full_name, whatsapp_number)
  values (
    new.id,
    new.id,
    'ADMIN',
    'ALL_SOURCES',
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'whatsapp_number', null)
  )
  on conflict (id) do update set
    workspace_id = coalesce(public.profiles.workspace_id, excluded.workspace_id),
    role = coalesce(nullif(trim(public.profiles.role), ''), excluded.role),
    plan_tier = coalesce(public.profiles.plan_tier, excluded.plan_tier),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    whatsapp_number = coalesce(public.profiles.whatsapp_number, excluded.whatsapp_number);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Profils orphelins : une ligne par utilisateur Auth confirmé sans profil
insert into public.profiles (id, workspace_id, role, plan_tier, full_name, whatsapp_number)
select
  u.id,
  u.id,
  'ADMIN',
  'ALL_SOURCES',
  coalesce(u.raw_user_meta_data->>'full_name', null),
  coalesce(u.raw_user_meta_data->>'whatsapp_number', null)
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
