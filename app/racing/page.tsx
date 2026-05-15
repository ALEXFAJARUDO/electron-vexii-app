'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { registerSW, requestPermission, notify } from '@/lib/webNotify'

type Sport = 'keiba' | 'kyotei' | 'keirin' | 'auto'
type PanelId =
  | 'race' | 'vote' | 'ai' | 'player' | 'live' | 'food'
  | 'vendor' | 'map' | 'events' | 'points' | 'ec'
  | 'replay' | 'vip' | 'seat'

const SPORT_LIST: { id: Sport; label: string; en: string; emoji: string; color: string; bg: string; border: string }[] = [
  { id: 'keiba',  label: '競馬',      en: 'Horse Racing',    emoji: '🐎', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  { id: 'kyotei', label: '競艇',      en: 'Boat Racing',     emoji: '🚤', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { id: 'keirin', label: '競輪',      en: 'Keirin',          emoji: '🚴', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { id: 'auto',   label: 'オートレース', en: 'Auto Racing',  emoji: '🏍️', color: '#ef4444', bg: '#fff1f2', border: '#fecdd3' },
]

const RACE_INFO = [
  { no: 1, name: '第1R', time: '10:30', status: '終了', top: '5-3-1' },
  { no: 2, name: '第2R', time: '11:00', status: '終了', top: '2-6-4' },
  { no: 3, name: '第3R', time: '11:30', status: '進行中', top: '1-4-??' },
  { no: 4, name: '第4R', time: '12:00', status: '発売中', top: '—' },
  { no: 5, name: '第5R', time: '12:30', status: '未発売', top: '—' },
]

const ODDS = [
  { comb: '1-4', odds: '2.3', hot: true },
  { comb: '1-2', odds: '4.1', hot: false },
  { comb: '4-1', odds: '5.8', hot: false },
  { comb: '3-1', odds: '8.2', hot: false },
  { comb: '2-4', odds: '11.0', hot: false },
  { comb: '1-6', odds: '15.5', hot: false },
]

const PLAYERS = [
  { no: 1, name: '山田 太郎', win: '55.2%', grade: 'A1', comment: '今日は内からの攻めを意識したい', recent: [1, 2, 1, 3, 1] },
  { no: 2, name: '佐藤 次郎', win: '48.7%', grade: 'A2', comment: 'モーターの調子は普通', recent: [3, 1, 4, 2, 5] },
  { no: 3, name: '鈴木 三郎', win: '42.1%', grade: 'B1', comment: '展示タイム好調', recent: [2, 4, 2, 1, 3] },
  { no: 4, name: '田中 四郎', win: '61.3%', grade: 'A1', comment: 'スタート練習でいい感触', recent: [1, 1, 2, 1, 2] },
]

const AI_PRED = [
  { rank: 1, comb: '4-1', prob: 28, type: '本命', color: '#ef4444' },
  { rank: 2, comb: '1-4', prob: 22, type: '対抗', color: '#f97316' },
  { rank: 3, comb: '4-3', prob: 14, type: '穴', color: '#8b5cf6' },
  { rank: 4, comb: '1-2', prob: 11, type: '—', color: '#6b7280' },
]

const FOOD_MENU = [
  { id: 1, name: 'チャンピオン弁当', price: 900 },
  { id: 2, name: 'から揚げ定食', price: 800 },
  { id: 3, name: 'ビール (中)', price: 700 },
  { id: 4, name: 'ソフトドリンク', price: 300 },
]

const EC_ITEMS = [
  { id: 1, name: '山田選手 サイン入りグッズ', price: '¥3,300', tag: '限定' },
  { id: 2, name: '場内オリジナルタオル', price: '¥1,650', tag: '場内限定' },
  { id: 3, name: 'コラボキャップ', price: '¥2,200', tag: 'コラボ' },
  { id: 4, name: 'プログラム (本日号)', price: '¥220', tag: '— ' },
]

const MENU_BUTTONS: { id: PanelId; label: string; color: string; bg: string; border: string; badge?: string; icon: React.ReactNode }[] = [
  {
    id: 'race', label: 'レース情報', badge: 'LIVE', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>,
  },
  {
    id: 'vote', label: '投票サポート', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>,
  },
  {
    id: 'ai', label: 'AI予想', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>,
  },
  {
    id: 'player', label: '選手情報', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>,
  },
  {
    id: 'live', label: 'リアルタイム速報', badge: '🔴', color: '#dc2626', bg: '#fff1f2', border: '#fecdd3',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
  {
    id: 'food', label: 'フード注文', color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25"/></svg>,
  },
  {
    id: 'vendor', label: '売り子呼び出し', color: '#eab308', bg: '#fefce8', border: '#fde68a',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>,
  },
  {
    id: 'map', label: '場内マップ', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>,
  },
  {
    id: 'events', label: 'イベント情報', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>,
  },
  {
    id: 'points', label: 'ポイント・会員', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  },
  {
    id: 'ec', label: 'EC・グッズ', color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>,
  },
  {
    id: 'replay', label: 'リプレイ動画', color: '#475569', bg: '#f8fafc', border: '#e2e8f0',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"/></svg>,
  },
  {
    id: 'vip', label: 'ラウンジ・VIP', color: '#b45309', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/></svg>,
  },
  {
    id: 'seat', label: '充電・席管理', badge: '⚡', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
]

export default function RacingPage() {
  const [sport, setSport] = useState<Sport | null>(null)
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [vendorCalled, setVendorCalled] = useState<string | null>(null)
  const [foodCart, setFoodCart] = useState<Record<number, number>>({})
  const [ecCart, setEcCart] = useState<Record<number, number>>({})
  const [nfcChecked, setNfcChecked] = useState(false)
  const [favs, setFavs] = useState<string[]>([])

  const seatNo = 'A-12'
  const selectedSport = SPORT_LIST.find((s) => s.id === sport)

  useEffect(() => { registerSW() }, [])

  function addFood(id: number) { setFoodCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function remFood(id: number) { setFoodCart((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }
  const foodTotal = FOOD_MENU.reduce((s, i) => s + (foodCart[i.id] ?? 0) * i.price, 0)

  async function placeRacingFoodOrder() {
    const canNotify = await requestPermission()
    if (canNotify) {
      notify(
        'フードの準備ができました！',
        `席 ${seatNo} にお持ちします。スタッフをお待ちください。`,
        10,
        { tag: 'racing-food', requireInteraction: true }
      )
    }
    closePanel()
  }

  function addEc(id: number) { setEcCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  const ecTotal = EC_ITEMS.reduce((s, i) => s + (ecCart[i.id] ?? 0) * parseInt(i.price.replace(/[¥,]/g, '')), 0)

  function callVendor(cat: string) {
    setVendorCalled(cat)
    setTimeout(() => setVendorCalled(null), 4000)
  }

  function toggleFav(comb: string) {
    setFavs((p) => p.includes(comb) ? p.filter((c) => c !== comb) : [...p, comb])
  }

  function closePanel() { setPanel(null) }

  // ─── Sport selection screen ───────────────────────────────
  if (!sport) {
    return (
      <main className="h-dvh flex flex-col bg-gray-50 max-w-md mx-auto overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
            <span className="font-bold text-sm silver-gradient">Vexii</span>
          </Link>
          <span className="text-gray-200 text-lg leading-none mx-0.5">|</span>
          <span className="text-sm font-semibold text-gray-500">公営競技場</span>
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

  // ─── Main 14-feature menu ────────────────────────────────
  return (
    <>
      <main className="h-dvh flex flex-col bg-gray-50 max-w-md mx-auto overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2.5 shrink-0">
          <button onClick={() => setSport(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{selectedSport?.emoji}</span>
            <span className="font-bold text-sm text-gray-800">{selectedSport?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-lg px-2 py-1">
            <svg className="w-3 h-3 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
            </svg>
            <span className="text-[10px] font-black text-teal-700">{seatNo}</span>
          </div>
        </header>

        {/* 2-col × 7-row compact grid */}
        <div className="flex-1 min-h-0 p-2 grid grid-cols-2 grid-rows-7 gap-1.5">
          {MENU_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform duration-150 p-1.5 relative"
              style={{ borderColor: btn.border }}
            >
              {btn.badge && (
                <span className="absolute top-1 right-1.5 text-[9px] font-black" style={{ color: btn.color }}>{btn.badge}</span>
              )}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: btn.bg, color: btn.color }}>
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-[10px] leading-tight text-center">{btn.label}</p>
            </button>
          ))}
        </div>
      </main>

      {panel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closePanel}>
          <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4"/>

            {/* レース情報 */}
            {panel === 'race' && (
              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">レース情報</h2>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">● LIVE</span>
                </div>
                {/* Race list */}
                <div className="space-y-1.5 mb-4">
                  {RACE_INFO.map((r) => (
                    <div key={r.no} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${r.status === '進行中' ? 'bg-green-50 border-green-300' : r.status === '発売中' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-700 text-sm w-12">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.top !== '—' && <p className="text-xs font-mono text-gray-600">{r.top}</p>}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${r.status === '進行中' ? 'bg-green-500 text-white' : r.status === '発売中' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Odds */}
                <p className="text-xs font-bold text-gray-400 mb-2 px-1">第3R オッズ（2連単）</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {ODDS.map((o) => (
                    <div key={o.comb} className={`rounded-xl p-2.5 text-center border ${o.hot ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-100'}`}>
                      <p className={`text-sm font-black ${o.hot ? 'text-red-600' : 'text-gray-700'}`}>{o.comb}</p>
                      <p className={`text-xs font-semibold ${o.hot ? 'text-red-400' : 'text-gray-400'}`}>{o.odds}倍</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 投票サポート */}
            {panel === 'vote' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">投票サポート</h2>
                <p className="text-xs text-gray-400 mb-3 px-1">お気に入りの買い目を保存できます</p>
                <div className="space-y-2 mb-4">
                  {ODDS.map((o) => (
                    <div key={o.comb} className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <p className="font-black text-gray-800">{o.comb}</p>
                        <p className="text-sm text-gray-400">{o.odds}倍</p>
                      </div>
                      <button onClick={() => toggleFav(o.comb)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${favs.includes(o.comb) ? 'bg-blue-500 text-white' : 'bg-white border border-blue-200 text-blue-600'}`}>
                        {favs.includes(o.comb) ? '★ 登録済' : '☆ 登録'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">オッズ変動通知</p>
                  <p className="text-xs text-gray-400">オッズが大きく変動した際にプッシュ通知でお知らせします</p>
                  <button className="mt-3 w-full py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm">通知を有効にする</button>
                </div>
              </div>
            )}

            {/* AI予想 */}
            {panel === 'ai' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">AI予想</h2>
                  <span className="text-[10px] bg-violet-500 text-white px-2 py-0.5 rounded-full font-bold">AI powered</span>
                </div>
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-4 mb-4 text-white">
                  <p className="text-xs font-bold opacity-80 mb-1">AI指数 第3R</p>
                  <p className="text-sm font-semibold">荒れ予想: <span className="font-black text-yellow-300">中程度</span></p>
                  <p className="text-xs opacity-70 mt-1">回収率分析: 本命党 83% / 穴党 121%</p>
                </div>
                <div className="space-y-2 mb-4">
                  {AI_PRED.map((p) => (
                    <div key={p.rank} className="flex items-center gap-3 px-4 py-3 bg-violet-50 border border-violet-100 rounded-xl">
                      <span className="text-lg font-black w-6 text-center" style={{ color: p.color }}>#{p.rank}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-gray-800">{p.comb}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: p.color + '20', color: p.color }}>{p.type}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${p.prob * 2}%`, background: p.color }}/>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-600 w-10 text-right">{p.prob}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-300 text-center">※AI予想は参考情報です。投票は自己責任でお願いします</p>
              </div>
            )}

            {/* 選手情報 */}
            {panel === 'player' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">選手情報</h2>
                <div className="space-y-3">
                  {PLAYERS.map((p) => (
                    <div key={p.no} className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">{p.no}</div>
                        <div>
                          <p className="font-bold text-gray-800">{p.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-orange-200 text-orange-700 px-1.5 py-0.5 rounded font-bold">{p.grade}</span>
                            <span className="text-xs text-gray-400">勝率 {p.win}</span>
                          </div>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {p.recent.map((r, i) => (
                            <span key={i} className={`w-5 h-5 rounded text-[9px] font-black flex items-center justify-center ${r === 1 ? 'bg-red-500 text-white' : r <= 3 ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>{r}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">"{p.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* リアルタイム速報 */}
            {panel === 'live' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">リアルタイム速報</h2>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">● LIVE</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                  <p className="text-xs text-red-400 font-bold mb-2">第3R 第2周回</p>
                  <div className="space-y-1.5">
                    {[
                      { pos: 1, no: 4, name: '田中 四郎', lap: '1:23.4' },
                      { pos: 2, no: 1, name: '山田 太郎', lap: '1:23.9' },
                      { pos: 3, no: 3, name: '鈴木 三郎', lap: '1:24.1' },
                    ].map((r) => (
                      <div key={r.pos} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-red-100">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${r.pos === 1 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{r.pos}</span>
                        <span className="w-6 h-6 rounded-full bg-orange-400 text-white text-xs font-black flex items-center justify-center">{r.no}</span>
                        <span className="flex-1 font-semibold text-gray-800 text-sm">{r.name}</span>
                        <span className="text-xs font-mono text-gray-400">{r.lap}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {[
                    { time: '11:34', type: 'スタート', msg: '全艇正常スタート', alert: false },
                    { time: '11:33', type: '展示', msg: '1号艇 展示タイム 6.87秒', alert: false },
                    { time: '11:30', type: '情報', msg: '4号艇のモーター交換が完了', alert: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-300 font-mono mt-0.5 w-10 shrink-0">{item.time}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${item.alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{item.type}</span>
                      <p className="text-xs text-gray-700">{item.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* フード注文 */}
            {panel === 'food' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">フード注文</h2>
                <div className="flex items-center gap-1.5 mb-4 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
                  <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                  <p className="text-xs font-bold text-teal-700">席番号 {seatNo} に配達</p>
                </div>
                <div className="space-y-2 mb-4">
                  {FOOD_MENU.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">¥{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => remFood(item.id)} className="w-7 h-7 rounded-full bg-white border border-amber-200 text-amber-600 font-bold flex items-center justify-center">−</button>
                        <span className="w-4 text-center font-bold text-gray-800 text-sm">{foodCart[item.id] ?? 0}</span>
                        <button onClick={() => addFood(item.id)} className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  disabled={foodTotal === 0}
                  onClick={placeRacingFoodOrder}
                  className="w-full py-3.5 rounded-xl bg-amber-500 text-white font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform"
                >
                  注文する（できたらスマホ通知）{foodTotal > 0 ? `　¥${foodTotal}` : ''}
                </button>
              </div>
            )}

            {/* 売り子呼び出し */}
            {panel === 'vendor' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">売り子呼び出し</h2>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {['🍺 ドリンク', '🍱 フード', '🚬 タバコ', '🎁 グッズ'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => callVendor(cat)}
                      className={`py-5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 ${vendorCalled === cat ? 'bg-green-500 text-white scale-95' : 'bg-yellow-50 border border-yellow-300 text-yellow-800 hover:bg-yellow-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {vendorCalled && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="font-bold text-green-700">✓ {vendorCalled} の売り子を呼びました</p>
                    <p className="text-xs text-green-500 mt-1">席 {seatNo} にまもなく参ります</p>
                  </div>
                )}
              </div>
            )}

            {/* 場内マップ */}
            {panel === 'map' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">場内マップ</h2>
                <div className="rounded-2xl bg-cyan-50 border border-cyan-100 aspect-video flex items-center justify-center mb-4">
                  <p className="text-cyan-300 text-sm font-semibold">場内マップ表示エリア</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['投票所', 'トイレ', '喫煙所', 'フード', 'VIP席', '救護室'].map((loc) => (
                    <button key={loc} className="py-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold active:scale-95 transition-transform">
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* イベント情報 */}
            {panel === 'events' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">イベント情報</h2>
                <div className="space-y-3">
                  {[
                    { title: '人気選手トークショー', time: '12:30〜13:00', place: 'イベント広場', tag: '本日' },
                    { title: '第3R予想会', time: '11:00〜11:25', place: '予想コーナー', tag: '本日' },
                    { title: 'ファン抽選会', time: '15:00〜', place: 'メインホール', tag: '本日' },
                    { title: 'サイン会 (山田選手)', time: '16:30〜17:00', place: '選手ゾーン', tag: '本日' },
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

            {/* ポイント・会員 */}
            {panel === 'points' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">ポイント・会員</h2>
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">会員ランク</p>
                  <p className="font-black text-2xl mb-2">ゴールド 🥇</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70">累計ポイント</p>
                      <p className="font-black text-3xl">4,280 pt</p>
                    </div>
                    <p className="text-xs opacity-60">本日 +50pt 獲得</p>
                  </div>
                </div>
                <button
                  onClick={() => setNfcChecked(true)}
                  className={`w-full py-4 rounded-2xl font-bold text-base mb-4 transition-all active:scale-95 ${nfcChecked ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                >
                  {nfcChecked ? '✓ NFCチェックイン完了 +50pt' : '📱 NFCチェックイン'}
                </button>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">ランク特典</p>
                  <div className="space-y-1">
                    {['VIP席優先予約', '限定グッズ割引 10%', '来場ポイント 2倍'].map((b) => (
                      <p key={b} className="text-xs text-gray-500">✓ {b}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EC・グッズ */}
            {panel === 'ec' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">EC・グッズ</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {EC_ITEMS.map((item) => (
                    <div key={item.id} className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                      <div className="aspect-square rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>
                      </div>
                      <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-bold">{item.tag.trim()}</span>
                      <p className="font-semibold text-gray-800 text-xs mt-1 leading-tight">{item.name}</p>
                      <p className="font-bold text-purple-600 text-sm">{item.price}</p>
                      <button onClick={() => addEc(item.id)} className="w-full mt-1.5 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-bold">
                        {ecCart[item.id] ? `${ecCart[item.id]}個` : 'カートへ'}
                      </button>
                    </div>
                  ))}
                </div>
                {ecTotal > 0 && (
                  <button className="w-full py-3.5 rounded-xl bg-purple-500 text-white font-bold text-sm">
                    購入する　¥{ecTotal.toLocaleString()}
                  </button>
                )}
              </div>
            )}

            {/* リプレイ動画 */}
            {panel === 'replay' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">リプレイ動画</h2>
                <div className="space-y-3">
                  {[
                    { title: '第2R ハイライト', duration: '0:45', tag: 'ハイライト' },
                    { title: '第2R スロー再生 (ゴール前)', duration: '0:30', tag: 'スロー' },
                    { title: '第2R マルチアングル', duration: '1:20', tag: 'マルチ' },
                    { title: '第1R ハイライト', duration: '0:42', tag: 'ハイライト' },
                  ].map((v) => (
                    <button key={v.title} className="w-full flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl active:scale-[0.98] transition-transform text-left">
                      <div className="w-16 h-12 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{v.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">{v.tag}</span>
                          <span className="text-xs text-gray-400">{v.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ラウンジ・VIP */}
            {panel === 'vip' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">ラウンジ・VIP</h2>
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">VIPラウンジ</p>
                  <p className="font-bold text-lg">プレミアムシート</p>
                  <p className="text-xs opacity-60 mt-1">専用モニター · ドリンク付き · 全レース対応</p>
                </div>
                <div className="space-y-2 mb-4">
                  {['10:00〜12:00', '12:00〜14:00', '14:00〜16:00', '16:00〜閉場'].map((slot) => (
                    <button key={slot} className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl active:scale-[0.98] transition-transform">
                      <span className="font-semibold text-gray-800 text-sm">{slot}</span>
                      <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">残2席</span>
                    </button>
                  ))}
                </div>
                <button className="w-full py-3.5 rounded-xl bg-amber-700 text-white font-bold text-sm">VIP予約する</button>
              </div>
            )}

            {/* 充電・席管理 */}
            {panel === 'seat' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">充電・席管理</h2>
                {/* Seat badge — core feature */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">現在の席番号</p>
                  <p className="font-black text-4xl mb-1">{seatNo}</p>
                  <p className="text-xs opacity-60">NFCログイン済 · 来場 12回目</p>
                </div>
                {/* Charging status */}
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">充電状況</p>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">充電中 ⚡</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-teal-400 to-green-400 rounded-full"/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">残り利用時間: 45分 / 利用開始: 11:00</p>
                </div>
                {/* Seat-linked features */}
                <p className="text-xs font-bold text-gray-400 mb-2 px-1">席番号連動サービス</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '席まで配達', icon: '🍱', action: () => setPanel('food') },
                    { label: 'AI今日の買い目', icon: '🤖', action: () => setPanel('ai') },
                    { label: 'NFCログイン', icon: '📱', action: () => setPanel('points') },
                    { label: '来場履歴', icon: '📋', action: () => {} },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl active:scale-95 transition-transform text-left"
                    >
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
