-- ViGo: allow visitors to check in without creating an account.
create table if not exists public.place_checkins (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  visitor_name text not null check (char_length(trim(visitor_name)) between 2 and 80),
  created_at timestamptz not null default now()
);

create index if not exists place_checkins_place_created_idx
  on public.place_checkins(place_id, created_at desc);

alter table public.place_checkins enable row level security;

grant insert on public.place_checkins to anon, authenticated;
-- Public visitor names and check-in records are not readable directly from the browser.
-- Insert-only policy lets the server action record a check-in without login.
drop policy if exists "Visitors can submit checkins" on public.place_checkins;
create policy "Visitors can submit checkins"
  on public.place_checkins for insert to anon, authenticated
  with check (
    char_length(trim(visitor_name)) between 2 and 80
    and exists (
      select 1 from public.places p
      where p.id = place_id
        and p.status = 'published'
        and p.category::text in ('Check-in', 'Check-in/Du lịch')
    )
  );
