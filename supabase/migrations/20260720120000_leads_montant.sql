-- Montant estimé du devis / chantier (stats CA)
alter table public.leads
  add column if not exists montant numeric(12, 2);

comment on column public.leads.montant is
  'Montant estimé du devis (€). Utilisé pour le CA signé et le volume en attente.';
