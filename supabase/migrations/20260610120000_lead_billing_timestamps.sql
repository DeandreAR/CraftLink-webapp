-- Horodages devis / facture + statuts pipeline étendus

alter table public.leads add column if not exists quote_sent_at timestamptz;
alter table public.leads add column if not exists invoice_sent_at timestamptz;

alter table public.leads drop constraint if exists leads_workflow_status_check;

update public.leads
set quote_sent_at = coalesce(quote_sent_at, updated_at)
where workflow_status in ('DEVIS_ENVOYE', 'DEVIS_SIGNE', 'FACTURE_A_ENVOYER', 'FACTURE_ENVOYEE', 'GAGNE_EN_COURS')
  and quote_sent_at is null;

alter table public.leads add constraint leads_workflow_status_check
  check (workflow_status in (
    'A_TRAITER',
    'DEVIS_A_FAIRE',
    'DEVIS_ENVOYE',
    'DEVIS_SIGNE',
    'FACTURE_A_ENVOYER',
    'FACTURE_ENVOYEE',
    'GAGNE_EN_COURS',
    'ARCHIVE'
  ));
