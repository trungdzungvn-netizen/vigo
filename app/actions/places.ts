'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function addPlace(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
    isAdmin = profile?.is_admin === true;
  }

  const name = String(formData.get('name') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const openingHours = String(formData.get('opening_hours') || '').trim();
  const googleMapsUrl = String(formData.get('google_maps_url') || '').trim();
  const submitterName = String(formData.get('submitter_name') || '').trim().slice(0, 100);
  const submitterPhone = String(formData.get('submitter_phone') || '').trim().slice(0, 30);
  const priceMin = formData.get('price_min') ? Number(formData.get('price_min')) : null;
  const priceMax = formData.get('price_max') ? Number(formData.get('price_max')) : null;
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null;
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null;
  const cover = formData.get('cover_image');

  if (name.length < 2 || address.length < 4 || description.length > 3000 || !city || !category ||
      !(cover instanceof File) || cover.size === 0 || !ALLOWED_TYPES.includes(cover.type) || cover.size > MAX_IMAGE_SIZE ||
      (priceMin !== null && (!Number.isFinite(priceMin) || priceMin < 0)) ||
      (priceMax !== null && (!Number.isFinite(priceMax) || priceMax < 0)) ||
      (priceMin !== null && priceMax !== null && priceMax < priceMin) ||
      (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
      (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) ||
      (googleMapsUrl && !/^https:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl)\//i.test(googleMapsUrl))) {
    throw new Error('Vui lòng kiểm tra thông tin và chọn đúng một ảnh JPG, PNG hoặc WebP không quá 5MB.');
  }

  const ext = cover.type === 'image/jpeg' ? 'jpg' : cover.type.split('/')[1];
  const imageFolder = user ? user.id : 'submissions';
  const imagePath = `${imageFolder}/${crypto.randomUUID()}-cover.${ext}`;
  const { error: uploadError } = await supabase.storage.from('place-images').upload(imagePath, cover, {
    contentType: cover.type, upsert: false, cacheControl: '3600',
  });
  if (uploadError) {
    throw new Error(`Không tải được ảnh: ${uploadError.message}. Hãy chạy migration visitor submissions trong Supabase.`);
  }
  const coverUrl = supabase.storage.from('place-images').getPublicUrl(imagePath).data.publicUrl;

  const { error } = await supabase.from('places').insert({
    name, address, city, category, description, opening_hours: openingHours || null,
    google_maps_url: googleMapsUrl || null, latitude, longitude,
    price_min: priceMin, price_max: priceMax, cover_image: coverUrl, images: [],
    created_by: user?.id ?? null,
    status: isAdmin ? 'published' : 'pending',
    submitter_name: submitterName || null,
    submitter_phone: submitterPhone || null,
  });
  if (error) throw new Error(`Không lưu được đề xuất: ${error.message}. Hãy chạy migration visitor submissions trong Supabase.`);
  revalidatePath('/');
  revalidatePath('/admin');
  if (isAdmin) redirect('/admin?created=1');
  redirect('/places/new?submitted=1');
}
