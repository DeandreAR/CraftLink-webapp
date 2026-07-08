-- Stats stockage bucket gallery pour le dashboard admin (service role uniquement).
create or replace function public.admin_gallery_storage_stats()
returns table (object_count bigint, total_bytes bigint)
language sql
security definer
set search_path = public, storage
as $$
  select
    count(*)::bigint as object_count,
    coalesce(sum((metadata->>'size')::bigint), 0)::bigint as total_bytes
  from storage.objects
  where bucket_id = 'gallery';
$$;

revoke all on function public.admin_gallery_storage_stats() from public;
grant execute on function public.admin_gallery_storage_stats() to service_role;
