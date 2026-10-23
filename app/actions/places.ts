'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export async function addPlace(formData: FormData) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Vui lòng đăng nhập trước khi đóng góp địa điểm.');
  const name=String(formData.get('name')||'').trim(), address=String(formData.get('address')||'').trim(), city=String(formData.get('city')||''), category=String(formData.get('category')||''), description=String(formData.get('description')||'').trim();
  const priceMin=formData.get('price_min')?Number(formData.get('price_min')):null, priceMax=formData.get('price_max')?Number(formData.get('price_max')):null;
  if(name.length<2||address.length<4||description.length>3000||!city||!category||(priceMin!==null&&priceMin<0)||(priceMax!==null&&priceMax<0)) throw new Error('Vui lòng kiểm tra các trường bắt buộc.');
  const {data,error}=await supabase.from('places').insert({name,address,city,category,description,price_min:priceMin,price_max:priceMax,created_by:user.id,status:'pending'}).select('id').single();
  if(error) throw new Error(error.message); revalidatePath('/'); redirect('/?submitted=1');
}
