'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (error || profile?.is_admin !== true) redirect('/');
  return supabase;
}

export async function setPlaceStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  if (!id || !['published', 'rejected', 'pending'].includes(status)) throw new Error('Dữ liệu không hợp lệ.');
  const { error } = await supabase.from('places').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/'); revalidatePath('/admin'); revalidatePath(`/place/${id}`);
}

export async function deletePlace(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) throw new Error('Thiếu ID địa điểm.');
  const { error } = await supabase.from('places').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/'); revalidatePath('/admin');
}


export async function updatePlace(formData: FormData) {
  const supabase = await requireAdmin();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const openingHours = String(formData.get('opening_hours') || '').trim();
  const googleMapsUrl = String(formData.get('google_maps_url') || '').trim();
  const phone = String(formData.get('phone') || '').trim().slice(0, 30);
  const priceMin = formData.get('price_min') ? Number(formData.get('price_min')) : null;
  const priceMax = formData.get('price_max') ? Number(formData.get('price_max')) : null;
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : null;
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : null;
  const oldCover = String(formData.get('old_cover_image') || '').trim();
  const oldImages = String(formData.get('old_images') || '').split('\n').map(x => x.trim()).filter(Boolean);
  const coverFile = formData.get('cover_image');
  const galleryFiles = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  const upload = async (file: File, prefix: string) => {
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Ảnh phải là JPG, PNG hoặc WebP, tối đa 5MB mỗi ảnh.');
    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const path = `${user.id}/${crypto.randomUUID()}-${prefix}.${ext}`;
    const { error } = await supabase.storage.from('place-images').upload(path, file, { contentType: file.type, upsert: false, cacheControl: '3600' });
    if (error) throw new Error(`Tải ảnh thất bại: ${error.message}. Kiểm tra bucket place-images.`);
    return supabase.storage.from('place-images').getPublicUrl(path).data.publicUrl;
  };
  if (!id || name.length < 2 || address.length < 4 || !city || !category || description.length > 3000 ||
      (priceMin !== null && (!Number.isFinite(priceMin) || priceMin < 0)) ||
      (priceMax !== null && (!Number.isFinite(priceMax) || priceMax < 0)) ||
      (priceMin !== null && priceMax !== null && priceMax < priceMin) ||
      (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
      (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) ||
      (googleMapsUrl && !/^https:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl)\//i.test(googleMapsUrl))) {
    throw new Error('Thông tin chỉnh sửa không hợp lệ.');
  }
  let coverImage = oldCover || null;
  if (coverFile instanceof File && coverFile.size > 0) coverImage = await upload(coverFile, 'cover');
  const newImages = await Promise.all(galleryFiles.map(file => upload(file, 'gallery')));
  const images = [...oldImages, ...newImages];
  const { error } = await supabase.from('places').update({
    name, address, city, category, description, opening_hours: openingHours || null,
    google_maps_url: googleMapsUrl || null, phone: phone || null, latitude, longitude,
    price_min: priceMin, price_max: priceMax, cover_image: coverImage, images,
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/'); revalidatePath('/admin'); revalidatePath(`/place/${id}`); revalidatePath(`/places/${id}/edit`);
  redirect('/admin?updated=1');
}


export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login?logged_out=1');
}
