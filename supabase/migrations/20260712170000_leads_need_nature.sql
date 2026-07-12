-- Nature du besoin (optionnel) saisie par le client sur la vitrine publique.
alter table public.leads
  add column if not exists need_nature text;

comment on column public.leads.need_nature is
  'Nature du besoin choisie par le client (liste dépendante du métier artisan).';
