-- Token secret pour abonnement calendrier ICS (un lien, tous les RDV).
alter table public.profiles
  add column if not exists calendar_feed_token text;

comment on column public.profiles.calendar_feed_token is
  'Jeton opaque pour le flux ICS public /api/calendar/feed/[token] (abonnement agenda).';

create unique index if not exists profiles_calendar_feed_token_uidx
  on public.profiles (calendar_feed_token)
  where calendar_feed_token is not null;
