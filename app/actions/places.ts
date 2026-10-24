'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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
  const priceMin = formData.get('price_min') ? Number(formData.get('price_min')) : null;
  const priceMax = formData.get('price_max') ? Number(formData.get('price_max')) : null;

  if (name.length < 2 || address.length < 4 || description.length > 3000 || !city || !category ||
      (priceMin !== null && (!Number.isFinite(priceMin) || priceMin < 0)) ||
      (priceMax !== null && (!Number.isFinite(priceMax) || priceMax < 0)) ||
      (priceMin !== null && priceMax !== null && priceMax < priceMin)) {
    throw new Error('Vui lòng kiểm tra thông tin địa điểm và khoảng giá.');
  }

  const { error } = await supabase.from('places').insert({
    name, address, city, category, description, price_min: priceMin, price_max: priceMax,
    created_by: user.id, status: isAdmin ? 'published' : 'pending',
  });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin');
  redirect(isAdmin ? '/admin?created=1' : '/?submitted=1');
}
