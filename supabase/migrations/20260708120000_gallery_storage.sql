-- Galerie portfolio artisan (photos directes compressées WebP)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  2097152,
  array['image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "gallery_select_public" on storage.objects;
create policy "gallery_select_public"
  on storage.objects for select
  using (bucket_id = 'gallery');

drop policy if exists "gallery_insert_workspace" on storage.objects;
create policy "gallery_insert_workspace"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );

drop policy if exists "gallery_delete_workspace" on storage.objects;
create policy "gallery_delete_workspace"
  on storage.objects for delete
  using (
    bucket_id = 'gallery'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );
