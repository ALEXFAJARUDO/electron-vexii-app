'use client'
import { useState, useEffect } from 'react'

export type OrderStatusEntry = {
  orderId: string
  tableId: string
  itemName: string
  status: 'accepted' | 'cooking' | 'ready' | 'served'
  updatedAt: number
}

const STATUS_MESSAGES: Record<OrderStatusEntry['status'], string> = {
  accepted: '注文を受け付けました',
  cooking: '調理中です',
  ready: 'お持ちする準備ができました',
  served: '提供しました',
}

const STATUS_EMOJIS: Record<OrderStatusEntry['status'], string> = {
  accepted: '✅',
  cooking: '🔥',
  ready: '🔔',
  served: '✨',
}

const STATUS_COLORS: Record<OrderStatusEntry['status'], string> = {
  accepted: '#22c55e',
  cooking: '#f97316',
  ready: '#3b82f6',
  served: '#8b5cf6',
}

type Props = {
  tableId: string
}

export default function OrderStatusNotification({ tableId }: Props) {
  const [notifications, setNotifications] = useState<OrderStatusEntry[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem('yakiniku_order_status_notifications')
        if (!raw) return
        const all: OrderStatusEntry[] = JSON.parse(raw)
        const relevant = all.filter(n => n.tableId === tableId && Date.now() - n.updatedAt < 5 * 60 * 1000)
        setNotifications(relevant)
      } catch {}
    }

    load()
    const interval = setInterval(load, 3000)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'yakiniku_order_status_notifications') load()
    }
    window.addEventListener('storage', onStorage)
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage) }
  }, [tableId])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    notifications.forEach(n => {
      if (n.status !== 'served') return
      const autoDismiss = 3000
      const key = n.orderId + n.status
      if (dismissed.has(key)) return
      const elapsed = Date.now() - n.updatedAt
      const delay = Math.max(0, autoDismiss - elapsed)

      timers.push(setTimeout(() => {
        setDismissed(prev => new Set([...prev, key]))
      }, delay))
    })
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  // 同じ注文IDは最新ステータスだけ表示
  const latestByOrder = notifications.reduce<Map<string, OrderStatusEntry>>((map, n) => {
    const cur = map.get(n.orderId)
    if (!cur || n.updatedAt > cur.updatedAt) map.set(n.orderId, n)
    return map
  }, new Map())
  const visible = [...latestByOrder.values()].filter(n => !dismissed.has(n.orderId + n.status))

  if (visible.length === 0) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {visible.slice(0, 3).map((n) => {
        const key = n.orderId + n.status
        const color = STATUS_COLORS[n.status]
        return (
          <div
            key={key}
            className="max-w-sm w-full rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg pointer-events-auto"
            style={{ background: '#111', border: `1px solid ${color}40` }}
          >
            <span className="text-xl shrink-0">{STATUS_EMOJIS[n.status]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white">{n.itemName}</p>
              <p className="text-[10px] mt-0.5" style={{ color }}>{STATUS_MESSAGES[n.status]}</p>
            </div>
            <button
              onClick={() => setDismissed(prev => new Set([...prev, key]))}
              className="text-gray-500 text-xs shrink-0 px-1"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function pushOrderStatusNotification(entry: OrderStatusEntry) {
  try {
    const raw = localStorage.getItem('yakiniku_order_status_notifications')
    const all: OrderStatusEntry[] = raw ? JSON.parse(raw) : []
    const filtered = all.filter(n => !(n.orderId === entry.orderId && n.status === entry.status))
    filtered.push(entry)
    localStorage.setItem('yakiniku_order_status_notifications', JSON.stringify(filtered))
  } catch {}
}
