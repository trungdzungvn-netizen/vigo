# ViGo — Thiết kế lại trang chủ

## Thay đổi
- Hero mới dạng hai cột, màu xanh đậm/emerald, CTA rõ ràng và ảnh minh họa dạng collage trên desktop.
- Giữ nguyên liên kết thành phố, bộ lọc Supabase, Top 10 Check-in, danh mục và dữ liệu địa điểm.
- Thêm 3 thẻ danh mục trực quan: Ăn uống, Quán cà phê, Check-in & du lịch.
- Tổ chức lại khu vực Top 10 Check-in và tiêu đề danh sách địa điểm.
- Thẻ địa điểm chưa có `cover_image` hiển thị ảnh minh họa theo danh mục thay cho khung trống; ảnh được ghi nhãn “Ảnh minh họa”. Ảnh thật trong Supabase vẫn được ưu tiên.
- Giữ nguyên header/footer và link đăng nhập quản trị ở cuối trang.

## Triển khai
1. Giải nén ZIP.
2. Cập nhật các file trong thư mục `vietvivu-reviewfix` lên GitHub, giữ nguyên các biến môi trường Vercel/Supabase.
3. Commit và push lên nhánh đang triển khai (thường là `main`).
4. Kiểm tra deployment trong Vercel.

Lưu ý: Ảnh minh họa được tải từ Unsplash qua URL trong mã nguồn; ảnh cover đã lưu trong Supabase sẽ được ưu tiên nếu có.
