-- URL publique artisan : /p/{page_slug}
alter table public.profiles add column if not exists page_slug text;

create unique index if not exists profiles_page_slug_unique
  on public.profiles (page_slug)
  where page_slug is not null;
