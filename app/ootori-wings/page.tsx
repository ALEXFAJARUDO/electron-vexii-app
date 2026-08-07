'use client'
import { iconGradient } from '@/lib/colorLight'

import { useState } from 'react'
import Link from 'next/link'

type PanelId = 'floor1' | 'floor2' | 'floor3' | 'events' | 'map'

const OFFICIAL_SITE_URL = 'https://wingssc.co.jp/'

const FLOOR1_SHOPS = [
  { name: 'おおとりウイングス 旅のサロン', category: '旅行代理店', hours: '10:00〜20:00', open: true },
  { name: 'つばさ整骨院', category: '整骨院', hours: '10:00〜20:00', open: true },
  { name: 'ほけんショップ', category: '保険相談', hours: '10:00〜20:00', open: true },
  { name: 'まるしげ', category: '和洋菓子', hours: '10:00〜20:00', open: true },
]

const FLOOR2_SHOPS = [
  { name: '紀陽銀行', category: '銀行', hours: '9:00〜15:00', open: true },
  { name: 'NICE NAIL', category: 'ネイルサロン', hours: '10:00〜20:00', open: true },
  { name: 'BRAND PARTNERS', category: 'ブランド買取', hours: '10:00〜20:00', open: true },
  { name: 'Care Mobile', category: '携帯・スマホ', hours: '10:00〜20:00', open: true },
  { name: 'なかむら内科・糖尿病クリニック', category: 'クリニック', hours: '9:00〜18:00', open: true },
  { name: '堺鳳東郵便局', category: '郵便局', hours: '9:00〜17:00', open: true },
  { name: '江原歯科', category: '歯科', hours: '9:30〜19:00', open: true },
  { name: 'ローラン', category: '美容室', hours: '10:00〜20:00', open: true },
  { name: 'ロボ団 おおとりウイングス校', category: 'プログラミング教室', hours: '10:00〜19:00', open: true },
  { name: 'カーブス', category: 'フィットネス', hours: '10:00〜19:00', open: true },
  { name: '三木楽器 鳳センター', category: '楽器・音楽教室', hours: '10:00〜20:00', open: true },
  { name: 'Seria', category: '100円ショップ', hours: '10:00〜20:00', open: true },
]

const FLOOR3_SHOPS = [
  { name: 'defi', category: 'カルチャースクール', hours: '10:00〜20:00', open: true },
  { name: 'おおとりアカデミー', category: '学習塾', hours: '10:00〜20:00', open: true },
]

const EVENTS = [
  { id: 1, title: '季節の催事販売会', date: '開催時期は公式サイトをご確認ください', floor: '1F 食品街催事会場', tag: '開催中' },
  { id: 2, title: '屋外西口通り催事', date: '開催時期は公式サイトをご確認ください', floor: '屋外西口通り催事会場', tag: '近日' },
]

export default function OotoriWingsPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)

  function closePanel() {
    setPanel(null)
  }

  const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; icon: React.ReactNode }[] = [
    {
      id: 'floor1',
      label: '1F店舗情報',
      desc: '旅のサロン・整骨院・和洋菓子',
      color: '#0891b2',
      bg: '#ecfeff',
      border: '#a5f3fc',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
        </svg>
      ),
    },
    {
      id: 'floor2',
      label: '2F店舗情報',
      desc: '銀行・美容・クリニック 他',
      color: '#22c55e',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
        </svg>
      ),
    },
    {
      id: 'floor3',
      label: '3F店舗情報',
      desc: 'スクール・学習塾',
      color: '#f97316',
      bg: '#fff7ed',
      border: '#fed7aa',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 12.5v3.5m-9-3.5v6m0-6L5.84 10.578A12.083 12.083 0 003 12.5v3.5"/>
        </svg>
      ),
    },
    {
      id: 'events',
      label: 'イベント情報',
      desc: '館内催事・特典',
      color: '#eab308',
      bg: '#fefce8',
      border: '#fde68a',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008z"/>
        </svg>
      ),
    },
    {
      id: 'map',
      label: '館内マップ',
      desc: 'フロアガイド・施設',
      color: '#8b5cf6',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
        </svg>
      ),
    },
  ]

  return (
    <>
      <main className="min-h-dvh flex flex-col bg-[#edf1f7]">
        {/* Header */}
        <header className="neu-header shrink-0" style={{ height: '64px' }}>
          <div className="h-full max-w-lg mx-auto w-full px-3 flex items-center justify-between gap-2.5">
            <Link href="/">
              <span className="font-bold text-gray-800 text-base">おおとりウイングス</span>
            </Link>
            <a
              href={OFFICIAL_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-cyan-600 border border-cyan-200 bg-cyan-50 rounded-full px-3 py-1.5 active:scale-95 transition-transform"
            >
              公式サイト ↗
            </a>
          </div>
        </header>

        {/* 2-col × 3-row grid */}
        <div className="flex-1 max-w-lg mx-auto w-full p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-[15px]">
          {/* ヒーロー画像 */}
          <div className="col-span-2 rounded-2xl overflow-hidden shrink-0" style={{ height: '25vh' }}>
            <img src="/mall-hero.png" alt="おおとりウイングス" className="w-full h-full object-cover" />
          </div>

          {/* 施設情報カード */}
          <div className="col-span-2 card-light p-4">
            <p className="font-bold text-gray-800 text-sm mb-1">おおとりウイングス</p>
            <p className="text-xs text-gray-500">大阪府堺市西区鳳東町7丁733番地</p>
            <p className="text-xs text-gray-500">TEL: 072-275-0750</p>
            <p className="text-xs text-gray-400 mt-1">専門店 10:00〜20:00</p>
          </div>

          {BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3"
              style={{ borderColor: btn.border }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: iconGradient(btn.color), color: '#ffffff' }}
              >
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-sm leading-tight text-center">{btn.label}</p>
              <p className="text-xs text-gray-400 text-center leading-tight">{btn.desc}</p>
            </button>
          ))}

          {/* 公式サイト誘導バナー */}
          <a
            href={OFFICIAL_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 card-light p-4 flex items-center justify-between active:scale-95 transition-transform duration-150"
          >
            <div>
              <p className="font-bold text-gray-800 text-sm">公式ホームページを見る</p>
              <p className="text-xs text-gray-400 mt-0.5">最新の店舗情報・催事情報はこちら</p>
            </div>
            <span className="text-cyan-500 text-xl">→</span>
          </a>
        </div>

        <div className="py-2 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-blue-900 mr-1.5">Powered by</span>
          <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain" />
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
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setPanel(null)} />

            {/* 1F店舗情報 */}
            {panel === 'floor1' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">1F 店舗情報</h2>
                </div>
                <div className="space-y-2">
                  {FLOOR1_SHOPS.map((shop) => (
                    <div key={shop.name} className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm">{shop.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${shop.open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {shop.open ? '営業中' : '準備中'}
                          </span>
                        </div>
                        <p className="text-xs text-cyan-500 font-semibold">{shop.category}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{shop.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2F店舗情報 */}
            {panel === 'floor2' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">2F 店舗情報</h2>
                </div>
                <div className="space-y-2">
                  {FLOOR2_SHOPS.map((shop) => (
                    <div key={shop.name} className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm">{shop.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${shop.open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {shop.open ? '営業中' : '準備中'}
                          </span>
                        </div>
                        <p className="text-xs text-green-500 font-semibold">{shop.category}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{shop.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3F店舗情報 */}
            {panel === 'floor3' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 12.5v3.5m-9-3.5v6m0-6L5.84 10.578A12.083 12.083 0 003 12.5v3.5"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">3F 店舗情報</h2>
                </div>
                <div className="space-y-2">
                  {FLOOR3_SHOPS.map((shop) => (
                    <div key={shop.name} className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm">{shop.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${shop.open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {shop.open ? '営業中' : '準備中'}
                          </span>
                        </div>
                        <p className="text-xs text-orange-500 font-semibold">{shop.category}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{shop.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* イベント情報 */}
            {panel === 'events' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">イベント情報</h2>
                </div>
                <div className="space-y-3">
                  {EVENTS.map((ev) => (
                    <div key={ev.id} className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-bold text-gray-800 text-sm leading-tight">{ev.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          ev.tag === '開催中' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {ev.tag}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-600 font-semibold">{ev.floor}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ev.date}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={OFFICIAL_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block text-center text-xs font-semibold text-cyan-600 underline"
                >
                  最新のイベント情報を公式サイトで見る
                </a>
              </div>
            )}

            {/* 館内マップ */}
            {panel === 'map' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">館内マップ</h2>
                </div>

                <div className="rounded-2xl bg-violet-50 border border-violet-100 aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-violet-200 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                    <p className="text-violet-400 text-sm font-semibold">フロアマップ表示エリア</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['トイレ', 'エレベーター', 'エスカレーター', '駐車場', 'ATM', '郵便局'].map((loc) => (
                    <button
                      key={loc}
                      className="py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold active:scale-95 transition-transform"
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                <a
                  href={OFFICIAL_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs font-semibold text-cyan-600 underline"
                >
                  詳細なフロアマップを公式サイトで見る
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
