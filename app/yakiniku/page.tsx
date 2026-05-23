'use client'
import { iconGradient } from '@/lib/colorLight'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'
import VoiceOrderButton from '@/components/restaurant/VoiceOrderButton'
import { type ParsedItem } from '@/lib/voiceCommandParser'

type PanelId = 'wifi' | 'coupons' | 'order' | 'ad' | 'app' | 'store' | 'staff' | 'payment'
type OrderItem = { id: number; name: string; desc: string; price: number; photo: string; photoBg: string; tag?: string }

const DEMO_WIFI = { ssid: 'YAKINIKU_WIFI', password: 'yakiniku2024' }

const COUPONS = [
  { id: 1, title: 'カルビ1皿無料', code: 'KARUBI1', expires: '2026/05/31' },
  { id: 2, title: 'ドリンク1杯無料', code: 'DRINK', expires: '2026/05/25' },
  { id: 3, title: 'デザート 30%OFF', code: 'DESSERT30', expires: '2026/06/30' },
]

const ORDER_MENU: Record<string, OrderItem[]> = {
  speed: [
    { id: 101, name: 'キムチ',     desc: '自家製白菜キムチ',                 price: 380, photo: '🥬', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 102, name: 'ナムル盛り', desc: 'ほうれん草・もやし・ぜんまい',     price: 380, photo: '🥗', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { id: 103, name: 'チャンジャ', desc: 'タラの塩辛・ピリ辛',               price: 480, photo: '🌶️', photoBg: 'linear-gradient(135deg,#dc2626,#991b1b)' },
    { id: 104, name: 'センマイ刺し', desc: '新鮮なセンマイ・ごまだれ',       price: 480, photo: '🐄', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
  ],
  recommend: [
    { id: 201, name: '厚切りタン塩',   desc: '国産牛タン・レモン添え',         price: 1680, photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', tag: '人気' },
    { id: 202, name: '上カルビ',        desc: 'A5黒毛和牛・特製たれ',          price: 1980, photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#991b1b)', tag: 'NEW' },
    { id: 203, name: '特選ハラミ',      desc: '柔らか外国産ハラミ',             price: 1280, photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 204, name: '神戸牛サーロイン', desc: 'A5ランク神戸牛',                price: 4800, photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', tag: '特選' },
    { id: 205, name: 'ユッケ',          desc: '新鮮牛肉・卵黄のせ',             price: 980,  photo: '🥚', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
  ],
  beef: [
    { id: 301, name: 'カルビ',       desc: '骨付きカルビ・甘口たれ',           price: 980,  photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', tag: '人気' },
    { id: 302, name: 'ロース',       desc: '厚切りロース・塩/たれ',             price: 1080, photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 303, name: 'ハラミ',       desc: '外国産ハラミ・塩/たれ',             price: 880,  photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 304, name: 'タン塩',       desc: '国産牛タン・レモン',                price: 1280, photo: '🥩', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
  ],
  horumon: [
    { id: 401, name: 'シマチョウ',   desc: '大腸・塩/たれ・ぷりぷり食感',     price: 680, photo: '🐄', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', tag: '人気' },
    { id: 402, name: 'テッチャン',   desc: '大腸・みそだれ',                   price: 680, photo: '🐄', photoBg: 'linear-gradient(135deg,#7c3aed,#5b21b6)' },
    { id: 403, name: 'ミノ',         desc: '第一胃・コリコリ食感',              price: 580, photo: '🐄', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
    { id: 404, name: 'レバー',       desc: '新鮮レバー・塩だれ',               price: 680, photo: '🐄', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
  ],
  drink: [
    { id: 501, name: '生ビール',    desc: '中ジョッキ・キンキン冷え',           price: 580, photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', tag: '人気' },
    { id: 502, name: 'ハイボール',  desc: 'ウイスキーソーダ割り',               price: 480, photo: '🥃', photoBg: 'linear-gradient(135deg,#475569,#334155)' },
    { id: 506, name: 'レモンサワー', desc: '生レモン搾りたて',                  price: 480, photo: '🍋', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', tag: '人気' },
    { id: 503, name: '酎ハイ',      desc: 'グレープフルーツ・梅',               price: 480, photo: '🍹', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
    { id: 504, name: '日本酒',      desc: '季節の地酒・1合',                   price: 680, photo: '🍶', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)' },
    { id: 505, name: '焼酎',        desc: '芋/麦/米・ロック/水割り',           price: 580, photo: '🥃', photoBg: 'linear-gradient(135deg,#1e40af,#1d4ed8)' },
  ],
  side: [
    { id: 601, name: 'クッパ',         desc: '牛骨スープのおじや',             price: 680, photo: '🍲', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', tag: '人気' },
    { id: 602, name: 'ライス',         desc: '白米・大/中/小',                 price: 220, photo: '🍚', photoBg: 'linear-gradient(135deg,#65a30d,#4d7c0f)' },
    { id: 603, name: 'クッパスープ',   desc: '牛骨だし・具たくさん',           price: 380, photo: '🍜', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 604, name: 'ナムルサラダ',   desc: '野菜たっぷり・ごまドレ',         price: 480, photo: '🥗', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
  ],
  shime: [
    { id: 701, name: '冷麺',     desc: '牛骨スープ・さっぱり',                  price: 780, photo: '🍜', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', tag: '人気' },
    { id: 702, name: '石焼ビビンバ', desc: 'おこげが香ばしい一品',             price: 780, photo: '🍳', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 703, name: 'チャーハン', desc: '牛肉入り・半熟卵のせ',               price: 680, photo: '🍳', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 704, name: 'クッパ締め', desc: '残りのたれで作るだし茶漬け',         price: 580, photo: '🍵', photoBg: 'linear-gradient(135deg,#059669,#047857)' },
  ],
}

const ALL_ITEMS = Object.values(ORDER_MENU).flat()

const ORDER_CATEGORIES = [
  {
    id: 'speed', label: 'スピードメニュー', color: '#dc2626', bg: '#fff1f2', border: '#fecdd3',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
  {
    id: 'recommend', label: 'おすすめ', color: '#eab308', bg: '#fefce8', border: '#fde68a',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>,
  },
  {
    id: 'beef', label: '牛肉', color: '#b91c1c', bg: '#fff1f2', border: '#fecdd3',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/></svg>,
  },
  {
    id: 'horumon', label: 'ホルモン', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/></svg>,
  },
  {
    id: 'drink', label: 'ドリンク', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/></svg>,
  },
  {
    id: 'side', label: 'サイドメニュー', color: '#d97706', bg: '#fefce8', border: '#fef08a',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/></svg>,
  },
  {
    id: 'shime', label: '締め', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/></svg>,
  },
  {
    id: 'history', label: '注文履歴', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>,
  },
]

const CAT_LABEL: Record<string, string> = {
  speed: 'スピードメニュー', recommend: '本日のおすすめ', beef: '牛肉',
  horumon: 'ホルモン', drink: 'ドリンク', side: 'サイドメニュー', shime: '締め',
}

export default function YakinikuPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [copied, setCopied] = useState<'ssid' | 'pass' | null>(null)
  const [barcode, setBarcode] = useState<{ code: string; title: string } | null>(null)
  const [orderCat, setOrderCat] = useState<string | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [quickAdded, setQuickAdded] = useState<string | null>(null)
  const [tableId, setTableId] = useState<string>('')
  const [showTableModal, setShowTableModal] = useState(false)
  const [tableInput, setTableInput] = useState('')
  const [logoImage, setLogoImage] = useState('/restaurant-logo.png')
  const [kvImage, setKvImage] = useState('/restaurant-hero.png')

  useEffect(() => {
    const saved = localStorage.getItem('yakiniku_table_id') ?? ''
    setTableId(saved)
    if (!saved) setShowTableModal(true)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genreConfig_yakiniku')
      if (raw) {
        const cfg = JSON.parse(raw)
        if (cfg.logoImage) setLogoImage(cfg.logoImage)
        if (cfg.kvImage) setKvImage(cfg.kvImage)
      }
    } catch {}
  }, [])

  function saveTableId() {
    const v = tableInput.trim()
    if (!v) return
    localStorage.setItem('yakiniku_table_id', v)
    setTableId(v)
    setShowTableModal(false)
  }

  const cartTotal = ALL_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0) * i.price, 0)
  const cartCount = ALL_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0), 0)

  function addItem(id: number) { setCart(p => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function remItem(id: number) { setCart(p => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }

  function quickAdd(id: number, name: string) {
    addItem(id)
    setQuickAdded(name)
    setTimeout(() => setQuickAdded(null), 1800)
  }

  function openCat(cat: string) { setPanel('order'); setOrderCat(cat) }

  async function placeOrder() {
    setOrderPlaced(true)
    setTimeout(() => {
      setCart({})
      setOrderPlaced(false)
      setOrderCat(null)
      setPanel(null)
    }, 3000)
  }

  async function copy(text: string, type: 'ssid' | 'pass') {
    try { await navigator.clipboard.writeText(text); setCopied(type); setTimeout(() => setCopied(null), 2000) } catch {}
  }

  function closePanel() { setPanel(null); setCopied(null); setOrderCat(null) }

  return (
    <>
      <main className="min-h-dvh flex flex-col bg-[#edf1f7]">
        <header className="neu-header py-3 shrink-0">
          <div className="max-w-lg mx-auto w-full px-3 flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoImage} alt="焼肉屋" style={{ height: '40px', width: 'auto' }} />
            </Link>
            <button
              onClick={() => { setTableInput(tableId); setShowTableModal(true) }}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1 active:opacity-70 transition-opacity"
              style={tableId ? { background: '#fff1f2', border: '1px solid #fecdd3' } : { background: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <svg className="w-3.5 h-3.5" style={{ color: tableId ? '#dc2626' : '#ef4444' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              <span className="text-xs font-black" style={{ color: tableId ? '#dc2626' : '#dc2626' }}>
                {tableId ? `席 ${tableId}` : '席番号を設定'}
              </span>
            </button>
            {cartCount > 0 && (
              <button onClick={() => setPanel('order')} className="ml-1 flex items-center gap-1.5 bg-red-50 border border-red-300 rounded-lg px-2.5 py-1">
                <span className="text-xs font-black text-red-700">カート {cartCount}点</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 max-w-lg mx-auto w-full p-3 pb-6 flex flex-col gap-[15px]">
          {/* ヒーロー画像 */}
          <div className="rounded-2xl overflow-hidden shrink-0" style={{ height: '25vh' }}>
            <img
              src={kvImage}
              alt="焼肉屋"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ━━ 音声注文 ━━ */}
          <div className="card-light rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-700">🎤 音声でかんたん注文</p>
              <p className="text-[10px] text-gray-400 mt-0.5">「カルビ2つとレモンサワー」と話してください</p>
            </div>
            <VoiceOrderButton
              menu={ALL_ITEMS}
              onConfirm={(items: ParsedItem[]) => {
                items.forEach(({ item, qty }) => {
                  for (let i = 0; i < qty; i++) addItem(item.id)
                })
                setQuickAdded(`音声注文をカートに追加しました`)
                setTimeout(() => setQuickAdded(null), 2000)
              }}
            />
          </div>

          {/* クイック追加トースト */}
          {quickAdded && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg">
              🥩 {quickAdded} をカートに追加しました
            </div>
          )}

          {/* ━━ クイックドリンク ━━ */}
          <div className="grid grid-cols-3 gap-[10px]">
            {[
              { id: 501, label: 'とりあえず\n生ビール', emoji: '🍺', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { id: 502, label: 'ハイボール', emoji: '🥃', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
              { id: 506, label: 'レモンサワー', emoji: '🍋', color: '#ca8a04', bg: '#fefce8', border: '#fef08a' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => quickAdd(d.id, d.label.replace('\n', ''))}
                className="card-light flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 py-3 px-1 min-h-[90px]"
                style={{ background: d.bg, borderColor: d.border }}
              >
                <span className="text-3xl leading-none">{d.emoji}</span>
                <p className="font-bold text-[11px] leading-tight text-center whitespace-pre-line" style={{ color: d.color }}>{d.label}</p>
                <span className="text-[9px] text-gray-400 font-semibold bg-white/70 px-1.5 py-0.5 rounded-full">1タップ注文</span>
              </button>
            ))}
          </div>

          {/* ━━ メニュー & サービス ━━ */}
          <div className="grid grid-cols-2 gap-[10px]">
            {/* 本日のおすすめ */}
            <button onClick={() => openCat('recommend')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#fefce8', borderColor: '#fde68a' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#eab308'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">本日のおすすめ</p>
                <p className="text-[10px] text-gray-400 leading-tight">今日の一品</p>
              </div>
            </button>

            {/* スピードメニュー */}
            <button onClick={() => openCat('speed')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#dc2626'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">スピードメニュー</p>
                <p className="text-[10px] text-gray-400 leading-tight">すぐ出てくる</p>
              </div>
            </button>

            {/* 牛肉 */}
            <button onClick={() => openCat('beef')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#b91c1c'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">牛肉</p>
                <p className="text-[10px] text-gray-400 leading-tight">カルビ・ロース・タンなど</p>
              </div>
            </button>

            {/* ホルモン */}
            <button onClick={() => openCat('horumon')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#7c3aed'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">ホルモン</p>
                <p className="text-[10px] text-gray-400 leading-tight">シマチョウ・ミノなど</p>
              </div>
            </button>

            {/* 締め */}
            <button onClick={() => openCat('shime')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#eef2ff', borderColor: '#c7d2fe' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#6366f1'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">締め</p>
                <p className="text-[10px] text-gray-400 leading-tight">冷麺・ビビンバなど</p>
              </div>
            </button>

            {/* スタッフ呼び出し */}
            <button onClick={() => setPanel('staff')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#0ea5e9'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">スタッフ呼び出し</p>
                <p className="text-[10px] text-gray-400 leading-tight">スタッフを呼ぶ</p>
              </div>
            </button>

            {/* クーポン */}
            <button onClick={() => setPanel('coupons')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#22c55e'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">クーポン</p>
                <p className="text-[10px] text-gray-400 leading-tight">割引クーポンを見る</p>
              </div>
            </button>

            {/* WiFi接続 */}
            <button onClick={() => setPanel('wifi')}
              className="card-light flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#0ea5e9'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">WiFi接続</p>
                <p className="text-[10px] text-gray-400 leading-tight">フリーWiFiに接続</p>
              </div>
            </button>

            {/* 店舗情報 */}
            <button onClick={() => setPanel('store')}
              className="card-light col-span-2 flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#f0fdfa', borderColor: '#99f6e4' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#14b8a6'), color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm leading-tight">店舗情報</p>
                <p className="text-[10px] text-gray-400 leading-tight">住所・営業時間など</p>
              </div>
            </button>
          </div>

          {/* お会計 — 全幅 */}
          <button
            onClick={() => setPanel('payment')}
            className="card-light flex items-center justify-center gap-3 p-4 active:scale-95 transition-transform duration-150"
            style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 neu-icon" style={{ background: iconGradient('#16a34a'), color: '#fff' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>
            </div>
            <p className="font-black text-green-700 text-base">お会計</p>
          </button>

          {/* 広告スペース */}
          <div className="col-span-2 rounded-2xl overflow-hidden aspect-video">
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

      {panel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closePanel}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setPanel(null)} />

            {/* ===== モバイルオーダー ===== */}
            {panel === 'order' && (
              <div className="pb-8">
                {!orderCat && (
                  <div className="px-5">
                    <h2 className="font-bold text-gray-900 text-lg mb-4">モバイルオーダー</h2>
                    {cartCount > 0 && (
                      <div className="flex items-center gap-2 mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <span className="text-red-500 text-sm">🛒</span>
                        <p className="text-xs font-bold text-red-700 flex-1">カートに {cartCount}点（¥{cartTotal.toLocaleString()}）</p>
                        <button onClick={placeOrder} className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg font-bold">注文する</button>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-[11px]">
                      {ORDER_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => cat.id !== 'history' && setOrderCat(cat.id)}
                          className="flex items-center gap-3 p-3 rounded-xl border active:scale-95 transition-transform duration-150 text-left"
                          style={{ background: cat.bg, borderColor: cat.border }}
                        >
                          <span style={{ color: cat.color }}>{cat.icon}</span>
                          <span className="font-semibold text-gray-800 text-sm leading-tight">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                    {orderPlaced && (
                      <div className="mt-4 w-full py-4 rounded-xl bg-green-500 text-white font-bold text-sm text-center">
                        ✓ ご注文を受け付けました！
                      </div>
                    )}
                  </div>
                )}

                {orderCat && orderCat !== 'history' && (
                  <div className="px-5">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => setOrderCat(null)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                        </svg>
                      </button>
                      <h2 className="font-bold text-gray-900 text-lg">{CAT_LABEL[orderCat]}</h2>
                    </div>

                    <div className="space-y-3 mb-4">
                      {(ORDER_MENU[orderCat] ?? []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                            style={{ background: item.photoBg }}
                          >
                            {item.photo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                              {item.tag && (
                                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">{item.tag}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mb-1">{item.desc}</p>
                            <p className="text-sm font-black text-red-600">¥{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => remItem(item.id)} className="w-8 h-8 rounded-full bg-white border border-red-200 text-red-500 font-bold text-base flex items-center justify-center">−</button>
                            <span className="w-4 text-center font-black text-gray-800 text-sm">{cart[item.id] ?? 0}</span>
                            <button onClick={() => addItem(item.id)} className="w-8 h-8 rounded-full bg-red-500 text-white font-bold text-base flex items-center justify-center">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {orderPlaced ? (
                      <div className="w-full py-4 rounded-xl bg-green-500 text-white font-bold text-sm text-center">
                        ✓ ご注文を受け付けました！
                      </div>
                    ) : (
                      <button
                        disabled={cartTotal === 0}
                        onClick={placeOrder}
                        className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform"
                      >
                        注文する{cartTotal > 0 ? `　¥${cartTotal.toLocaleString()}` : ''}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== WiFi ===== */}
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
                    className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold text-sm active:bg-sky-700"
                  >
                    {copied === 'pass' ? '✓ 接続済' : '接続'}
                  </button>
                </div>
              </div>
            )}

            {/* ===== クーポン ===== */}
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

            {/* ===== スタッフ呼び出し ===== */}
            {panel === 'staff' && (
              <div className="px-5 pb-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-4 mt-2">
                  <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                  </svg>
                </div>
                <h2 className="font-black text-gray-900 text-xl mb-1">スタッフを呼びますか？</h2>
                <p className="text-sm text-gray-400 mb-6">ボタンを押すとスタッフに通知が届きます</p>
                <button
                  onClick={() => { setPanel(null); setQuickAdded('スタッフに通知しました'); setTimeout(() => setQuickAdded(null), 2000) }}
                  className="w-full py-4 rounded-2xl bg-sky-500 text-white font-black text-base active:scale-95 transition-transform shadow-md shadow-sky-200"
                >
                  呼び出す
                </button>
              </div>
            )}

            {/* ===== お会計 ===== */}
            {panel === 'payment' && (
              <div className="px-5 pb-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 mt-2">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                  </svg>
                </div>
                <h2 className="font-black text-gray-900 text-xl mb-1">お会計</h2>
                <p className="text-sm text-gray-400 mb-4">スタッフにお会計をお伝えします</p>
                {cartCount > 0 && (
                  <div className="w-full bg-green-50 border border-green-100 rounded-xl p-4 mb-4 text-left">
                    <p className="text-xs text-green-600 font-semibold mb-1">注文合計</p>
                    <p className="text-2xl font-black text-green-700">¥{cartTotal.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{cartCount}点のご注文</p>
                  </div>
                )}
                <button
                  onClick={() => { setPanel(null); setQuickAdded('お会計の準備をします'); setTimeout(() => setQuickAdded(null), 2000) }}
                  className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-base active:scale-95 transition-transform shadow-md shadow-green-200"
                >
                  お会計をお願いする
                </button>
              </div>
            )}

            {/* ===== 店舗情報 ===== */}
            {panel === 'store' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">店舗情報</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">住所</p>
                      <p className="text-sm text-gray-700 font-medium">東京都渋谷区恵比寿1-2-3<br/>焼肉ビル 1F</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">電話番号</p>
                      <a href="tel:03-1234-5679" className="text-sm text-gray-700 font-medium">03-1234-5679</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">営業時間</p>
                      <p className="text-sm text-gray-700 font-medium">月〜金　17:00 – 24:00</p>
                      <p className="text-sm text-gray-700 font-medium">土・日　16:00 – 24:00</p>
                      <p className="text-xs text-gray-400 mt-1">定休日：毎週火曜日</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">アクセス</p>
                      <p className="text-sm text-gray-700 font-medium">JR恵比寿駅 東口より徒歩3分</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {barcode && <BarcodeModal code={barcode.code} title={barcode.title} onClose={() => setBarcode(null)} />}

      {/* ── 席番号入力モーダル ── */}
      {showTableModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-6" onClick={() => tableId && setShowTableModal(false)}>
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
              <h2 className="font-black text-gray-900 text-lg">席番号を入力</h2>
              <p className="text-sm text-gray-400 mt-1">テーブルのQRコードまたは席札の番号を入力してください</p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="例：3、A-2、カウンター1"
              value={tableInput}
              onChange={e => setTableInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveTableId()}
              autoFocus
              className="w-full border-2 border-gray-200 focus:border-red-400 rounded-xl px-4 py-3 text-center text-2xl font-black text-gray-800 outline-none mb-4 transition-colors"
            />
            <button
              onClick={saveTableId}
              disabled={!tableInput.trim()}
              className="w-full py-3.5 rounded-xl bg-red-500 text-white font-black text-base disabled:opacity-40 active:scale-95 transition-transform"
            >
              決定
            </button>
            {tableId && (
              <button onClick={() => setShowTableModal(false)} className="w-full mt-2 py-2.5 text-sm text-gray-400 font-semibold">
                キャンセル
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
