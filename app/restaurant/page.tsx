'use client'

import { useState } from 'react'
import Link from 'next/link'

type PanelId = 'wifi' | 'coupons' | 'order' | 'ad'

const DEMO_WIFI = { ssid: 'RESTAURANT_WIFI', password: 'dinner2024' }

const COUPONS = [
  { id: 1, title: 'ランチセット 100円引き', code: 'LUNCH100', expires: '2026/05/31' },
  { id: 2, title: 'ドリンク1杯無料', code: 'DRINK', expires: '2026/05/25' },
  { id: 3, title: 'デザート 30%OFF', code: 'DESSERT30', expires: '2026/06/30' },
]

const ORDER_CATEGORIES = [
  {
    id: 'speed',
    label: 'スピードメニュー',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
      </svg>
    ),
  },
  {
    id: 'recommend',
    label: 'おすすめ',
    color: '#eab308',
    bg: '#fefce8',
    border: '#fde68a',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'salad',
    label: 'サラダ',
    color: '#22c55e',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/>
      </svg>
    ),
  },
  {
    id: 'main',
    label: 'メイン',
    color: '#ef4444',
    bg: '#fff1f2',
    border: '#fecdd3',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/>
      </svg>
    ),
  },
  {
    id: 'drink',
    label: 'ドリンク',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/>
      </svg>
    ),
  },
  {
    id: 'history',
    label: '注文履歴',
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#e5e7eb',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
      </svg>
    ),
  },
]

export default function RestaurantPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [copied, setCopied] = useState<'ssid' | 'pass' | null>(null)

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
      <main className="h-dvh flex flex-col bg-[#edf1f7] max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <header className="neu-header px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
              alt="Vexii"
              className="h-6 w-auto object-contain"
            />
            <span className="font-bold text-sm silver-gradient">Vexii</span>
          </Link>
          <span className="text-gray-200 text-lg leading-none mx-0.5">|</span>
          <span className="text-sm font-semibold text-gray-500">飲食店</span>
        </header>

        {/* 2×2 feature grid — fills height, no scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-3">

          {/* WiFi */}
          <button
            onClick={() => setPanel('wifi')}
            className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3"
            style={{ borderColor: '#bae6fd' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-sky-50">
              <svg className="w-9 h-9 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
              </svg>
            </div>
            <p className="font-bold text-gray-800 text-sm leading-tight text-center">WiFi接続</p>
            <p className="text-xs text-gray-400 text-center leading-tight">フリーWiFiに接続</p>
          </button>

          {/* Coupons */}
          <button
            onClick={() => setPanel('coupons')}
            className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3"
            style={{ borderColor: '#bbf7d0' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-50">
              <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
              </svg>
            </div>
            <p className="font-bold text-gray-800 text-sm leading-tight text-center">お得なクーポン</p>
            <p className="text-xs text-gray-400 text-center leading-tight">割引クーポンを見る</p>
          </button>

          {/* Order */}
          <button
            onClick={() => setPanel('order')}
            className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3"
            style={{ borderColor: '#fed7aa' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-50">
              <svg className="w-9 h-9 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <p className="font-bold text-gray-800 text-sm leading-tight text-center">オーダー</p>
            <p className="text-xs text-gray-400 text-center leading-tight">メニューを選ぶ</p>
          </button>

          {/* Ad space */}
          <button
            onClick={() => setPanel('ad')}
            className="card-light flex flex-col items-center justify-center overflow-hidden active:scale-95 transition-transform duration-150 relative"
            style={{ borderColor: '#e9d5ff' }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50" />
            <div className="relative flex flex-col items-center gap-2 p-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100">
                <svg className="w-9 h-9 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/>
                </svg>
              </div>
              <p className="font-bold text-purple-700 text-sm leading-tight text-center">広告スペース</p>
              <p className="text-xs text-purple-400 text-center leading-tight">PR・お知らせ</p>
            </div>
          </button>
        </div>
      </main>

      {/* Bottom-sheet panels */}
      {panel && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          onClick={closePanel}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />

            {/* WiFi panel */}
            {panel === 'wifi' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">WiFi接続情報</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-sky-50 rounded-xl p-4">
                    <p className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">SSID</p>
                    <p className="font-mono font-semibold text-sky-900 mt-0.5">{DEMO_WIFI.ssid}</p>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-4">
                    <p className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">パスワード</p>
                    <p className="font-mono font-semibold text-sky-900 mt-0.5">{DEMO_WIFI.password}</p>
                  </div>
                  <button
                    onClick={() => copy(DEMO_WIFI.password, 'pass')}
                    className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold text-sm transition-colors hover:bg-sky-600 active:bg-sky-700"
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
                  <h2 className="font-bold text-gray-900 text-lg">お得なクーポン</h2>
                </div>
                <div className="space-y-2">
                  {COUPONS.map((c) => (
                    <div key={c.id} className="bg-green-50 border border-green-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        コード: <span className="font-mono text-green-700 font-semibold">{c.code}</span>　{c.expires}まで
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order panel */}
            {panel === 'order' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">オーダー</h2>
                </div>

                {/* 2-col category grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {ORDER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className="flex items-center gap-3 p-3 rounded-xl border active:scale-95 transition-transform duration-150 text-left"
                      style={{ background: cat.bg, borderColor: cat.border }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span>
                      <span className="font-semibold text-gray-800 text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* 会計 — full-width CTA */}
                <button className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-base transition-colors hover:bg-orange-600 active:bg-orange-700 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                  </svg>
                  会計
                </button>
              </div>
            )}

            {/* Ad panel */}
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
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 border border-purple-200 aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-1">Advertisement</p>
                    <p className="text-purple-600 font-bold text-lg">広告枠</p>
                    <p className="text-purple-400 text-xs mt-1">ここに広告が表示されます</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">広告掲載のお問い合わせは Vexii までご連絡ください</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
