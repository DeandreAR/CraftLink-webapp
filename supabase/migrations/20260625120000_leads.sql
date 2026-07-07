-- Table leads (CRM artisan) + RLS workspace
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references auth.users (id) on delete cascade,
  request_number integer not null,
  client_name text not null,
  client_phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  work_type text not null default '',
  zone text not null default '',
  delay_status text not null default 'asap'
    check (delay_status in ('urgent', 'asap', 'planned', 'info')),
  workflow_status text not null default 'active'
    check (workflow_status in ('active', 'done', 'archived')),
  contact_status text not null default 'pending'
    check (contact_status in ('pending', 'contacted')),
  contacted_at timestamptz,
  description text not null default '',
  summary text not null default '',
  voice jsonb,
  photos jsonb not null default '[]'::jsonb,
  schedule jsonb
);

create unique index if not exists leads_workspace_request_number_idx
  on public.leads (workspace_id, request_number);

create index if not exists leads_workspace_created_at_idx
  on public.leads (workspace_id, created_at desc);

create or replace function public.assign_lead_request_number()
returns trigger
language plpgsql
as $$
begin
  if new.request_number is null or new.request_number = 0 then
    select coalesce(max(request_number), 3800) + 1
    into new.request_number
    from public.leads
    where workspace_id = new.workspace_id;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_assign_request_number on public.leads;
create trigger leads_assign_request_number
  before insert on public.leads
  for each row execute function public.assign_lead_request_number();

create or replace function public.leads_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.leads_set_updated_at();

alter table public.leads enable row level security;

drop policy if exists "leads_select_workspace" on public.leads;
create policy "leads_select_workspace"
  on public.leads for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.workspace_id = leads.workspace_id
    )
  );

drop policy if exists "leads_insert_workspace" on public.leads;
create policy "leads_insert_workspace"
  on public.leads for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.workspace_id = leads.workspace_id
    )
  );

drop policy if exists "leads_update_workspace" on public.leads;
create policy "leads_update_workspace"
  on public.leads for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.workspace_id = leads.workspace_id
    )
  );

drop policy if exists "leads_delete_workspace" on public.leads;
create policy "leads_delete_workspace"
  on public.leads for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.workspace_id = leads.workspace_id
    )
  );
