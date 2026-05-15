'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { registerSW, requestPermission, notify } from '@/lib/webNotify'

type PanelId = 'order' | 'app' | 'wifi' | 'coupon' | 'info' | 'points' | 'seat'
type DrinkTab = 'hot' | 'iced' | 'food'

const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; badge?: string; icon: React.ReactNode }[] = [
  {
    id: 'order', label: 'モバイルオーダー', desc: '席から事前注文', color: '#92400e', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>,
  },
  {
    id: 'app', label: 'アプリダウンロード', desc: '公式アプリを取得', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', badge: 'NEW',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>,
  },
  {
    id: 'wifi', label: 'WiFi接続', desc: '無料WiFiに接続', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>,
  },
  {
    id: 'coupon', label: 'クーポン', desc: 'お得な特典をゲット', color: '#dc2626', bg: '#fff1f2', border: '#fecdd3',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>,
  },
  {
    id: 'info', label: '店舗情報', desc: '営業時間・アクセス', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/></svg>,
  },
  {
    id: 'points', label: 'ポイント・会員', desc: '貯めて使えるポイント', color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>,
  },
  {
    id: 'seat', label: '充電・席管理', desc: '充電状況・座席', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', badge: '⚡',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
]

const MENU: Record<DrinkTab, { id: number; name: string; desc: string; price: number; tag?: string }[]> = {
  hot: [
    { id: 1,  name: 'エスプレッソ',     desc: '濃厚なシングルショット',          price: 320 },
    { id: 2,  name: 'カフェラテ',       desc: 'まろやかなミルクとエスプレッソ',   price: 480, tag: '人気' },
    { id: 3,  name: 'カプチーノ',       desc: 'ふわふわフォームミルク',           price: 480 },
    { id: 4,  name: 'カフェアメリカーノ', desc: 'すっきりした飲み口',             price: 400 },
    { id: 5,  name: '抹茶ラテ',         desc: '国産抹茶使用',                   price: 520, tag: 'NEW' },
    { id: 6,  name: 'チャイラテ',       desc: 'スパイシーなインドの香り',         price: 520 },
    { id: 7,  name: 'ほうじ茶ラテ',     desc: '香ばしい和の一杯',               price: 500 },
  ],
  iced: [
    { id: 11, name: 'アイスラテ',       desc: 'ミルクたっぷり冷たいラテ',        price: 510, tag: '人気' },
    { id: 12, name: 'アイスアメリカーノ', desc: 'さっぱりとしたアイスコーヒー',    price: 430 },
    { id: 13, name: 'アイス抹茶ラテ',   desc: '冷たい抹茶の味わい',             price: 550, tag: 'NEW' },
    { id: 14, name: 'フラペチーノ',     desc: 'クリームのせブレンド',            price: 650 },
    { id: 15, name: 'ソイラテ (ICE)',   desc: 'ヘルシーな豆乳ラテ',             price: 560 },
    { id: 16, name: 'スムージー',       desc: '旬のフルーツ使用',               price: 620 },
  ],
  food: [
    { id: 21, name: 'クロワッサン',     desc: 'バター香るサクサク生地',          price: 280, tag: '人気' },
    { id: 22, name: 'スコーン',         desc: 'クロテッドクリーム添え',          price: 320 },
    { id: 23, name: 'ブルーベリーマフィン', desc: '大粒ブルーベリー入り',         price: 350 },
    { id: 24, name: 'サンドイッチ',     desc: 'チキン&アボカド',                price: 580, tag: 'NEW' },
    { id: 25, name: 'ベーグル',         desc: 'クリームチーズ添え',              price: 480 },
    { id: 26, name: 'チーズケーキ',     desc: 'なめらかなニューヨーク風',        price: 420 },
    { id: 27, name: 'シナモンロール',   desc: 'ふわふわ焼きたて',               price: 380 },
  ],
}

const COUPONS = [
  { id: 1, title: '本日限定！ドリンク100円引き', code: 'CAFE100', exp: '本日23:59まで', tag: '本日限定' },
  { id: 2, title: 'フードと一緒でラテ50円引き', code: 'SETOFF', exp: '2026/05/31まで', tag: 'セット割' },
  { id: 3, title: 'ポイント2倍デー', code: 'PT2X', exp: '2026/05/17まで', tag: 'ポイント' },
]

export default function CafePage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [tab, setTab] = useState<DrinkTab>('hot')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [wifiCopied, setWifiCopied] = useState(false)
  const [chargePercent] = useState(54)

  const seatNo = 'A-05'

  useEffect(() => { registerSW() }, [])

  const allItems = Object.values(MENU).flat()
  const cartTotal = allItems.reduce((s, i) => s + (cart[i.id] ?? 0) * i.price, 0)
  const cartCount = allItems.reduce((s, i) => s + (cart[i.id] ?? 0), 0)

  function add(id: number) { setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function rem(id: number) { setCart((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }

  async function placeOrder() {
    const canNotify = await requestPermission()
    setOrderPlaced(true)
    if (canNotify) {
      notify(
        'ご注文の準備ができました ☕',
        `席番号 ${seatNo} のご注文をカウンターでお受け取りください`,
        8,
        { tag: 'cafe-order', requireInteraction: true }
      )
    }
    setTimeout(() => {
      setCart({})
      setOrderPlaced(false)
      setPanel(null)
    }, 3000)
  }

  function copyWifi() {
    navigator.clipboard.writeText('CafeVexii_Free').catch(() => {})
    setWifiCopied(true)
    setTimeout(() => setWifiCopied(false), 2000)
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
          <span className="text-sm font-semibold text-gray-500">☕ カフェ</span>
          {cartCount > 0 && (
            <button onClick={() => setPanel('order')} className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1">
              <span className="text-xs font-black text-amber-700">カート {cartCount}点</span>
            </button>
          )}
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-3">
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
              <div className="w-12 h-12 rounded-xl flex items-center justify-center neu-icon" style={{ background: btn.bg, color: btn.color }}>
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
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4"/>

            {/* モバイルオーダー */}
            {panel === 'order' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">モバイルオーダー</h2>
                <div className="flex items-center gap-1.5 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <span className="text-amber-600 text-sm">☕</span>
                  <p className="text-xs font-bold text-amber-700">席番号 {seatNo} · できたらスマホに通知</p>
                </div>

                {/* タブ */}
                <div className="flex gap-1.5 mb-4">
                  {([['hot', '🔥 HOT'], ['iced', '🧊 ICED'], ['food', '🥐 フード']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${tab === key ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  {MENU[tab].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                          {item.tag && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold shrink-0">{item.tag}</span>}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>
                        <p className="text-xs font-bold text-amber-700 mt-0.5">¥{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => rem(item.id)} className="w-7 h-7 rounded-full bg-white border border-amber-200 text-amber-600 font-bold flex items-center justify-center">−</button>
                        <span className="w-4 text-center font-bold text-gray-800 text-sm">{cart[item.id] ?? 0}</span>
                        <button onClick={() => add(item.id)} className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">+</button>
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
                    className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform"
                  >
                    注文する（できたら通知）{cartTotal > 0 ? `　¥${cartTotal.toLocaleString()}` : ''}
                  </button>
                )}
              </div>
            )}

            {/* アプリダウンロード */}
            {panel === 'app' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">アプリダウンロード</h2>

                {/* App brand card */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 mb-5 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-lg">
                      ☕
                    </div>
                    <div>
                      <p className="font-black text-xl leading-tight">カフェ公式アプリ</p>
                      <p className="text-xs opacity-70 mt-0.5">Cafe Official App</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {'★★★★★'.split('').map((s, i) => (
                          <span key={i} className="text-yellow-300 text-xs">{s}</span>
                        ))}
                        <span className="text-xs opacity-60 ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {['モバイルオーダーで待ち時間ゼロ', 'ポイントが200円ごとに1pt貯まる', '会員限定クーポンが毎月届く', 'お気に入りのオーダーを記憶'].map((benefit) => (
                      <p key={benefit} className="text-xs opacity-90">✓ {benefit}</p>
                    ))}
                  </div>
                </div>

                {/* Download buttons */}
                <div className="space-y-3 mb-5">
                  <button className="w-full flex items-center gap-4 px-5 py-4 bg-black text-white rounded-2xl active:scale-95 transition-transform">
                    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] opacity-70">Download on the</p>
                      <p className="font-bold text-base leading-tight">App Store</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 px-5 py-4 bg-black text-white rounded-2xl active:scale-95 transition-transform">
                    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.18 23.76c.3.17.64.19.96.07L14.76 12 3.97.17C3.65.05 3.3.07 3 .24 2.38.6 2 1.33 2 2.2v19.6c0 .87.38 1.6 1 1.96zM16.54 13.78l2.76-2.76-2.76-2.76-3.01 3.01 3.01 2.51zM20.68 8.84L17.2 7.03l-3.39 3.39 3.26 3.26 3.5-1.82a2 2 0 00.03-3.02zM4.17 1.18L15.04 12 4.17 22.82 4 22.6V1.4l.17-.22z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] opacity-70">Get it on</p>
                      <p className="font-bold text-base leading-tight">Google Play</p>
                    </div>
                  </button>
                </div>

                {/* QR code */}
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <div className="grid grid-cols-5 gap-0.5">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-[2px] ${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24,7,12,17].includes(i) ? 'bg-gray-800' : 'bg-gray-100'}`}/>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-1">QRコードでダウンロード</p>
                    <p className="text-xs text-gray-400 leading-relaxed">カメラアプリでQRコードを読み取るとアプリストアに移動します</p>
                  </div>
                </div>
              </div>
            )}

            {/* WiFi接続 */}
            {panel === 'wifi' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">WiFi接続</h2>
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-6">
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl px-4 py-3 border border-violet-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">ネットワーク名 (SSID)</p>
                      <p className="font-mono font-bold text-gray-800">CafeVexii_Free</p>
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 border border-violet-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">パスワード</p>
                      <p className="font-mono font-bold text-gray-800">cafe2026vexii</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={copyWifi}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 active:scale-95 ${wifiCopied ? 'bg-green-500 text-white' : 'bg-violet-500 text-white hover:bg-violet-600'}`}
                >
                  {wifiCopied ? '✓ コピーしました' : '接続'}
                </button>
              </div>
            )}

            {/* クーポン */}
            {panel === 'coupon' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">クーポン</h2>
                <div className="space-y-3">
                  {COUPONS.map((c) => (
                    <div key={c.id} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold text-gray-800 text-sm leading-tight flex-1 mr-2">{c.title}</p>
                        <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold shrink-0">{c.tag}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{c.exp}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">コード: <span className="font-mono text-red-700 font-bold">{c.code}</span></p>
                        <button
                          onClick={() => navigator.clipboard.writeText(c.code).catch(() => {})}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold"
                        >
                          使う
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 店舗情報 */}
            {panel === 'info' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">店舗情報</h2>
                <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4 mb-4">
                  <p className="font-bold text-gray-800 mb-3">Cafe Vexii</p>
                  <div className="space-y-2">
                    {[
                      { label: '営業時間', value: '7:00〜22:00 (年中無休)' },
                      { label: '電話番号', value: '03-0000-0000' },
                      { label: '席数',     value: '42席 (喫煙不可)' },
                      { label: 'Wi-Fi',    value: '無料提供' },
                      { label: 'コンセント', value: '全席完備' },
                      { label: 'PayPay',   value: '利用可' },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between py-1.5 border-b border-cyan-100 last:border-none text-sm">
                        <span className="text-gray-400">{row.label}</span>
                        <span className="font-semibold text-gray-700">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-cyan-50 border border-cyan-100 aspect-video flex items-center justify-center">
                  <p className="text-cyan-300 text-sm font-semibold">地図表示エリア</p>
                </div>
              </div>
            )}

            {/* ポイント・会員 */}
            {panel === 'points' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">ポイント・会員</h2>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">会員ランク</p>
                  <p className="font-black text-2xl mb-3">☕ ゴールド会員</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70">保有ポイント</p>
                      <p className="font-black text-3xl">1,280 pt</p>
                    </div>
                    <p className="text-xs opacity-60">次のランクまで 220pt</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
                  <p className="text-sm font-bold text-gray-700 mb-2">ポイント履歴</p>
                  {[
                    { date: '05/15', item: 'カフェラテ', pt: '+3pt' },
                    { date: '05/14', item: 'スコーン + アメリカーノ', pt: '+8pt' },
                    { date: '05/12', item: '抹茶ラテ', pt: '+3pt' },
                  ].map((row) => (
                    <div key={row.date} className="flex items-center justify-between py-2 border-b border-amber-100 last:border-none text-sm">
                      <div>
                        <p className="text-[10px] text-gray-400">{row.date}</p>
                        <p className="font-semibold text-gray-700">{row.item}</p>
                      </div>
                      <p className="font-bold text-amber-600">{row.pt}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3.5 rounded-xl bg-amber-500 text-white font-bold text-sm">
                  ポイントを使う
                </button>
              </div>
            )}

            {/* 充電・席管理 */}
            {panel === 'seat' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">充電・席管理</h2>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">現在の座席</p>
                  <p className="font-black text-4xl mb-1">{seatNo}</p>
                  <p className="text-xs opacity-60">窓際席 · コンセント利用中</p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">充電状況</p>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">充電中 ⚡</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full" style={{ width: `${chargePercent}%` }}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{chargePercent}% · 残り約50分で満充電</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '注文する', icon: '☕', action: () => setPanel('order') },
                    { label: 'クーポン', icon: '🎟', action: () => setPanel('coupon') },
                    { label: 'ポイント確認', icon: '⭐', action: () => setPanel('points') },
                    { label: 'アプリDL', icon: '📱', action: () => setPanel('app') },
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
