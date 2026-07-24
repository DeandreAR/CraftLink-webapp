-- Header settings live in profiles.vitrine_presentation JSON (no `pages` table in CraftLink).
-- Recommended products + banners bucket for "La Sélection Pro".

-- ---------------------------------------------------------------------------
-- recommended_products
-- ---------------------------------------------------------------------------
create table if not exists public.recommended_products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  brand text,
  image_url text not null,
  affiliate_url text not null,
  price_hint text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists recommended_products_profile_position_idx
  on public.recommended_products (profile_id, position);

create index if not exists recommended_products_profile_active_idx
  on public.recommended_products (profile_id)
  where is_active = true;

alter table public.recommended_products enable row level security;

drop policy if exists "recommended_products_select_own" on public.recommended_products;
create policy "recommended_products_select_own"
  on public.recommended_products for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = recommended_products.profile_id
        and p.id = auth.uid()
    )
  );

-- Public read of active products for published vitrines (anon + authenticated).
drop policy if exists "recommended_products_select_public_active" on public.recommended_products;
create policy "recommended_products_select_public_active"
  on public.recommended_products for select
  using (is_active = true);

drop policy if exists "recommended_products_insert_own" on public.recommended_products;
create policy "recommended_products_insert_own"
  on public.recommended_products for insert
  with check (
    profile_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
    )
  );

drop policy if exists "recommended_products_update_own" on public.recommended_products;
create policy "recommended_products_update_own"
  on public.recommended_products for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "recommended_products_delete_own" on public.recommended_products;
create policy "recommended_products_delete_own"
  on public.recommended_products for delete
  using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage bucket: banners
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'banners',
  'banners',
  true,
  3145728,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "banners_select_public" on storage.objects;
create policy "banners_select_public"
  on storage.objects for select
  using (bucket_id = 'banners');

drop policy if exists "banners_insert_workspace" on storage.objects;
create policy "banners_insert_workspace"
  on storage.objects for insert
  with check (
    bucket_id = 'banners'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );

drop policy if exists "banners_delete_workspace" on storage.objects;
create policy "banners_delete_workspace"
  on storage.objects for delete
  using (
    bucket_id = 'banners'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );
