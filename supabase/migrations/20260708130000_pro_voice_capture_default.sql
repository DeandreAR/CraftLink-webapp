-- Capture vocale activée par défaut pour les artisans Pro existants
update public.profiles
set voice_capture_enabled = true
where plan_tier = 'PRO'
  and voice_capture_enabled = false;
