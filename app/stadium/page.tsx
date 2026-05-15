'use client'

import { useState } from 'react'
import Link from 'next/link'

type Sport = 'baseball' | 'soccer' | 'american-football' | 'rugby'
type PanelId = 'game' | 'vendor' | 'map' | 'order' | 'community' | 'coupon' | 'goods'

const SPORT_LIST: { id: Sport; label: string; en: string; emoji: string; color: string; bg: string; border: string }[] = [
  { id: 'baseball',          label: '野球',    en: 'Baseball',          emoji: '⚾', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  { id: 'soccer',            label: 'サッカー', en: 'Soccer',            emoji: '⚽', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { id: 'american-football', label: 'アメフト', en: 'American Football', emoji: '🏈', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { id: 'rugby',             label: 'ラグビー', en: 'Rugby',             emoji: '🏉', color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff' },
]

const BUTTONS: {
  id: PanelId
  label: string
  desc: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
}[] = [
  {
    id: 'game',
    label: '試合情報',
    desc: 'スコア・出場選手',
    color: '#22c55e',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
      </svg>
    ),
  },
  {
    id: 'vendor',
    label: '売り子呼び出し',
    desc: '場内スタッフを呼ぶ',
    color: '#eab308',
    bg: '#fefce8',
    border: '#fde68a',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
      </svg>
    ),
  },
  {
    id: 'map',
    label: 'スタジアムマップ',
    desc: '座席・トイレ・売店',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
      </svg>
    ),
  },
  {
    id: 'order',
    label: 'モバイルオーダー',
    desc: '座席から注文する',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
      </svg>
    ),
  },
  {
    id: 'community',
    label: 'ファンコミュニティ',
    desc: '応援・チャット',
    color: '#ec4899',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
      </svg>
    ),
  },
  {
    id: 'coupon',
    label: 'クーポン・スポンサー',
    desc: '特典・お得情報',
    color: '#a855f7',
    bg: '#faf5ff',
    border: '#e9d5ff',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
      </svg>
    ),
  },
  {
    id: 'goods',
    label: 'グッズEC',
    desc: '公式グッズを購入',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
      </svg>
    ),
  },
]

const DEMO_GAME = {
  home: 'Vexii Bears',
  away: 'Stadium Lions',
  homeScore: 3,
  awayScore: 1,
  inning: '7回表',
  date: '2026/05/15 (木) 18:00',
  venue: 'Vexiiスタジアム',
}

const DEMO_ORDER = [
  { id: 1, name: '球場弁当', price: '¥1,200' },
  { id: 2, name: 'ビール (中)', price: '¥800' },
  { id: 3, name: 'ソフトドリンク', price: '¥400' },
  { id: 4, name: 'から揚げ', price: '¥600' },
]

const DEMO_COUPONS = [
  { id: 1, sponsor: 'スポンサーA', title: 'ビール 100円引き', code: 'BEER100' },
  { id: 2, sponsor: 'スポンサーB', title: 'グッズ 10%OFF', code: 'GOODS10' },
  { id: 3, sponsor: 'スポンサーC', title: 'フード無料券', code: 'FOOD' },
]

export default function StadiumPage() {
  const [sport, setSport] = useState<Sport | null>(null)
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [vendorCalled, setVendorCalled] = useState(false)
  const [cart, setCart] = useState<Record<number, number>>({})

  const selectedSport = SPORT_LIST.find((s) => s.id === sport)

  function callVendor() {
    setVendorCalled(true)
    setTimeout(() => setVendorCalled(false), 4000)
  }

  function addToCart(id: number) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  const cartTotal = DEMO_ORDER.reduce(
    (sum, item) => sum + (cart[item.id] ?? 0) * parseInt(item.price.replace(/[¥,]/g, '')),
    0,
  )

  function closePanel() {
    setPanel(null)
    setVendorCalled(false)
  }

  // ─── Sport selection screen ───────────────────────────────
  if (!sport) {
    return (
      <main className="h-dvh flex flex-col bg-[#edf1f7] max-w-lg mx-auto overflow-hidden">
        <header className="neu-header px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
            <span className="font-bold text-sm silver-gradient">Vexii</span>
          </Link>
          <span className="text-gray-200 text-lg leading-none mx-0.5">|</span>
          <span className="text-sm font-semibold text-gray-500">球場</span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Select Sport</p>
          <h2 className="text-xl font-bold text-gray-800 mb-8">競技を選択してください</h2>
          <div className="w-full grid grid-cols-2 gap-4">
            {SPORT_LIST.map((s) => (
              <button
                key={s.id}
                onClick={() => setSport(s.id)}
                className="card-light flex flex-col items-center gap-3 py-7 active:scale-95 transition-transform duration-150"
                style={{ borderColor: s.border }}
              >
                <span className="text-5xl">{s.emoji}</span>
                <div className="text-center">
                  <p className="font-bold text-gray-800 text-base">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.en}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ─── Main menu ────────────────────────────────────────────
  return (
    <>
      <main className="h-dvh flex flex-col bg-[#edf1f7] max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <header className="neu-header px-4 py-3 flex items-center gap-2.5 shrink-0">
          <button onClick={() => setSport(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{selectedSport?.emoji}</span>
            <span className="font-bold text-sm text-gray-800">{selectedSport?.label}</span>
          </div>
          <span className="text-gray-200 text-lg leading-none mx-0.5 ml-auto" />
          <span className="text-xs text-gray-400 font-semibold">球場</span>
        </header>

        {/* 2-col × 4-row grid — fills height, no scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-3">
          {BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 p-2"
              style={{ borderColor: btn.border }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: btn.bg, color: btn.color }}
              >
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-xs leading-tight text-center">{btn.label}</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">{btn.desc}</p>
            </button>
          ))}
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

            {/* 試合情報 */}
            {panel === 'game' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">試合情報</h2>
                    <p className="text-xs text-gray-400">{selectedSport?.emoji} {selectedSport?.label}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-4">
                  <p className="text-xs text-green-500 text-center mb-3 font-semibold">{DEMO_GAME.inning} 進行中</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-500 mb-1">ホーム</p>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{DEMO_GAME.home}</p>
                      <p className="text-4xl font-black text-green-600 mt-2">{DEMO_GAME.homeScore}</p>
                    </div>
                    <p className="text-gray-300 font-bold text-xl">VS</p>
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-500 mb-1">アウェイ</p>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{DEMO_GAME.away}</p>
                      <p className="text-4xl font-black text-gray-400 mt-2">{DEMO_GAME.awayScore}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">開催日時</span>
                    <span className="font-semibold text-gray-700">{DEMO_GAME.date}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">会場</span>
                    <span className="font-semibold text-gray-700">{DEMO_GAME.venue}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 売り子呼び出し */}
            {panel === 'vendor' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">売り子呼び出し</h2>
                </div>

                <p className="text-sm text-gray-500 mb-6 text-center">ボタンを押すと近くの売り子スタッフに通知が届きます</p>

                <button
                  onClick={callVendor}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    vendorCalled
                      ? 'bg-green-500 text-white scale-95'
                      : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 active:scale-95'
                  }`}
                >
                  {vendorCalled ? '✓ スタッフを呼びました！' : '売り子を呼ぶ'}
                </button>

                {vendorCalled && (
                  <p className="text-xs text-green-500 text-center mt-3">まもなく参ります。しばらくお待ちください。</p>
                )}
              </div>
            )}

            {/* スタジアムマップ */}
            {panel === 'map' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">スタジアムマップ</h2>
                </div>

                <div className="rounded-2xl bg-sky-50 border border-sky-100 aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-sky-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                    <p className="text-sky-400 text-sm font-semibold">スタジアムマップ</p>
                    <p className="text-sky-300 text-xs mt-1">表示エリア</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['トイレ', '売店', '救護室', '喫煙所', '授乳室', '出口'].map((loc) => (
                    <button
                      key={loc}
                      className="py-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold active:scale-95 transition-transform"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* モバイルオーダー */}
            {panel === 'order' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">モバイルオーダー</h2>
                </div>

                <div className="space-y-2 mb-4">
                  {DEMO_ORDER.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCart((prev) => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] ?? 0) - 1) }))}
                          className="w-7 h-7 rounded-full bg-white border border-orange-200 text-orange-500 font-bold text-lg flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-bold text-gray-800 text-sm">{cart[item.id] ?? 0}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={cartTotal === 0}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
                >
                  注文する　{cartTotal > 0 ? `¥${cartTotal.toLocaleString()}` : ''}
                </button>
              </div>
            )}

            {/* ファンコミュニティ */}
            {panel === 'community' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">ファンコミュニティ</h2>
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    { user: 'ファン太郎', msg: '7回の逆転ホームランに期待！', time: '18:42' },
                    { user: 'スタジアム花子', msg: '今日の選手のコンディション最高ですね', time: '18:40' },
                    { user: 'ベアーズ応援団', msg: '一緒に応援しましょう！🐻', time: '18:38' },
                  ].map((post, i) => (
                    <div key={i} className="bg-pink-50 border border-pink-100 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-pink-700 text-xs">{post.user}</p>
                        <p className="text-[10px] text-gray-300">{post.time}</p>
                      </div>
                      <p className="text-sm text-gray-700">{post.msg}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="応援メッセージを送る..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-300"
                  />
                  <button className="px-4 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-sm">
                    送信
                  </button>
                </div>
              </div>
            )}

            {/* クーポン・スポンサー */}
            {panel === 'coupon' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">クーポン・スポンサー</h2>
                </div>

                <div className="space-y-2">
                  {DEMO_COUPONS.map((c) => (
                    <div key={c.id} className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-purple-400 font-semibold mb-0.5">{c.sponsor}</p>
                        <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">コード: <span className="font-mono text-purple-700 font-semibold">{c.code}</span></p>
                      </div>
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-purple-500 text-white font-semibold shrink-0">
                        使う
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* グッズEC */}
            {panel === 'goods' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">グッズEC</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'ユニフォーム', price: '¥8,800', tag: '人気' },
                    { name: 'キャップ', price: '¥3,300', tag: '新着' },
                    { name: 'タオル', price: '¥1,650', tag: '' },
                    { name: 'クリアファイル', price: '¥550', tag: '' },
                  ].map((item) => (
                    <div key={item.name} className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                      <div className="aspect-square rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
                        </svg>
                      </div>
                      {item.tag && (
                        <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">{item.tag}</span>
                      )}
                      <p className="font-semibold text-gray-800 text-xs mt-1">{item.name}</p>
                      <p className="font-bold text-indigo-600 text-sm">{item.price}</p>
                      <button className="w-full mt-2 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-bold">
                        カートへ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
