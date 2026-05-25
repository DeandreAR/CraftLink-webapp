-- Ajoute ALL_SOURCES à l'enum plan_tier (erreur 22P02 si absent).
-- Exécuter dans Supabase → SQL Editor.

do $$
declare
  enum_name name;
begin
  select c.udt_name
  into enum_name
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'profiles'
    and c.column_name = 'plan_tier';

  if enum_name is null then
    return;
  end if;

  if exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = enum_name
      and t.typtype = 'e'
  ) then
    execute format(
      'alter type public.%I add value if not exists %L',
      enum_name,
      'ALL_SOURCES'
    );
  end if;
exception
  when duplicate_object then
    null;
end $$;

-- Valeur par défaut côté table (enum ou text)
alter table public.profiles
  alter column plan_tier set default 'ALL_SOURCES';

update public.profiles
set plan_tier = 'ALL_SOURCES'
where plan_tier is null;

-- Trigger aligné
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
    role = coalesce(public.profiles.role, excluded.role),
    plan_tier = coalesce(public.profiles.plan_tier, excluded.plan_tier),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    whatsapp_number = coalesce(public.profiles.whatsapp_number, excluded.whatsapp_number);
  return new;
end;
$$;
