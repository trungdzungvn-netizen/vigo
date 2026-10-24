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
