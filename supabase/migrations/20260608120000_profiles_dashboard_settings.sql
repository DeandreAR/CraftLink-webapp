alter table public.profiles
  add column if not exists whatsapp_clicks_this_month integer not null default 0;

alter table public.profiles
  add column if not exists whatsapp_clicks_month_key text;

alter table public.profiles
  add column if not exists voice_capture_enabled boolean not null default false;
