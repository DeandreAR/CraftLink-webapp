-- E-mail client pour accusé de réception (capture publique)

alter table public.leads add column if not exists client_email text;
