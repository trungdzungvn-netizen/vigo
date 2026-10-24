import { addPlace } from '@/app/actions/places';
import { createClient } from '@/lib/supabase/server';

export default async function NewPlace({ searchParams }: { searchParams?: { submitted?: string } }) {
  let isAdmin = false;
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      isAdmin = profile?.is_admin === true;
    }
  } catch {
    // Public visitors can submit without an account.
  }

  return <div className="mx-auto max-w-3xl px-4 py-10">
    <p className="text-sm font-bold uppercase tracking-widest text-brand-700">ViGo</p>
    <h1 className="mt-1 text-3xl font-black">{isAdmin ? 'Đăng địa điểm mới' : 'Đề xuất địa điểm'}</h1>
    <p className="mt-2 text-stone-500">{isAdmin ? 'Bài đăng của Admin sẽ được xuất bản trực tiếp.' : 'Chia sẻ địa điểm hay với cộng đồng. Quản trị viên sẽ kiểm tra và phê duyệt trước khi đăng công khai.'}</p>
    {searchParams?.submitted === '1' && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-900">Đã nhận đề xuất! Địa điểm sẽ được quản trị viên xem xét trước khi đăng công khai.</p>}
    {!isLoggedIn && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Bạn có thể gửi đề xuất mà không cần đăng nhập.</p>}
    <form action={addPlace} encType="multipart/form-data" className="mt-6 space-y-5 rounded-2xl border bg-white p-6">
      {!isLoggedIn && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Tên của bạn (không bắt buộc)<input name="submitter_name" maxLength={100} className="mt-1 w-full rounded-lg border p-3 font-normal" placeholder="Tên người đề xuất"/></label><label className="block text-sm font-semibold">Số điện thoại liên hệ (không bắt buộc)<input name="submitter_phone" type="tel" maxLength={30} className="mt-1 w-full rounded-lg border p-3 font-normal" placeholder="Để quản trị viên liên hệ khi cần"/></label></div>}
      <label className="block text-sm font-semibold">Tên địa điểm *<input name="name" required minLength={2} maxLength={150} className="mt-1 w-full rounded-lg border p-3 font-normal" placeholder="Tên quán hoặc địa điểm"/></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Thành phố *<select name="city" required className="mt-1 w-full rounded-lg border bg-white p-3 font-normal">{['Biên Hòa','TP.HCM','Hà Nội','Đà Lạt','Đà Nẵng','Vũng Tàu','Khác'].map(x=><option key={x}>{x}</option>)}</select></label><label className="block text-sm font-semibold">Danh mục *<select name="category" required className="mt-1 w-full rounded-lg border bg-white p-3 font-normal">{['Ăn uống','Cafe','Check-in','Hotel'].map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label className="block text-sm font-semibold">Địa chỉ đầy đủ *<input name="address" required minLength={4} maxLength={300} placeholder="Số nhà, đường, phường/xã, thành phố" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label>
      <label className="block text-sm font-semibold">Số điện thoại địa điểm<input name="phone" type="tel" maxLength={30} pattern="[0-9+() .-]{7,30}" placeholder="Ví dụ: 0901234567" className="mt-1 w-full rounded-lg border p-3 font-normal"/><span className="mt-1 block font-normal text-stone-500">Hiển thị nút gọi điện và đặt giao hàng trên trang địa điểm.</span></label>
      <label className="block text-sm font-semibold">Liên kết Google Maps<input name="google_maps_url" type="url" placeholder="https://www.google.com/maps/..." className="mt-1 w-full rounded-lg border p-3 font-normal"/><span className="mt-1 block font-normal text-stone-500">Mở Google Maps → Chia sẻ → Sao chép đường liên kết.</span></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Vĩ độ<input name="latitude" type="number" step="any" min="-90" max="90" placeholder="10.9574" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label><label className="block text-sm font-semibold">Kinh độ<input name="longitude" type="number" step="any" min="-180" max="180" placeholder="106.8427" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Giá từ (VNĐ)<input type="number" min="0" name="price_min" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label><label className="block text-sm font-semibold">Giá đến (VNĐ)<input type="number" min="0" name="price_max" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label></div>
      <label className="block text-sm font-semibold">Giờ mở cửa<input name="opening_hours" maxLength={200} placeholder="Ví dụ: 07:00–22:00 hằng ngày" className="mt-1 w-full rounded-lg border p-3 font-normal"/></label>
      <label className="block text-sm font-semibold">Một hình ảnh địa điểm *<input name="cover_image" type="file" required accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full rounded-lg border p-3 font-normal"/><span className="mt-1 block font-normal text-stone-500">Bắt buộc 1 ảnh JPG, PNG hoặc WebP, tối đa 5MB. Ảnh sẽ được quản trị viên xem xét cùng đề xuất.</span></label>
      <label className="block text-sm font-semibold">Mô tả<textarea name="description" maxLength={3000} rows={4} className="mt-1 w-full rounded-lg border p-3 font-normal" placeholder="Món nổi bật, trải nghiệm, lưu ý khi ghé thăm..."/></label>
      <button className="rounded-xl bg-brand-700 px-5 py-3 font-bold text-white">{isAdmin ? 'Đăng địa điểm' : 'Gửi đề xuất để duyệt'}</button>
      <p className="text-xs text-stone-500">{isAdmin ? 'Địa điểm sẽ được đăng công khai ngay.' : 'Đề xuất chưa hiển thị công khai cho đến khi được quản trị viên phê duyệt.'}</p>
    </form>
  </div>;
}
