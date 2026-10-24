import { addReview } from '@/app/actions/reviews';

const criteria = [
  { name: 'food_scenery', label: 'Đồ ăn / Cảnh quan' },
  { name: 'space', label: 'Không gian' },
  { name: 'service', label: 'Phục vụ' },
  { name: 'price', label: 'Giá cả' },
];

export default function ReviewForm({ placeId }: { placeId: string }) {
  return (
    <form action={addReview} className="space-y-4 rounded-2xl border bg-white p-5">
      <input type="hidden" name="place_id" value={placeId} />

      {/* Honeypot chống bot: Người thật không thấy, bot crawl form sẽ tự điền */}
      <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
        <input
          type="text"
          name="hp_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <h3 className="text-lg font-bold">Chia sẻ trải nghiệm của bạn</h3>

      <div>
        <label className="block text-sm font-semibold text-stone-700">Tên của bạn</label>
        <input
          type="text"
          name="author_name"
          maxLength={50}
          placeholder="Nhập tên hiển thị (tùy chọn)"
          className="mt-1 block w-full rounded-lg border border-stone-200 p-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <label className="block text-sm font-semibold text-stone-700">
        Đánh giá tổng thể
        <select name="rating" required className="mt-1 block w-full rounded-lg border border-stone-200 p-2 focus:border-brand-500 focus:outline-none">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} sao</option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {criteria.map((c) => (
          <label key={c.name} className="text-sm text-stone-700">
            {c.label}
            <select name={c.name} required className="mt-1 block w-full rounded-lg border border-stone-200 p-2 focus:border-brand-500 focus:outline-none">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} sao</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <label className="block text-sm font-semibold text-stone-700">
        Nhận xét
        <textarea
          name="comment"
          minLength={5}
          maxLength={3000}
          required
          rows={4}
          placeholder="Chất lượng món ăn, không gian, mức giá, phục vụ..."
          className="mt-1 block w-full rounded-lg border border-stone-200 p-3 text-sm font-normal focus:border-brand-500 focus:outline-none"
        />
      </label>

      <p className="text-xs text-stone-500
