-- Sélection Pro : crée recommended_items si absente, puis ajoute link_kind.
-- Autonome : OK même si 20260724180000_unify_recommended_items n’a pas été appliquée.

create extension if not exists pgcrypto;

create table if not exists public.recommended_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  discount_code text,
  url text not null,
  image_url text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists recommended_items_profile_position_idx
  on public.recommended_items (profile_id, position);

create index if not exists recommended_items_profile_active_idx
  on public.recommended_items (profile_id)
  where is_active = true;

alter table public.recommended_items enable row level security;

drop policy if exists "recommended_items_select_own" on public.recommended_items;
create policy "recommended_items_select_own"
  on public.recommended_items for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = recommended_items.profile_id
        and p.id = auth.uid()
    )
  );

drop policy if exists "recommended_items_select_public_active" on public.recommended_items;
create policy "recommended_items_select_public_active"
  on public.recommended_items for select
  using (is_active = true);

drop policy if exists "recommended_items_insert_own" on public.recommended_items;
create policy "recommended_items_insert_own"
  on public.recommended_items for insert
  with check (profile_id = auth.uid());

drop policy if exists "recommended_items_update_own" on public.recommended_items;
create policy "recommended_items_update_own"
  on public.recommended_items for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "recommended_items_delete_own" on public.recommended_items;
create policy "recommended_items_delete_own"
  on public.recommended_items for delete
  using (profile_id = auth.uid());

-- Type de lien : Amazon | affiliation | autre
alter table public.recommended_items
  add column if not exists link_kind text not null default 'other';

alter table public.recommended_items
  drop constraint if exists recommended_items_link_kind_check;

alter table public.recommended_items
  add constraint recommended_items_link_kind_check
  check (link_kind in ('amazon', 'affiliate', 'other'));

comment on column public.recommended_items.link_kind is
  'Type de lien : amazon | affiliate | other (marque, boutique…).';

-- Heuristique : URLs Amazon déjà présentes
update public.recommended_items
set link_kind = 'amazon'
where link_kind = 'other'
  and (
    url ~* 'amazon\.'
    or url ~* 'amzn\.'
    or url ~* '(^|://|www\.)a\.co(/|$)'
  );
