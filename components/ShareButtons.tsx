'use client';

import { Copy, Facebook, MessageCircle, Check } from 'lucide-react';
import { useState } from 'react';

type ShareButtonsProps = {
  url: string;
  title: string;
};

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Sao chép liên kết địa điểm:', url);
    }
  }

  return (
    <section aria-label="Chia sẻ địa điểm" className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
      <h2 className="text-base font-bold text-stone-900">Chia sẻ địa điểm này</h2>
      <p className="mt-1 text-sm text-stone-500">Gửi địa điểm yêu thích cho bạn bè và người thân.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chia sẻ qua Facebook"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
        >
          <Facebook size={18} /> Facebook
        </a>
        <a
          href={`https://zalo.me/share?url=${shareUrl}&title=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chia sẻ qua Zalo"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0068FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
        >
          <MessageCircle size={18} /> Zalo
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Đã sao chép' : 'Sao chép liên kết'}
        </button>
      </div>
    </section>
  );
}
