-- ViGo: seed 10 popular food places in Da Lat.
-- Run in Supabase Dashboard > SQL Editor.
-- Safe to re-run: existing name/city rows are skipped.
-- Ratings, prices, hours, coordinates, photos and view counts are not fabricated.

INSERT INTO public.places
  (name, slug, description, category, city, address, price_min, price_max,
   opening_hours, latitude, longitude, cover_image, images,
   average_rating, total_reviews, created_by, status)
SELECT v.name, v.slug, v.description, 'Ăn uống'::public.place_category,
       'Đà Lạt', v.address, NULL, NULL, NULL, NULL, NULL, NULL,
       '{}'::text[], 0, 0, NULL, 'published'::public.place_status
FROM (VALUES
 ('Bánh Ướt Lòng Gà Long', 'banh-uot-long-ga-long-da-lat', 'Món đặc sản Đà Lạt với bánh ướt mềm, lòng gà và nước mắm pha; địa chỉ thường được giới thiệu tại đường Phan Đình Phùng.', '202 Phan Đình Phùng, Đà Lạt, Lâm Đồng'),
 ('Cơm Niêu Thiên Lý', 'com-nieu-thien-ly-da-lat', 'Quán cơm niêu và món Việt phù hợp cho bữa ăn gia đình hoặc nhóm bạn.', '3 Sương Nguyệt Anh, Đà Lạt, Lâm Đồng'),
 ('Nem Nướng Bà Hùng', 'nem-nuong-ba-hung-da-lat', 'Nem nướng ăn kèm bánh tráng, rau sống và nước chấm đặc trưng.', '3A Trần Hưng Đạo, Đà Lạt, Lâm Đồng'),
 ('Bánh Tráng Nướng Dì Đinh', 'banh-trang-nuong-di-dinh-da-lat', 'Bánh tráng nướng với nhiều loại topping, món ăn vặt quen thuộc khi khám phá ẩm thực Đà Lạt.', '26 Hoàng Diệu, Đà Lạt, Lâm Đồng'),
 ('Quán 33 Ốc Nhồi Thịt', 'quan-33-oc-nhoi-thit-da-lat', 'Quán nổi tiếng với món ốc nhồi thịt nóng, phù hợp thưởng thức trong thời tiết se lạnh.', '32 Hai Bà Trưng, Đà Lạt, Lâm Đồng'),
 ('Bánh Căn Lệ', 'banh-can-le-da-lat', 'Bánh căn nóng ăn kèm nước chấm, một món ăn sáng phổ biến tại Đà Lạt.', '27/44 Yersin, Đà Lạt, Lâm Đồng'),
 ('Lẩu Gà Lá É Tao Ngộ', 'lau-ga-la-e-tao-ngo-da-lat', 'Lẩu gà lá é là món được nhiều du khách tìm ăn khi đến Đà Lạt.', '5/3 đường 3 Tháng 4, Đà Lạt, Lâm Đồng'),
 ('Nậm Nướng Đà Lạt', 'nam-nuong-da-lat', 'Quán nướng phù hợp nhóm bạn, nổi bật với các món nướng và rau ăn kèm.', '7 Hoàng Diệu, Đà Lạt, Lâm Đồng'),
 ('Đôi Đũa', 'doi-dua-da-lat', 'Quán món Việt theo phong cách bữa cơm gia đình, thích hợp đi cùng người thân và nhóm bạn.', '96 Phù Đổng Thiên Vương, Đà Lạt, Lâm Đồng'),
 ('Bánh Mì Xíu Mại Bé Linh', 'banh-mi-xiu-mai-be-linh-da-lat', 'Bánh mì xíu mại nóng, gợi ý cho bữa sáng ở Đà Lạt.', '26 Hoàng Diệu, Đà Lạt, Lâm Đồng')
) AS v(name, slug, description, address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.places p
  WHERE lower(trim(p.name)) = lower(trim(v.name))
    AND p.city = 'Đà Lạt'
);

-- Verify imported records.
SELECT id, name, city, address, status
FROM public.places
WHERE city = 'Đà Lạt'
  AND slug IN (
    'banh-uot-long-ga-long-da-lat','com-nieu-thien-ly-da-lat',
    'nem-nuong-ba-hung-da-lat','banh-trang-nuong-di-dinh-da-lat',
    'quan-33-oc-nhoi-thit-da-lat','banh-can-le-da-lat',
    'lau-ga-la-e-tao-ngo-da-lat','nam-nuong-da-lat',
    'doi-dua-da-lat','banh-mi-xiu-mai-be-linh-da-lat'
  )
ORDER BY name;
