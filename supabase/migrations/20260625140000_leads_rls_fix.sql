-- Corrige workspace_id null sur profiles + RLS leads (coalesce workspace_id, id)

update public.profiles
set workspace_id = id
where workspace_id is null;

-- Colonnes manquantes si une ancienne table leads existait déjà
alter table public.leads add column if not exists request_number integer;
alter table public.leads add column if not exists client_name text;
alter table public.leads add column if not exists client_phone text not null default '';
alter table public.leads add column if not exists work_type text not null default '';
alter table public.leads add column if not exists zone text not null default '';
alter table public.leads add column if not exists delay_status text not null default 'asap';
alter table public.leads add column if not exists workflow_status text not null default 'active';
alter table public.leads add column if not exists contact_status text not null default 'pending';
alter table public.leads add column if not exists contacted_at timestamptz;
alter table public.leads add column if not exists description text not null default '';
alter table public.leads add column if not exists summary text not null default '';
alter table public.leads add column if not exists voice jsonb;
alter table public.leads add column if not exists photos jsonb not null default '[]'::jsonb;
alter table public.leads add column if not exists schedule jsonb;
alter table public.leads add column if not exists updated_at timestamptz not null default now();

update public.leads
set request_number = coalesce(request_number, 3800)
where request_number is null;

alter table public.leads enable row level security;

drop policy if exists "leads_select_workspace" on public.leads;
create policy "leads_select_workspace"
  on public.leads for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and coalesce(p.workspace_id, p.id) = leads.workspace_id
    )
  );

drop policy if exists "leads_insert_workspace" on public.leads;
create policy "leads_insert_workspace"
  on public.leads for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and coalesce(p.workspace_id, p.id) = leads.workspace_id
    )
  );

drop policy if exists "leads_update_workspace" on public.leads;
create policy "leads_update_workspace"
  on public.leads for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and coalesce(p.workspace_id, p.id) = leads.workspace_id
    )
  );

drop policy if exists "leads_delete_workspace" on public.leads;
create policy "leads_delete_workspace"
  on public.leads for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and coalesce(p.workspace_id, p.id) = leads.workspace_id
    )
  );
