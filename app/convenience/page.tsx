'use client'
import { iconGradient } from '@/lib/colorLight'

import { useState } from 'react'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'

type PanelId = 'wifi' | 'coupons' | 'store' | 'tickets' | 'disaster' | 'ad'

const DEMO_WIFI = { ssid: 'STORE_FREE_WIFI', password: 'welcome2024' }

const COUPONS = [
  { id: 1, title: '唐揚げ弁当 50円引き', code: 'CVS50', expires: '2026/05/31' },
  { id: 2, title: 'コーヒー Mサイズ 無料', code: 'COFFEE', expires: '2026/05/20' },
  { id: 3, title: 'スイーツ 20%OFF', code: 'SWEET20', expires: '2026/06/15' },
]

const TICKETS = [
  { id: 1, name: '映画チケット', price: '¥1,900', available: true },
  { id: 2, name: 'バス1日乗車券', price: '¥800', available: true },
  { id: 3, name: '遊園地入場券', price: '¥3,200', available: false },
]

const STORE = {
  name: 'Vexiiストア 渋谷店',
  address: '東京都渋谷区道玄坂1-2-3',
  phone: '03-1234-5678',
  hours: '24時間営業',
}

const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; icon: React.ReactNode }[] = [
  {
    id: 'wifi',
    label: 'WiFi接続',
    desc: 'フリーWiFiに接続',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
      </svg>
    ),
  },
  {
    id: 'coupons',
    label: 'クーポン商品一覧',
    desc: 'お得なクーポンを見る',
    color: '#22c55e',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
      </svg>
    ),
  },
  {
    id: 'store',
    label: '店舗情報',
    desc: '住所・電話・営業時間',
    color: '#a855f7',
    bg: '#faf5ff',
    border: '#e9d5ff',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
      </svg>
    ),
  },
  {
    id: 'tickets',
    label: 'チケット販売',
    desc: '映画・交通・イベント',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
      </svg>
    ),
  },
]

export default function ConveniencePage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [copied, setCopied] = useState<'ssid' | 'pass' | null>(null)
  const [barcode, setBarcode] = useState<{ code: string; title: string } | null>(null)

  async function copy(text: string, type: 'ssid' | 'pass') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {}
  }

  function closePanel() {
    setPanel(null)
    setCopied(null)
  }

  return (
    <>
      <main className="h-dvh flex flex-col bg-[#edf1f7] overflow-hidden">
        {/* Header */}
        <header className="neu-header shrink-0" style={{ height: '64px' }}>
          <div className="h-full max-w-lg mx-auto w-full px-3 flex items-center gap-2.5">
            <Link href="/">
              <div style={{ width: '144px', height: '38px', backgroundImage: 'url(/convenience-logo.png)', backgroundSize: '120%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', marginTop: '20px' }} />
            </Link>
            <span className="ml-auto text-sm font-semibold text-gray-500">コンビニ</span>
          </div>
        </header>

        {/* Feature grid — 3 rows × 2 cols, fills remaining height with no scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto max-w-lg mx-auto w-full p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-[15px]">
          {/* ヒーロー画像 — 上下カットなし、ページの1/4 */}
          <div className="col-span-2 rounded-2xl overflow-hidden" style={{ height: '25vh' }}>
            <img
              src="/convenience-hero.png"
              alt="Ever Green Convenience Store"
              className="w-full h-full object-contain"
            />
          </div>

          {BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3"
              style={{ borderColor: btn.border }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: iconGradient(btn.color), color: '#ffffff' }}
              >
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-sm leading-tight text-center">{btn.label}</p>
              <p className="text-xs text-gray-400 text-center leading-tight">{btn.desc}</p>
            </button>
          ))}

          {/* Disaster — same card size as others, red styling */}
          <button
            onClick={() => setPanel('disaster')}
            className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3"
            style={{ borderColor: '#fecdd3' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-50">
              <svg className="w-9 h-9 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            </div>
            <p className="font-bold text-red-600 text-sm leading-tight text-center">災害情報</p>
            <p className="text-xs text-red-300 text-center leading-tight">緊急・避難情報を確認</p>
          </button>
          {/* 広告スペース */}
          <div className="col-span-2 rounded-2xl overflow-hidden" style={{ height: '25vh' }}>
            <iframe
              src="https://www.youtube.com/embed/vNVdeRkjT2Y?autoplay=1&mute=1&loop=1&playlist=vNVdeRkjT2Y&controls=0&modestbranding=1"
              title="Advertisement"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="py-2 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-blue-900 mr-1.5">Powered by</span><img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
        </div>
      </main>

      {/* Bottom-sheet panel overlay */}
      {panel && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          onClick={closePanel}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setPanel(null)} />

            {/* WiFi panel */}
            {panel === 'wifi' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">WiFi接続情報</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">SSID</p>
                    <p className="font-mono font-semibold text-blue-900 mt-0.5">{DEMO_WIFI.ssid}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">パスワード</p>
                    <p className="font-mono font-semibold text-blue-900 mt-0.5">{DEMO_WIFI.password}</p>
                  </div>
                  <button
                    onClick={() => copy(DEMO_WIFI.password, 'pass')}
                    className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold text-sm transition-colors hover:bg-blue-600 active:bg-blue-700"
                  >
                    {copied === 'pass' ? '✓ 接続済' : '接続'}
                  </button>
                </div>
              </div>
            )}

            {/* Coupons panel */}
            {panel === 'coupons' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">クーポン商品一覧</h2>
                </div>
                <div className="space-y-2">
                  {COUPONS.map((c) => (
                    <div key={c.id} className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between active:scale-95 transition-transform cursor-pointer"
                      onClick={() => setBarcode({ code: c.code, title: c.title })}>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.expires}まで</p>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-green-500 text-white font-semibold shrink-0 ml-3">使う</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Store info panel */}
            {panel === 'store' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">店舗情報</h2>
                </div>
                <p className="font-bold text-gray-800 mb-4">{STORE.name}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="text-gray-700">{STORE.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <a href={`tel:${STORE.phone}`} className="text-blue-600 font-medium">{STORE.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-gray-700">{STORE.hours}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets panel */}
            {panel === 'tickets' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">チケット販売</h2>
                </div>
                <div className="space-y-2">
                  {TICKETS.map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-xl p-4 flex items-center justify-between border ${t.available ? 'bg-orange-50 border-orange-100' : 'bg-[#edf1f7] border-gray-100 opacity-60'}`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.available ? '購入可能' : '在庫なし'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">{t.price}</p>
                        {t.available && (
                          <span className="inline-block text-[10px] mt-1 px-2 py-0.5 rounded-md bg-orange-500 text-white font-semibold">購入</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disaster panel */}
            {panel === 'disaster' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-red-700 text-lg">災害情報</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="font-semibold text-green-700 text-sm">現在の状況: 平常</p>
                    <p className="text-xs text-green-500 mt-1">この地域に現在の避難情報はありません</p>
                  </div>
                  <p className="text-xs text-gray-400 px-1">最新の情報は各機関の公式サイトをご確認ください</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-[#edf1f7] rounded-xl border border-gray-100">
                      <span className="text-sm font-semibold text-gray-700">内閣府 防災情報</span>
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                      </svg>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#edf1f7] rounded-xl border border-gray-100">
                      <span className="text-sm font-semibold text-gray-700">気象庁 防災情報</span>
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {panel === 'ad' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">広告スペース</h2>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-video mb-4">
                  <iframe
                    src="https://www.youtube.com/embed/vNVdeRkjT2Y"
                    title="Advertisement"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">広告掲載のお問い合わせは Vexii までご連絡ください</p>
              </div>
            )}
          </div>
        </div>
      )}
      {barcode && <BarcodeModal code={barcode.code} title={barcode.title} onClose={() => setBarcode(null)} />}
    </>
  )
}
