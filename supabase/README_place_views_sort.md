# Sắp xếp địa điểm ViGo: điểm review và lượt xem

## 1. Cập nhật database (bắt buộc)
1. Mở Supabase Dashboard của dự án.
2. Vào SQL Editor > New query.
3. Mở `supabase/migration_place_views_sort.sql`, sao chép toàn bộ nội dung vào SQL Editor và nhấn Run.

Migration thêm cột `view_count`, tạo index và hàm RPC để đếm lượt mở trang chi tiết. Lượt xem bắt đầu từ 0 kể từ lúc migration được chạy; không thể tự khôi phục lượt xem cũ nếu trước đó chưa được ghi nhận.

## 2. Cập nhật website
Đẩy toàn bộ mã nguồn trong thư mục này lên repository GitHub đang kết nối với Vercel. Sau khi deploy:
- **Điểm review cao nhất**: sắp xếp `average_rating` giảm dần, sau đó `total_reviews` giảm dần.
- **Xem nhiều nhất**: sắp xếp `view_count` giảm dần, sau đó ưu tiên điểm review cao hơn.
- Mỗi lượt mở trang chi tiết địa điểm đã xuất bản sẽ tăng bộ đếm lượt xem lên 1.

Lưu ý: lượt xem hiện đếm mỗi lần tải trang chi tiết, không lọc theo người dùng hoặc phiên truy cập.
