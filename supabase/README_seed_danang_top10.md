# ViGo — dữ liệu 10 quán ăn nổi tiếng tại Đà Nẵng

## Cách nhập dữ liệu
1. Mở Supabase Dashboard của dự án ViGo.
2. Chọn **SQL Editor → New query**.
3. Mở `seed_danang_top10_restaurants.sql`, sao chép toàn bộ nội dung, dán vào SQL Editor rồi bấm **Run**.
4. Mở website ViGo và bấm **Đà Nẵng** trên trang chủ để lọc địa điểm.

Script có thể chạy lại nhiều lần mà không thêm trùng theo tên + thành phố. Dữ liệu được thêm với `city = 'Đà Nẵng'`, trạng thái `published`, danh mục `Ăn uống`. Giá, giờ mở cửa, tọa độ, ảnh và điểm đánh giá để trống/0 nếu chưa xác minh; không tạo review giả.

## Danh sách
- Mì Quảng Cô Sáu
- Mì Quảng Sứa Hồng Nga
- Bánh Tráng Cuốn Thịt Heo Mậu
- Bánh Tráng Cuốn Thịt Heo Bà Mua
- Bánh Tráng Cuốn Thịt Heo Bà Hường
- Quán Cốm Đại Lộc
- Ẩm Thực Trần
- Bếp Bé Anh - Đặc Sản Đà Nẵng
- Mộc Quán Seafood
- Nhà hàng Gành Bàng

Đây là danh sách gợi ý biên tập, không phải bảng xếp hạng chính thức. Một số địa chỉ cần xác nhận lại trước khi đến.

## Nguồn tham khảo
- Cổng thông tin điện tử thành phố Đà Nẵng: https://www.danang.gov.vn/web/dng/-/en-a-nang-an-gid
- Hello Đà Nẵng: https://hellodanang.vn/topAZ/banh-trang-cuon-thit-heo-o-da-nang
- Mytour: https://mytour.vn/vi/blog/bai-viet/top-10-quan-banh-trang-cuon-thit-heo-ngon-nhat-da-nang.html
- Thông tin địa điểm công khai của các quán ăn địa phương.

Lưu ý: thông tin giá, giờ mở cửa và địa chỉ có thể thay đổi. Hãy xác nhận với quán trước khi đi.
