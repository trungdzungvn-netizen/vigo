# ViGo — dữ liệu 10 quán ăn nổi tiếng tại TP.HCM

## Cách nhập dữ liệu
1. Mở Supabase Dashboard của dự án ViGo.
2. Chọn **SQL Editor → New query**.
3. Mở `seed_hcmc_top10_restaurants.sql`, sao chép toàn bộ nội dung, dán vào SQL Editor rồi bấm **Run**.
4. Kiểm tra kết quả bằng câu SELECT ở cuối script.

Script có thể chạy lại nhiều lần mà không thêm trùng theo tên + thành phố. Dữ liệu được thêm với `city = 'TP.HCM'` để khớp tùy chọn bộ lọc hiện có trên website. Các trường giá, giờ mở cửa, tọa độ, ảnh và đánh giá được để trống/0 nếu chưa có dữ liệu đã xác minh; không tạo đánh giá giả. Điểm review và lượt xem sẽ tăng theo dữ liệu thực sau khi website hoạt động.

## Danh sách
Ănăn Saigon; Bánh Xèo 46A; Ngon Restaurant; Quán Bụi Central; Đèn Lồng; Bếp Cuốn Sài Gòn; Hoàng’s Kitchen; De Tham Restaurant; Tung’s Restaurant; Phở Việt Nam.

## Nguồn tham khảo
- MICHELIN Guide Vietnam — danh sách nhà hàng TP.HCM: https://guide.michelin.com/en/vn/ho-chi-minh/ho-chi-minh_2978179/restaurants
- IDC Travel — tổng hợp nhà hàng TP.HCM và lưu ý địa chỉ hành chính: https://www.idctravel.com/blog/best-restaurants-in-ho-chi-minh-city.html
- Kết quả tra cứu doanh nghiệp và địa chỉ công khai cho Quán Bụi Central, Ngon Restaurant, Đèn Lồng, Bếp Cuốn Sài Gòn, De Tham Restaurant, Tung’s Restaurant, Hoàng’s Kitchen và Phở Việt Nam.

Lưu ý: “Top 10” ở đây là danh sách gợi ý biên tập, không phải bảng xếp hạng chính thức. Hãy xác nhận địa chỉ/giờ hoạt động trước khi đi vì thông tin địa điểm có thể thay đổi.
