# ViGo mobile + visitor check-in update

## Giao diện
- Tăng kích thước logo ViGo trên mobile.
- Wordmark mới: “Vi” đỏ, “Go” xanh lá, ngôi sao vàng thay dấu chấm chữ i.
- Mục điều hướng “Top 10 / Check-in” hiển thị thành hai dòng trên màn hình nhỏ.
- Thẻ địa điểm thuộc danh mục Check-in ẩn giá và có nút Check-in.
- Visitor nhập họ tên để ghi nhận check-in, không cần đăng nhập.

## Bắt buộc chạy migration Supabase một lần
1. Mở Supabase Dashboard → SQL Editor.
2. Chạy toàn bộ nội dung `supabase/migration_place_checkins.sql`.
3. Commit/push mã nguồn lên GitHub hoặc tải ZIP này lên repo rồi triển khai lại trên Vercel.

Check-in được ghi vào bảng `public.place_checkins`. Bảng chỉ cho phép insert qua policy; bản ghi và tên visitor không được đọc trực tiếp công khai.
