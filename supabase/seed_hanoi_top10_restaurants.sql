-- ViGo: seed 10 well-known food places in Hanoi.
-- Run in Supabase Dashboard > SQL Editor.
-- Safe to re-run: existing name/city rows are skipped.
-- Ratings, prices, hours, coordinates, photos and view counts are not fabricated.

INSERT INTO public.places
  (name, slug, description, category, city, address, price_min, price_max,
   opening_hours, latitude, longitude, cover_image, images,
   average_rating, total_reviews, created_by, status)
SELECT v.name, v.slug, v.description, 'Ăn uống'::public.place_category,
       'Hà Nội', v.address, NULL, NULL, NULL, NULL, NULL, NULL,
       '{}'::text[], 0, 0, NULL, 'published'::public.place_status
FROM (VALUES
 ('Phở 10 Lý Quốc Sư', 'pho-10-ly-quoc-su-ha-noi', 'Quán phở bò nổi tiếng ở khu vực Hoàn Kiếm, được MICHELIN Guide tuyển chọn.', '10 Lý Quốc Sư, Hoàn Kiếm, Hà Nội'),
 ('Bún Chả Hương Liên', 'bun-cha-huong-lien-ha-noi', 'Địa chỉ bún chả được nhiều du khách biết đến; nổi tiếng sau chuyến ghé thăm của Barack Obama và Anthony Bourdain.', '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội'),
 ('Chả Cá Thăng Long', 'cha-ca-thang-long-ha-noi', 'Nhà hàng chuyên chả cá kiểu Hà Nội, món cá nấu cùng thì là và hành.', '6B Đường Thành, Hoàn Kiếm, Hà Nội'),
 ('Bún Chả Đắc Kim', 'bun-cha-dac-kim-ha-noi', 'Quán bún chả lâu năm trong khu phố cổ, được nhắc đến trong MICHELIN Guide.', '1 Hàng Mành, Hoàn Kiếm, Hà Nội'),
 ('Phở Gia Truyền Bát Đàn', 'pho-gia-truyen-bat-dan-ha-noi', 'Quán phở bò truyền thống được nhiều thực khách xếp vào danh sách món nên thử ở Hà Nội.', '49 Bát Đàn, Hoàn Kiếm, Hà Nội'),
 ('Bánh Cuốn Gia Truyền Thanh Vân', 'banh-cuon-thanh-van-ha-noi', 'Địa chỉ bánh cuốn gia truyền trong khu phố cổ, có tên trong danh sách MICHELIN Guide.', '12–14 Hàng Gà, Hoàn Kiếm, Hà Nội'),
 ('Bún Chả Ta', 'bun-cha-ta-nguyen-huu-huan-ha-noi', 'Quán bún chả phục vụ món thịt nướng than hoa, bún và nước chấm kiểu Hà Nội.', '21 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội'),
 ('Phở Gà Nguyệt', 'pho-ga-nguyet-ha-noi', 'Quán phở gà được MICHELIN Guide tuyển chọn, phù hợp cho người muốn thử phở gà Hà Nội.', '5B Phủ Doãn, Hoàn Kiếm, Hà Nội'),
 ('Tầm Vị', 'tam-vi-ha-noi', 'Nhà hàng món Việt phong cách bữa cơm Bắc Bộ, từng được trao một sao MICHELIN.', '4B Yên Thế, Ba Đình, Hà Nội'),
 ('Quán Ăn Ngon', 'quan-an-ngon-ha-noi', 'Nhà hàng giới thiệu nhiều món ăn Việt Nam vùng miền trong cùng một thực đơn.', '18 Phan Bội Châu, Hoàn Kiếm, Hà Nội')
) AS v(name, slug, description, address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.places p
  WHERE lower(trim(p.name)) = lower(trim(v.name))
    AND p.city = 'Hà Nội'
);

-- Verify imported records.
SELECT id, name, city, address, status
FROM public.places
WHERE city = 'Hà Nội'
  AND slug IN (
    'pho-10-ly-quoc-su-ha-noi','bun-cha-huong-lien-ha-noi',
    'cha-ca-thang-long-ha-noi','bun-cha-dac-kim-ha-noi',
    'pho-gia-truyen-bat-dan-ha-noi','banh-cuon-thanh-van-ha-noi',
    'bun-cha-ta-nguyen-huu-huan-ha-noi','pho-ga-nguyet-ha-noi',
    'tam-vi-ha-noi','quan-an-ngon-ha-noi'
  )
ORDER BY name;
