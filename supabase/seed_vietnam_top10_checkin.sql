-- ViGo: seed 10 popular check-in destinations across Vietnam.
-- Run in Supabase Dashboard > SQL Editor.
-- Safe to re-run: existing name/city rows are skipped.
-- Ratings, prices, hours, coordinates, photos and view counts are not fabricated.

INSERT INTO public.places
  (name, slug, description, category, city, address, price_min, price_max,
   opening_hours, latitude, longitude, cover_image, images,
   average_rating, total_reviews, created_by, status)
SELECT v.name, v.slug, v.description, 'Check-in/Du lịch'::public.place_category,
       v.city, v.address, NULL, NULL, NULL, NULL, NULL, NULL,
       '{}'::text[], 0, 0, NULL, 'published'::public.place_status
FROM (VALUES
 ('Phố cổ Hội An', 'pho-co-hoi-an-checkin', 'Khu phố cổ di sản với nhà vàng, đèn lồng và những góc chụp ảnh ven sông Hoài.', 'Hội An', 'Khu phố cổ Hội An, thành phố Hội An, Quảng Nam'),
 ('Cầu Vàng – Bà Nà Hills', 'cau-vang-ba-na-hills-checkin', 'Cây cầu nổi tiếng với đôi bàn tay khổng lồ nâng đỡ, nằm trong khu du lịch Sun World Bà Nà Hills.', 'Đà Nẵng', 'Sun World Bà Nà Hills, Hòa Vang, Đà Nẵng'),
 ('Vịnh Hạ Long', 'vinh-ha-long-checkin', 'Di sản thiên nhiên nổi tiếng với hàng nghìn đảo đá vôi và trải nghiệm ngắm vịnh bằng du thuyền.', 'Hạ Long', 'Vịnh Hạ Long, Quảng Ninh'),
 ('Quần thể danh thắng Tràng An', 'trang-an-ninh-binh-checkin', 'Cảnh quan núi đá vôi, sông nước và hang động, có thể khám phá bằng thuyền.', 'Ninh Bình', 'Khu du lịch sinh thái Tràng An, Ninh Bình'),
 ('Đỉnh Fansipan', 'dinh-fansipan-sapa-checkin', 'Điểm ngắm núi và biển mây nổi tiếng ở vùng Tây Bắc, có tuyến cáp treo từ khu vực Sa Pa.', 'Sa Pa', 'Khu du lịch Sun World Fansipan Legend, Sa Pa, Lào Cai'),
 ('Hồ Hoàn Kiếm và phố cổ', 'ho-hoan-kiem-pho-co-checkin', 'Không gian đi bộ trung tâm Hà Nội với hồ, cầu Thê Húc, đền Ngọc Sơn và các tuyến phố cổ.', 'Hà Nội', 'Hồ Hoàn Kiếm, quận Hoàn Kiếm, Hà Nội'),
 ('Đại Nội Huế', 'dai-noi-hue-checkin', 'Quần thể cung điện và thành quách của triều Nguyễn, phù hợp chụp ảnh kiến trúc và tìm hiểu lịch sử.', 'Huế', 'Đại Nội, thành phố Huế'),
 ('Bàu Trắng', 'bau-trang-mui-ne-checkin', 'Đồi cát trắng và hồ nước tạo nên khung cảnh đặc trưng của vùng Mũi Né, Bình Thuận.', 'Mũi Né', 'Khu du lịch Bàu Trắng, huyện Bắc Bình, Bình Thuận'),
 ('Cột cờ Lũng Cú', 'cot-co-lung-cu-checkin', 'Điểm check-in trên vùng cao nguyên đá Hà Giang, nổi bật với lá cờ Tổ quốc và cảnh quan núi non.', 'Hà Giang', 'Cột cờ Lũng Cú, huyện Đồng Văn, Hà Giang'),
 ('Bãi Đầm Trầu', 'bai-dam-trau-con-dao-checkin', 'Bãi biển nổi bật ở Côn Đảo với cát vàng, nước biển xanh và cảnh máy bay hạ cánh gần bờ.', 'Côn Đảo', 'Bãi Đầm Trầu, Côn Đảo, Bà Rịa - Vũng Tàu')
) AS v(name, slug, description, city, address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.places p
  WHERE lower(trim(p.name)) = lower(trim(v.name))
    AND p.city = v.city
);

-- Verify imported records.
SELECT id, name, city, address, status
FROM public.places
WHERE slug IN (
  'pho-co-hoi-an-checkin','cau-vang-ba-na-hills-checkin','vinh-ha-long-checkin',
  'trang-an-ninh-binh-checkin','dinh-fansipan-sapa-checkin','ho-hoan-kiem-pho-co-checkin',
  'dai-noi-hue-checkin','bau-trang-mui-ne-checkin','cot-co-lung-cu-checkin',
  'bai-dam-trau-con-dao-checkin'
)
ORDER BY name;
