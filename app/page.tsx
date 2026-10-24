import { MapPin, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import PlaceCard from '@/components/PlaceCard';
import { createClient } from '@/lib/supabase/server';
import type { Place } from '@/types';
export const revalidate = 0;
export default async function Home({ searchParams }: { searchParams: { city?: string; category?: string; q?: string; sort?: string } }) {
  let places: Place[] = []; let dbError = '';
  try {
    const supabase = await createClient();
    const sort = searchParams.sort === 'views' ? 'views' : 'rating';
    let query = supabase.from('places').select('*').eq('status','published');
    if (sort === 'views') {
      query = query.order('view_count', { ascending: false }).order('average_rating', { ascending: false }).order('total_reviews', { ascending: false });
    } else {
      query = query.order('average_rating', { ascending: false }).order('total_reviews', { ascending: false }).order('created_at', { ascending: false });
    }
    query = query.limit(60);
    if (searchParams.city) query = query.eq('city', searchParams.city);
    if (searchParams.category) query = query.eq('category', searchParams.category);
    if (searchParams.q) query = query.or(`name.ilike.%${searchParams.q.replace(/[,%()]/g,'')}%,address.ilike.%${searchParams.q.replace(/[,%()]/g,'')}%,description.ilike.%${searchParams.q.replace(/[,%()]/g,'')}%`);
    const { data, error } = await query;
    if (error) dbError = error.message; else places = (data || []) as Place[];
  } catch (e) { dbError = e instanceof Error ? e.message : 'Không thể kết nối Supabase.'; }
  return <><section className="bg-gradient-to-br from-brand-900 via-brand-700 to-emerald-600 text-white"><div className="mx-auto max-w-7xl px-4 py-14 md:py-20"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm"><Sparkles size={15}/> Cẩm nang khám phá Việt Nam</div><h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">Đi đâu cũng vui.<br/><span className="text-emerald-200">Ăn gì cũng chất.</span></h1><p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">Tìm những quán ngon, góc đẹp và trải nghiệm đáng nhớ — qua chia sẻ từ cộng đồng.</p><div className="mt-8 flex flex-wrap gap-3 text-sm">
  {[
    { label: 'Hà Nội', city: 'Hà Nội', icon: true },
    { label: 'TP.HCM', city: 'TP.HCM' },
    { label: 'Đà Lạt', city: 'Đà Lạt' },
    { label: 'Biên Hòa', city: 'Biên Hòa' },
    { label: 'Đà Nẵng', city: 'Đà Nẵng' },
    { label: 'Vũng Tàu', city: 'Vũng Tàu' },
  ].map((item) => (
    <Link
      key={item.city}
      href={`/?city=${encodeURIComponent(item.city)}`}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-2 transition hover:bg-white/30 hover:ring-1 hover:ring-white/50 ${searchParams.city === item.city ? 'bg-white text-brand-900 font-bold' : 'bg-white/15 text-white'}`}
    >
      {item.icon ? <MapPin size={15} /> : null}
      {item.label}
    </Link>
  ))}
</div>
  <div className="mt-5 flex flex-wrap items-center gap-2">
    <Link href="/?category=Check-in%2FDu+l%E1%BB%8Bch" className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 font-bold text-brand-900 shadow-sm transition hover:bg-amber-200">
      <Camera size={17} /> Top 10 Check-in Việt Nam
    </Link>
    <span className="text-xs text-white/80">Hội An · Đà Nẵng · Hạ Long · Tràng An · Sa Pa · Hà Nội · Huế · Mũi Né · Hà Giang · Côn Đảo</span>
  </div>
</div></div></section><section className="mx-auto max-w-7xl px-4"><div className="-mt-6 relative"><FilterBar city={searchParams.city} category={searchParams.category} q={searchParams.q} sort={searchParams.sort}/></div><div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
  <div className="mb-3 flex items-center gap-2 font-bold text-stone-800"><Camera size={18} className="text-brand-700"/> Điểm check-in nổi bật</div>
  <div className="flex flex-wrap gap-2">
    {[
      { label: 'Phố cổ Hội An', city: 'Hội An' },
      { label: 'Cầu Vàng – Bà Nà Hills', city: 'Đà Nẵng' },
      { label: 'Vịnh Hạ Long', city: 'Hạ Long' },
      { label: 'Tràng An', city: 'Ninh Bình' },
      { label: 'Fansipan', city: 'Sa Pa' },
      { label: 'Hồ Hoàn Kiếm', city: 'Hà Nội' },
      { label: 'Đại Nội Huế', city: 'Huế' },
      { label: 'Bàu Trắng', city: 'Mũi Né' },
      { label: 'Cột cờ Lũng Cú', city: 'Hà Giang' },
      { label: 'Bãi Đầm Trầu', city: 'Côn Đảo' },
    ].map((item) => <Link key={item.label} href={`/?category=${encodeURIComponent('Check-in/Du lịch')}&q=${encodeURIComponent(item.label)}`} className="rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-700 transition hover:border-brand-600 hover:bg-brand-50 hover:text-brand-800">{item.label}</Link>)}
  </div>
</div>
<div className="flex flex-col justify-between gap-2 py-8 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-brand-700">Gợi ý cho bạn</p><h2 className="mt-1 text-2xl font-black">Khám phá địa điểm</h2></div><div className="flex flex-wrap items-center gap-3"><p className="text-sm text-stone-500">{places.length} địa điểm</p><p className="text-xs text-stone-500">{searchParams.sort === 'views' ? 'Sắp xếp: Xem nhiều nhất' : 'Sắp xếp: Điểm đánh giá cao'}</p></div></div>{dbError ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><strong>Chưa tải được dữ liệu.</strong><p className="mt-1">{dbError} Hãy kiểm tra `.env.local` và chạy SQL khởi tạo trong thư mục `supabase/schema.sql`.</p></div> : places.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{places.map(place=><PlaceCard key={place.id} place={place}/>)}</div> : <div className="rounded-2xl border border-dashed p-10 text-center"><p className="text-lg font-bold">Chưa có địa điểm phù hợp</p><p className="mt-2 text-sm text-stone-500">Thử đổi bộ lọc hoặc thêm địa điểm đầu tiên cho ViGo.</p></div>}</section></>
}
