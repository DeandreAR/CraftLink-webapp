-- Journal de consommation API (LLM, Whisper, imports) — réservé service role / admin dashboard.
create table if not exists public.api_usage_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  provider text not null,
  model text not null,
  operation text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_usd numeric(12, 6) not null default 0,
  workspace_id uuid references auth.users (id) on delete set null,
  success boolean not null default true,
  error_message text
);

create index if not exists api_usage_logs_created_at_idx
  on public.api_usage_logs (created_at desc);

create index if not exists api_usage_logs_workspace_id_idx
  on public.api_usage_logs (workspace_id);

alter table public.api_usage_logs enable row level security;

-- Pas de policy publique : lecture/écriture via service role uniquement.
