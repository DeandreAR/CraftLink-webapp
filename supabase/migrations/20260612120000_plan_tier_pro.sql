-- Ajoute PRO à l'enum plan_tier (activation Stripe / tests manuels).

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
      'PRO'
    );
  end if;
exception
  when duplicate_object then
    null;
end $$;
