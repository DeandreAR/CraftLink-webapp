-- Demandes de partenariat B2B (formulaire vitrine « Partenariats & Marques »)
create table if not exists public.partnership_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references auth.users (id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  job_title text not null default '',
  email text not null,
  phone text not null default '',
  partnership_type text not null
    check (partnership_type in ('advertising', 'ugc', 'product_test', 'other')),
  budget_range text
    check (
      budget_range is null
      or budget_range in ('under_5k', 'from_5k_to_15k', 'from_15k_to_50k', 'over_50k', 'undisclosed')
    ),
  budget_approximate text,
  message text not null default '',
  workflow_status text not null default 'A_TRAITER'
    check (workflow_status in ('A_TRAITER', 'CONTACTE', 'ARCHIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partnership_requests_workspace_created_idx
  on public.partnership_requests (workspace_id, created_at desc);

create or replace function public.partnership_requests_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partnership_requests_set_updated_at on public.partnership_requests;
create trigger partnership_requests_set_updated_at
  before update on public.partnership_requests
  for each row execute function public.partnership_requests_set_updated_at();

alter table public.partnership_requests enable row level security;

drop policy if exists "partnership_requests_select_workspace" on public.partnership_requests;
create policy "partnership_requests_select_workspace"
  on public.partnership_requests for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.workspace_id = partnership_requests.workspace_id
    )
  );

drop policy if exists "partnership_requests_update_workspace" on public.partnership_requests;
create policy "partnership_requests_update_workspace"
  on public.partnership_requests for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.workspace_id = partnership_requests.workspace_id
    )
  );
