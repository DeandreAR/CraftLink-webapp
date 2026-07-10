-- Pipeline CRM à 5 statuts + limite upload 5 Mo

alter table public.leads drop constraint if exists leads_workflow_status_check;

update public.leads
set workflow_status = case workflow_status
  when 'active' then 'A_TRAITER'
  when 'done' then 'DEVIS_ENVOYE'
  when 'archived' then 'ARCHIVE'
  else workflow_status
end;

alter table public.leads
  alter column workflow_status set default 'A_TRAITER';

alter table public.leads add constraint leads_workflow_status_check
  check (workflow_status in (
    'A_TRAITER',
    'DEVIS_A_FAIRE',
    'DEVIS_ENVOYE',
    'GAGNE_EN_COURS',
    'ARCHIVE'
  ));

update storage.buckets
set file_size_limit = 5242880
where id = 'lead-documents';
