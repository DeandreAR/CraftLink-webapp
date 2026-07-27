-- Historique des changements d'URL publique (max 2 / 12 mois glissants)
alter table public.profiles
  add column if not exists page_slug_change_dates timestamptz[] not null default '{}';

comment on column public.profiles.page_slug_change_dates is
  'Dates des changements de page_slug (quota 2 / an glissant).';
