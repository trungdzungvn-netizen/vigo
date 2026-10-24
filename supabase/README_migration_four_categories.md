# Cập nhật 4 loại tin đăng ViGo

Các loại mới trong giao diện: **Ăn uống, Cafe, Check-in, Hotel**.

## Nếu dự án Supabase đã có dữ liệu (đang chạy website)

1. Mở Supabase → SQL Editor.
2. Chạy toàn bộ nội dung `migration_four_categories.sql`.
3. Sau khi chạy thành công, triển khai mã nguồn mới lên GitHub/Vercel.

Migration đổi nhãn cũ `Quán cà phê` thành `Cafe` và `Check-in/Du lịch` thành `Check-in`, đồng thời thêm `Hotel`. Các bài `Về đêm` cũ được giữ nguyên dữ liệu để tránh tự động phân loại nhầm thành khách sạn; giao diện đăng tin mới chỉ cho chọn 4 loại yêu cầu.

Nếu tạo database mới từ đầu, `schema.sql` đã dùng sẵn 4 loại chuẩn.
