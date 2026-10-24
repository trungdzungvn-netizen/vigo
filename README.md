# ViGo
Starter project for a Vietnamese travel and food review web app built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase SSR and PostgreSQL.

## Requirements
Node.js 20.9+, Supabase project, GitHub account and Vercel account.

## Install
```bash
npm install
cp .env.example .env.local
npm run dev
```
Fill `.env.local` with your Supabase Project URL and publishable key. Never put a service-role/secret key in a `NEXT_PUBLIC_*` variable.

## Database
Open Supabase Dashboard → SQL Editor and run `supabase/schema.sql` once.

## Auth
In Supabase → Authentication → URL Configuration, set local Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback`. Add the production callback after deploying. For Google OAuth, configure Google provider credentials in Supabase.

## Storage
Create buckets `place-images` and `review-images`. Public image buckets need read access policies and authenticated insert policies that restrict object paths to the user's UID folder. Keep uploads under `<user-id>/<uuid>.jpg`; never allow anonymous uploads. For private images, use signed URLs.

## GitHub + Vercel
```bash
npm run build
git init
git add .
git commit -m "Initial ViGo app"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/vietvivu.git
git push -u origin main
```
On Vercel choose Add New → Project → import the GitHub repo. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production, Preview and Development, then redeploy after changes.

## Starter limitations to complete before production
- Place submissions default to `pending`, and a moderation/admin workflow is required to publish them.
- Image upload UI for places and reviews is not implemented; database supports image URL arrays.
- Favorites listing and schema are included, but the save/unsave button needs a client component/server action.
- Add pagination, rate limiting, moderation, error boundaries and tests before launch.


## Tạo tài khoản quản trị (Admin)

1. Deploy ứng dụng và mở `/login`, tạo tài khoản bằng email/mật khẩu. Nếu bật xác nhận email trong Supabase, hãy xác nhận email trước khi đăng nhập.
2. Trong Supabase Dashboard → SQL Editor, chạy lệnh dưới đây, thay email bằng email admin đã đăng ký:

```sql
update public.profiles p
set is_admin = true
from auth.users u
where p.id = u.id and lower(u.email) = lower('admin@yourdomain.com');
```

3. Đăng xuất/đăng nhập lại, mở `/admin`. Admin có thể đăng địa điểm trực tiếp ở trạng thái `published`, duyệt bài cộng đồng, ẩn bài hoặc xóa bài. Tài khoản thường chỉ gửi địa điểm ở trạng thái `pending`.
4. Nếu câu lệnh cập nhật 0 dòng, kiểm tra tài khoản đã đăng ký và trigger `handle_new_user` đã tạo profile chưa. Không cho phép người dùng tự đặt `is_admin`; chỉ quản trị viên dự án nên chạy câu SQL này.

Sau khi cập nhật `supabase/schema.sql` trên project Supabase đã chạy trước đó, hãy chạy lại phần SQL mới bổ sung `is_admin`, hàm `is_current_user_admin`, các policy admin và quyền cập nhật cột profile. Không chạy lại toàn bộ file cũ nếu gặp lỗi “already exists”; hãy chạy riêng phần bổ sung admin ở cuối file.


## Chỉnh sửa địa điểm, tải ảnh và Google Maps

1. Chạy `supabase/migration_edit_images_maps.sql` trong Supabase SQL Editor.
2. Xác nhận tài khoản Admin có `profiles.is_admin = true`.
3. Admin mở `/admin` và nhấn `Sửa` cạnh địa điểm; hoặc vào `/places/new` để tạo mới.
4. Ảnh dùng bucket Storage `place-images`; chỉ tài khoản đăng nhập được upload vào thư mục UUID của mình. Ảnh công khai để hiển thị trên thẻ địa điểm.
5. Liên kết Google Maps: mở Google Maps, chọn địa điểm, nhấn Chia sẻ và sao chép liên kết vào trường tương ứng. Có thể điền thêm latitude/longitude.

## Visitor suggestions (anonymous submissions)

1. Run `supabase/migration_visitor_submissions.sql` in Supabase SQL Editor before deploying this version.
2. The migration adds `submitter_name` and `submitter_phone`, permits anonymous users to upload only into `place-images/submissions/`, and allows anonymous `INSERT` only for pending place rows with zero review stats. Keep RLS enabled.
3. `/places/new` is public. Visitors submit one required cover image and optional contact details; their place remains `pending` until an Admin publishes it.
4. The Admin dashboard displays submitter contact information and a link to the submitted image. Admins can approve/reject/hide/delete entries and use the new **Đăng xuất** button.
5. Anonymous public forms can attract spam. For a production launch, add CAPTCHA/rate limiting before promoting the form widely.


## Số điện thoại, đặt giao hàng và liên hệ

Trước khi deploy, chạy `supabase/migration_place_phone.sql` trong Supabase SQL Editor để thêm cột `places.phone`. Sau đó, Admin vào trang sửa địa điểm và nhập số điện thoại. Trang chi tiết sẽ hiển thị nút `Đặt giao hàng` và `Gọi [số điện thoại]`; cả hai mở ứng dụng gọi điện trên điện thoại để khách đặt hàng/liên hệ trực tiếp.


### Logo ViGo
- Logo SVG tuỳ chỉnh nằm tại `public/vigo-logo.svg`.
- Header responsive: logo nổi bật hơn, menu co giãn trên điện thoại và máy tính.


## Homepage city links and direct place details
- City chips on the homepage are clickable and filter by city, including Vũng Tàu.
- Each place card on the homepage links directly to `/place/[id]` when clicked.
- For Vũng Tàu records, use `city = 'Vũng Tàu'` in Supabase so the homepage chip matches.
