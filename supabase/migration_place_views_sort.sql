-- ViGo: sort places by rating or most viewed.
-- Run this file once in Supabase Dashboard > SQL Editor.
alter table public.places
  add column if not exists view_count bigint not null default 0;

create index if not exists places_view_count_idx
  on public.places (view_count desc, average_rating desc, total_reviews desc)
  where status = 'published';

create or replace function public.increment_place_view_count(place_id_input uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.places
     set view_count = view_count + 1
   where id = place_id_input
     and status = 'published';
$$;

revoke all on function public.increment_place_view_count(uuid) from public;
grant execute on function public.increment_place_view_count(uuid) to anon, authenticated;
