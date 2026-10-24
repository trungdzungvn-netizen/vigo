# ViGo — dữ liệu 10 quán ăn nổi tiếng tại Hà Nội

## Cách nhập dữ liệu
1. Mở Supabase Dashboard của dự án ViGo.
2. Chọn **SQL Editor → New query**.
3. Mở `seed_hanoi_top10_restaurants.sql`, sao chép toàn bộ nội dung, dán vào SQL Editor rồi bấm **Run**.
4. Mở website ViGo và chọn thành phố **Hà Nội** để lọc địa điểm.

Script có thể chạy lại nhiều lần mà không thêm trùng theo tên + thành phố. Dữ liệu được thêm với `city = 'Hà Nội'`, trạng thái `published`, danh mục `Ăn uống`. Giá, giờ mở cửa, tọa độ, ảnh và điểm đánh giá để trống/0 khi chưa xác minh; không tạo review giả.

## Danh sách gợi ý
- Phở 10 Lý Quốc Sư
- Bún Chả Hương Liên
- Chả Cá Thăng Long
- Bún Chả Đắc Kim
- Phở Gia Truyền Bát Đàn
- Bánh Cuốn Gia Truyền Thanh Vân
- Bún Chả Ta
- Phở Gà Nguyệt
- Tầm Vị
- Quán Ăn Ngon

Đây là danh sách gợi ý biên tập, không phải thứ hạng chính thức.

## Nguồn tham khảo
- MICHELIN Guide Hanoi: https://guide.michelin.com/en/vn/ha-noi/ha-noi_2974158/restaurants
- MICHELIN Guide 2025 Vietnam: https://www.michelin.com/en/publications/products-and-services/the-2025-michelin-guide-hanoi
- Hanoi Tourism — Bún chả: https://www.hanoitourism.org/bun-cha-hanoi-guide/

Lưu ý: vui lòng xác nhận lại địa chỉ, giờ hoạt động và tình trạng kinh doanh trước khi đến; các thông tin này có thể thay đổi.
