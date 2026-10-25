# Fix lỗi đánh giá ViGo — không cần đăng nhập

## Thay đổi
- Bỏ yêu cầu đăng nhập khi gửi đánh giá.
- Bắt buộc nhập họ tên (2–100 ký tự); chỉ lưu họ tên khách cung cấp, không gắn đánh giá mới với tài khoản.
- Dùng RPC `submit_place_review` để kiểm tra dữ liệu và ghi đánh giá an toàn.
- Hiển thị họ tên người bình luận trên trang chi tiết.
- Lỗi gửi đánh giá được hiển thị trong biểu mẫu thay vì làm trang phát sinh Application error.

## Cập nhật Supabase bắt buộc
1. Mở Supabase Dashboard → SQL Editor.
2. Mở và chạy toàn bộ `supabase/migration_public_reviews.sql`.
3. Đảm bảo dự án có `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (hoặc cấu hình client hiện tại tương ứng) trong Vercel.

## Triển khai
Đưa các thay đổi trong thư mục dự án lên GitHub để Vercel build lại. Migration SQL phải chạy trước khi kiểm tra gửi review, vì mã mới dùng cột `reviewer_name` và hàm RPC `submit_place_review`.

Ghi chú: migration giữ nguyên các review cũ, điền tên từ hồ sơ hiện có khi có thể; review mới lưu `user_id = NULL` và tên do khách nhập. Không lưu email hoặc thông tin tài khoản cho review mới.
