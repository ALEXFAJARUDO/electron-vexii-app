'use client'
import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'
import {
  MENU_SECTIONS, ALL_MENU_ITEMS, submitOrder, fetchOrders, subscribeOrders, timeAgo,
  type RestaurantOrder, type MenuEntry,
} from '@/lib/restaurantOrder'

const QUICK_DRINKS = [
  { id: 501, label: 'とりあえず\n生ビール', emoji: '🍺', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { id: 502, label: 'ハイボール',           emoji: '🥃', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
  { id: 506, label: 'レモンサワー',         emoji: '🍋', color: '#ca8a04', bg: '#fefce8', border: '#fef08a' },
]

const DEMO_WIFI = { ssid: 'SUISHUN_WIFI', password: 'suishun2024' }

const COUPONS = [
  { id: 1, title: 'ランチセット 100円引き', code: 'LUNCH100', expires: '2026/05/31' },
  { id: 2, title: 'ドリンク1杯無料',       code: 'DRINK',    expires: '2026/05/25' },
  { id: 3, title: 'デザート 30%OFF',       code: 'DESSERT30', expires: '2026/06/30' },
]

type ServicePanel = 'coupon' | 'wifi' | 'store' | null

const STATUS_COLOR: Record<string, string> = {
  '未対応': 'bg-red-100 text-red-700',
  '調理中': 'bg-amber-100 text-amber-700',
  '提供済み': 'bg-green-100 text-green-700',
}

export default function TablePage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params)

  const [activeSection, setActiveSection] = useState('drink')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [history, setHistory] = useState<RestaurantOrder[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [servicePanel, setServicePanel] = useState<ServicePanel>(null)
  const [barcode, setBarcode] = useState<{ code: string; title: string } | null>(null)
  const [wifiCopied, setWifiCopied] = useState(false)

  const cartItems = ALL_MENU_ITEMS.filter(i => (cart[i.id] ?? 0) > 0)
  const cartTotal = ALL_MENU_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0) * i.price, 0)
  const cartCount = ALL_MENU_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0), 0)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const loadHistory = useCallback(async () => {
    setHistory(await fetchOrders(tableId))
  }, [tableId])

  useEffect(() => {
    loadHistory()
    return subscribeOrders(loadHistory)
  }, [loadHistory])

  function add(id: number) { setCart(p => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function rem(id: number) { setCart(p => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }

  function quickAdd(id: number, name: string) {
    add(id)
    showToast(`${name} をカートに追加`)
  }

  async function placeOrder() {
    if (cartItems.length === 0) return
    setSubmitting(true)
    try {
      const drinkItems = cartItems.filter(i => i.category === 'drink').map(i => ({ id: i.id, name: i.name, price: i.price, qty: cart[i.id], category: i.category as 'drink' | 'food' }))
      const foodItems  = cartItems.filter(i => i.category === 'food').map(i => ({ id: i.id, name: i.name, price: i.price, qty: cart[i.id], category: i.category as 'drink' | 'food' }))
      const promises = []
      if (drinkItems.length > 0) {
        const total = drinkItems.reduce((s, i) => s + i.price * i.qty, 0)
        promises.push(submitOrder({ table_id: tableId, items: drinkItems, status: '未対応', type: 'order', total }))
      }
      if (foodItems.length > 0) {
        const total = foodItems.reduce((s, i) => s + i.price * i.qty, 0)
        promises.push(submitOrder({ table_id: tableId, items: foodItems, status: '未対応', type: 'order', total }))
      }
      await Promise.all(promises)
      setCart({})
      showToast('ご注文を受け付けました！')
      loadHistory()
    } finally {
      setSubmitting(false)
    }
  }

  async function copyWifi() {
    try { await navigator.clipboard.writeText(DEMO_WIFI.password) } catch {}
    setWifiCopied(true)
    setTimeout(() => setWifiCopied(false), 2000)
  }

  async function callStaff() {
    await submitOrder({ table_id: tableId, items: [], status: '未対応', type: 'staff_call', total: 0 })
    showToast('スタッフに通知しました')
    loadHistory()
  }

  async function requestPayment() {
    await submitOrder({ table_id: tableId, items: [], status: '未対応', type: 'payment', total: 0 })
    showToast('お会計の準備をします')
    loadHistory()
  }

  const currentSection = MENU_SECTIONS.find(s => s.id === activeSection)

  return (
    <div className="min-h-dvh bg-[#edf1f7] flex flex-col pb-28">

      {/* ── Header ── */}
      <header className="neu-header py-3 shrink-0 sticky top-0 z-30">
        <div className="max-w-lg mx-auto w-full px-3 flex items-center gap-2.5">
          <Link href="/restaurant">
            <img src="/restaurant-logo.png" alt="翠旬" style={{ height: 36, width: 'auto' }} />
          </Link>
          <span className="ml-auto text-xs font-semibold text-gray-500">飲食店</span>
          <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
            テーブル {tableId}
          </span>
          {cartCount > 0 && (
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="flex items-center gap-1 bg-orange-50 border border-orange-300 rounded-lg px-2.5 py-1"
            >
              <span className="text-xs font-black text-orange-700">🛒 {cartCount}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      <div className="flex-1 max-w-lg mx-auto w-full px-3 pt-3 flex flex-col gap-3">

        {/* ── Hero ── */}
        <div className="rounded-2xl overflow-hidden shrink-0" style={{ height: '18vh' }}>
          <img src="/restaurant-hero.png" alt="翠旬" className="w-full h-full object-cover" />
        </div>

        {/* ── クイックドリンク ── */}
        <div className="card-light rounded-2xl p-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">⚡ クイック注文</p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_DRINKS.map(d => (
              <button
                key={d.id}
                onClick={() => quickAdd(d.id, d.label.replace('\n', ''))}
                className="flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 active:scale-95 transition-transform border"
                style={{ background: d.bg, borderColor: d.border }}
              >
                <span className="text-2xl leading-none">{d.emoji}</span>
                <span className="text-[10px] font-bold text-center leading-tight whitespace-pre-line" style={{ color: d.color }}>{d.label}</span>
                <span className="text-[9px] text-gray-400 bg-white/80 px-1.5 rounded-full">1タップ</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── カテゴリタブ ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3">
          {MENU_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                activeSection === s.id
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
              style={activeSection === s.id ? { background: s.color } : {}}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveSection('service')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              activeSection === 'service'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <span>🔔</span>
            <span>サービス</span>
          </button>
        </div>

        {/* ── メニュー一覧 ── */}
        {activeSection !== 'service' && currentSection && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black text-gray-400 px-1">
              {currentSection.emoji} {currentSection.label}
            </p>
            {currentSection.items.map(item => (
              <MenuItemRow
                key={item.id}
                item={item}
                qty={cart[item.id] ?? 0}
                onAdd={() => add(item.id)}
                onRem={() => rem(item.id)}
              />
            ))}
          </div>
        )}

        {/* ── サービス ── */}
        {activeSection === 'service' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={callStaff}
              className="card-light flex items-center gap-4 p-5 rounded-2xl active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl shrink-0">🔔</div>
              <div className="text-left">
                <p className="font-black text-gray-800 text-base">スタッフ呼び出し</p>
                <p className="text-xs text-gray-400 mt-0.5">タップするとスタッフに通知</p>
              </div>
            </button>

            <button
              onClick={() => setServicePanel('coupon')}
              className="card-light flex items-center gap-4 p-5 rounded-2xl active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl shrink-0">🎟</div>
              <div className="text-left">
                <p className="font-black text-gray-800 text-base">クーポン</p>
                <p className="text-xs text-gray-400 mt-0.5">お得な割引クーポン</p>
              </div>
            </button>

            <button
              onClick={() => setServicePanel('wifi')}
              className="card-light flex items-center gap-4 p-5 rounded-2xl active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl shrink-0">📶</div>
              <div className="text-left">
                <p className="font-black text-gray-800 text-base">WiFi接続</p>
                <p className="text-xs text-gray-400 mt-0.5">フリーWiFiに接続する</p>
              </div>
            </button>

            <button
              onClick={() => setServicePanel('store')}
              className="card-light flex items-center gap-4 p-5 rounded-2xl active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl shrink-0">🏪</div>
              <div className="text-left">
                <p className="font-black text-gray-800 text-base">店舗情報</p>
                <p className="text-xs text-gray-400 mt-0.5">住所・営業時間など</p>
              </div>
            </button>

            <button
              onClick={requestPayment}
              className="card-light flex items-center gap-4 p-5 rounded-2xl active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl shrink-0">💴</div>
              <div className="text-left">
                <p className="font-black text-gray-800 text-base">お会計依頼</p>
                <p className="text-xs text-gray-400 mt-0.5">スタッフがお持ちします</p>
              </div>
            </button>
          </div>
        )}

        {/* ── 注文履歴 ── */}
        <div className="card-light rounded-2xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setShowHistory(h => !h)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-gray-700">注文履歴</span>
              {history.filter(o => o.type === 'order').length > 0 && (
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {history.filter(o => o.type === 'order').length}件
                </span>
              )}
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showHistory && (
            <div className="px-4 pb-4 flex flex-col gap-2">
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">まだ注文はありません</p>
              ) : history.map(order => (
                <div key={order.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-400">{timeAgo(order.created_at)}</span>
                    {order.type === 'staff_call' ? (
                      <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold">スタッフ呼び出し</span>
                    ) : order.type === 'payment' ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">お会計依頼</span>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${STATUS_COLOR[order.status]}`}>
                        {order.status}
                      </span>
                    )}
                  </div>
                  {order.items.length > 0 && (
                    <div className="space-y-0.5">
                      {order.items.map(i => (
                        <div key={i.id} className="flex justify-between text-xs text-gray-600">
                          <span>{i.name} × {i.qty}</span>
                          <span className="font-semibold">¥{(i.price * i.qty).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs font-black text-gray-800 pt-1 border-t border-gray-200 mt-1">
                        <span>合計</span>
                        <span>¥{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── サービスパネル (モーダル) ── */}
      {servicePanel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setServicePanel(null)}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setServicePanel(null)} />

            {/* クーポン */}
            {servicePanel === 'coupon' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">🎟</div>
                  <h2 className="font-bold text-gray-900 text-lg">お得なクーポン</h2>
                </div>
                <div className="space-y-2">
                  {COUPONS.map(c => (
                    <div
                      key={c.id}
                      className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between active:scale-95 transition-transform cursor-pointer"
                      onClick={() => { setServicePanel(null); setBarcode({ code: c.code, title: c.title }) }}
                    >
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

            {/* WiFi */}
            {servicePanel === 'wifi' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl">📶</div>
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
                    onClick={copyWifi}
                    className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold text-sm active:bg-sky-700"
                  >
                    {wifiCopied ? '✓ コピーしました' : 'パスワードをコピー'}
                  </button>
                </div>
              </div>
            )}

            {/* 店舗情報 */}
            {servicePanel === 'store' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl">🏪</div>
                  <h2 className="font-bold text-gray-900 text-lg">店舗情報</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: '📍', label: '住所', value: '東京都渋谷区恵比寿1-2-3\n翠旬ビル 2F', href: null },
                    { icon: '📞', label: '電話番号', value: '03-1234-5678', href: 'tel:03-1234-5678' },
                    { icon: '🕐', label: '営業時間', value: '月〜金 11:30–14:00 / 17:00–23:00\n土・日 11:30–23:00\n定休日：毎週月曜日', href: null },
                    { icon: '🚉', label: 'アクセス', value: 'JR恵比寿駅 東口より徒歩3分', href: null },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3 bg-teal-50 rounded-xl p-4">
                      <span className="text-lg shrink-0">{row.icon}</span>
                      <div className="flex-1">
                        <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">{row.label}</p>
                        {row.href ? (
                          <a href={row.href} className="text-sm text-gray-700 font-medium">{row.value}</a>
                        ) : (
                          <p className="text-sm text-gray-700 font-medium whitespace-pre-line">{row.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {barcode && <BarcodeModal code={barcode.code} title={barcode.title} onClose={() => setBarcode(null)} />}

      {/* ── 固定カートバー ── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
          <div className="max-w-lg mx-auto px-3 pb-4 pt-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3">
              <div className="flex flex-col gap-1.5 mb-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => rem(item.id)} className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 text-orange-500 font-bold text-sm flex items-center justify-center">−</button>
                      <span className="w-5 text-center font-black text-gray-800 text-sm">{cart[item.id]}</span>
                      <button onClick={() => add(item.id)} className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center">+</button>
                    </div>
                    <span className="flex-1 text-xs text-gray-700 truncate">{item.name}</span>
                    <span className="text-xs font-bold text-gray-500 shrink-0">¥{(item.price * (cart[item.id] ?? 0)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-black text-sm disabled:opacity-60 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {submitting ? '送信中…' : `注文する　¥${cartTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItemRow({ item, qty, onAdd, onRem }: {
  item: MenuEntry
  qty: number
  onAdd: () => void
  onRem: () => void
}) {
  return (
    <div className="card-light rounded-2xl flex items-center gap-3 p-3">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: item.photoBg }}>
        {item.photo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
          {item.tag && (
            <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">{item.tag}</span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 mb-1 line-clamp-1">{item.desc}</p>
        <p className="text-sm font-black text-orange-600">¥{item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onRem} className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-500 font-bold flex items-center justify-center text-base">−</button>
        <span className="w-5 text-center font-black text-gray-800 text-sm">{qty}</span>
        <button onClick={onAdd} className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-base">+</button>
      </div>
    </div>
  )
}
