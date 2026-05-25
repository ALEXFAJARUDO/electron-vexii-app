'use client'
import { useState, useEffect } from 'react'
import { type DemoOrder, type OrderStatus } from '@/lib/demoYakinikuOrders'
import OrderStatusBadge from './OrderStatusBadge'
import { pushOrderStatusNotification } from '@/components/yakiniku/OrderStatusNotification'

function ElapsedMin({ placedAt }: { placedAt: number }) {
  const [mins, setMins] = useState(0)
  useEffect(() => {
    const tick = () => setMins(Math.floor((Date.now() - placedAt) / 60000))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [placedAt])
  return <span>{mins}分前</span>
}

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; value: OrderStatus; style: string }[]>> = {
  new: [
    { label: '調理開始', value: 'cooking',   style: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: 'キャンセル', value: 'cancelled', style: 'bg-gray-600 hover:bg-gray-700 text-white' },
  ],
  cooking: [
    { label: '提供済み', value: 'served',  style: 'bg-green-600 hover:bg-green-700 text-white' },
    { label: '新規に戻す', value: 'new',   style: 'bg-gray-700 hover:bg-gray-600 text-gray-200' },
  ],
  served: [
    { label: '新規に戻す', value: 'new',    style: 'bg-gray-700 hover:bg-gray-600 text-gray-200' },
  ],
  cancelled: [
    { label: '新規に戻す', value: 'new',    style: 'bg-gray-700 hover:bg-gray-600 text-gray-200' },
  ],
}

const BORDER_BY_STATUS: Record<OrderStatus, string> = {
  new:       'border-red-500/60',
  cooking:   'border-blue-500/60',
  served:    'border-green-600/40',
  cancelled: 'border-gray-600/40',
}

export default function OrderCard({
  order,
  onUpdateStatus,
  onToggleItem,
}: {
  order: DemoOrder
  onUpdateStatus: (id: string, status: OrderStatus) => void
  onToggleItem: (orderId: string, itemId: string) => void
}) {
  const foodItems  = order.items.filter(i => i.category === 'food')
  const drinkItems = order.items.filter(i => i.category === 'drink')
  const actions    = NEXT_STATUS[order.status] ?? []
  const checked    = order.checkedItemIds ?? []

  return (
    <div className={`rounded-2xl border bg-[#111] flex flex-col gap-0 overflow-hidden ${BORDER_BY_STATUS[order.status]}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-white">席 {order.tableId}</span>
          <OrderStatusBadge status={order.status} large />
        </div>
        <span className="text-sm text-gray-400">
          <ElapsedMin placedAt={order.placedAt} />
        </span>
      </div>

      {/* Items */}
      <div className="px-4 py-3 flex-1 space-y-1">
        {foodItems.length > 0 && (
          <>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">🍖 フード</p>
            {foodItems.map(item => {
              const done = checked.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleItem(order.id, item.id)}
                  className="w-full flex items-center justify-between text-sm gap-2 py-0.5 group"
                >
                  <span className={`flex items-center gap-2 ${done ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-green-600 border-green-600' : 'border-gray-500 group-hover:border-green-400'}`}>
                      {done && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>}
                    </span>
                    {item.name} <span className="text-gray-500">×{item.qty}</span>
                  </span>
                  <span className={done ? 'text-gray-600' : 'text-gray-400'}>¥{(item.price * item.qty).toLocaleString()}</span>
                </button>
              )
            })}
          </>
        )}
        {drinkItems.length > 0 && (
          <>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-2 mb-1">🍺 ドリンク</p>
            {drinkItems.map(item => {
              const done = checked.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleItem(order.id, item.id)}
                  className="w-full flex items-center justify-between text-sm gap-2 py-0.5 group"
                >
                  <span className={`flex items-center gap-2 ${done ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-green-600 border-green-600' : 'border-gray-500 group-hover:border-green-400'}`}>
                      {done && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>}
                    </span>
                    {item.name} <span className="text-gray-500">×{item.qty}</span>
                  </span>
                  <span className={done ? 'text-gray-600' : 'text-gray-400'}>¥{(item.price * item.qty).toLocaleString()}</span>
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* Total */}
      <div className="px-4 py-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-xs text-gray-500">合計</span>
        <span className="text-base font-black text-orange-400">¥{order.total.toLocaleString()}</span>
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="px-4 pb-4 pt-2 flex gap-2">
          {actions.map(a => (
            <button
              key={a.value}
              onClick={() => {
                onUpdateStatus(order.id, a.value)
                const statusMap: Record<OrderStatus, 'accepted' | 'cooking' | 'ready' | 'served' | null> = {
                  new: null, cooking: 'cooking', served: 'served', cancelled: null,
                }
                const notifStatus = statusMap[a.value]
                if (notifStatus) {
                  const itemName = order.items[0]?.name ?? 'ご注文'
                  const itemCount = order.items.length
                  pushOrderStatusNotification({ orderId: order.id, tableId: order.tableId, itemName, itemCount, status: notifStatus, updatedAt: Date.now() })
                }
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${a.style}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
