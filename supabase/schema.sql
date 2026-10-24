-- VietVivu schema. Run once in Supabase SQL Editor.
create extension if not exists pgcrypto;
create type public.place_category as enum ('Ăn uống','Cafe','Check-in','Hotel');
create type public.place_status as enum ('pending','published','rejected');
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text check (char_length(display_name) <= 100), avatar_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.places (
 id uuid primary key default gen_random_uuid(), name text not null check(char_length(name) between 2 and 150), slug text, description text check(char_length(description)<=5000), category public.place_category not null, city text not null check(char_length(city) between 2 and 100), address text not null check(char_length(address) between 4 and 300), price_min integer check(price_min is null or price_min>=0), price_max integer check(price_max is null or price_max>=0), opening_hours text, latitude double precision check(latitude is null or latitude between -90 and 90), longitude double precision check(longitude is null or longitude between -180 and 180), cover_image text, images text[] not null default '{}', average_rating numeric(3,2) not null default 0 check(average_rating between 0 and 5), total_reviews integer not null default 0 check(total_reviews>=0), created_by uuid references auth.users(id) on delete set null, status public.place_status not null default 'pending', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check(price_min is null or price_max is null or price_max>=price_min));
create table public.reviews (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, place_id uuid not null references public.places(id) on delete cascade, rating integer not null check(rating between 1 and 5), rating_detail jsonb not null default '{"food_scenery":5,"space":5,"service":5,"price":5}'::jsonb, comment text not null check(char_length(comment) between 5 and 3000), images text[] not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id,place_id), constraint rating_detail_shape check(jsonb_typeof(rating_detail)='object' and (rating_detail->>'food_scenery')::int between 1 and 5 and (rating_detail->>'space')::int between 1 and 5 and (rating_detail->>'service')::int between 1 and 5 and (rating_detail->>'price')::int between 1 and 5));
create table public.favorites(user_id uuid not null references public.profiles(id) on delete cascade, place_id uuid not null references public.places(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,place_id));
create index places_city_category_idx on public.places(city,category,status);
create index places_rating_idx on public.places(average_rating desc,total_reviews desc);
create index reviews_place_created_idx on public.reviews(place_id,created_at desc);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$ begin insert into public.profiles(id,display_name,avatar_url) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',split_part(new.email,'@',1)),new.raw_user_meta_data->>'avatar_url') on conflict(id) do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.refresh_place_review_stats() returns trigger language plpgsql security definer set search_path='' as $$ declare target_place uuid; begin target_place:=coalesce(new.place_id,old.place_id); update public.places p set average_rating=coalesce((select round(avg(r.rating)::numeric,2) from public.reviews r where r.place_id=target_place),0),total_reviews=(select count(*)::int from public.reviews r where r.place_id=target_place),updated_at=now() where p.id=target_place; if tg_op='UPDATE' and old.place_id is distinct from new.place_id then update public.places p set average_rating=coalesce((select round(avg(r.rating)::numeric,2) from public.reviews r where r.place_id=old.place_id),0),total_reviews=(select count(*)::int from public.reviews r where r.place_id=old.place_id),updated_at=now() where p.id=old.place_id; end if; if tg_op='DELETE' then return old; else return new; end if; end; $$;
create trigger reviews_refresh_stats after insert or update or delete on public.reviews for each row execute procedure public.refresh_place_review_stats();
alter table public.profiles enable row level security; alter table public.places enable row level security; alter table public.reviews enable row level security; alter table public.favorites enable row level security;
create policy "published places are public" on public.places for select to anon,authenticated using(status='published' or created_by=(select auth.uid()));
create policy "authenticated users can submit places" on public.places for insert to authenticated with check(created_by=(select auth.uid()) and status='pending');
create policy "owners can edit pending places" on public.places for update to authenticated using(created_by=(select auth.uid()) and status='pending') with check(created_by=(select auth.uid()) and status='pending');
create policy "owners can delete pending places" on public.places for delete to authenticated using(created_by=(select auth.uid()) and status='pending');
create policy "profiles are public readable" on public.profiles for select to anon,authenticated using(true);
create policy "users insert own profile" on public.profiles for insert to authenticated with check(id=(select auth.uid()));
create policy "users update own profile" on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy "reviews readable for published places" on public.reviews for select to anon,authenticated using(exists(select 1 from public.places p where p.id=place_id and p.status='published'));
create policy "users insert own reviews" on public.reviews for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.places p where p.id=place_id and p.status='published'));
create policy "users update own reviews" on public.reviews for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "users delete own reviews" on public.reviews for delete to authenticated using(user_id=(select auth.uid()));
create policy "users read own favorites" on public.favorites for select to authenticated using(user_id=(select auth.uid()));
create policy "users add own favorites" on public.favorites for insert to authenticated with check(user_id=(select auth.uid()));
create policy "users remove own favorites" on public.favorites for delete to authenticated using(user_id=(select auth.uid()));
revoke all on public.profiles,public.places,public.reviews,public.favorites from anon,authenticated;
grant select on public.profiles,public.places,public.reviews to anon,authenticated;
grant insert,update on public.profiles to authenticated;
grant insert,update,delete on public.places to authenticated;
grant insert,update,delete on public.reviews to authenticated;
grant select,insert,delete on public.favorites to authenticated;


-- Admin role: create a normal Auth account first, then promote it manually in SQL Editor.
alter table public.profiles add column if not exists is_admin boolean not null default false;

create or replace function public.is_current_user_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin = true);
$$;
revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to anon, authenticated;

-- Admins can review and publish any submitted place. Existing owner policies remain active.
create policy "admins can read all places" on public.places
  for select to authenticated using ((select public.is_current_user_admin()));
create policy "admins can insert places" on public.places
  for insert to authenticated with check ((select public.is_current_user_admin()));
create policy "admins can update any place" on public.places
  for update to authenticated using ((select public.is_current_user_admin()))
  with check ((select public.is_current_user_admin()));
create policy "admins can delete any place" on public.places
  for delete to authenticated using ((select public.is_current_user_admin()));

-- Prevent users from granting themselves admin privileges through profile updates.
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url, updated_at) on public.profiles to authenticated;
