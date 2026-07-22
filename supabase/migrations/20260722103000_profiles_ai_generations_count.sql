-- Quota générations IA (import magic) : Essentiel / essai = 2 max, Pro payant = illimité.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_generations_count integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.profiles.ai_generations_count IS
  'Nombre de générations IA consommées (import Google/Instagram/Facebook).';
