import { addPlace } from '@/app/actions/places';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewPlace() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
  const isAdmin = profile?.is_admin === true;
  return <div className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-3xl font-black">{isAdmin ? 'Đăng địa điểm mới' : 'Đóng góp địa điểm'}</h1><p className="mt-2 text-stone-500">{isAdmin ? 'Bài đăng của Admin sẽ được xuất bản trực tiếp.' : 'Địa điểm sẽ chờ duyệt trước khi xuất hiện công khai.'}</p>
    <form action={addPlace} encType="multipart/form-data" className="mt-6 space-y-5 rounded-2xl border bg-white p-6">
      <label className="block text-sm font-semibold">Tên địa điểm *<input name="name" required minLength={2} maxLength={150} className="mt-1 w-full rounded-lg border p-3 font-normal"/></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Thành phố *<select name="city" required className="mt-1 w-full rounded-lg border bg-white p-3 font-normal">{['Biên Hòa','TP.HCM','Hà Nội','Đà Lạt','Đà Nẵng','Vũng Tàu','Khác'].map(x=><option key={x}>{x}</option>)}</select></label><label className="block text-sm font-semibold">Danh mục *<select name="category" required className="mt-1 w-full rounded-lg border bg-white p-3 font-normal">{['Ăn uống','Quán cà phê','Check-in/Du lịch','Về đêm'].map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label className="block text-sm font-semibold">Địa chỉ đầy đủ *<input name="address" required minLength={4} maxLength={300} placeholder="Số nhà, đường, phường/xã, thành phố" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label>
      <label className="block text-sm font-semibold">Liên kết Google Maps<input name="google_maps_url" type="url" placeholder="https://www.google.com/maps/place/..." className="mt-1 w-full rounded-lg border p-3 font-normal"/><span className="mt-1 block font-normal text-stone-500">Mở Google Maps, chọn địa điểm → Chia sẻ → Sao chép đường liên kết.</span></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Vĩ độ (latitude)<input name="latitude" type="number" step="any" min="-90" max="90" placeholder="10.9574" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label><label className="block text-sm font-semibold">Kinh độ (longitude)<input name="longitude" type="number" step="any" min="-180" max="180" placeholder="106.8427" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Giá từ (VNĐ)<input type="number" min="0" name="price_min" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label><label className="block text-sm font-semibold">Giá đến (VNĐ)<input type="number" min="0" name="price_max" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label></div>
      <label className="block text-sm font-semibold">Giờ mở cửa<input name="opening_hours" maxLength={200} placeholder="Ví dụ: 07:00–22:00 hằng ngày" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label>
      <label className="block text-sm font-semibold">Ảnh đại diện<input name="cover_image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full rounded-lg border p-3 font-normal"/><span className="mt-1 block font-normal text-stone-500">JPG, PNG hoặc WebP, tối đa 5MB.</span></label>
      <label className="block text-sm font-semibold">Ảnh thư viện (có thể chọn nhiều)<input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full rounded-lg border p-3 font-normal"/><span className="mt-1 block font-normal text-stone-500">Tối đa 5MB mỗi ảnh. Ảnh được lưu trong Supabase Storage.</span></label>
      <label className="block text-sm font-semibold">Mô tả<textarea name="description" maxLength={3000} rows={4} className="mt-1 w-full rounded-lg border p-3 font-normal"/></label>
      <button className="rounded-xl bg-brand-700 px-5 py-3 font-bold text-white">{isAdmin ? 'Đăng địa điểm' : 'Gửi địa điểm để duyệt'}</button>
    </form></div>;
}
