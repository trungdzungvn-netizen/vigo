import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star } from 'lucide-react';
import type { Place } from '@/types';

export default function PlaceCard({ place }: { place: Place }) {
  const price = place.price_min == null
    ? 'Chưa cập nhật giá'
    : `${place.price_min.toLocaleString('vi-VN')}đ${place.price_max ? ` – ${place.price_max.toLocaleString('vi-VN')}đ` : '+'}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/place/${place.id}`}
        className="flex min-w-0 flex-row sm:block"
        aria-label={`Xem chi tiết ${place.name}`}
      >
        <div className="relative h-32 w-32 shrink-0 bg-stone-100 sm:aspect-[4/3] sm:h-auto sm:w-auto">
          {place.cover_image ? (
            <Image
              src={place.cover_image}
              alt={place.name}
              fill
              sizes="(max-width: 639px) 128px, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition duration-300 sm:group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-stone-400 sm:text-sm">
              Chưa có ảnh
            </div>
          )}
          <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-12px)] truncate rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-brand-700 sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            {place.category}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <h2 className="line-clamp-2 min-w-0 text-sm font-bold leading-snug group-hover:text-brand-700 sm:line-clamp-1 sm:text-lg">
              {place.name}
            </h2>
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold sm:text-sm">
              <Star size={14} className="fill-amber-400 text-amber-400 sm:h-[15px] sm:w-[15px]" />
              {Number(place.average_rating || 0).toFixed(1)}
            </span>
          </div>

          <p className="mt-1.5 flex min-w-0 items-start gap-1 text-xs leading-snug text-stone-500 sm:mt-2 sm:text-sm">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{place.address}{place.address && place.city ? ', ' : ''}{place.city}</span>
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs sm:mt-4 sm:text-sm">
            <span className="font-semibold text-brand-700">{price}</span>
            <span className="text-stone-500">{place.total_reviews || 0} đánh giá</span>
          </div>
        </div>
      </Link>

      <div className="border-t border-stone-200 px-3 py-2 sm:px-4">
        <button
          type="button"
          aria-label="Yêu thích (đăng nhập để sử dụng)"
          title="Đăng nhập để lưu yêu thích"
          className="flex items-center gap-2 text-xs text-stone-500 hover:text-rose-600 sm:text-sm"
        >
          <Heart size={15} /> Lưu yêu thích
        </button>
      </div>
    </article>
  );
}
