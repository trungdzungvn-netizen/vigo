'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type ReviewActionState = { success: boolean; message: string };

export async function addReview(_prevState: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  const placeId = String(formData.get('place_id') || '').trim();
  const reviewerName = String(formData.get('reviewer_name') || '').trim().replace(/\s+/g, ' ');
  const comment = String(formData.get('comment') || '').trim();
  const rating = Number(formData.get('rating'));
  const detail = {
    food_scenery: Number(formData.get('food_scenery')),
    space: Number(formData.get('space')),
    service: Number(formData.get('service')),
    price: Number(formData.get('price')),
  };

  if (!placeId) return { success: false, message: 'Không xác định được địa điểm. Vui lòng tải lại trang.' };
  if (reviewerName.length < 2 || reviewerName.length > 100) return { success: false, message: 'Vui lòng nhập họ tên từ 2 đến 100 ký tự.' };
  if (comment.length < 5 || comment.length > 3000 || !Number.isInteger(rating) || rating < 1 || rating > 5 || Object.values(detail).some(v => !Number.isInteger(v) || v < 1 || v > 5)) {
    return { success: false, message: 'Vui lòng nhập nhận xét từ 5 đến 3.000 ký tự và chọn điểm từ 1 đến 5.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('submit_place_review', {
      place_id_input: placeId,
      reviewer_name_input: reviewerName,
      rating_input: rating,
      rating_detail_input: detail,
      comment_input: comment,
    });
    if (error) {
      console.error('submit_place_review failed:', error.message);
      return { success: false, message: 'Chưa gửi được đánh giá. Vui lòng kiểm tra cấu hình Supabase hoặc thử lại.' };
    }
    revalidatePath(`/place/${placeId}`);
    revalidatePath('/');
    return { success: true, message: 'Cảm ơn bạn! Đánh giá đã được gửi.' };
  } catch (error) {
    console.error('addReview failed:', error);
    return { success: false, message: 'Hệ thống đang gặp sự cố khi gửi đánh giá. Vui lòng thử lại sau.' };
  }
}
