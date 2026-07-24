-- Unifie Marques + Liens d'affiliation + Sélection Pro → recommended_items
-- CraftLink : profile_id (pas de table pages)

-- ---------------------------------------------------------------------------
-- recommended_items
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Migrate depuis recommended_products (si présente)
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.recommended_products') is not null then
    insert into public.recommended_items (
      id, profile_id, title, description, discount_code, url, image_url, position, is_active, created_at
    )
    select
      rp.id,
      rp.profile_id,
      rp.title,
      nullif(trim(concat_ws(' — ', nullif(rp.brand, ''), nullif(rp.description, ''))), ''),
      nullif(rp.price_hint, ''),
      rp.affiliate_url,
      nullif(rp.image_url, ''),
      rp.position,
      rp.is_active,
      rp.created_at
    from public.recommended_products rp
    on conflict (id) do nothing;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Migrate liens d'affiliation JSON → recommended_items
-- ---------------------------------------------------------------------------
insert into public.recommended_items (
  profile_id, title, description, discount_code, url, image_url, position, is_active
)
select
  p.id,
  coalesce(nullif(trim(link->>'label'), ''), 'Lien partenaire'),
  null,
  nullif(trim(link->>'discount'), ''),
  coalesce(nullif(trim(link->>'url'), ''), 'https://'),
  nullif(trim(link->>'imageUrl'), ''),
  coalesce((link->>'position')::int, ord.ordinality::int - 1),
  true
from public.profiles p
cross join lateral jsonb_array_elements(
  coalesce(p.vitrine_presentation->'profile'->'affiliateLinks', '[]'::jsonb)
) with ordinality as ord(link, ordinality)
where nullif(trim(link->>'url'), '') is not null
  and not exists (
    select 1
    from public.recommended_items ri
    where ri.profile_id = p.id
      and ri.url = nullif(trim(link->>'url'), '')
      and ri.title = coalesce(nullif(trim(link->>'label'), ''), 'Lien partenaire')
  );

-- ---------------------------------------------------------------------------
-- Drop ancienne table
-- ---------------------------------------------------------------------------
drop table if exists public.recommended_products cascade;
