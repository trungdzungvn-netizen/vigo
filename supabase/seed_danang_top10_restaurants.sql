-- ViGo: seed 10 popular food places in Da Nang.
-- Run in Supabase Dashboard > SQL Editor.
-- Safe to re-run: existing name/city rows are skipped.
-- Ratings, prices, hours, coordinates, photos and view counts are not fabricated.

INSERT INTO public.places
  (name, slug, description, category, city, address, price_min, price_max,
   opening_hours, latitude, longitude, cover_image, images,
   average_rating, total_reviews, created_by, status)
SELECT v.name, v.slug, v.description, 'Ăn uống'::public.place_category,
       'Đà Nẵng', v.address, NULL, NULL, NULL, NULL, NULL, NULL,
       '{}'::text[], 0, 0, NULL, 'published'::public.place_status
FROM (VALUES
 ('Mì Quảng Cô Sáu', 'mi-quang-co-sau-da-nang', 'Quán mì Quảng với món mì đặc trưng miền Trung, ăn kèm rau sống và bánh tráng.', '397 Trần Hưng Đạo, Đà Nẵng'),
 ('Mì Quảng Sứa Hồng Nga', 'mi-quang-sua-hong-nga-da-nang', 'Quán mì Quảng tại trung tâm Đà Nẵng, có lựa chọn mì Quảng sứa và các món mì địa phương.', '67 Yên Bái, Hải Châu, Đà Nẵng'),
 ('Bánh Tráng Cuốn Thịt Heo Mậu', 'banh-trang-thit-heo-mau-da-nang', 'Địa chỉ quen thuộc để thử bánh tráng cuốn thịt heo hai đầu da và mắm nêm.', '35 Đỗ Thúc Tịnh, Cẩm Lệ, Đà Nẵng'),
 ('Bánh Tráng Cuốn Thịt Heo Bà Mua', 'banh-trang-thit-heo-ba-mua-da-nang', 'Thương hiệu ẩm thực miền Trung nổi tiếng với mì Quảng và bánh tráng cuốn thịt heo.', '19–21 Trần Bình Trọng, Hải Châu, Đà Nẵng'),
 ('Bánh Tráng Cuốn Thịt Heo Bà Hường', 'banh-trang-thit-heo-ba-huong-da-nang', 'Quán đặc sản Đà Nẵng với món bánh tráng cuốn thịt heo và rau sống ăn kèm.', 'K72/1C Hàm Nghi, Hải Châu, Đà Nẵng'),
 ('Quán Cốm Đại Lộc', 'quan-com-dai-loc-da-nang', 'Quán đặc sản miền Trung được gợi ý cho món bánh tráng cuốn thịt heo.', '103 Trưng Nữ Vương, Hải Châu, Đà Nẵng'),
 ('Ẩm Thực Trần', 'am-thuc-tran-da-nang', 'Nhà hàng chuyên các món đặc sản Đà Nẵng, trong đó có bánh tráng cuốn thịt heo.', '4 Lê Duẩn, Hải Châu, Đà Nẵng'),
 ('Bếp Bé Anh - Đặc Sản Đà Nẵng', 'bep-be-anh-dac-san-da-nang', 'Quán đặc sản địa phương với bánh tráng cuốn thịt heo và các món cuốn miền Trung.', '04 Mai Thúc Lân, Ngũ Hành Sơn, Đà Nẵng'),
 ('Mộc Quán Seafood', 'moc-quan-seafood-da-nang', 'Nhà hàng hải sản được cổng thông tin thành phố Đà Nẵng giới thiệu, phù hợp để thưởng thức hải sản.', '26 Tô Hiến Thành, Sơn Trà, Đà Nẵng'),
 ('Nhà hàng Gành Bàng', 'nha-hang-ganh-bang-da-nang', 'Gợi ý ăn hải sản và món địa phương khi khám phá khu vực ven biển Đà Nẵng.', 'Đà Nẵng')
) AS v(name, slug, description, address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.places p
  WHERE lower(trim(p.name)) = lower(trim(v.name))
    AND p.city = 'Đà Nẵng'
);

-- Verify imported records.
SELECT id, name, city, address, status
FROM public.places
WHERE city = 'Đà Nẵng'
  AND slug IN (
    'mi-quang-co-sau-da-nang','mi-quang-sua-hong-nga-da-nang',
    'banh-trang-thit-heo-mau-da-nang','banh-trang-thit-heo-ba-mua-da-nang',
    'banh-trang-thit-heo-ba-huong-da-nang','quan-com-dai-loc-da-nang',
    'am-thuc-tran-da-nang','bep-be-anh-dac-san-da-nang',
    'moc-quan-seafood-da-nang','nha-hang-ganh-bang-da-nang'
  )
ORDER BY name;
