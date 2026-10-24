import { MapPin, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import PlaceCard from '@/components/PlaceCard';
import { createClient } from '@/lib/supabase/server';
import type { Place } from '@/types';

export const revalidate = 0;

type HomeProps = {
  searchParams: { city?: string; category?: string; q?: string; sort?: string };
};

export default async function Home({ searchParams }: HomeProps) {
  let places: Place[] = [];
  let dbError = '';

  try {
    const supabase = await createClient();
    const sort = searchParams.sort === 'views' ? 'views' : 'rating';
    let query = supabase.from('places').select('*').eq('status', 'published');

    if (sort === 'views') {
      query = query
        .order('view_count', { ascending: false })
        .order('average_rating', { ascending: false })
        .order('total_reviews', { ascending: false });
    } else {
      query = query
        .order('average_rating', { ascending: false })
        .order('total_reviews', { ascending: false })
        .order('created_at', { ascending: false });
    }

    query = query.limit(60);
    if (searchParams.city) query = query.eq('city', searchParams.city);
    if (searchParams.category) query = query.eq('category', searchParams.category);
    if (searchParams.q) {
      const term = searchParams.q.replace(/[,%()]/g, '');
      query = query.or(
        `name.ilike.%${term}%,address.ilike.%${term}%,description.ilike.%${term}%`,
      );
    }

    const { data, error } = await query;
    if (error) dbError = error.message;
    else places = (data || []) as Place[];
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Không thể kết nối Supabase.';
  }

  const cities = [
    { label: 'Hà Nội', city: 'Hà Nội', icon: true },
    { label: 'TP.HCM', city: 'TP.HCM' },
    { label: 'Đà Lạt', city: 'Đà Lạt' },
    { label: 'Biên Hòa', city: 'Biên Hòa' },
    { label: 'Đà Nẵng', city: 'Đà Nẵng' },
    { label: 'Vũng Tàu', city: 'Vũng Tàu' },
  ];

  const checkInPlaces = [
    { label: 'Phố cổ Hội An' },
    { label: 'Cầu Vàng – Bà Nà Hills' },
    { label: 'Vịnh Hạ Long' },
    { label: 'Tràng An' },
    { label: 'Fansipan' },
    { label: 'Hồ Hoàn Kiếm' },
    { label: 'Đại Nội Huế' },
    { label: 'Bàu Trắng' },
    { label: 'Cột cờ Lũng Cú' },
    { label: 'Bãi Đầm Trầu' },
  ];

  const travelImage = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=85';
  const foodImage = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85';
  const coffeeImage = 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=85';
  const cityImage = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=85';

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#103e2e] text-white">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#103e2e] via-[#126b4b] to-[#0b8b68]" />
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: `url(${travelImage})`, backgroundSize: 'cover', backgroundPosition: 'center 48%' }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#103e2e] via-[#103e2e]/90 to-[#103e2e]/40" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:py-20">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-50 shadow-sm backdrop-blur">
              <Sparkles size={15} /> CẨM NANG KHÁM PHÁ VIỆT NAM
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Đi đâu cũng vui.<br />
              <span className="text-[#9ff0c8]">Ăn gì cũng chất.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Tìm quán ngon, góc check-in đẹp và những trải nghiệm đáng nhớ — được chia sẻ bởi cộng đồng yêu khám phá.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#kham-pha" className="inline-flex items-center gap-2 rounded-full bg-[#f9c74f] px-5 py-3 text-sm font-extrabold text-[#173b2c] shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300">
                Khám phá ngay <span aria-hidden="true">→</span>
              </Link>
              <Link href={`/?category=${encodeURIComponent('Check-in/Du lịch')}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                <Camera size={17} /> Top 10 Check-in
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {cities.map((item) => (
                <Link key={item.city} href={`/?city=${encodeURIComponent(item.city)}`} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition hover:border-white/60 hover:bg-white/20 ${searchParams.city === item.city ? 'border-white bg-white font-bold text-[#174631]' : 'border-white/20 bg-white/10 text-white/90'}`}>
                  {item.icon ? <MapPin size={14} /> : null}{item.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/15 pt-5 text-sm text-white/75">
              <span><strong className="text-xl font-black text-white">{places.length || '60+'}</strong> địa điểm gợi ý</span>
              <span className="h-1 w-1 rounded-full bg-[#f9c74f]" />
              <span>Ăn ngon · Đi chơi · Check-in</span>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[560px] lg:block">
            <div className="absolute -right-3 top-3 h-28 w-28 rounded-full bg-[#f9c74f]/25 blur-2xl" />
            <div className="grid grid-cols-5 grid-rows-6 gap-3">
              <div className="relative col-span-3 row-span-4 overflow-hidden rounded-[28px] border border-white/20 shadow-2xl" style={{ backgroundImage: `url(${travelImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-4"><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">GỢI Ý DU LỊCH</span><p className="mt-3 text-2xl font-black">Việt Nam<br />đẹp bất ngờ</p></div>
              </div>
              <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[24px] border border-white/20 shadow-xl" style={{ backgroundImage: `url(${foodImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><div className="absolute bottom-4 left-4 text-lg font-extrabold">Ăn ngon</div>
              </div>
              <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[24px] border border-white/20 shadow-xl" style={{ backgroundImage: `url(${coffeeImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><div className="absolute bottom-4 left-4 text-lg font-extrabold">Góc cà phê</div>
              </div>
              <div className="relative col-span-3 row-span-2 flex items-end overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-xl" style={{ backgroundImage: `url(${cityImage})`, backgroundSize: 'cover', backgroundPosition: 'center 55%' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" /><div className="relative"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-200">Điểm đến nổi bật</p><p className="mt-1 text-xl font-black">Lên lịch cho chuyến đi tiếp theo</p></div>
              </div>
            </div>
            <div className="absolute -left-5 top-1/2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#173b2c] shadow-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100"><MapPin size={20} /></span><span><strong className="block text-sm">Khám phá gần bạn</strong><span className="text-xs text-stone-500">Mở rộng trải nghiệm</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10 -mt-5 rounded-[24px] border border-stone-200/80 bg-white p-3 shadow-[0_18px_50px_-28px_rgba(15,50,35,.28)] sm:p-4">
          <div className="mb-2 flex items-center gap-2 px-2 pt-1 text-sm font-bold text-stone-700"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-brand-700"><MapPin size={17}/></span> Bạn muốn khám phá điều gì?</div>
          <FilterBar city={searchParams.city} category={searchParams.category} q={searchParams.q} sort={searchParams.sort} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href={`/?category=${encodeURIComponent('Ăn uống')}`} className="group relative min-h-[150px] overflow-hidden rounded-3xl bg-stone-800 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-0 opacity-70 transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${foodImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/><div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"/><div className="relative"><span className="text-xs font-bold uppercase tracking-[.18em] text-amber-200">Food guide</span><h2 className="mt-2 text-2xl font-black">Ăn uống</h2><p className="mt-1 text-sm text-white/80">Món ngon và quán đáng thử</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Khám phá <span>↗</span></span></div>
          </Link>
          <Link href={`/?category=${encodeURIComponent('Quán cà phê')}`} className="group relative min-h-[150px] overflow-hidden rounded-3xl bg-stone-800 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-0 opacity-70 transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${coffeeImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/><div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"/><div className="relative"><span className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Coffee & chill</span><h2 className="mt-2 text-2xl font-black">Quán cà phê</h2><p className="mt-1 text-sm text-white/80">Góc đẹp để gặp gỡ, thư giãn</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Tìm góc chill <span>↗</span></span></div>
          </Link>
          <Link href={`/?category=${encodeURIComponent('Check-in/Du lịch')}`} className="group relative min-h-[150px] overflow-hidden rounded-3xl bg-stone-800 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-0 opacity-70 transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${travelImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/><div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"/><div className="relative"><span className="text-xs font-bold uppercase tracking-[.18em] text-sky-200">Travel inspiration</span><h2 className="mt-2 text-2xl font-black">Check-in & du lịch</h2><p className="mt-1 text-sm text-white/80">Điểm đến đẹp trên khắp Việt Nam</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Xem điểm đến <span>↗</span></span></div>
          </Link>
        </div>

        <div className="mt-10 rounded-[26px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-brand-700">Điểm đến đáng lưu lại</p><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Top 10 Check-in Việt Nam</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">Từ phố cổ rực rỡ đến núi non hùng vĩ — chọn điểm đến cho chuyến đi tiếp theo của bạn.</p></div>
            <Link href={`/?category=${encodeURIComponent('Check-in/Du lịch')}`} className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-900">Xem tất cả <span>→</span></Link>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {checkInPlaces.map((item, index) => <Link key={item.label} href={`/?category=${encodeURIComponent('Check-in/Du lịch')}&q=${encodeURIComponent(item.label)}`} className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-brand-800"><span className="mr-2 text-xs font-extrabold text-brand-700">{String(index + 1).padStart(2, '0')}</span>{item.label}</Link>)}
          </div>
        </div>

        <div id="kham-pha" className="flex scroll-mt-24 flex-col justify-between gap-3 py-9 sm:flex-row sm:items-end">
          <div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-brand-700">Gợi ý dành cho bạn</p><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Khám phá địa điểm</h2><p className="mt-1 text-sm text-stone-500">Tìm nơi phù hợp cho bữa ăn, buổi hẹn hoặc chuyến đi của bạn.</p></div>
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-brand-800">{places.length} địa điểm</span><span className="text-xs text-stone-500">{searchParams.sort === 'views' ? 'Sắp xếp: Xem nhiều nhất' : 'Sắp xếp: Điểm đánh giá cao'}</span></div>
        </div>

        {dbError ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><strong>Chưa tải được dữ liệu.</strong><p className="mt-1">{dbError} Hãy kiểm tra `.env.local` và chạy SQL khởi tạo trong thư mục `supabase/schema.sql`.</p></div> : places.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{places.map((place) => <PlaceCard key={place.id} place={place} />)}</div> : <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center"><p className="text-lg font-bold">Chưa có địa điểm phù hợp</p><p className="mt-2 text-sm text-stone-500">Thử đổi bộ lọc hoặc thêm địa điểm đầu tiên cho ViGo.</p></div>}
      </section>
    </>
  );
}
