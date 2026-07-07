-- Pièces jointes artisan (devis / factures) + bucket Storage

alter table public.leads
  add column if not exists attachments jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lead-documents',
  'lead-documents',
  true,
  5242880,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/gif'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "lead_documents_select_workspace" on storage.objects;
create policy "lead_documents_select_workspace"
  on storage.objects for select
  using (
    bucket_id = 'lead-documents'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );

drop policy if exists "lead_documents_insert_workspace" on storage.objects;
create policy "lead_documents_insert_workspace"
  on storage.objects for insert
  with check (
    bucket_id = 'lead-documents'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );

drop policy if exists "lead_documents_delete_workspace" on storage.objects;
create policy "lead_documents_delete_workspace"
  on storage.objects for delete
  using (
    bucket_id = 'lead-documents'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and split_part(name, '/', 1) = coalesce(p.workspace_id, p.id)::text
    )
  );
