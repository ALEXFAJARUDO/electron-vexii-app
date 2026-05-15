'use client'

import { useState } from 'react'
import Link from 'next/link'

type PanelId = 'flight' | 'immigration' | 'shops' | 'lounge' | 'baggage' | 'exchange' | 'map' | 'wifi'

const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; badge?: string; icon: React.ReactNode }[] = [
  {
    id: 'flight', label: 'フライト情報', desc: '出発・到着状況', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', badge: 'LIVE',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
  },
  {
    id: 'immigration', label: '出入国案内', desc: '必要書類・手順', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/></svg>,
  },
  {
    id: 'shops', label: '売店・免税店', desc: 'ショップ・グルメ', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>,
  },
  {
    id: 'lounge', label: 'ラウンジ予約', desc: '快適な待合スペース', color: '#b45309', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>,
  },
  {
    id: 'baggage', label: '手荷物情報', desc: 'ベルト番号・状況', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
  },
  {
    id: 'exchange', label: '両替・ATM', desc: '為替レート・場所', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>,
  },
  {
    id: 'map', label: '館内マップ', desc: 'ターミナル案内', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>,
  },
  {
    id: 'wifi', label: 'WiFi接続', desc: '無料WiFiに接続', color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>,
  },
]

const FLIGHTS = [
  { no: 'NH001', dest: '東京 (HND)', time: '10:30', gate: 'A12', status: '搭乗中', statusColor: 'green' },
  { no: 'JL202', dest: '大阪 (ITM)', time: '11:00', gate: 'B05', status: '出発待ち', statusColor: 'blue' },
  { no: 'MM301', dest: '福岡 (FUK)', time: '11:45', gate: 'C08', status: '遅延 +20分', statusColor: 'red' },
  { no: 'NH441', dest: '札幌 (CTS)', time: '12:20', gate: 'A03', status: '定刻', statusColor: 'gray' },
  { no: 'JL088', dest: 'ソウル (ICN)', time: '13:10', gate: 'D14', status: '定刻', statusColor: 'gray' },
]

const SHOPS = [
  { floor: '3F', name: '免税コスメ館', category: '免税', hours: '6:00〜21:00' },
  { floor: '3F', name: 'ラーメン街道', category: 'グルメ', hours: '7:00〜21:00' },
  { floor: '2F', name: '空港ブティック', category: 'ファッション', hours: '8:00〜20:00' },
  { floor: '2F', name: '本・雑誌コーナー', category: 'ショップ', hours: '6:30〜21:00' },
  { floor: '1F', name: 'コンビニ (24h)', category: 'コンビニ', hours: '24時間' },
]

const EXCHANGE_RATES = [
  { currency: 'USD', flag: '🇺🇸', buy: '152.30', sell: '153.80' },
  { currency: 'EUR', flag: '🇪🇺', buy: '164.20', sell: '165.90' },
  { currency: 'KRW', flag: '🇰🇷', buy: '10.82', sell: '11.20' },
  { currency: 'CNY', flag: '🇨🇳', buy: '20.91', sell: '21.50' },
]

export default function AirportPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [wifiCopied, setWifiCopied] = useState(false)

  function copyWifi() {
    navigator.clipboard.writeText('airport_free_wifi_2026').catch(() => {})
    setWifiCopied(true)
    setTimeout(() => setWifiCopied(false), 2000)
  }

  function closePanel() { setPanel(null) }

  return (
    <>
      <main className="h-dvh flex flex-col bg-gray-50 max-w-md mx-auto overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
            <span className="font-bold text-sm silver-gradient">Vexii</span>
          </Link>
          <span className="text-gray-200 text-lg leading-none mx-0.5">|</span>
          <span className="text-sm font-semibold text-gray-500">✈️ 空港</span>
        </header>

        <div className="flex-1 min-h-0 p-3 grid grid-cols-2 grid-rows-4 gap-3">
          {BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 p-2 relative"
              style={{ borderColor: btn.border }}
            >
              {btn.badge && (
                <span className="absolute top-1.5 right-2 text-[9px] font-black text-sky-500">{btn.badge}</span>
              )}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: btn.bg, color: btn.color }}>
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-xs leading-tight text-center">{btn.label}</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">{btn.desc}</p>
            </button>
          ))}
        </div>
      </main>

      {panel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closePanel}>
          <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4"/>

            {/* フライト情報 */}
            {panel === 'flight' && (
              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">フライト情報</h2>
                  <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">● LIVE</span>
                </div>
                <div className="space-y-2">
                  {FLIGHTS.map((f) => (
                    <div key={f.no} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${f.statusColor === 'green' ? 'bg-green-50 border-green-200' : f.statusColor === 'red' ? 'bg-red-50 border-red-200' : f.statusColor === 'blue' ? 'bg-sky-50 border-sky-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-black text-gray-800 text-sm">{f.no}</p>
                          <p className="text-xs text-gray-500">{f.dest}</p>
                        </div>
                        <p className="text-xs text-gray-400">出発 {f.time}　ゲート {f.gate}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${f.statusColor === 'green' ? 'bg-green-500 text-white' : f.statusColor === 'red' ? 'bg-red-500 text-white' : f.statusColor === 'blue' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {f.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 出入国案内 */}
            {panel === 'immigration' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">出入国案内</h2>
                <div className="space-y-3">
                  {[
                    { title: '出国手続きの流れ', steps: ['チェックイン', '手荷物検査', '出国審査', '搭乗ゲートへ'] },
                    { title: '入国手続きの流れ', steps: ['入国審査', '手荷物受取', '税関申告', '到着ロビーへ'] },
                  ].map((section) => (
                    <div key={section.title} className="bg-green-50 border border-green-100 rounded-2xl p-4">
                      <p className="font-bold text-gray-800 text-sm mb-3">{section.title}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {section.steps.map((step, i) => (
                          <div key={step} className="flex items-center gap-1">
                            <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-semibold">{step}</span>
                            {i < section.steps.length - 1 && <span className="text-gray-300 text-sm">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="font-bold text-amber-800 text-sm mb-2">必要書類</p>
                    {['パスポート (有効期限6ヶ月以上)', '航空チケット (eチケット可)', '税関申告書 (入国時)'].map((item) => (
                      <p key={item} className="text-xs text-gray-600 py-1 border-b border-amber-100 last:border-none">✓ {item}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 売店・免税店 */}
            {panel === 'shops' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">売店・免税店</h2>
                <div className="space-y-2">
                  {SHOPS.map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-bold w-7 text-center">{s.floor}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                          <p className="text-[10px] text-gray-400">{s.hours}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">{s.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ラウンジ予約 */}
            {panel === 'lounge' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">ラウンジ予約</h2>
                <div className="space-y-3">
                  {[
                    { name: 'プレミアムラウンジ A', floor: '3F 搭乗ゲート近く', price: '¥1,500/時', avail: '残3席', hot: true },
                    { name: 'ビジネスラウンジ B', floor: '2F 中央エリア', price: '¥1,000/時', avail: '空きあり', hot: false },
                    { name: 'ファミリーラウンジ', floor: '1F 到着ロビー横', price: '¥800/時', avail: '空きあり', hot: false },
                  ].map((l) => (
                    <div key={l.name} className={`rounded-2xl p-4 border ${l.hot ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{l.name}</p>
                          <p className="text-xs text-gray-400">{l.floor}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${l.hot ? 'bg-red-500 text-white' : 'bg-green-100 text-green-700'}`}>
                          {l.avail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-amber-700 text-sm">{l.price}</p>
                        <button className="text-xs px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold">予約する</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 手荷物情報 */}
            {panel === 'baggage' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">手荷物情報</h2>
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">手荷物受取</p>
                  <p className="font-black text-3xl mb-1">ベルト 3番</p>
                  <p className="text-xs opacity-60">NH001 東京発　到着 10:15</p>
                </div>
                <div className="space-y-2">
                  {[
                    { belt: '1番', flight: 'JL202 大阪発', status: '受取中', statusColor: 'green' },
                    { belt: '2番', flight: 'MM301 福岡発', status: '搬入中', statusColor: 'blue' },
                    { belt: '3番', flight: 'NH001 東京発', status: '受取中', statusColor: 'green' },
                    { belt: '4番', flight: '—', status: '待機中', statusColor: 'gray' },
                  ].map((b) => (
                    <div key={b.belt} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${b.statusColor === 'green' ? 'bg-green-50 border-green-200' : b.statusColor === 'blue' ? 'bg-sky-50 border-sky-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-800 w-12">ベルト {b.belt}</span>
                        <span className="text-xs text-gray-500">{b.flight}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${b.statusColor === 'green' ? 'bg-green-500 text-white' : b.statusColor === 'blue' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 両替・ATM */}
            {panel === 'exchange' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">両替・ATM</h2>
                <p className="text-xs text-gray-400 mb-4">本日 2026/05/15 のレート (JPY)</p>
                <div className="space-y-2 mb-4">
                  {EXCHANGE_RATES.map((r) => (
                    <div key={r.currency} className="flex items-center justify-between px-4 py-3 bg-teal-50 border border-teal-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{r.flag}</span>
                        <span className="font-black text-gray-800">{r.currency}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400">買取</p>
                          <p className="font-bold text-gray-700">{r.buy}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400">販売</p>
                          <p className="font-bold text-teal-600">{r.sell}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                  <p className="font-bold text-gray-800 text-sm mb-2">ATM・両替所</p>
                  {['1F 到着ロビー (24h ATM)', '2F 中央コンコース (両替所)', '3F 出発ゲート前 (ATM)'].map((loc) => (
                    <p key={loc} className="text-xs text-gray-500 py-1 border-b border-teal-100 last:border-none">📍 {loc}</p>
                  ))}
                </div>
              </div>
            )}

            {/* 館内マップ */}
            {panel === 'map' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">館内マップ</h2>
                <div className="rounded-2xl bg-violet-50 border border-violet-100 aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-violet-400 text-sm font-semibold">ターミナルマップ</p>
                    <p className="text-violet-300 text-xs mt-1">表示エリア</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { floor: '3F', desc: '出発ロビー・搭乗ゲート・免税店' },
                    { floor: '2F', desc: 'チェックインカウンター・ショップ' },
                    { floor: '1F', desc: '到着ロビー・税関・手荷物受取' },
                    { floor: 'B1F', desc: '鉄道・バスターミナル・駐車場' },
                  ].map((f) => (
                    <button key={f.floor} className="w-full flex items-center gap-3 px-4 py-2.5 bg-violet-50 border border-violet-100 rounded-xl text-left active:scale-[0.98] transition-transform">
                      <span className="text-xs bg-violet-500 text-white font-bold px-2 py-0.5 rounded w-10 text-center shrink-0">{f.floor}</span>
                      <span className="text-xs text-gray-600">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WiFi接続 */}
            {panel === 'wifi' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">WiFi接続</h2>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                    </svg>
                    <p className="font-bold text-gray-800">空港無料WiFi</p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl px-4 py-3 border border-purple-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">ネットワーク名 (SSID)</p>
                      <p className="font-mono font-bold text-gray-800">Airport_Free_WiFi</p>
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 border border-purple-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">パスワード</p>
                      <p className="font-mono font-bold text-gray-800">airport_free_wifi_2026</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={copyWifi}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 active:scale-95 ${wifiCopied ? 'bg-green-500 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                >
                  {wifiCopied ? '✓ コピーしました' : '接続'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
