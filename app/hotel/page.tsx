'use client'

import { useState } from 'react'
import Link from 'next/link'

type PanelId =
  | 'guide' | 'room-service' | 'sightseeing' | 'restaurant'
  | 'mobile-key' | 'checkout' | 'chat' | 'spa'
  | 'ec' | 'taxi' | 'language'

type Lang = 'ja' | 'en' | 'zh' | 'ko'

const LANG_LABELS: Record<Lang, string> = { ja: '日本語', en: 'English', zh: '中文', ko: '한국어' }

const FLOOR_GUIDE = [
  { floor: 'B1', name: 'コインランドリー・駐車場', icon: '🧺' },
  { floor: '1F', name: 'フロント・ロビー・喫煙所', icon: '🏨' },
  { floor: '2F', name: 'レストラン・ラウンジ', icon: '🍽️' },
  { floor: '8F', name: 'ジム・フィットネス', icon: '💪' },
  { floor: '9F', name: '大浴場・サウナ', icon: '♨️' },
  { floor: '10F', name: 'プール・スカイラウンジ', icon: '🏊' },
]

const ROOM_SERVICE_MENU = [
  { id: 1, cat: 'フード', name: 'クラブサンドイッチ', price: 2200 },
  { id: 2, cat: 'フード', name: '和風おかゆセット', price: 1800 },
  { id: 3, cat: 'ドリンク', name: 'コーヒー・紅茶', price: 800 },
  { id: 4, cat: 'ドリンク', name: 'ビール (350ml)', price: 1000 },
  { id: 5, cat: 'アメニティ', name: 'アメニティ追加', price: 0 },
  { id: 6, cat: 'アメニティ', name: 'タオル追加', price: 0 },
]

const SIGHT_TABS = ['周辺観光', 'グルメ', 'イベント', '交通案内', '天気'] as const
type SightTab = typeof SIGHT_TABS[number]

const SIGHT_DATA: Record<SightTab, { name: string; sub: string }[]> = {
  周辺観光: [
    { name: '〇〇城跡', sub: '徒歩5分 ★★★★★' },
    { name: '△△美術館', sub: '徒歩10分 ★★★★☆' },
    { name: '◇◇温泉街', sub: '車5分 ★★★★★' },
  ],
  グルメ: [
    { name: '地魚料理 さくら', sub: '徒歩3分 · 予算¥3,000〜' },
    { name: '郷土料理 山彦', sub: '徒歩8分 · 予算¥2,000〜' },
    { name: 'カフェ 海風', sub: '徒歩2分 · 予算¥800〜' },
  ],
  イベント: [
    { name: '地元お祭り', sub: '5/20 (水) 17:00〜' },
    { name: '花火大会', sub: '5/31 (土) 20:00〜' },
  ],
  交通案内: [
    { name: '最寄り駅: △△駅', sub: '徒歩5分 · JR線' },
    { name: '空港リムジン', sub: '1F発 · 所要40分' },
    { name: 'レンタカー', sub: '1Fフロントで手配可' },
  ],
  天気: [
    { name: '本日 晴れ ☀️', sub: '最高28°C · 最低18°C' },
    { name: '明日 曇りのち雨 🌦️', sub: '最高22°C · 最低16°C' },
    { name: '明後日 晴れ ☀️', sub: '最高26°C · 最低17°C' },
  ],
}

const TONIGHT_RECOMMEND = '本日のおすすめ: 近くの海鮮居酒屋「波音」が21時まで営業中。ホテル特典で生ビール1杯無料！'

const CHAT_HISTORY = [
  { role: 'ai', text: 'いらっしゃいませ。何かご不明な点はございますか？' },
  { role: 'user', text: '近くにおすすめのレストランはありますか？' },
  { role: 'ai', text: '徒歩3分の「地魚料理 さくら」がおすすめです。新鮮な海の幸を楽しめます。ご予約のお手伝いもできますよ。' },
]

const SPA_FACILITIES = [
  { name: 'エステ', slots: ['11:00', '13:00', '15:00', '17:00'], price: '¥8,800〜' },
  { name: 'サウナ', slots: ['06:00〜24:00 (随時)'], price: '無料 (宿泊者)' },
  { name: 'プール', slots: ['07:00〜22:00 (随時)'], price: '無料 (宿泊者)' },
  { name: 'ジム', slots: ['24時間 (随時)'], price: '無料 (宿泊者)' },
]

const EC_ITEMS = [
  { id: 1, name: 'ホテルオリジナル羊羹', price: '¥1,200', tag: '限定' },
  { id: 2, name: '地域特産 梅干しセット', price: '¥1,800', tag: '特産' },
  { id: 3, name: 'ホテルタオル', price: '¥2,200', tag: '限定' },
  { id: 4, name: '地酒 飲み比べセット', price: '¥3,300', tag: '特産' },
]

const BUTTONS: { id: PanelId; label: string; color: string; bg: string; border: string; icon: React.ReactNode }[] = [
  {
    id: 'guide',
    label: '館内案内',
    color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>,
  },
  {
    id: 'room-service',
    label: 'ルームサービス',
    color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25"/></svg>,
  },
  {
    id: 'sightseeing',
    label: '観光案内',
    color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
  },
  {
    id: 'restaurant',
    label: 'レストラン予約',
    color: '#ef4444', bg: '#fff1f2', border: '#fecdd3',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>,
  },
  {
    id: 'mobile-key',
    label: 'モバイルキー',
    color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/></svg>,
  },
  {
    id: 'checkout',
    label: 'チェックアウト',
    color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>,
  },
  {
    id: 'chat',
    label: 'ホテル内チャット',
    color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>,
  },
  {
    id: 'spa',
    label: 'スパ・施設予約',
    color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>,
  },
  {
    id: 'ec',
    label: 'EC・お土産',
    color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>,
  },
  {
    id: 'taxi',
    label: 'タクシー・交通',
    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>,
  },
  {
    id: 'language',
    label: '多言語切替',
    color: '#64748b', bg: '#f8fafc', border: '#e2e8f0',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/></svg>,
  },
]

export default function HotelPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [lang, setLang] = useState<Lang>('ja')
  const [sightTab, setSightTab] = useState<SightTab>('周辺観光')
  const [showTonight, setShowTonight] = useState(false)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [rsCart, setRsCart] = useState<Record<number, number>>({})
  const [keyUnlocked, setKeyUnlocked] = useState(false)
  const [lateCheckout, setLateCheckout] = useState(false)
  const [taxiCalled, setTaxiCalled] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState(CHAT_HISTORY)
  const [mealType, setMealType] = useState<'朝食' | 'ディナー'>('朝食')

  function addRs(id: number) { setRsCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function remRs(id: number) { setRsCart((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }
  const rsTotal = ROOM_SERVICE_MENU.reduce((s, i) => s + (rsCart[i.id] ?? 0) * i.price, 0)

  function addEc(id: number) { setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  const ecTotal = EC_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0) * parseInt(i.price.replace(/[¥,]/g, '')), 0)

  function unlock() {
    setKeyUnlocked(true)
    setTimeout(() => setKeyUnlocked(false), 3000)
  }

  function callTaxi() {
    setTaxiCalled(true)
    setTimeout(() => setTaxiCalled(false), 4000)
  }

  function sendChat() {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatHistory((h) => [
      ...h,
      { role: 'user', text: userMsg },
      { role: 'ai', text: 'ご質問ありがとうございます。フロントスタッフがご対応いたします。少々お待ちください。' },
    ])
  }

  function closePanel() { setPanel(null) }

  return (
    <>
      <main className="h-dvh flex flex-col bg-[#edf1f7] max-w-lg mx-auto overflow-hidden">
        <header className="neu-header px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
            <span className="font-bold text-sm silver-gradient">Vexii</span>
          </Link>
          <span className="text-gray-200 text-lg leading-none mx-0.5">|</span>
          <span className="text-sm font-semibold text-gray-500">ホテル</span>
          <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{LANG_LABELS[lang]}</span>
        </header>

        {/* 2-col × 6-row compact grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2.5 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-2">
          {BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 p-2"
              style={{ borderColor: btn.border }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center neu-icon" style={{ background: btn.bg, color: btn.color }}>
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-[11px] leading-tight text-center">{btn.label}</p>
            </button>
          ))}
        </div>
      </main>

      {panel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closePanel}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />

            {/* 館内案内 */}
            {panel === 'guide' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">館内案内</h2>
                <div className="space-y-2">
                  {FLOOR_GUIDE.map((f) => (
                    <div key={f.floor} className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <p className="text-[10px] text-sky-400 font-bold">{f.floor}</p>
                        <p className="font-semibold text-gray-800 text-sm">{f.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ルームサービス */}
            {panel === 'room-service' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">ルームサービス</h2>
                <div className="space-y-2 mb-4">
                  {ROOM_SERVICE_MENU.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <div>
                        <p className="text-[10px] text-orange-400 font-semibold">{item.cat}</p>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.price === 0 ? '無料' : `¥${item.price.toLocaleString()}`}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => remRs(item.id)} className="w-7 h-7 rounded-full bg-white border border-orange-200 text-orange-500 font-bold flex items-center justify-center">−</button>
                        <span className="w-4 text-center font-bold text-gray-800 text-sm">{rsCart[item.id] ?? 0}</span>
                        <button onClick={() => addRs(item.id)} className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button disabled={rsTotal === 0} className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-40">
                  注文する{rsTotal > 0 ? `　¥${rsTotal.toLocaleString()}` : ''}
                </button>
              </div>
            )}

            {/* 観光案内 */}
            {panel === 'sightseeing' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">観光案内</h2>
                {/* AIおすすめバナー */}
                <button
                  onClick={() => setShowTonight((v) => !v)}
                  className="w-full mb-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl px-4 py-3 text-left"
                >
                  <p className="text-[10px] font-bold opacity-80 mb-0.5">✨ AI · 今夜のおすすめ</p>
                  <p className="text-xs font-semibold">{showTonight ? TONIGHT_RECOMMEND : 'タップして今夜のおすすめを見る'}</p>
                </button>
                {/* Tabs */}
                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                  {SIGHT_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSightTab(tab)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${sightTab === tab ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-500'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {SIGHT_DATA[sightTab].map((item) => (
                    <div key={item.name} className="bg-pink-50 border border-pink-100 rounded-xl px-4 py-3">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* レストラン予約 */}
            {panel === 'restaurant' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">レストラン予約</h2>
                <div className="flex gap-2 mb-4">
                  {(['朝食', 'ディナー'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setMealType(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${mealType === t ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {/* 混雑状況 */}
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">現在の混雑状況</p>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">空いています</span>
                </div>
                <p className="text-xs text-gray-400 mb-3 px-1">ご希望のお時間を選択してください</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {(mealType === '朝食'
                    ? ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30']
                    : ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
                  ).map((time) => (
                    <button key={time} className="py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold active:bg-red-500 active:text-white transition-colors">
                      {time}
                    </button>
                  ))}
                </div>
                <button className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm">
                  予約する
                </button>
              </div>
            )}

            {/* モバイルキー */}
            {panel === 'mobile-key' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">モバイルキー</h2>
                <p className="text-xs text-gray-400 mb-5 text-center">スマートフォンでお部屋を解錠できます</p>
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-6 border-4 transition-all duration-500 ${keyUnlocked ? 'bg-green-50 border-green-400' : 'bg-indigo-50 border-indigo-200'}`}>
                  <svg className={`w-14 h-14 transition-colors ${keyUnlocked ? 'text-green-500' : 'text-indigo-400'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    {keyUnlocked
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                    }
                  </svg>
                </div>
                {keyUnlocked && <p className="text-center text-green-600 font-bold text-sm mb-4">解錠しました！</p>}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={unlock} className="py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0"/></svg>
                    NFC解錠
                  </button>
                  <button onClick={unlock} className="py-4 rounded-2xl bg-indigo-400 text-white font-bold text-sm flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0"/></svg>
                    Bluetooth解錠
                  </button>
                </div>
                <p className="text-xs text-gray-300 text-center mt-4">502号室</p>
              </div>
            )}

            {/* チェックアウト */}
            {panel === 'checkout' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">チェックアウト</h2>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-4 space-y-2.5 text-sm">
                  {[['お部屋番号', '502号室'], ['チェックイン', '2026/05/14'], ['チェックアウト', '2026/05/15 11:00']].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-purple-200">
                    <span className="font-semibold text-gray-700">ご請求合計</span>
                    <span className="font-black text-gray-900 text-lg">¥24,800</span>
                  </div>
                </div>
                {/* レイトチェックアウト */}
                <div className="bg-[#edf1f7] border border-gray-100 rounded-xl p-4 flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">延長申請</p>
                    <p className="text-xs text-gray-400 mt-0.5">13:00まで延長 (+¥3,300)</p>
                  </div>
                  <button onClick={() => setLateCheckout((v) => !v)} className={`w-12 h-6 rounded-full relative transition-colors ${lateCheckout ? 'bg-purple-500' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${lateCheckout ? 'translate-x-6' : 'translate-x-0.5'}`}/>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button className="py-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-sm font-bold">領収書DL</button>
                  <button className="py-3 rounded-xl bg-purple-500 text-white text-sm font-bold">モバイル精算</button>
                </div>
              </div>
            )}

            {/* ホテル内チャット */}
            {panel === 'chat' && (
              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">ホテル内チャット</h2>
                  <div className="flex gap-1">
                    {(['ja', 'en', 'zh', 'ko'] as Lang[]).map((l) => (
                      <button key={l} onClick={() => setLang(l)} className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-colors ${lang === l ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600'}`}>
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {/* AI concierge badge */}
                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                  <p className="text-xs font-bold">AI Concierge · {LANG_LABELS[lang]}</p>
                </div>
                <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder="メッセージを入力..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-300"
                  />
                  <button onClick={sendChat} className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-sm">送信</button>
                </div>
              </div>
            )}

            {/* スパ・施設予約 */}
            {panel === 'spa' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">スパ・施設予約</h2>
                <div className="space-y-3">
                  {SPA_FACILITIES.map((fac) => (
                    <div key={fac.name} className="bg-green-50 border border-green-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-800">{fac.name}</p>
                        <span className="text-xs font-semibold text-green-600">{fac.price}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {fac.slots.map((slot) => (
                          <button key={slot} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-green-200 text-green-700 font-semibold active:bg-green-500 active:text-white transition-colors">
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EC・お土産 */}
            {panel === 'ec' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">EC・お土産</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {EC_ITEMS.map((item) => (
                    <div key={item.id} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <div className="aspect-square rounded-lg bg-amber-100 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>
                      </div>
                      <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">{item.tag}</span>
                      <p className="font-semibold text-gray-800 text-xs mt-1 leading-tight">{item.name}</p>
                      <p className="font-bold text-amber-600 text-sm">{item.price}</p>
                      <button onClick={() => addEc(item.id)} className="w-full mt-1.5 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold">
                        {cart[item.id] ? `${cart[item.id]}個` : 'カートへ'}
                      </button>
                    </div>
                  ))}
                </div>
                {ecTotal > 0 && (
                  <button className="w-full py-3.5 rounded-xl bg-amber-500 text-white font-bold text-sm">
                    購入する　¥{ecTotal.toLocaleString()}
                  </button>
                )}
              </div>
            )}

            {/* タクシー・交通 */}
            {panel === 'taxi' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">タクシー・交通</h2>
                <button
                  onClick={callTaxi}
                  className={`w-full py-5 rounded-2xl font-bold text-lg mb-4 transition-all duration-300 ${taxiCalled ? 'bg-green-500 text-white scale-95' : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 active:scale-95'}`}
                >
                  {taxiCalled ? '✓ タクシーを手配中...' : '🚕 タクシーを呼ぶ'}
                </button>
                {taxiCalled && <p className="text-xs text-green-500 text-center mb-4">約5分でフロント前に到着します</p>}
                <div className="space-y-2">
                  {[
                    { name: '空港アクセス (リムジンバス)', sub: '1F発 · 所要40分 · ¥1,500', icon: '✈️' },
                    { name: '最寄り駅 (△△駅)', sub: '徒歩5分 · JR線', icon: '🚉' },
                    { name: 'バス時刻表', sub: '1番のりば · 毎時00・30分', icon: '🚌' },
                    { name: 'レンタカー手配', sub: 'フロントにてご案内', icon: '🚗' },
                  ].map((item) => (
                    <div key={item.name} className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 多言語切替 */}
            {panel === 'language' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">多言語切替</h2>
                <p className="text-sm text-gray-400 mb-5 text-center">表示言語を選択してください</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { code: 'ja', label: '日本語', sub: 'Japanese', flag: '🇯🇵' },
                    { code: 'en', label: 'English', sub: '英語', flag: '🇺🇸' },
                    { code: 'zh', label: '中文', sub: '中国語', flag: '🇨🇳' },
                    { code: 'ko', label: '한국어', sub: '韓国語', flag: '🇰🇷' },
                  ] as const).map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); closePanel() }}
                      className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 ${lang === l.code ? 'border-slate-500 bg-slate-50' : 'border-gray-100 bg-white'}`}
                    >
                      <span className="text-3xl">{l.flag}</span>
                      <p className="font-bold text-gray-800 text-sm">{l.label}</p>
                      <p className="text-xs text-gray-400">{l.sub}</p>
                      {lang === l.code && <span className="text-[10px] bg-slate-500 text-white px-2 py-0.5 rounded-full font-bold">選択中</span>}
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
