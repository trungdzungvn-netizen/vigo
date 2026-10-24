import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Compass, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'ViGo | Review Du lịch, Ẩm thực',
  description: 'ViGo — Review địa điểm du lịch, quán ăn và ẩm thực Việt Nam từ cộng đồng.',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let isAdmin = false;
  let isLoggedIn = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isLoggedIn = Boolean(user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
        isAdmin = profile?.is_admin === true;
      }
    } catch {
      isAdmin = false;
      isLoggedIn = false;
    }
  }

  return (
    <html lang="vi">
      <body>
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-5 sm:py-3">
            <Link href="/" aria-label="ViGo - Trang chủ" className="group flex min-w-0 shrink-0 items-center">
              <Image src="/vigo-logo.svg" alt="ViGo — Khám phá, ăn ngon, đi đâu cũng vui" width={260} height={75} priority className="h-auto w-[116px] sm:w-[175px] lg:w-[220px] transition-transform duration-200 group-hover:scale-[1.02]" />
            </Link>
            <nav aria-label="Điều hướng chính" className="flex min-w-0 items-center justify-end gap-2 text-xs font-semibold sm:gap-4 sm:text-sm lg:gap-6">
              <Link href="/" className="flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 text-stone-800 hover:bg-stone-50 hover:text-brand-700 sm:flex-row sm:gap-1.5 sm:px-2">
                <Compass size={18} className="shrink-0 sm:hidden" />
                <span>Khám phá</span>
              </Link>
              <Link href="/?category=Check-in%2FDu+l%E1%BB%8Bch" className="flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 text-stone-800 hover:bg-stone-50 hover:text-brand-700 sm:flex-row sm:gap-1.5 sm:px-2">
                <Camera size={18} className="shrink-0" />
                <span className="whitespace-nowrap">Top 10 Check-in</span>
              </Link>
              <Link href="/favorites" className="flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 text-stone-800 hover:bg-stone-50 hover:text-brand-700 sm:flex-row sm:gap-1.5 sm:px-2">
                <Heart size={18} className="shrink-0" />
                <span>Yêu thích</span>
              </Link>
              <Link href="/places/new" className="inline-flex max-w-[138px] items-center justify-center gap-1.5 rounded-full bg-brand-700 px-3 py-2.5 text-center leading-tight text-white shadow-sm transition hover:bg-brand-900 sm:max-w-none sm:gap-2 sm:px-4 sm:py-3">
                <span className="text-lg leading-none">+</span><span>Đề xuất địa điểm</span>
              </Link>
              {isLoggedIn && isAdmin && <Link href="/admin" className="hidden rounded-lg px-2 py-2 hover:text-brand-700 sm:inline-flex">Quản trị</Link>}
            </nav>
          </div>
        </header>
        <main className="min-h-[75vh]">{children}</main>
        <footer className="mt-16 border-t border-stone-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" aria-label="ViGo - Trang chủ" className="inline-flex w-fit items-center">
              <Image src="/vigo-logo.svg" alt="ViGo" width={160} height={46} className="h-auto w-28" />
            </Link>
            <span>Đi để trải nghiệm. Review để sẻ chia.</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> Khám phá Việt Nam</span>
          </div>
          {!isLoggedIn && <div className="mx-auto max-w-7xl px-4 pb-5 text-center"><Link href="/login" className="text-xs text-stone-500 underline underline-offset-2 hover:text-brand-700">Đăng nhập quản trị</Link></div>}
        </footer>
      </body>
    </html>
  );
}
