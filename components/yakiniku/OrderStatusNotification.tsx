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

const COMBINE_WINDOW = 30000 // 同ステータスの通知を結合する時間ウィンドウ

type DisplayEntry = {
  dismissKey: string
  status: OrderStatusEntry['status']
  itemName: string
  latestUpdatedAt: number
}

type Props = {
  tableId: string
}

export default function OrderStatusNotification({ tableId }: Props) {
  const [notifications, setNotifications] = useState<OrderStatusEntry[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  // マウント時：アクティブな注文がない通知を削除（前セッションの残留を防ぐ）
  useEffect(() => {
    try {
      const ordersRaw = localStorage.getItem('yakiniku_admin_orders')
      const orders: Array<{ id: string; tableId: string; status: string }> =
        ordersRaw ? JSON.parse(ordersRaw) : []
      const activeIds = new Set(
        orders
          .filter(o => o.tableId === tableId && o.status !== 'served' && o.status !== 'cancelled')
          .map(o => o.id)
      )
      const notifRaw = localStorage.getItem('yakiniku_order_status_notifications')
      if (notifRaw) {
        const all: OrderStatusEntry[] = JSON.parse(notifRaw)
        const cleaned = all.filter(n => n.tableId !== tableId || activeIds.has(n.orderId))
        if (cleaned.length !== all.length) {
          localStorage.setItem('yakiniku_order_status_notifications', JSON.stringify(cleaned))
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem('yakiniku_order_status_notifications')
        if (!raw) return
        const all: OrderStatusEntry[] = JSON.parse(raw)
        const cleaned = all.filter(n => n.status !== 'accepted')
        if (cleaned.length !== all.length) {
          localStorage.setItem('yakiniku_order_status_notifications', JSON.stringify(cleaned))
        }
        const relevant = cleaned.filter(n =>
          n.tableId === tableId &&
          Date.now() - n.updatedAt < 5 * 60 * 1000
        )
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

  // 同テーブル・同ステータスの通知を30秒ウィンドウで結合してDisplayEntryを作る
  function buildDisplayEntries(notifs: OrderStatusEntry[]): DisplayEntry[] {
    // orderId単位で最新ステータスだけ残す
    const latestByOrder = notifs.reduce<Map<string, OrderStatusEntry>>((map, n) => {
      const cur = map.get(n.orderId)
      if (!cur || n.updatedAt > cur.updatedAt) map.set(n.orderId, n)
      return map
    }, new Map())

    const list = [...latestByOrder.values()]

    // tableId+status でグループ化し、最新のupdatedAtから30s以内のものをまとめる
    const groupMap = new Map<string, OrderStatusEntry[]>()
    list.forEach(n => {
      const key = `${n.tableId}-${n.status}`
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key)!.push(n)
    })

    const entries: DisplayEntry[] = []
    groupMap.forEach((group, key) => {
      group.sort((a, b) => b.updatedAt - a.updatedAt)
      const latest = group[0]
      // ウィンドウ内の通知だけまとめる
      const inWindow = group.filter(n => latest.updatedAt - n.updatedAt <= COMBINE_WINDOW)
      const outside = group.filter(n => latest.updatedAt - n.updatedAt > COMBINE_WINDOW)

      // ウィンドウ内グループをひとつに結合
      if (inWindow.length > 0) {
        const names = inWindow.map(n => n.itemName)
        const itemName = names.length === 1
          ? names[0]
          : `${names[names.length - 1]} 他${names.length - 1}品`
        entries.push({
          dismissKey: `${key}-${latest.updatedAt}`,
          status: latest.status,
          itemName,
          latestUpdatedAt: latest.updatedAt,
        })
      }

      // ウィンドウ外のものは個別に追加
      outside.forEach(n => {
        entries.push({
          dismissKey: n.orderId + n.status,
          status: n.status,
          itemName: n.itemName,
          latestUpdatedAt: n.updatedAt,
        })
      })
    })

    return entries
  }

  const allEntries = buildDisplayEntries(notifications)
  const visible = allEntries.filter(e => !dismissed.has(e.dismissKey))

  // servedは3秒後に自動消去
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    visible.forEach(e => {
      if (e.status !== 'served') return
      if (dismissed.has(e.dismissKey)) return
      const elapsed = Date.now() - e.latestUpdatedAt
      const delay = Math.max(0, 3000 - elapsed)
      timers.push(setTimeout(() => {
        setDismissed(prev => new Set([...prev, e.dismissKey]))
      }, delay))
    })
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  if (visible.length === 0) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {visible.slice(0, 3).map((e) => {
        const color = STATUS_COLORS[e.status]
        return (
          <div
            key={e.dismissKey}
            className="max-w-sm w-full rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg pointer-events-auto"
            style={{ background: '#111', border: `1px solid ${color}40` }}
          >
            <span className="text-xl shrink-0">{STATUS_EMOJIS[e.status]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white">{e.itemName}</p>
              <p className="text-[10px] mt-0.5" style={{ color }}>{STATUS_MESSAGES[e.status]}</p>
            </div>
            <button
              onClick={() => setDismissed(prev => new Set([...prev, e.dismissKey]))}
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
