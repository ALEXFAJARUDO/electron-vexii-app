'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  fetchOrders, updateOrderStatus, subscribeOrders, timeAgo,
  type RestaurantOrder, type OrderStatus,
} from '@/lib/restaurantOrder'

type Filter = 'all' | 'pending' | 'drink' | 'food' | 'service'

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  '未対応': '調理中',
  '調理中': '提供済み',
  '提供済み': null,
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  '未対応': 'bg-red-500',
  '調理中': 'bg-amber-500',
  '提供済み': 'bg-green-500',
}

const STATUS_BADGE: Record<OrderStatus, string> = {
  '未対応': 'bg-red-100 text-red-700 border-red-200',
  '調理中': 'bg-amber-100 text-amber-700 border-amber-200',
  '提供済み': 'bg-green-100 text-green-700 border-green-200',
}

const TABLE_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
  'bg-teal-500', 'bg-rose-500', 'bg-orange-500', 'bg-cyan-500',
]

function tableColor(tableId: string): string {
  const n = parseInt(tableId.replace(/\D/g, '') || '0', 10)
  return TABLE_COLORS[n % TABLE_COLORS.length]
}

export default function RestaurantAdminPage() {
  const [orders, setOrders] = useState<RestaurantOrder[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const data = await fetchOrders()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const unsub = subscribeOrders(load)
    // polling fallback: refresh every 10s
    const interval = setInterval(load, 10_000)
    return () => { unsub(); clearInterval(interval) }
  }, [load])

  async function advance(id: string, current: OrderStatus) {
    const next = STATUS_NEXT[current]
    if (!next) return
    setUpdatingId(id)
    await updateOrderStatus(id, next)
    await load()
    setUpdatingId(null)
  }

  function filtered(): RestaurantOrder[] {
    switch (filter) {
      case 'pending': return orders.filter(o => o.status === '未対応')
      case 'drink':   return orders.filter(o => o.type === 'order' && o.items.some(i => i.category === 'drink'))
      case 'food':    return orders.filter(o => o.type === 'order' && o.items.some(i => i.category === 'food'))
      case 'service': return orders.filter(o => o.type !== 'order')
      default:        return orders
    }
  }

  const displayOrders = filtered()
  const pendingCount = orders.filter(o => o.status === '未対応').length

  const FILTERS: { id: Filter; label: string; emoji: string }[] = [
    { id: 'all',     label: 'すべて',   emoji: '📋' },
    { id: 'pending', label: '未対応',   emoji: '🔴' },
    { id: 'drink',   label: 'ドリンク', emoji: '🍺' },
    { id: 'food',    label: 'フード',   emoji: '🍽' },
    { id: 'service', label: 'サービス', emoji: '🔔' },
  ]

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-gray-900 text-white py-4 px-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold">翠旬 Suishun</p>
            <h1 className="text-lg font-black leading-tight">注文管理</h1>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
                未対応 {pendingCount}件
              </span>
            )}
            <button onClick={load} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 active:bg-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Filter tabs ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 sticky top-[61px] z-10">
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto scrollbar-none">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                filter === f.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
              {f.id === 'pending' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders ── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-3 py-3 flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-16 text-gray-400">読み込み中…</div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-500 font-semibold">注文はありません</p>
          </div>
        ) : displayOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            updating={updatingId === order.id}
            onAdvance={() => advance(order.id, order.status)}
          />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, updating, onAdvance }: {
  order: RestaurantOrder
  updating: boolean
  onAdvance: () => void
}) {
  const next = STATUS_NEXT[order.status]
  const isService = order.type !== 'order'

  const drinkItems = order.items.filter(i => i.category === 'drink')
  const foodItems  = order.items.filter(i => i.category === 'food')

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
      order.status === '未対応' ? 'border-red-200' : 'border-gray-100'
    }`}>
      {/* Top bar */}
      <div className={`h-1.5 w-full ${STATUS_STYLE[order.status]}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 ${tableColor(order.table_id)} rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0`}>
              {order.table_id}
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">テーブル {order.table_id}</p>
              <p className="text-[11px] text-gray-400">{timeAgo(order.created_at)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_BADGE[order.status]}`}>
              {order.status}
            </span>
            {isService && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                order.type === 'staff_call' ? 'bg-sky-100 text-sky-700' : 'bg-green-100 text-green-700'
              }`}>
                {order.type === 'staff_call' ? '🔔 スタッフ呼び出し' : '💴 お会計依頼'}
              </span>
            )}
          </div>
        </div>

        {/* Items */}
        {!isService && order.items.length > 0 && (
          <div className="mb-3 space-y-2">
            {drinkItems.length > 0 && (
              <div className="bg-sky-50 rounded-xl p-3">
                <p className="text-[10px] text-sky-500 font-black uppercase tracking-wider mb-1.5">🍺 ドリンク</p>
                <div className="space-y-1">
                  {drinkItems.map(i => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{i.name} <span className="text-gray-400">× {i.qty}</span></span>
                      <span className="font-semibold text-gray-600">¥{(i.price * i.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {foodItems.length > 0 && (
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-wider mb-1.5">🍽 フード</p>
                <div className="space-y-1">
                  {foodItems.map(i => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{i.name} <span className="text-gray-400">× {i.qty}</span></span>
                      <span className="font-semibold text-gray-600">¥{(i.price * i.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-gray-400">{order.items.reduce((s, i) => s + i.qty, 0)}点</span>
              <span className="font-black text-gray-900">¥{order.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Action */}
        {next && (
          <button
            onClick={onAdvance}
            disabled={updating}
            className={`w-full py-2.5 rounded-xl text-white font-black text-sm active:scale-95 transition-all disabled:opacity-60 ${STATUS_STYLE[next as OrderStatus]}`}
          >
            {updating ? '更新中…' : `→ ${next}にする`}
          </button>
        )}
        {!next && (
          <div className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm text-center">
            完了
          </div>
        )}
      </div>
    </div>
  )
}
