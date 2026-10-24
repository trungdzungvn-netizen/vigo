# ViGo — dữ liệu 10 quán ăn nổi tiếng tại Đà Lạt

## Cách nhập dữ liệu
1. Mở Supabase Dashboard của dự án ViGo.
2. Chọn **SQL Editor → New query**.
3. Mở `seed_dalat_top10_restaurants.sql`, sao chép toàn bộ nội dung, dán vào SQL Editor rồi bấm **Run**.
4. Kiểm tra danh sách bằng câu SELECT ở cuối script.
5. Trên website, chọn thành phố **Đà Lạt** để lọc địa điểm.

Script có thể chạy lại nhiều lần mà không thêm trùng theo tên + thành phố. Dữ liệu được thêm với `city = 'Đà Lạt'`, trạng thái `published`, danh mục `Ăn uống`. Giá, giờ mở cửa, tọa độ, ảnh và điểm đánh giá để trống/0 khi chưa xác minh; không tạo review giả.

## Danh sách
- Bánh Ướt Lòng Gà Long
- Cơm Niêu Thiên Lý
- Nem Nướng Bà Hùng
- Bánh Tráng Nướng Dì Đinh
- Quán 33 Ốc Nhồi Thịt
- Bánh Căn Lệ
- Lẩu Gà Lá É Tao Ngộ
- Nậm Nướng Đà Lạt
- Đôi Đũa
- Bánh Mì Xíu Mại Bé Linh

## Nguồn tham khảo
- DALATHUB: https://dalathub.vn/top-quan-an-da-lat
- LangThangDaLat: https://langthangdalat.com/bo-suu-tap/top-15-nha-hang-ngon-da-lat/
- MIA.vn: https://mia.vn/cam-nang-du-lich/quan-an-da-lat-19915
- Review Đà Lạt: https://reviewdalat.net/vn/dia-diem-an-uong-da-lat/

Lưu ý: đây là danh sách gợi ý, không phải bảng xếp hạng chính thức. Địa chỉ và giờ hoạt động có thể thay đổi; nên xác nhận với quán trước khi đi.
