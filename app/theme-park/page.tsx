'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type PanelId = 'wait' | 'fastpass' | 'map' | 'food' | 'event' | 'goods' | 'photo' | 'seat'

const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; badge?: string; icon: React.ReactNode }[] = [
  {
    id: 'wait', label: '待ち時間', desc: 'アトラクション混雑', color: '#ef4444', bg: '#fff1f2', border: '#fecdd3', badge: 'LIVE',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    id: 'fastpass', label: 'ファストパス', desc: '優先入場を予約', color: '#eab308', bg: '#fefce8', border: '#fde68a',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
  {
    id: 'map', label: 'パークマップ', desc: 'エリア・施設案内', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>,
  },
  {
    id: 'food', label: 'フード注文', desc: '席まで配達', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25"/></svg>,
  },
  {
    id: 'event', label: 'イベント情報', desc: 'ショー・パレード', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>,
  },
  {
    id: 'goods', label: 'グッズEC', desc: '公式グッズを購入', color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>,
  },
  {
    id: 'photo', label: 'フォトサービス', desc: 'アトラクション写真', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>,
  },
  {
    id: 'seat', label: '充電・席管理', desc: '充電状況・座席', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', badge: '⚡',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
]

const ATTRACTIONS = [
  { name: 'スターコースター', wait: 75, capacity: 90, status: '混雑' },
  { name: 'マジックキャッスル', wait: 45, capacity: 60, status: '普通' },
  { name: 'ウォータースライド', wait: 20, capacity: 30, status: '空き' },
  { name: 'ファンタジートレイン', wait: 55, capacity: 70, status: '混雑' },
  { name: 'ホーンテッドマンション', wait: 30, capacity: 45, status: '普通' },
  { name: 'キッズランド', wait: 10, capacity: 15, status: '空き' },
]

const FOOD_MENU = [
  { id: 1, name: 'パーク限定バーガー', price: 1200 },
  { id: 2, name: 'テーマドリンク', price: 600 },
  { id: 3, name: 'キャラクターポップコーン', price: 800 },
  { id: 4, name: 'フルーツパフェ', price: 900 },
]

const GOODS = [
  { name: 'キャラクターぬいぐるみ', price: '¥3,200', tag: '人気' },
  { name: 'パーク限定Tシャツ', price: '¥4,500', tag: '限定' },
  { name: 'マグカップ', price: '¥1,800', tag: '' },
  { name: 'キーホルダー', price: '¥800', tag: 'NEW' },
]

export default function ThemeParkPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [foodCart, setFoodCart] = useState<Record<number, number>>({})
  const [fastpassBooked, setFastpassBooked] = useState<string | null>(null)
  const [photoCode, setPhotoCode] = useState('')
  const [chargePercent] = useState(62)

  const seatNo = 'C-07'

  function addFood(id: number) { setFoodCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function remFood(id: number) { setFoodCart((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }
  const foodTotal = FOOD_MENU.reduce((s, i) => s + (foodCart[i.id] ?? 0) * i.price, 0)

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
          <span className="text-sm font-semibold text-gray-500">🎡 テーマパーク</span>
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
                <span className="absolute top-1.5 right-2 text-[9px] font-black" style={{ color: btn.color }}>{btn.badge}</span>
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
          <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4"/>

            {/* 待ち時間 */}
            {panel === 'wait' && (
              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">待ち時間</h2>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">● LIVE</span>
                </div>
                <div className="space-y-2">
                  {ATTRACTIONS.map((a) => (
                    <div key={a.name} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${a.status === '混雑' ? 'bg-red-50 border-red-200' : a.status === '普通' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${a.status === '混雑' ? 'bg-red-400' : a.status === '普通' ? 'bg-amber-400' : 'bg-green-400'}`} style={{ width: `${a.capacity}%` }}/>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${a.status === '混雑' ? 'text-red-500' : a.status === '普通' ? 'text-amber-500' : 'text-green-500'}`}>{a.wait}<span className="text-xs font-semibold">分</span></p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.status === '混雑' ? 'bg-red-500 text-white' : a.status === '普通' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}`}>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ファストパス */}
            {panel === 'fastpass' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">ファストパス</h2>
                <p className="text-xs text-gray-400 mb-4">優先入場できる時間帯を予約します（1日2回まで）</p>
                {fastpassBooked && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mb-4 text-center">
                    <p className="font-black text-yellow-800">⚡ 予約済み</p>
                    <p className="text-sm text-yellow-700 mt-1">{fastpassBooked}</p>
                    <p className="text-xs text-yellow-500 mt-1">入場可能時間: 13:00〜14:00</p>
                  </div>
                )}
                <div className="space-y-2">
                  {ATTRACTIONS.filter((a) => a.status !== '空き').map((a) => (
                    <div key={a.name} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
                        <p className="text-xs text-gray-400">現在 {a.wait}分待ち</p>
                      </div>
                      <button
                        onClick={() => setFastpassBooked(a.name)}
                        disabled={fastpassBooked === a.name}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold ${fastpassBooked === a.name ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}
                      >
                        {fastpassBooked === a.name ? '予約済' : '予約'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* パークマップ */}
            {panel === 'map' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">パークマップ</h2>
                <div className="rounded-2xl bg-sky-50 border border-sky-100 aspect-video flex items-center justify-center mb-4">
                  <p className="text-sky-300 text-sm font-semibold">パークマップ表示エリア</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['ファンタジーランド', 'アドベンチャーゾーン', 'フューチャーワールド', 'キッズパーク', 'レストラン街', 'お土産エリア'].map((area) => (
                    <button key={area} className="py-2 px-3 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold text-left active:scale-95 transition-transform">
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* フード注文 */}
            {panel === 'food' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">フード注文</h2>
                <div className="flex items-center gap-1.5 mb-4 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
                  <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                  <p className="text-xs font-bold text-teal-700">エリア {seatNo} に配達</p>
                </div>
                <div className="space-y-2 mb-4">
                  {FOOD_MENU.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">¥{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => remFood(item.id)} className="w-7 h-7 rounded-full bg-white border border-orange-200 text-orange-500 font-bold flex items-center justify-center">−</button>
                        <span className="w-4 text-center font-bold text-gray-800 text-sm">{foodCart[item.id] ?? 0}</span>
                        <button onClick={() => addFood(item.id)} className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button disabled={foodTotal === 0} className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-40">
                  {seatNo}に注文する{foodTotal > 0 ? `　¥${foodTotal.toLocaleString()}` : ''}
                </button>
              </div>
            )}

            {/* イベント情報 */}
            {panel === 'event' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">イベント情報</h2>
                <div className="space-y-3">
                  {[
                    { title: 'ナイトパレード', time: '20:00〜21:00', place: 'メインストリート', tag: '本日' },
                    { title: 'キャラクターショー', time: '13:00・16:00', place: 'ファンタジーステージ', tag: '本日' },
                    { title: 'スペシャルダンス', time: '11:30・14:30', place: 'セントラルプラザ', tag: '本日' },
                    { title: 'サイン会 (限定30名)', time: '15:30〜16:30', place: 'キャラクターエリア', tag: '要整理券' },
                  ].map((ev) => (
                    <div key={ev.title} className="bg-pink-50 border border-pink-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-bold text-gray-800 text-sm leading-tight">{ev.title}</p>
                        <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold shrink-0">{ev.tag}</span>
                      </div>
                      <p className="text-xs text-gray-400">{ev.time}　{ev.place}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* グッズEC */}
            {panel === 'goods' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">グッズEC</h2>
                <div className="grid grid-cols-2 gap-3">
                  {GOODS.map((item) => (
                    <div key={item.name} className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                      <div className="aspect-square rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                        <span className="text-3xl">🎠</span>
                      </div>
                      {item.tag && <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-bold">{item.tag}</span>}
                      <p className="font-semibold text-gray-800 text-xs mt-1 leading-tight">{item.name}</p>
                      <p className="font-bold text-purple-600 text-sm">{item.price}</p>
                      <button className="w-full mt-2 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-bold">カートへ</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* フォトサービス */}
            {panel === 'photo' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">フォトサービス</h2>
                <p className="text-xs text-gray-400 mb-4">アトラクション乗車時に撮影された写真を受け取れます</p>
                <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">フォトコードを入力</p>
                  <input
                    type="text"
                    value={photoCode}
                    onChange={(e) => setPhotoCode(e.target.value)}
                    placeholder="例: P-12345678"
                    className="w-full px-4 py-3 rounded-xl border border-cyan-200 text-sm outline-none focus:border-cyan-400 font-mono text-center text-gray-800 bg-white"
                  />
                  <button className="w-full mt-3 py-3 rounded-xl bg-cyan-500 text-white font-bold text-sm">
                    写真を検索
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 mb-2">対応アトラクション</p>
                  {['スターコースター', 'ウォータースライド', 'マジックキャッスル'].map((a) => (
                    <div key={a} className="flex items-center justify-between px-4 py-2.5 bg-cyan-50 border border-cyan-100 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700">{a}</p>
                      <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-bold">フォト対応</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 充電・席管理 */}
            {panel === 'seat' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">充電・席管理</h2>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">現在のエリア</p>
                  <p className="font-black text-4xl mb-1">{seatNo}</p>
                  <p className="text-xs opacity-60">ファンタジーランド 休憩エリア</p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">充電状況</p>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">充電中 ⚡</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full transition-all" style={{ width: `${chargePercent}%` }}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{chargePercent}% · 残り約35分で満充電</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'フードを注文', icon: '🍔', action: () => setPanel('food') },
                    { label: '待ち時間確認', icon: '⏱', action: () => setPanel('wait') },
                    { label: 'パークマップ', icon: '🗺', action: () => setPanel('map') },
                    { label: 'イベント情報', icon: '🎭', action: () => setPanel('event') },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl active:scale-95 transition-transform text-left">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold text-teal-800 text-xs leading-tight">{item.label}</span>
                    </button>
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
