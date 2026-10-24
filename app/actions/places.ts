'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function uploadImages(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, formData: FormData) {
  const cover = formData.get('cover_image');
  const gallery = formData.getAll('images');
  const uploaded: string[] = [];
  let coverUrl: string | null = null;

  const uploadOne = async (file: FormDataEntryValue | null, prefix: string) => {
    if (!(file instanceof File) || file.size === 0) return null;
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE) {
      throw new Error('Ảnh phải là JPG, PNG hoặc WebP và không vượt quá 5MB mỗi ảnh.');
    }
    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const path = `${userId}/${crypto.randomUUID()}-${prefix}.${extension}`;
    const { error } = await supabase.storage.from('place-images').upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: '3600',
    });
    if (error) throw new Error(`Không tải được ảnh: ${error.message}. Hãy kiểm tra bucket place-images và Storage policies.`);
    const { data } = supabase.storage.from('place-images').getPublicUrl(path);
    return data.publicUrl;
  };

  coverUrl = await uploadOne(cover, 'cover');
  for (const file of gallery) {
    const url = await uploadOne(file, 'gallery');
    if (url) uploaded.push(url);
  }
  return { coverUrl, images: uploaded };
}

export async function addPlace(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
  const isAdmin = profile?.is_admin === true;
  const name = String(formData.get('name') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const openingHours = String(formData.get('opening_hours') || '').trim();
  const googleMapsUrl = String(formData.get('google_maps_url') || '').trim();
  const priceMin = formData.get('price_min') ? Number(formData.get('price_min')) : null;
  const priceMax = formData.get('price_max') ? Number(formData.get('price_max')) : null;
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null;
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null;

  if (name.length < 2 || address.length < 4 || description.length > 3000 || !city || !category ||
      (priceMin !== null && (!Number.isFinite(priceMin) || priceMin < 0)) ||
      (priceMax !== null && (!Number.isFinite(priceMax) || priceMax < 0)) ||
      (priceMin !== null && priceMax !== null && priceMax < priceMin) ||
      (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
      (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) ||
      (googleMapsUrl && !/^https:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl)\//i.test(googleMapsUrl))) {
    throw new Error('Vui lòng kiểm tra thông tin địa điểm, tọa độ, liên kết Google Maps và khoảng giá.');
  }

  const { coverUrl, images } = await uploadImages(supabase, user.id, formData);
  const { error } = await supabase.from('places').insert({
    name, address, city, category, description, opening_hours: openingHours || null,
    google_maps_url: googleMapsUrl || null, latitude, longitude,
    price_min: priceMin, price_max: priceMax, cover_image: coverUrl, images,
    created_by: user.id, status: isAdmin ? 'published' : 'pending',
  });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin');
  redirect(isAdmin ? '/admin?created=1' : '/?submitted=1');
}
