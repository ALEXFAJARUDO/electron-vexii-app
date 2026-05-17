'use client'
import { iconGradient } from '@/lib/colorLight'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { registerSW, requestPermission, notify } from '@/lib/webNotify'

type PanelId = 'floor1' | 'floor2' | 'food' | 'events' | 'map' | 'ad'
type OrderStatus = 'idle' | 'waiting' | 'ready' | 'ad'

const FLOOR1_SHOPS = [
  { name: 'ファッションABC', category: 'ファッション', hours: '10:00〜21:00', open: true },
  { name: 'シューズパーク', category: 'シューズ', hours: '10:00〜21:00', open: true },
  { name: 'コスメビューティー', category: 'コスメ', hours: '10:00〜20:00', open: true },
  { name: 'アクセサリーショップ', category: 'アクセサリー', hours: '10:00〜21:00', open: false },
]

const FLOOR2_SHOPS = [
  { name: '家電プラザ', category: '家電・PC', hours: '10:00〜21:00', open: true },
  { name: 'スポーツゾーン', category: 'スポーツ', hours: '10:00〜21:00', open: true },
  { name: 'ライフスタイルハウス', category: 'インテリア', hours: '10:00〜20:30', open: true },
  { name: 'ブック&カフェ', category: '書籍・雑貨', hours: '09:00〜22:00', open: true },
]

type FoodItem = { id: number; name: string; price: number; tag?: string }
type FoodStore = { id: string; name: string; emoji: string; color: string; bg: string; wait: number; image?: string; items: FoodItem[] }

const FOOD_STORES: FoodStore[] = [
  {
    id: 'sakura', name: '麺屋さくら', emoji: '🍜', color: '#ef4444', bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', wait: 12,
    items: [
      { id: 1, name: '醤油ラーメン', price: 900, tag: '人気' },
      { id: 2, name: '味噌ラーメン', price: 950 },
      { id: 3, name: '塩ラーメン', price: 880 },
      { id: 4, name: 'チャーシュー麺', price: 1200, tag: '特製' },
    ],
  },
  {
    id: 'spice', name: 'スパイスキッチン', emoji: '🍛', color: '#f97316', bg: 'linear-gradient(135deg,#7c2d12,#ea580c)', wait: 8,
    items: [
      { id: 5, name: 'ビーフカレー', price: 850, tag: '人気' },
      { id: 6, name: 'チキンカレー', price: 800 },
      { id: 7, name: 'ベジタブルカレー', price: 750 },
      { id: 8, name: 'ナンセット', price: 980 },
    ],
  },
  {
    id: 'burger', name: 'バーガーパーク', emoji: '🍔', color: '#ca8a04', bg: 'linear-gradient(135deg,#78350f,#ca8a04)', wait: 10,
    items: [
      { id: 9, name: 'チーズバーガーセット', price: 1100, tag: '人気' },
      { id: 10, name: 'テリヤキバーガーセット', price: 1050 },
      { id: 11, name: 'フィッシュバーガーセット', price: 980 },
      { id: 12, name: 'ポテト単品 (L)', price: 350 },
    ],
  },
  {
    id: 'italiano', name: 'イタリアーノ', emoji: '🍝', color: '#16a34a', bg: 'linear-gradient(135deg,#14532d,#16a34a)', wait: 15,
    items: [
      { id: 13, name: 'ナポリタン', price: 1100, tag: '人気' },
      { id: 14, name: 'カルボナーラ', price: 1200 },
      { id: 15, name: 'ペペロンチーノ', price: 1050 },
      { id: 16, name: 'パスタランチセット', price: 1400, tag: 'おすすめ' },
    ],
  },
  {
    id: 'sushi', name: 'テイクアウト寿司', emoji: '🍣', color: '#0284c7', bg: 'linear-gradient(135deg,#0c4a6e,#0284c7)', wait: 5,
    items: [
      { id: 17, name: '特上にぎり (8貫)', price: 1800, tag: '人気' },
      { id: 18, name: 'サーモン盛り (6貫)', price: 1200 },
      { id: 19, name: '海鮮巻き', price: 980 },
      { id: 20, name: 'いなり寿司セット', price: 650 },
    ],
  },
]

const EVENTS = [
  { id: 1, title: '春のファッションフェア', date: '5/15〜5/25', floor: '1F', tag: '開催中' },
  { id: 2, title: 'キッズ体験ワークショップ', date: '5/18 (日) 14:00', floor: '2F', tag: '近日' },
  { id: 3, title: 'グルメフェスタ', date: '5/20〜5/31', floor: '3F', tag: '近日' },
  { id: 4, title: 'アーティストライブ', date: '6/1 (日) 13:00', floor: '1F広場', tag: '近日' },
]

export default function MallPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle')
  const [countdown, setCountdown] = useState(0)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [selectedStore, setSelectedStore] = useState<string>(FOOD_STORES[0].id)
  const [selectedFood, setSelectedFood] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    registerSW()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  async function placeOrder() {
    if (selectedFood === null) return

    const canNotify = await requestPermission()
    const num = Math.floor(Math.random() * 900) + 100
    const store = FOOD_STORES.find((s) => s.id === selectedStore)!
    const foodItem = store.items.find((i) => i.id === selectedFood)!
    const item = { ...foodItem, wait: store.wait, price: `¥${foodItem.price.toLocaleString()}` }
    setOrderNumber(num)
    setOrderStatus('waiting')

    // Service Worker 経由でバックグラウンド通知をスケジュール
    if (canNotify) {
      notify(
        'お食事の準備ができました！',
        `番号札 ${num} のお食事をカウンターでお受け取りください`,
        item.wait,
        { tag: `food-${num}`, requireInteraction: true }
      )
    }

    let remaining = item.wait
    setCountdown(remaining)

    timerRef.current = setInterval(() => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current!)
        setOrderStatus('ready')
      }
    }, 1000)
  }

  function resetOrder() {
    if (timerRef.current) clearInterval(timerRef.current)
    setOrderStatus('idle')
    setCountdown(0)
    setOrderNumber(null)
    setSelectedFood(null)
  }

  function closePanel() {
    setPanel(null)
  }

  const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; icon: React.ReactNode }[] = [
    {
      id: 'floor1',
      label: '1F店舗情報',
      desc: 'ファッション・コスメ',
      color: '#0ea5e9',
      bg: '#f0f9ff',
      border: '#bae6fd',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
        </svg>
      ),
    },
    {
      id: 'floor2',
      label: '2F店舗情報',
      desc: '家電・スポーツ・書籍',
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
      id: 'food',
      label: '3Fフードコート',
      desc: '注文→スマホ通知',
      color: '#f97316',
      bg: '#fff7ed',
      border: '#fed7aa',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/>
        </svg>
      ),
    },
    {
      id: 'events',
      label: 'イベント情報',
      desc: '館内イベント・特典',
      color: '#eab308',
      bg: '#fefce8',
      border: '#fde68a',
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/>
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
          <div className="h-full max-w-lg mx-auto w-full px-3 flex items-center gap-2.5">
            <Link href="/">
              <div style={{ width: '144px', height: '38px', backgroundImage: 'url(/mall-logo.png)', backgroundSize: '170%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }} />
            </Link>
          </div>
        </header>

        {/* 2-col × 3-row grid */}
        <div className="flex-1 max-w-lg mx-auto w-full p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-[15px]">
          {/* ヒーロー画像 */}
          <div className="col-span-2 rounded-2xl overflow-hidden shrink-0" style={{ height: '25vh' }}>
            <img src="/mall-hero.png" alt="Food Court" className="w-full h-full object-cover" />
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
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">1F 店舗情報</h2>
                </div>
                <div className="space-y-2">
                  {FLOOR1_SHOPS.map((shop) => (
                    <div key={shop.name} className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm">{shop.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${shop.open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {shop.open ? '営業中' : '準備中'}
                          </span>
                        </div>
                        <p className="text-xs text-sky-500 font-semibold">{shop.category}</p>
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

            {/* 3Fフードコート */}
            {panel === 'food' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">3F フードコート</h2>
                </div>

                {/* 通知バナー */}
                <div className="mb-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                  </svg>
                  <p className="text-xs text-orange-600 font-semibold">注文後、できあがったらスマホに通知が届きます</p>
                </div>

                {orderStatus === 'idle' && (
                  <>
                    {/* 店舗カードグリッド */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {FOOD_STORES.map((store) => {
                        const isSelected = selectedStore === store.id
                        return (
                          <button
                            key={store.id}
                            onClick={() => { setSelectedStore(store.id); setSelectedFood(null) }}
                            className={`rounded-2xl overflow-hidden text-left transition-all active:scale-95 ${
                              isSelected ? 'ring-2 ring-orange-400 shadow-md' : 'shadow-sm'
                            }`}
                          >
                            {/* 画像エリア */}
                            <div
                              className="w-full flex items-center justify-center"
                              style={{ background: store.bg, height: '80px' }}
                            >
                              {store.image
                                ? <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                                : <span className="text-5xl">{store.emoji}</span>
                              }
                            </div>
                            {/* 店舗名 */}
                            <div className={`px-3 py-2 ${isSelected ? 'bg-orange-50' : 'bg-white'}`}>
                              <p className="font-bold text-gray-800 text-xs leading-tight">{store.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">待ち約{store.wait}分</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* 選択中店舗のメニュー */}
                    {FOOD_STORES.filter((s) => s.id === selectedStore).map((store) => (
                      <div key={store.id} className="mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{store.name} のメニュー</p>
                        <div className="space-y-2">
                          {store.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setSelectedFood(item.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                selectedFood === item.id
                                  ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-300'
                                  : 'bg-white border-gray-100 hover:bg-orange-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                {item.tag && (
                                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">{item.tag}</span>
                                )}
                              </div>
                              <p className="font-bold text-gray-700 text-sm">¥{item.price.toLocaleString()}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={placeOrder}
                      disabled={selectedFood === null}
                      className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 active:bg-orange-700"
                    >
                      注文してスマホ通知を受け取る
                    </button>
                  </>
                )}

                {orderStatus === 'waiting' && (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 rounded-full bg-orange-50 border-4 border-orange-200 flex items-center justify-center mx-auto mb-4">
                      <p className="text-2xl font-black text-orange-500">{countdown}</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">番号札</p>
                    <p className="text-4xl font-black text-gray-800 mb-2">{orderNumber}</p>
                    <p className="text-sm text-gray-500 mb-1">お食事を準備中です...</p>
                    <p className="text-xs text-orange-500">できあがったらスマホに通知が届きます</p>
                    <button onClick={resetOrder} className="mt-6 text-xs text-gray-300 underline">キャンセル</button>
                  </div>
                )}

                {orderStatus === 'ready' && (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-300 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">番号札</p>
                    <p className="text-4xl font-black text-gray-800 mb-3">{orderNumber}</p>
                    <p className="font-bold text-green-600 text-lg mb-1">お食事の準備ができました！</p>
                    <p className="text-sm text-gray-400 mb-6">カウンターでお受け取りください</p>
                    <button
                      onClick={resetOrder}
                      className="px-8 py-3 rounded-xl bg-green-500 text-white font-bold text-sm"
                    >
                      完了
                    </button>
                  </div>
                )}
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

                {/* Floor selector */}
                <div className="flex gap-2 mb-4">
                  {['1F', '2F', '3F'].map((f) => (
                    <button
                      key={f}
                      className="flex-1 py-2 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-sm font-bold active:scale-95 transition-transform"
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl bg-violet-50 border border-violet-100 aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-violet-200 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                    <p className="text-violet-400 text-sm font-semibold">フロアマップ表示エリア</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['トイレ', 'エレベーター', 'エスカレーター', '授乳室', 'ATM', '救護室'].map((loc) => (
                    <button
                      key={loc}
                      className="py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold active:scale-95 transition-transform"
                    >
                      {loc}
                    </button>
                  ))}
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
    </>
  )
}
