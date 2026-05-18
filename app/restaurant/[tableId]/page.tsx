'use client'
import { use, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'
import { useSession, formatRemaining } from '@/lib/restaurantSession'
import OrderRecommendation from '@/components/restaurant/OrderRecommendation'
import PartyGames from '@/components/restaurant/PartyGames'
import OrganizerSupport from '@/components/restaurant/OrganizerSupport'
import ConversationTopics from '@/components/restaurant/ConversationTopics'
import AiTalkIdeas from '@/components/restaurant/AiTalkIdeas'
import CompatibilityQuiz from '@/components/restaurant/CompatibilityQuiz'
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

const STATUS_COLOR: Record<string, string> = {
  '未対応': 'bg-red-100 text-red-700',
  '調理中': 'bg-amber-100 text-amber-700',
  '提供済み': 'bg-green-100 text-green-700',
}

type MainTab = 'order' | 'support' | 'payment' | 'staff'
type SupportFeature = 'top' | 'recommend' | 'games' | 'organizer' | 'topics' | 'ai' | 'quiz'
type ServicePanel = 'coupon' | 'wifi' | 'store' | null

const SUPPORT_FEATURES: { id: SupportFeature; label: string; emoji: string; desc: string; color: string }[] = [
  { id: 'recommend', label: '次何頼む？', emoji: '💡', desc: '注文履歴からAI提案', color: 'from-emerald-600 to-teal-700' },
  { id: 'games',     label: '飲み会ゲーム', emoji: '🎯', desc: 'ルーレット・クイズ・お題', color: 'from-purple-600 to-violet-700' },
  { id: 'organizer', label: '幹事支援',   emoji: '⏱', desc: '飲み放題タイマー・割り勘', color: 'from-blue-600 to-indigo-700' },
  { id: 'topics',    label: '今日の話題', emoji: '💬', desc: 'スポーツ・仕事・トレンド', color: 'from-orange-500 to-red-600' },
  { id: 'ai',        label: 'AI会話ネタ', emoji: '🤖', desc: '上司・初対面・ウォームアップ', color: 'from-cyan-600 to-sky-700' },
  { id: 'quiz',      label: '相性診断',   emoji: '❤️', desc: '5問で飲み会タイプ判定', color: 'from-pink-500 to-rose-600' },
]

const BOTTOM_TABS: { id: MainTab; label: string; emoji: string }[] = [
  { id: 'order',   label: '注文',         emoji: '🍽' },
  { id: 'support', label: '飲み会サポート', emoji: '🎉' },
  { id: 'payment', label: '会計',          emoji: '💴' },
  { id: 'staff',   label: 'スタッフ',      emoji: '🔔' },
]

export default function TablePage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = (searchParams.get('tab') as MainTab | null) ?? 'order'

  const {
    session, isLoading, endSession,
    remainingSec, showLogoutModal, setShowLogoutModal,
    isExpiringSoon, isCritical,
  } = useSession()

  const [expired, setExpired] = useState(false)
  const [mainTab, setMainTab] = useState<MainTab>(initialTab)
  const [supportFeature, setSupportFeature] = useState<SupportFeature>('top')
  const [activeSection, setActiveSection] = useState('drink')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [history, setHistory] = useState<RestaurantOrder[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [servicePanel, setServicePanel] = useState<ServicePanel>(null)
  const [barcode, setBarcode] = useState<{ code: string; title: string } | null>(null)
  const [wifiCopied, setWifiCopied] = useState(false)

  // ── セッションガード ──
  useEffect(() => {
    if (isLoading) return
    if (!session) {
      router.replace('/restaurant/nfc')
    } else if (session.tableId !== tableId) {
      router.replace('/restaurant/nfc')
    }
  }, [isLoading, session, tableId, router])

  // ── セッション自動ログアウト検知 ──
  useEffect(() => {
    if (!isLoading && !session && !expired) {
      setExpired(true)
    }
  }, [isLoading, session, expired])

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
    // 会計完了でセッション終了
    setTimeout(() => {
      endSession()
      router.push('/restaurant/nfc')
    }, 2000)
  }

  function handleLogoutConfirm() {
    endSession()
    router.push('/restaurant/nfc')
  }

  const currentSection = MENU_SECTIONS.find(s => s.id === activeSection)
  const orderTotal = history.filter(o => o.type === 'order').reduce((s, o) => s + o.total, 0)

  const cartBarH = cartCount > 0 ? 'pb-[calc(3.5rem+7rem)]' : 'pb-14'

  return (
    <div className="min-h-dvh bg-[#edf1f7] flex flex-col">

      {/* ── Header ── */}
      <header className="neu-header py-3 shrink-0 sticky top-0 z-30">
        <div className="max-w-lg mx-auto w-full px-3 flex items-center gap-2">
          <Link href="/restaurant">
            <img src="/restaurant-logo.png" alt="翠旬" style={{ height: 32, width: 'auto' }} />
          </Link>
          {/* セッションタイマー */}
          {session && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black tabular-nums ${
              isCritical       ? 'bg-red-500 text-white animate-pulse' :
              isExpiringSoon   ? 'bg-amber-400 text-white animate-pulse' :
                                 'bg-gray-100 text-gray-600'
            }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {formatRemaining(remainingSec)}
            </div>
          )}
          <span className="ml-auto text-xs font-semibold text-gray-500">飲食店</span>
          <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
            テーブル {tableId}
          </span>
          {cartCount > 0 && (
            <button onClick={() => setMainTab('order')} className="flex items-center gap-1 bg-orange-50 border border-orange-300 rounded-lg px-2.5 py-1">
              <span className="text-xs font-black text-orange-700">🛒 {cartCount}</span>
            </button>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* ── Main content ── */}
      <div className={`flex-1 max-w-lg mx-auto w-full px-3 pt-3 flex flex-col gap-3 ${cartBarH}`}>

        {/* ════ 注文タブ ════ */}
        {mainTab === 'order' && (
          <>
            <div className="rounded-2xl overflow-hidden shrink-0" style={{ height: '18vh' }}>
              <img src="/restaurant-hero.png" alt="翠旬" className="w-full h-full object-cover" />
            </div>

            {/* クイックドリンク */}
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

            {/* カテゴリタブ */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3">
              {MENU_SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                    activeSection === s.id ? 'text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                  style={activeSection === s.id ? { background: s.color } : {}}
                >
                  <span>{s.emoji}</span><span>{s.label}</span>
                </button>
              ))}
              <button
                onClick={() => setActiveSection('service')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  activeSection === 'service' ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                <span>🔔</span><span>サービス</span>
              </button>
            </div>

            {/* メニュー一覧 */}
            {activeSection !== 'service' && currentSection && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-black text-gray-400 px-1">{currentSection.emoji} {currentSection.label}</p>
                {currentSection.items.map(item => (
                  <MenuItemRow key={item.id} item={item} qty={cart[item.id] ?? 0} onAdd={() => add(item.id)} onRem={() => rem(item.id)} />
                ))}
              </div>
            )}

            {/* サービス */}
            {activeSection === 'service' && (
              <div className="flex flex-col gap-3">
                {[
                  { icon: '🎟', bg: 'bg-green-100', label: 'クーポン', desc: 'お得な割引クーポン', action: () => setServicePanel('coupon') },
                  { icon: '📶', bg: 'bg-sky-100', label: 'WiFi接続', desc: 'フリーWiFiに接続する', action: () => setServicePanel('wifi') },
                  { icon: '🏪', bg: 'bg-teal-100', label: '店舗情報', desc: '住所・営業時間など', action: () => setServicePanel('store') },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} className="card-light flex items-center gap-4 p-5 rounded-2xl active:scale-95 transition-transform">
                    <div className={`w-12 h-12 rounded-full ${btn.bg} flex items-center justify-center text-2xl shrink-0`}>{btn.icon}</div>
                    <div className="text-left">
                      <p className="font-black text-gray-800 text-base">{btn.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{btn.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ════ 飲み会サポートタブ ════ */}
        {mainTab === 'support' && (
          <div className="flex flex-col gap-3">
            {/* Sub-feature nav header */}
            {supportFeature !== 'top' && (
              <button
                onClick={() => setSupportFeature('top')}
                className="flex items-center gap-2 text-sm text-gray-500 font-bold -mb-1 active:opacity-70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                飲み会サポート
              </button>
            )}

            {/* Feature grid (top level) */}
            {supportFeature === 'top' && (
              <>
                <div className="bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-white font-black text-sm">飲み会サポート</p>
                    <p className="text-gray-400 text-xs">飲み会をもっと楽しくする6つの機能</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORT_FEATURES.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSupportFeature(f.id)}
                      className={`bg-gradient-to-br ${f.color} rounded-2xl p-4 text-left active:scale-95 transition-all shadow-sm`}
                    >
                      <p className="text-3xl mb-2">{f.emoji}</p>
                      <p className="text-white font-black text-sm">{f.label}</p>
                      <p className="text-white/70 text-[10px] mt-0.5">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Sub-features */}
            {supportFeature === 'recommend' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <p className="font-black text-gray-800">次何頼む？提案</p>
                </div>
                <OrderRecommendation
                  history={history}
                  onAddToCart={(item) => { add(item.id); showToast(`${item.name} をカートに追加`); setMainTab('order') }}
                />
              </>
            )}

            {supportFeature === 'games' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <p className="font-black text-gray-800">飲み会ゲーム</p>
                </div>
                <PartyGames />
              </>
            )}

            {supportFeature === 'organizer' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱</span>
                  <p className="font-black text-gray-800">幹事支援</p>
                </div>
                <OrganizerSupport history={history} tableId={tableId} onRequestPayment={requestPayment} onCallStaff={callStaff} />
              </>
            )}

            {supportFeature === 'topics' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  <p className="font-black text-gray-800">今日の話題</p>
                </div>
                <ConversationTopics />
              </>
            )}

            {supportFeature === 'ai' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="font-black text-gray-800">AI会話ネタ</p>
                </div>
                <AiTalkIdeas />
              </>
            )}

            {supportFeature === 'quiz' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❤️</span>
                  <p className="font-black text-gray-800">相性診断</p>
                </div>
                <CompatibilityQuiz />
              </>
            )}
          </div>
        )}

        {/* ════ 会計タブ ════ */}
        {mainTab === 'payment' && (
          <div className="flex flex-col gap-4">
            {/* Total */}
            <div className="card-light rounded-2xl p-5">
              <p className="text-xs font-black text-gray-400 mb-3">本日の合計</p>
              <p className="text-4xl font-black text-gray-900">¥{orderTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">
                {history.filter(o => o.type === 'order').reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0)}点注文済み
              </p>
            </div>

            <button
              onClick={requestPayment}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span>💴</span> お会計を依頼する
            </button>

            {/* Order history */}
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
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${STATUS_COLOR[order.status]}`}>{order.status}</span>
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
                            <span>合計</span><span>¥{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ スタッフタブ ════ */}
        {mainTab === 'staff' && (
          <div className="flex flex-col gap-4">
            <div className="card-light rounded-2xl p-5 text-center">
              <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center text-4xl mx-auto mb-4">🔔</div>
              <p className="font-black text-gray-800 text-xl mb-1">スタッフ呼び出し</p>
              <p className="text-sm text-gray-400 mb-6">タップするとスタッフに通知します</p>
              <button
                onClick={() => { callStaff(); setMainTab('order') }}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                🔔 呼び出す
              </button>
            </div>

            <div className="card-light rounded-2xl p-5">
              <p className="text-xs font-black text-gray-400 mb-3">よく使われるリクエスト</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'お水をください', emoji: '💧' },
                  { label: 'おしぼりください', emoji: '🧻' },
                  { label: '灰皿をください', emoji: '🚬' },
                  { label: 'メニューを見たい', emoji: '📋' },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={() => { callStaff(); showToast(`「${btn.label}」でスタッフを呼びました`) }}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gray-50 border border-gray-200 active:scale-95 transition-transform text-center"
                  >
                    <span className="text-2xl">{btn.emoji}</span>
                    <span className="text-[11px] text-gray-600 font-semibold">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── サービスパネル ── */}
      {servicePanel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setServicePanel(null)}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setServicePanel(null)} />

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
                  <button onClick={copyWifi} className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold text-sm active:bg-sky-700">
                    {wifiCopied ? '✓ コピーしました' : 'パスワードをコピー'}
                  </button>
                </div>
              </div>
            )}

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

      {/* ── ログアウト確認モーダル ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-6">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
                </svg>
              </div>
              <h2 className="font-black text-gray-900 text-lg">ログアウトしますか？</h2>
              <p className="text-sm text-gray-400 mt-1">セッションが終了します。<br/>再度NFCタッチが必要になります。</p>
              {session && (
                <div className="mt-3 bg-gray-50 rounded-xl px-4 py-2 inline-flex items-center gap-2 text-xs text-gray-500">
                  <span>残り時間</span>
                  <span className="font-black text-gray-700">{formatRemaining(remainingSec)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm active:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-sm active:bg-red-600"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── セッション期限切れモーダル ── */}
      {expired && !session && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center px-6">
          <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="font-black text-white text-xl mb-2">セッションが終了しました</h2>
            <p className="text-gray-400 text-sm mb-6">30分間の無操作により<br/>自動的にログアウトされました。</p>
            <button
              onClick={() => router.push('/restaurant/nfc')}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-base active:bg-emerald-600"
            >
              NFCタッチに戻る
            </button>
          </div>
        </div>
      )}

      {/* ── Cart bar (above bottom tabs) ── */}
      {cartCount > 0 && mainTab === 'order' && (
        <div className="fixed bottom-14 left-0 right-0 z-40">
          <div className="max-w-lg mx-auto px-3 pb-2 pt-1">
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

      {/* ── Bottom tab bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe">
        <div className="max-w-lg mx-auto flex">
          {BOTTOM_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setMainTab(tab.id)
                if (tab.id === 'support') setSupportFeature('top')
              }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                mainTab === tab.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <span className={`text-xl leading-none ${mainTab === tab.id ? 'scale-110' : ''} transition-transform`}>{tab.emoji}</span>
              <span className={`text-[10px] font-bold ${mainTab === tab.id ? 'text-orange-500' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
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
