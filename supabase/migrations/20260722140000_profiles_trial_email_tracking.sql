-- Suivi des e-mails séquence essai Pro (J+7, J+12, expiration).
alter table public.profiles
  add column if not exists trial_email_mid_sent_at timestamptz,
  add column if not exists trial_email_warning_sent_at timestamptz,
  add column if not exists trial_email_expired_sent_at timestamptz;

comment on column public.profiles.trial_email_mid_sent_at is
  'E-mail milieu d''essai (J+7) envoyé via Resend.';
comment on column public.profiles.trial_email_warning_sent_at is
  'E-mail J-2 avant fin d''essai envoyé via Resend.';
comment on column public.profiles.trial_email_expired_sent_at is
  'E-mail fin d''essai (expiration) envoyé via Resend.';

create index if not exists profiles_trial_ends_at_idx
  on public.profiles (trial_ends_at)
  where is_subscribed = false and trial_ends_at is not null;
