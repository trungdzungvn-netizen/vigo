-- ViGo: seed 10 popular food places in Vung Tau.
-- Run in Supabase Dashboard > SQL Editor.
-- Safe to re-run: existing name/city rows are skipped.
-- Ratings, prices, hours, coordinates, photos and view counts are not fabricated.

INSERT INTO public.places
  (name, slug, description, category, city, address, price_min, price_max,
   opening_hours, latitude, longitude, cover_image, images,
   average_rating, total_reviews, created_by, status)
SELECT v.name, v.slug, v.description, 'Ăn uống'::public.place_category,
       'Vũng Tàu', v.address, NULL, NULL, NULL, NULL, NULL, NULL,
       '{}'::text[], 0, 0, NULL, 'published'::public.place_status
FROM (VALUES
 ('Bánh Khọt Gốc Vú Sữa', 'banh-khot-goc-vu-sua-vung-tau', 'Quán bánh khọt lâu năm, nổi tiếng với bánh khọt tôm ăn kèm rau sống và nước mắm.', '14 Nguyễn Trường Tộ, Vũng Tàu'),
 ('Bánh Khọt Cô Ba Vũng Tàu', 'banh-khot-co-ba-vung-tau', 'Địa chỉ bánh khọt quen thuộc, thích hợp thử món đặc sản nổi tiếng của thành phố biển.', '1 Hoàng Hoa Thám, Vũng Tàu'),
 ('Lẩu Cá Đuối 7 Lượm', 'lau-ca-duoi-7-luom-vung-tau', 'Quán lẩu cá đuối thường được nhắc đến trong các gợi ý ẩm thực Vũng Tàu.', '37 Nguyễn Trường Tộ, Vũng Tàu'),
 ('Nhà hàng Gành Hào', 'nha-hang-ganh-hao-vung-tau', 'Nhà hàng hải sản nổi tiếng với không gian hướng biển và thực đơn hải sản đa dạng.', '03 Trần Phú, Vũng Tàu'),
 ('Ốc Tự Nhiên Vũng Tàu', 'oc-tu-nhien-vung-tau', 'Quán ốc và hải sản với nhiều cách chế biến như rang me, xào bơ tỏi và nướng.', '34 Trần Phú, Vũng Tàu'),
 ('Bánh Canh Ghẹ Ngọc Lâm', 'banh-canh-ghe-ngoc-lam-vung-tau', 'Gợi ý cho thực khách muốn thử bánh canh ghẹ và các món nước hải sản.', 'Vũng Tàu, Bà Rịa - Vũng Tàu'),
 ('Bún Riêu Tôm Thuận Phúc', 'bun-rieu-tom-thuan-phuc-vung-tau', 'Quán món nước nổi bật với bún riêu tôm và các lựa chọn bánh canh hải sản.', '94 Hoàng Hoa Thám, Vũng Tàu'),
 ('Hàu Né Tâm Nguyễn', 'hau-ne-tam-nguyen-vung-tau', 'Quán hải sản bình dân được biết đến với món hàu né nóng ăn cùng bánh mì hoặc mì.', '04 Lê Lợi, Vũng Tàu'),
 ('Hải sản Hùng Chi', 'hai-san-hung-chi-vung-tau', 'Quán hải sản phong cách địa phương, có các món hải sản chế biến phổ biến.', 'F19 đường Ông Ích Khiêm, Vũng Tàu'),
 ('Bánh Khọt Bà Hai', 'banh-khot-ba-hai-vung-tau', 'Quán bánh khọt được nhiều danh sách ẩm thực địa phương giới thiệu.', '42 Trần Đồng, Vũng Tàu')
) AS v(name, slug, description, address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.places p
  WHERE lower(trim(p.name)) = lower(trim(v.name))
    AND p.city = 'Vũng Tàu'
);

-- Verify imported records.
SELECT id, name, city, address, status
FROM public.places
WHERE city = 'Vũng Tàu'
  AND slug IN (
    'banh-khot-goc-vu-sua-vung-tau','banh-khot-co-ba-vung-tau',
    'lau-ca-duoi-7-luom-vung-tau','nha-hang-ganh-hao-vung-tau',
    'oc-tu-nhien-vung-tau','banh-canh-ghe-ngoc-lam-vung-tau',
    'bun-rieu-tom-thuan-phuc-vung-tau','hau-ne-tam-nguyen-vung-tau',
    'hai-san-hung-chi-vung-tau','banh-khot-ba-hai-vung-tau'
  )
ORDER BY name;
