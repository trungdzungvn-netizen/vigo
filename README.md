# ViệtVivu
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
git commit -m "Initial VietVivu app"
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
