import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Heart, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'ViGo | Review Du lịch, Ẩm thực',
  description: 'ViGo — Review địa điểm du lịch, quán ăn và ẩm thực Việt Nam từ cộng đồng.',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let isAdmin = false;
  let isLoggedIn = false;

  // Read the authenticated user on the server so the Admin link is never
  // shown merely because of a client-side flag.
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      isLoggedIn = Boolean(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        isAdmin = profile?.is_admin === true;
      }
    } catch {
      // Keep public navigation available if auth lookup fails.
      isAdmin = false;
      isLoggedIn = false;
    }
  }

  return (
    <html lang="vi">
      <body>
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-brand-700">
              <Compass />ViGo
            </Link>
            <nav className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/" className="hover:text-brand-700">Khám phá</Link>
              <Link href="/favorites" className="flex items-center gap-1 hover:text-brand-700">
                <Heart size={16} /> Yêu thích
              </Link>
              <Link href="/places/new" className="rounded-full bg-brand-700 px-4 py-2 text-white hover:bg-brand-900">
                + Đề xuất địa điểm
              </Link>
              {isLoggedIn && isAdmin && (
                <Link href="/admin" className="hover:text-brand-700">Quản trị</Link>
              )}
              {!isLoggedIn && (
                <Link href="/login" className="hidden rounded-full px-3 py-2 hover:bg-stone-100 hover:text-brand-700 sm:inline-flex">Đăng nhập</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="min-h-[75vh]">{children}</main>

        <footer className="mt-16 border-t bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-bold text-brand-700">ViGo</span>
            <span>Đi để trải nghiệm. Review để sẻ chia.</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> Khám phá Việt Nam</span>
          </div>
          {!isLoggedIn && (
            <div className="mx-auto max-w-7xl px-4 pb-5 text-center">
              <Link href="/login" className="text-xs text-stone-500 underline underline-offset-2 hover:text-brand-700">
                Đăng nhập quản trị
              </Link>
            </div>
          )}
        </footer>
      </body>
    </html>
  );
}
