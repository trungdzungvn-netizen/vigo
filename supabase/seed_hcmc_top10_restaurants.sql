-- ViGo: seed 10 well-known restaurants in Ho Chi Minh City.
-- Run in Supabase Dashboard > SQL Editor. Safe to re-run: existing name/city rows are skipped.
-- No fabricated ratings, opening hours, prices, photos or view counts are inserted.

INSERT INTO public.places
  (name, slug, description, category, city, address, price_min, price_max,
   opening_hours, latitude, longitude, cover_image, images,
   average_rating, total_reviews, created_by, status)
SELECT v.name, v.slug, v.description, 'Ăn uống'::public.place_category,
       'TP.HCM', v.address, NULL, NULL, NULL, NULL, NULL, NULL,
       '{}'::text[], 0, 0, NULL, 'published'::public.place_status
FROM (VALUES
 ('Ănăn Saigon', 'anan-saigon', 'Nhà hàng Việt Nam đương đại, nổi tiếng với trải nghiệm ẩm thực sáng tạo; có tên trong MICHELIN Guide.', '89 Tôn Thất Đạm, TP.HCM'),
 ('Bánh Xèo 46A', 'banh-xeo-46a', 'Quán bánh xèo Việt Nam được MICHELIN Guide tuyển chọn; phù hợp để khám phá món bánh xèo truyền thống.', '46A Đinh Công Tráng, TP.HCM'),
 ('Ngon Restaurant', 'ngon-restaurant-pasteur', 'Nhà hàng phục vụ nhiều món đặc sản Việt Nam vùng miền trong không gian ăn uống rộng rãi.', '160 Pasteur, TP.HCM'),
 ('Quán Bụi Central', 'quan-bui-central', 'Nhà hàng món Việt phong cách hoài niệm, phục vụ các món cơm nhà và đặc sản Việt Nam.', '1B Ngô Văn Năm, TP.HCM'),
 ('Đèn Lồng - Home Cooked Vietnamese Restaurant', 'den-long-home-cooked', 'Nhà hàng món Việt kiểu cơm nhà, nổi bật với thực đơn trải dài nhiều vùng miền Việt Nam.', '130 Nguyễn Trãi, TP.HCM'),
 ('Bếp Cuốn Sài Gòn', 'bep-cuon-sai-gon', 'Nhà hàng chuyên món cuốn và các món Việt, có không gian phù hợp cho khách muốn thử nhiều món truyền thống.', '76 Võ Văn Tần, TP.HCM'),
 ('Hoàng’s Kitchen', 'hoangs-kitchen', 'Nhà hàng món Việt với nhiều lựa chọn món truyền thống và món chay; nằm gần khu chợ Bến Thành.', '45 Thủ Khoa Huân, TP.HCM'),
 ('De Tham Restaurant', 'de-tham-restaurant', 'Nhà hàng Việt Nam với các món quen thuộc như bánh xèo và món cuốn.', '258 Đề Thám, TP.HCM'),
 ('Tung’s Restaurant', 'tungs-restaurant', 'Nhà hàng Việt Nam với thực đơn nhiều vùng miền, có lựa chọn món chay.', '230 Lê Thánh Tôn, TP.HCM'),
 ('Phở Việt Nam', 'pho-viet-nam-pham-hong-thai', 'Quán phở bò tại khu vực trung tâm TP.HCM.', '14 Phạm Hồng Thái, TP.HCM')
) AS v(name, slug, description, address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.places p
  WHERE lower(trim(p.name)) = lower(trim(v.name))
    AND p.city = 'TP.HCM'
);

-- Verify the imported records.
SELECT id, name, city, address, status
FROM public.places
WHERE city = 'TP.HCM'
  AND slug IN (
    'anan-saigon','banh-xeo-46a','ngon-restaurant-pasteur','quan-bui-central',
    'den-long-home-cooked','bep-cuon-sai-gon','hoangs-kitchen','de-tham-restaurant',
    'tungs-restaurant','pho-viet-nam-pham-hong-thai'
  )
ORDER BY name;
