'use client'
import { iconGradient } from '@/lib/colorLight'
import { useState } from 'react'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'

type PanelId = 'wifi' | 'coupons' | 'order' | 'ad'
type OrderItem = { id: number; name: string; desc: string; price: number; photo: string; photoBg: string; tag?: string }

const DEMO_WIFI = { ssid: 'RESTAURANT_WIFI', password: 'dinner2024' }

const COUPONS = [
  { id: 1, title: 'ランチセット 100円引き', code: 'LUNCH100', expires: '2026/05/31' },
  { id: 2, title: 'ドリンク1杯無料', code: 'DRINK', expires: '2026/05/25' },
  { id: 3, title: 'デザート 30%OFF', code: 'DESSERT30', expires: '2026/06/30' },
]

const ORDER_MENU: Record<string, OrderItem[]> = {
  speed: [
    { id: 101, name: 'キムチ',   desc: '辛さ3段階から選択',             price: 380,  photo: '🥬', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 102, name: '枝豆',     desc: '塩ゆでほくほく',                 price: 280,  photo: '🫛', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { id: 103, name: 'お漬物',   desc: '季節の野菜盛り合わせ',           price: 320,  photo: '🥒', photoBg: 'linear-gradient(135deg,#65a30d,#4d7c0f)' },
    { id: 104, name: 'たこわさ', desc: '新鮮タコとわさびの絶妙な相性',   price: 480,  photo: '🐙', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
  ],
  recommend: [
    { id: 201, name: '刺身7種盛り',   desc: '本日の鮮魚7種',            price: 1980, photo: '🐟', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', tag: '人気' },
    { id: 202, name: '鴨ロースト',    desc: '特製ソース仕立て',          price: 1480, photo: '🦆', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', tag: 'NEW' },
    { id: 203, name: '厚切り塩タン', desc: 'レモン添え・柔らか仕上げ',  price: 1280, photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#991b1b)' },
    { id: 204, name: '神戸牛ステーキ', desc: 'A5ランク神戸牛',          price: 4800, photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', tag: '特選' },
    { id: 205, name: 'サムゲタン',    desc: '国産鶏の参鶏湯',           price: 1580, photo: '🍲', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
  ],
  salad: [
    { id: 301, name: 'わかめサラダ', desc: 'ごま油香るポン酢ドレッシング',       price: 480, photo: '🥗', photoBg: 'linear-gradient(135deg,#059669,#047857)' },
    { id: 302, name: 'シーザーサラダ', desc: 'パルメザンチーズたっぷり',         price: 580, photo: '🥗', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)', tag: '人気' },
    { id: 303, name: 'チキンサラダ',  desc: 'グリルチキン & ハニーマスタード', price: 680, photo: '🥗', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
    { id: 304, name: '韓国風サラダ',  desc: 'コチュジャンドレッシング',          price: 580, photo: '🥗', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
  ],
  main: [
    { id: 401, name: 'ローストビーフ',    desc: '特製グレービーソース',       price: 1680, photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', tag: '人気' },
    { id: 402, name: 'マグロ釜焼き',     desc: '赤身のぶつ切り釜焼き',       price: 1480, photo: '🐟', photoBg: 'linear-gradient(135deg,#1d4ed8,#1e40af)' },
    { id: 403, name: 'ジューシーチキン', desc: 'スパイス丸鶏焼き',            price: 1280, photo: '🍗', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
    { id: 404, name: '串カツ盛り合わせ', desc: '5本盛り・ソース/塩から選択', price:  980, photo: '🍢', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', tag: 'NEW' },
  ],
  drink: [
    { id: 501, name: 'ビール',    desc: '生ビール・中ジョッキ',          price: 580, photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)',  tag: '人気' },
    { id: 502, name: 'ハイボール', desc: 'ウイスキーソーダ割り',          price: 480, photo: '🥃', photoBg: 'linear-gradient(135deg,#475569,#334155)' },
    { id: 503, name: '酎ハイ',    desc: 'レモン・グレープフルーツ・梅',   price: 480, photo: '🍹', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
    { id: 504, name: '日本酒',    desc: '季節の地酒・1合',               price: 680, photo: '🍶', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)' },
    { id: 505, name: '焼酎',      desc: '芋/麦/米・ロック/水割り',       price: 580, photo: '🥃', photoBg: 'linear-gradient(135deg,#1e40af,#1d4ed8)' },
  ],
}

const ALL_ITEMS = Object.values(ORDER_MENU).flat()

const ORDER_CATEGORIES = [
  {
    id: 'speed', label: 'スピードメニュー', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
  {
    id: 'recommend', label: 'おすすめ', color: '#eab308', bg: '#fefce8', border: '#fde68a',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>,
  },
  {
    id: 'salad', label: 'サラダ', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/></svg>,
  },
  {
    id: 'main', label: 'メイン', color: '#ef4444', bg: '#fff1f2', border: '#fecdd3',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/></svg>,
  },
  {
    id: 'drink', label: 'ドリンク', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.16 2.798H3.96c-1.19 0-2.16-1.798-1.16-2.798L4 15.3"/></svg>,
  },
  {
    id: 'history', label: '注文履歴', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>,
  },
]

const CAT_LABEL: Record<string, string> = {
  speed: 'スピードメニュー', recommend: 'おすすめ', salad: 'サラダ',
  main: 'メイン', drink: 'ドリンク',
}

export default function RestaurantPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [copied, setCopied] = useState<'ssid' | 'pass' | null>(null)
  const [barcode, setBarcode] = useState<{ code: string; title: string } | null>(null)
  const [orderCat, setOrderCat] = useState<string | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [orderPlaced, setOrderPlaced] = useState(false)

  const cartTotal = ALL_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0) * i.price, 0)
  const cartCount = ALL_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0), 0)

  function addItem(id: number) { setCart(p => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function remItem(id: number) { setCart(p => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }

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
              <img src="/restaurant-logo.png" alt="翠旬 Suishun" style={{ height: '40px', width: 'auto' }} />
            </Link>
            <span className="ml-auto text-sm font-semibold text-gray-500">飲食店</span>
            {cartCount > 0 && (
              <button onClick={() => setPanel('order')} className="ml-2 flex items-center gap-1.5 bg-orange-50 border border-orange-300 rounded-lg px-2.5 py-1">
                <span className="text-xs font-black text-orange-700">カート {cartCount}点</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 max-w-lg mx-auto w-full p-3 pb-6 flex flex-col gap-[15px]">
          {/* ヒーロー画像 */}
          <div className="rounded-2xl overflow-hidden shrink-0" style={{ height: '25vh' }}>
            <img
              src="/restaurant-hero.png"
              alt="翠旬 Suishun"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
            {/* モバイルオーダー — full width */}
            <button
              onClick={() => setPanel('order')}
              className="card-light col-span-2 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 py-5 min-h-[110px]"
              style={{ background: '#fff3e0' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center neu-icon" style={{ background: iconGradient('#f97316'), color: '#ffffff' }}>
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <p className="font-black text-orange-700 text-base leading-tight text-center">モバイルオーダー</p>
              <p className="text-xs text-orange-400 text-center leading-tight">席から事前注文</p>
            </button>

            {/* WiFi */}
            <button
              onClick={() => setPanel('wifi')}
              className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3 min-h-[110px]"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center neu-icon" style={{ background: iconGradient('#0ea5e9'), color: '#ffffff' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                </svg>
              </div>
              <p className="font-bold text-gray-800 text-xs leading-tight text-center">WiFi接続</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">フリーWiFiに接続</p>
            </button>

            {/* クーポン */}
            <button
              onClick={() => setPanel('coupons')}
              className="card-light flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform duration-150 p-3 min-h-[110px]"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center neu-icon" style={{ background: iconGradient('#22c55e'), color: '#ffffff' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
              </div>
              <p className="font-bold text-gray-800 text-xs leading-tight text-center">お得なクーポン</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">割引クーポンを見る</p>
            </button>
          </div>

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
                {/* カテゴリ一覧 */}
                {!orderCat && (
                  <div className="px-5">
                    <h2 className="font-bold text-gray-900 text-lg mb-4">モバイルオーダー</h2>
                    {cartCount > 0 && (
                      <div className="flex items-center gap-2 mb-4 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                        <span className="text-orange-500 text-sm">🛒</span>
                        <p className="text-xs font-bold text-orange-700 flex-1">カートに {cartCount}点（¥{cartTotal.toLocaleString()}）</p>
                        <button onClick={placeOrder} className="text-xs px-3 py-1 bg-orange-500 text-white rounded-lg font-bold">注文する</button>
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

                {/* 商品一覧 */}
                {orderCat && orderCat !== 'history' && (
                  <div className="px-5">
                    {/* ヘッダー */}
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

                    {/* 商品カード */}
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
                                <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">{item.tag}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mb-1">{item.desc}</p>
                            <p className="text-sm font-black text-orange-600">¥{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => remItem(item.id)} className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-500 font-bold text-base flex items-center justify-center">−</button>
                            <span className="w-4 text-center font-black text-gray-800 text-sm">{cart[item.id] ?? 0}</span>
                            <button onClick={() => addItem(item.id)} className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-base flex items-center justify-center">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 注文ボタン */}
                    {orderPlaced ? (
                      <div className="w-full py-4 rounded-xl bg-green-500 text-white font-bold text-sm text-center">
                        ✓ ご注文を受け付けました！
                      </div>
                    ) : (
                      <button
                        disabled={cartTotal === 0}
                        onClick={placeOrder}
                        className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform"
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.75 0 01.75 0z"/>
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

            {/* ===== 広告 ===== */}
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
