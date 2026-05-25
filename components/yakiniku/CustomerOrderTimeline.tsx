'use client'
import { useState, useEffect } from 'react'

type StatusStep = 'accepted' | 'cooking' | 'ready' | 'served'

type OrderTimelineItem = {
  orderId: string
  tableId: string
  itemSummary: string
  total: number
  placedAt: number
  currentStatus: StatusStep
}

const STEPS: { key: StatusStep; label: string; emoji: string }[] = [
  { key: 'accepted', label: '受付', emoji: '✅' },
  { key: 'cooking',  label: '調理中', emoji: '🔥' },
  { key: 'ready',    label: '準備完了', emoji: '🔔' },
  { key: 'served',   label: '提供済み', emoji: '✨' },
]

const STEP_INDEX: Record<StatusStep, number> = {
  accepted: 0, cooking: 1, ready: 2, served: 3,
}

type Props = {
  tableId: string
}

export default function CustomerOrderTimeline({ tableId }: Props) {
  const [orders, setOrders] = useState<OrderTimelineItem[]>([])

  useEffect(() => {
    function load() {
      try {
        const rawOrders = localStorage.getItem('yakiniku_admin_orders')
        const rawStatuses = localStorage.getItem('yakiniku_order_status_notifications')
        if (!rawOrders) return

        const adminOrders: { id: string; tableId: string; items: { name: string; qty: number }[]; total: number; placedAt: number; status: string }[] = JSON.parse(rawOrders)
        const statuses: { orderId: string; status: string }[] = rawStatuses ? JSON.parse(rawStatuses) : []

        const tableOrders = adminOrders
          .filter(o => o.tableId === tableId)
          .slice(-5)
          .map(o => {
            const latest = statuses
              .filter(s => s.orderId === o.id)
              .pop()
            const currentStatus: StatusStep =
              (latest?.status as StatusStep) ??
              (o.status === 'served' ? 'served' : o.status === 'cooking' ? 'cooking' : 'accepted')

            const itemSummary = o.items.slice(0, 2).map(i => `${i.name}×${i.qty}`).join(' / ')
            return { orderId: o.id, tableId: o.tableId, itemSummary, total: o.total, placedAt: o.placedAt, currentStatus }
          })
        setOrders(tableOrders.reverse())
      } catch {}
    }

    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [tableId])

  if (orders.length === 0) return (
    <p className="text-center text-gray-500 text-xs py-4">注文履歴がありません</p>
  )

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const stepIdx = STEP_INDEX[order.currentStatus]
        return (
          <div key={order.orderId} className="bg-gray-900 border border-gray-700 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-white truncate flex-1 mr-2">{order.itemSummary}</p>
              <p className="text-[10px] text-gray-400 shrink-0">
                {new Date(order.placedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-3 left-1/2 w-full h-0.5 -z-0"
                      style={{ background: i < stepIdx ? '#f97316' : '#374151' }} />
                  )}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs z-10 relative"
                    style={{
                      background: i <= stepIdx ? '#f97316' : '#1f2937',
                      border: `1px solid ${i <= stepIdx ? '#f97316' : '#374151'}`,
                    }}
                  >
                    {i <= stepIdx ? step.emoji : ''}
                  </div>
                  <p className="text-[8px] mt-1 text-center" style={{ color: i <= stepIdx ? '#f97316' : '#6b7280' }}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
