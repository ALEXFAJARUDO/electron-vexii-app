'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useYakinikuOrders } from '@/lib/useYakinikuOrders'
import { type OrderStatus } from '@/lib/demoYakinikuOrders'
import OrderStatsCards from './OrderStatsCards'
import OrderCard from './OrderCard'

type Filter = 'all' | OrderStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',       label: '全て' },
  { value: 'new',       label: '新規' },
  { value: 'cooking',   label: '調理中' },
  { value: 'served',    label: '提供済み' },
  { value: 'cancelled', label: 'キャンセル' },
]

export default function AdminOrderDashboard() {
  const { orders, updateStatus, toggleItemChecked, resetToDemo, loaded } = useYakinikuOrders()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const sorted   = [...filtered].sort((a, b) => b.placedAt - a.placedAt)

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#0d0d0d] border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h1 className="text-lg font-black text-white leading-none">焼肉 白雲台</h1>
            <p className="text-xs text-gray-500 mt-0.5">店舗管理ダッシュボード</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/yakiniku/kitchen"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
            🍳 厨房
          </Link>
          <Link href="/yakiniku/drink"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors">
            🍺 ドリンク場
          </Link>
          <button
            onClick={resetToDemo}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-bold transition-colors">
            デモリセット
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
        {/* Stats */}
        {loaded && <OrderStatsCards orders={orders} />}

        {/* Filter tabs */}
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                filter === f.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-gray-200'
              }`}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({orders.filter(o => o.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders grid */}
        {!loaded ? (
          <p className="text-gray-500 text-center py-20">読み込み中...</p>
        ) : sorted.length === 0 ? (
          <p className="text-gray-500 text-center py-20">該当する注文はありません</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {sorted.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} onToggleItem={toggleItemChecked} />
            ))}
          </div>
        )}

        {/* New order banner */}
        {loaded && orders.some(o => o.status === 'new') && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-red-900/50 animate-pulse font-bold text-sm pointer-events-none">
            🔔 新規注文あり — {orders.filter(o => o.status === 'new').length}件
          </div>
        )}
      </div>
    </div>
  )
}
