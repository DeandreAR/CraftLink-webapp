-- Analytics vitrine artisan (vues, clics contact, clics Sélection Pro)
-- CraftLink : profile_id → profiles (pas de table pages)

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null
    check (
      event_type in (
        'page_view',
        'click_whatsapp',
        'click_affiliate',
        'form_submit',
        'voice_sent'
      )
    ),
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_profile_created_idx
  on public.analytics_events (profile_id, created_at desc);

create index if not exists analytics_events_profile_type_created_idx
  on public.analytics_events (profile_id, event_type, created_at desc);

alter table public.analytics_events enable row level security;

-- Artisan lit ses propres events
drop policy if exists "analytics_events_select_own" on public.analytics_events;
create policy "analytics_events_select_own"
  on public.analytics_events for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = analytics_events.profile_id
        and p.id = auth.uid()
    )
  );

-- Inserts publics via service role (API route) — pas d'insert anon RLS
-- (évite le spam RLS ; la route API valide le slug)
