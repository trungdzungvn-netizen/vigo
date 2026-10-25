'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
export async function addReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Vui lòng đăng nhập để viết đánh giá.');
  const placeId = String(formData.get('place_id') || '');
  const comment = String(formData.get('comment') || '').trim();
  const rating = Number(formData.get('rating'));
  const detail = { food_scenery: Number(formData.get('food_scenery')), space: Number(formData.get('space')), service: Number(formData.get('service')), price: Number(formData.get('price')) };
  if (!placeId || comment.length < 5 || comment.length > 3000 || !Number.isInteger(rating) || rating < 1 || rating > 5 || Object.values(detail).some(v => !Number.isInteger(v) || v < 1 || v > 5)) throw new Error('Vui lòng nhập nhận xét và điểm từ 1 đến 5 hợp lệ.');
  const { error } = await supabase.from('reviews').insert({ user_id: user.id, place_id: placeId, rating, rating_detail: detail, comment });
  if (error) throw new Error(error.message);
  revalidatePath(`/place/${placeId}`); revalidatePath('/');
}
