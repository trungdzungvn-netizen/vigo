'use client';

import { useFormState } from 'react-dom';
import { addReview } from '@/app/actions/reviews';

const criteria = [
  { name: 'food_scenery', label: 'Đồ ăn / Cảnh quan' },
  { name: 'space', label: 'Không gian' },
  { name: 'service', label: 'Phục vụ' },
  { name: 'price', label: 'Giá cả' },
];
const initialState = { success: false, message: '' };

export default function ReviewForm({ placeId }: { placeId: string }) {
  const [state, formAction] = useFormState(addReview, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border bg-white p-5">
      <input type="hidden" name="place_id" value={placeId} />
      <h3 className="text-lg font-bold">Chia sẻ trải nghiệm của bạn</h3>
      <p className="text-sm text-stone-500">Không cần đăng nhập. Vui lòng nhập họ tên để hiển thị cùng nhận xét.</p>
      <label className="block text-sm font-semibold">Họ và tên
        <input name="reviewer_name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Nhập họ tên của bạn" className="mt-1 block w-full rounded-lg border p-3 font-normal" />
      </label>
      <label className="block text-sm font-semibold">Đánh giá tổng thể
        <select name="rating" required defaultValue="5" className="mt-1 block w-full rounded-lg border p-2">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}</select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">{criteria.map(c => <label key={c.name} className="text-sm">{c.label}<select name={c.name} required defaultValue="5" className="mt-1 block w-full rounded-lg border p-2">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}</select></label>)}</div>
      <label className="block text-sm font-semibold">Nhận xét
        <textarea name="comment" minLength={5} maxLength={3000} required rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." className="mt-1 block w-full rounded-lg border p-3 font-normal" />
      </label>
      {state.message && <p role="status" aria-live="polite" className={`rounded-lg p-3 text-sm ${state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{state.message}</p>}
      <button className="rounded-xl bg-brand-700 px-5 py-3 font-bold text-white hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60">Gửi đánh giá</button>
    </form>
  );
}
