-- Données éditables de la vitrine (dashboard + snapshot onboarding)
alter table public.profiles
  add column if not exists vitrine_presentation jsonb;
