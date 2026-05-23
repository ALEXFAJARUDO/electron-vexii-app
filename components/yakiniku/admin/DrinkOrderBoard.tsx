'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useYakinikuOrders } from '@/lib/useYakinikuOrders'
import { type DemoOrder, type OrderStatus } from '@/lib/demoYakinikuOrders'
import OrderStatusBadge from './OrderStatusBadge'

function MinAgo({ placedAt }: { placedAt: number }) {
  const [mins, setMins] = useState(0)
  useEffect(() => {
    const tick = () => setMins(Math.floor((Date.now() - placedAt) / 60000))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [placedAt])
  return <span>{mins}分前</span>
}

function DrinkCard({
  order,
  onUpdateStatus,
  onToggleItem,
}: {
  order: DemoOrder
  onUpdateStatus: (id: string, status: OrderStatus) => void
  onToggleItem: (orderId: string, itemId: string) => void
}) {
  const drinkItems = order.items.filter(i => i.category === 'drink')
  const isNew    = order.status === 'new'
  const checked  = order.checkedItemIds ?? []

  return (
    <div className={`rounded-2xl border flex items-stretch gap-0 overflow-hidden
      ${isNew ? 'border-amber-500/60 bg-[#1a1200]' : 'border-blue-600/40 bg-[#080d1a]'}`}
    >
      {/* Table badge */}
      <div className={`flex flex-col items-center justify-center px-5 border-r min-w-[80px]
        ${isNew ? 'border-amber-500/30 bg-amber-500/10' : 'border-blue-600/20 bg-blue-600/10'}`}
      >
        <span className={`text-3xl font-black ${isNew ? 'text-amber-300' : 'text-blue-300'}`}>{order.tableId}</span>
        <span className="text-[10px] text-gray-500 mt-0.5">席</span>
      </div>

      {/* Drink items with checkboxes */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-2">
        <div className="flex items-center gap-2 mb-1">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-gray-500"><MinAgo placedAt={order.placedAt} /></span>
        </div>
        {drinkItems.map(item => {
          const done = checked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => onToggleItem(order.id, item.id)}
              className="flex items-center justify-between gap-3 group"
            >
              <span className={`flex items-center gap-2 text-base font-bold transition-colors ${done ? 'line-through text-gray-600' : 'text-white'}`}>
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-green-600 border-green-600' : 'border-gray-500 group-hover:border-green-400'}`}>
                  {done && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>}
                </span>
                {item.name}
              </span>
              <span className={`text-lg font-black ml-3 shrink-0 ${done ? 'text-gray-600' : isNew ? 'text-amber-300' : 'text-blue-300'}`}>×{item.qty}</span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-2 px-3 py-3 shrink-0">
        {isNew && (
          <button
            onClick={() => onUpdateStatus(order.id, 'cooking')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition-colors whitespace-nowrap"
          >
            🍹 作成中
          </button>
        )}
        {(isNew || order.status === 'cooking') && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-black transition-colors whitespace-nowrap"
          >
            ✅ 提供済み
          </button>
        )}
      </div>
    </div>
  )
}

export default function DrinkOrderBoard() {
  const { orders, updateStatus, toggleItemChecked, loaded } = useYakinikuOrders()

  const drinkOrders = orders
    .filter(o => o.status === 'new' || o.status === 'cooking')
    .filter(o => o.items.some(i => i.category === 'drink'))
    .sort((a, b) => {
      if (a.status === 'new' && b.status !== 'new') return -1
      if (a.status !== 'new' && b.status === 'new') return 1
      return a.placedAt - b.placedAt
    })

  const newCount     = drinkOrders.filter(o => o.status === 'new').length
  const cookingCount = drinkOrders.filter(o => o.status === 'cooking').length

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0">
        <span className="text-2xl">🍺</span>
        <div>
          <h1 className="text-xl font-black text-white leading-none">ドリンク場</h1>
          <p className="text-xs text-gray-500 mt-0.5">ドリンク注文のみ表示</p>
        </div>
        <div className="ml-4 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-xl px-3 py-1.5">
            <span className="text-amber-400 font-black text-lg">{newCount}</span>
            <span className="text-amber-300 text-sm">未対応</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-xl px-3 py-1.5">
            <span className="text-blue-400 font-black text-lg">{cookingCount}</span>
            <span className="text-blue-300 text-sm">作成中</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Link href="/yakiniku/admin" className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-bold transition-colors">
            管理画面
          </Link>
          <Link href="/yakiniku/kitchen" className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold transition-colors">
            🍳 厨房
          </Link>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        {!loaded ? (
          <p className="text-gray-500 text-center py-20">読み込み中...</p>
        ) : drinkOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl">🍹</span>
            <p className="text-2xl font-bold text-amber-400">未対応のドリンクはありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {drinkOrders.map(order => (
              <DrinkCard key={order.id} order={order} onUpdateStatus={updateStatus} onToggleItem={toggleItemChecked} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
