'use client';

import { useState, useTransition } from 'react';
import { Camera, Check, LoaderCircle, X } from 'lucide-react';
import { submitVisitorCheckin } from '@/app/actions/checkins';

export default function CheckinButton({ placeId, placeName }: { placeId: string; placeName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setMessage('');
    startTransition(async () => {
      const result = await submitVisitorCheckin({ placeId, placeName, visitorName: name });
      setMessage(result.message);
      setSuccess(result.ok);
      if (result.ok) setName('');
    });
  }

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setMessage(''); setSuccess(false); }} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 sm:text-sm">
        <Camera size={15} /> Check-in
      </button>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="visitor-checkin-title">
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div><h3 id="visitor-checkin-title" className="text-lg font-extrabold text-stone-900">Check-in địa điểm</h3><p className="mt-1 text-sm text-stone-500">{placeName}</p></div>
            <button type="button" aria-label="Đóng" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"><X size={18}/></button>
          </div>
          {success ? <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><Check size={18} className="mb-1 inline" /> {message}</div> : <>
            <label htmlFor="visitor-name" className="mt-4 block text-sm font-semibold text-stone-700">Họ và tên</label>
            <input id="visitor-name" value={name} onChange={e => setName(e.target.value)} maxLength={80} autoComplete="name" placeholder="Nhập họ tên của bạn" className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
            <button type="button" disabled={pending || name.trim().length < 2} onClick={submit} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
              {pending ? <><LoaderCircle size={16} className="animate-spin"/> Đang gửi...</> : <><Camera size={16}/> Xác nhận check-in</>}
            </button>
            <p className="mt-3 text-xs leading-5 text-stone-500">Không cần đăng nhập. Chỉ nhập tên để ghi nhận lượt check-in.</p>
          </>}
          {success && <button type="button" onClick={() => setOpen(false)} className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white">Đóng</button>}
        </div>
      </div>}
    </>
  );
}
