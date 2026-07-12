-- Certifications & diplômes artisan (badges textuels sur la vitrine publique)
alter table public.profiles
  add column if not exists certifications text[] not null default '{}';

comment on column public.profiles.certifications is
  'Labels affichés sur la vitrine publique (ex. RGE, Qualibat, CAP Électricien).';
