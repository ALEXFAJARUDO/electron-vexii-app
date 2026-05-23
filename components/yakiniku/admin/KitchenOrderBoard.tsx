'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useYakinikuOrders } from '@/lib/useYakinikuOrders'
import { type DemoOrder, type OrderStatus } from '@/lib/demoYakinikuOrders'
import OrderStatusBadge from './OrderStatusBadge'

function ElapsedTimer({ placedAt }: { placedAt: number }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - placedAt) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [placedAt])
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  const urgent = m >= 10
  return (
    <span className={`font-mono text-xl font-bold ${urgent ? 'text-red-400' : 'text-gray-300'}`}>
      {m}:{s.toString().padStart(2, '0')}
    </span>
  )
}

function KitchenCard({
  order,
  onUpdateStatus,
}: {
  order: DemoOrder
  onUpdateStatus: (id: string, status: OrderStatus) => void
}) {
  const foodItems = order.items.filter(i => i.category === 'food')
  const isNew     = order.status === 'new'

  return (
    <div className={`rounded-2xl border flex flex-col overflow-hidden transition-all
      ${isNew
        ? 'border-red-500 bg-[#1a0808] shadow-lg shadow-red-900/30'
        : 'border-blue-600/60 bg-[#080d1a]'
      }`}
    >
      {/* Table + status */}
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isNew ? 'border-red-500/30' : 'border-blue-600/20'}`}>
        <div className="flex items-center gap-3">
          <span className="text-5xl font-black text-white">席{order.tableId}</span>
          <OrderStatusBadge status={order.status} large />
        </div>
        <ElapsedTimer placedAt={order.placedAt} />
      </div>

      {/* Food items */}
      <div className="px-5 py-4 flex-1 space-y-2">
        {foodItems.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-xl font-bold text-white">{item.name}</span>
            <span className={`text-2xl font-black ${isNew ? 'text-red-300' : 'text-blue-300'}`}>×{item.qty}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 pt-2 flex gap-3">
        {isNew && (
          <button
            onClick={() => onUpdateStatus(order.id, 'cooking')}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-base font-black transition-colors"
          >
            🍳 調理開始
          </button>
        )}
        {order.status === 'cooking' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white text-base font-black transition-colors"
          >
            ✅ 提供済み
          </button>
        )}
        {order.status === 'cooking' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'new')}
            className="px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-bold transition-colors"
          >
            戻す
          </button>
        )}
      </div>
    </div>
  )
}

export default function KitchenOrderBoard() {
  const { orders, updateStatus, loaded } = useYakinikuOrders()

  const kitchenOrders = orders
    .filter(o => o.status === 'new' || o.status === 'cooking')
    .filter(o => o.items.some(i => i.category === 'food'))
    .sort((a, b) => {
      if (a.status === 'new' && b.status !== 'new') return -1
      if (a.status !== 'new' && b.status === 'new') return 1
      return a.placedAt - b.placedAt
    })

  const newCount     = kitchenOrders.filter(o => o.status === 'new').length
  const cookingCount = kitchenOrders.filter(o => o.status === 'cooking').length

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0">
        <span className="text-2xl">🍳</span>
        <div>
          <h1 className="text-xl font-black text-white leading-none">厨房モニター</h1>
          <p className="text-xs text-gray-500 mt-0.5">フード注文のみ表示</p>
        </div>
        <div className="ml-4 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-xl px-3 py-1.5">
            <span className="text-red-400 font-black text-lg">{newCount}</span>
            <span className="text-red-300 text-sm">未対応</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-xl px-3 py-1.5">
            <span className="text-blue-400 font-black text-lg">{cookingCount}</span>
            <span className="text-blue-300 text-sm">調理中</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Link href="/yakiniku/admin" className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-bold transition-colors">
            管理画面
          </Link>
          <Link href="/yakiniku/drink" className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold transition-colors">
            🍺 ドリンク場
          </Link>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        {!loaded ? (
          <p className="text-gray-500 text-center py-20">読み込み中...</p>
        ) : kitchenOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl">✅</span>
            <p className="text-2xl font-bold text-green-400">未対応の注文はありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {kitchenOrders.map(order => (
              <KitchenCard key={order.id} order={order} onUpdateStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
