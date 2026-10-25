-- Allow public reviews without login; display only the reviewer's name.
-- Run once in Supabase SQL Editor.

alter table public.reviews add column if not exists reviewer_name text;

-- Backfill existing reviews with the account display name before making the field required.
update public.reviews r
set reviewer_name = coalesce(nullif(trim(p.display_name), ''), 'Thành viên ViGo')
from public.profiles p
where p.id = r.user_id and (r.reviewer_name is null or trim(r.reviewer_name) = '');

update public.reviews
set reviewer_name = 'Khách ViGo'
where reviewer_name is null or trim(reviewer_name) = '';

alter table public.reviews alter column reviewer_name set not null;
alter table public.reviews alter column reviewer_name set default 'Khách ViGo';
alter table public.reviews alter column user_id drop not null;

-- Public users cannot insert arbitrary rows directly; all new reviews pass through this validated RPC.
revoke insert, update, delete on public.reviews from anon;
grant select on public.reviews to anon;

create or replace function public.submit_place_review(
  place_id_input uuid,
  reviewer_name_input text,
  rating_input integer,
  rating_detail_input jsonb,
  comment_input text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_review_id uuid;
  clean_name text;
  clean_comment text;
begin
  clean_name := regexp_replace(trim(coalesce(reviewer_name_input, '')), '\s+', ' ', 'g');
  clean_comment := trim(coalesce(comment_input, ''));

  if char_length(clean_name) < 2 or char_length(clean_name) > 100 then
    raise exception 'Họ tên phải từ 2 đến 100 ký tự.';
  end if;
  if rating_input is null or rating_input < 1 or rating_input > 5 then
    raise exception 'Điểm đánh giá phải từ 1 đến 5.';
  end if;
  if char_length(clean_comment) < 5 or char_length(clean_comment) > 3000 then
    raise exception 'Nhận xét phải từ 5 đến 3000 ký tự.';
  end if;
  if jsonb_typeof(rating_detail_input) <> 'object'
    or coalesce((rating_detail_input->>'food_scenery')::integer, 0) not between 1 and 5
    or coalesce((rating_detail_input->>'space')::integer, 0) not between 1 and 5
    or coalesce((rating_detail_input->>'service')::integer, 0) not between 1 and 5
    or coalesce((rating_detail_input->>'price')::integer, 0) not between 1 and 5 then
    raise exception 'Điểm đánh giá chi tiết không hợp lệ.';
  end if;
  if not exists (select 1 from public.places p where p.id = place_id_input and p.status = 'published') then
    raise exception 'Địa điểm không tồn tại hoặc chưa được công khai.';
  end if;

  -- user_id intentionally remains NULL: only the name supplied by the visitor is recorded.
  insert into public.reviews (user_id, place_id, reviewer_name, rating, rating_detail, comment)
  values (null, place_id_input, clean_name, rating_input, rating_detail_input, clean_comment)
  returning id into new_review_id;

  return new_review_id;
end;
$$;

revoke all on function public.submit_place_review(uuid, text, integer, jsonb, text) from public;
grant execute on function public.submit_place_review(uuid, text, integer, jsonb, text) to anon, authenticated;
