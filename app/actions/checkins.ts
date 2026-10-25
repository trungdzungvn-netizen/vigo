'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function submitVisitorCheckin(input: { placeId: string; placeName: string; visitorName: string }): Promise<{ ok: boolean; message: string }> {
  const placeId = String(input?.placeId || '').trim();
  const visitorName = String(input?.visitorName || '').trim().replace(/\s+/g, ' ');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(placeId)) {
    return { ok: false, message: 'Địa điểm không hợp lệ. Vui lòng tải lại trang.' };
  }
  if (visitorName.length < 2 || visitorName.length > 80) {
    return { ok: false, message: 'Vui lòng nhập họ tên từ 2 đến 80 ký tự.' };
  }

  try {
    const supabase = await createClient();
    const { data: place, error: placeError } = await supabase.from('places').select('id,category,status').eq('id', placeId).maybeSingle();
    if (placeError || !place || place.status !== 'published' || !['Check-in', 'Check-in/Du lịch'].includes(place.category)) {
      return { ok: false, message: 'Không tìm thấy địa điểm check-in đang hoạt động.' };
    }
    const { error } = await supabase.from('place_checkins').insert({ place_id: placeId, visitor_name: visitorName });
    if (error) {
      console.error('Visitor check-in insert failed:', error.message);
      return { ok: false, message: 'Chưa lưu được check-in. Vui lòng thử lại sau.' };
    }
    revalidatePath(`/place/${placeId}`);
    revalidatePath('/');
    return { ok: true, message: 'Check-in thành công. Cảm ơn bạn đã chia sẻ!' };
  } catch (error) {
    console.error('Visitor check-in failed:', error);
    return { ok: false, message: 'Hệ thống đang bận. Vui lòng thử lại sau.' };
  }
}
