-- Onboarding terminé uniquement après publication (Essentiel) ou paiement Pro réussi.
alter table public.profiles add column if not exists onboarding_completed_at timestamptz;
