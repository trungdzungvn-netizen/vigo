# ViGo — dữ liệu 10 quán ăn nổi tiếng tại Vũng Tàu

## Cách nhập dữ liệu
1. Mở Supabase Dashboard của dự án ViGo.
2. Chọn **SQL Editor → New query**.
3. Mở `seed_vung_tau_top10_restaurants.sql`, sao chép toàn bộ nội dung, dán vào SQL Editor rồi bấm **Run**.
4. Kiểm tra kết quả bằng câu SELECT ở cuối script.
5. Trên website, chọn thành phố **Vũng Tàu** để lọc địa điểm.

Script có thể chạy lại nhiều lần mà không thêm trùng theo tên + thành phố. Dữ liệu được thêm với `city = 'Vũng Tàu'`, trạng thái `published`, danh mục `Ăn uống`. Giá, giờ mở cửa, tọa độ, ảnh và điểm đánh giá để trống/0 khi chưa xác minh; không tạo review giả.

## Danh sách
- Bánh Khọt Gốc Vú Sữa
- Bánh Khọt Cô Ba Vũng Tàu
- Lẩu Cá Đuối 7 Lượm
- Nhà hàng Gành Hào
- Ốc Tự Nhiên Vũng Tàu
- Bánh Canh Ghẹ Ngọc Lâm
- Bún Riêu Tôm Thuận Phúc
- Hàu Né Tâm Nguyễn
- Hải sản Hùng Chi
- Bánh Khọt Bà Hai

## Nguồn tham khảo
- Vietnammm: https://vietnammm.com/quan-an-ngon-vung-tau/
- Sun Travel 247: https://suntravel247.com/an-gi-o-vung-tau/
- Tripi: https://tripi.vn/blog/vi/doi-song/top-13-quan-an-noi-tieng-khong-the-bo-qua-khi-den-vung-tau-tripi
- Klook: https://www.klook.com/vi/blog/mon-ngon-vung-tau/

Lưu ý: đây là danh sách gợi ý biên tập, không phải bảng xếp hạng chính thức. Một số địa chỉ nên được xác nhận lại trên bản đồ hoặc qua quán trước khi đi; dữ liệu được cung cấp như danh sách ban đầu để nhập vào ViGo.
