'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function addReview(formData: FormData) {
  // 1. Anti-spam: Honeypot check (nếu bot điền vào input ẩn -> huỷ)
  const honeypot = String(formData.get('hp_website') || '');
  if (honeypot.trim().length > 0) {
    throw new Error('Phát hiện thao tác tự động khả nghi.');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const placeId = String(formData.get('place_id') || '');
  const comment = String(formData.get('comment') || '').trim();
  const authorName = String(formData.get('author_name') || '').trim() || 'Khách trải nghiệm';
  const rating = Number(formData.get('rating'));
  const detail = {
    food_scenery: Number(formData.get('food_scenery')),
    space: Number(formData.get('space')),
    service: Number(formData.get('service')),
    price: Number(formData.get('price')),
  };

  // 2. Anti-spam: Lọc link lừa đảo / cờ bạc / spam link
  const urlCount = (comment.match(/https?:\/\//gi) || []).length;
  if (urlCount > 1) {
    throw new Error('Nội dung bình luận không được chứa nhiều đường link.');
  }

  // 3. Lấy IP để giới hạn spam tần suất cao
  const headerList = headers();
  const clientIp = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // 4. Validate dữ liệu
  if (
    !placeId ||
    comment.length < 5 ||
    comment.length > 3000 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    Object.values(detail).some((v) => !Number.isInteger(v) || v < 1 || v > 5)
  ) {
    throw new Error('Vui lòng nhập nhận xét và điểm từ 1 đến 5 hợp lệ.');
  }

  // 5. Thêm vào database
  const { error } = await supabase.from('reviews').insert({
    user_id: user ? user.id : null,
    author_name: user ? null : authorName,
    place_id: placeId,
    rating,
    rating_detail: detail,
    comment,
    author_ip: clientIp,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/place/${placeId}`);
  revalidatePath('/');
}
