'use client'
import { useState, useMemo } from 'react'
import { getDemoBehaviorEvents, getEventTypeStats, getEventLabel, type BehaviorEvent, type BehaviorEventType } from '@/lib/yakiniku/demoBehaviorEvents'

const EVENT_COLORS: Record<BehaviorEventType, string> = {
  nfc_login: '#22c55e',
  menu_view: '#3b82f6',
  cart_add: '#f59e0b',
  order_submit: '#f97316',
  staff_call: '#0ea5e9',
  payment_request: '#ec4899',
  ad_click: '#a78bfa',
  coupon_view: '#34d399',
}

const EVENT_ICONS: Record<BehaviorEventType, string> = {
  nfc_login: '📲',
  menu_view: '👁',
  cart_add: '🛒',
  order_submit: '✅',
  staff_call: '🔔',
  payment_request: '💳',
  ad_click: '📢',
  coupon_view: '🎟',
}

function TimelineItem({ ev }: { ev: BehaviorEvent }) {
  const color = EVENT_COLORS[ev.eventType]
  const icon = EVENT_ICONS[ev.eventType]
  const ago = Math.floor((Date.now() - ev.timestamp) / 60000)

  return (
    <div className="flex items-start gap-3 relative">
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs z-10"
          style={{ background: color + '22', border: `1px solid ${color}` }}
        >
          {icon}
        </div>
        <div className="w-px flex-1 mt-1" style={{ background: color + '33', minHeight: '16px' }} />
      </div>
      <div className="flex-1 pb-3 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-white">{getEventLabel(ev.eventType)}</p>
          <span className="text-[9px] text-gray-500 ml-auto shrink-0">{ago > 0 ? `${ago}分前` : '今'}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">{ev.detail}</p>
      </div>
    </div>
  )
}

const ALL_TABLES = ['1', '2', '3', '5']

export default function BehaviorAnalyticsPanel() {
  const [selectedTable, setSelectedTable] = useState<string>('all')
  const allEvents = useMemo(() => getDemoBehaviorEvents(), [])

  const filtered = selectedTable === 'all'
    ? allEvents
    : allEvents.filter(ev => ev.tableId === selectedTable)

  const stats = useMemo(() => getEventTypeStats(allEvents), [allEvents])

  const popularItems = [
    { name: '骨付きカルビ', viewCount: 48, cartCount: 31 },
    { name: '生ビール', viewCount: 62, cartCount: 58 },
    { name: '手打ち冷麺', viewCount: 29, cartCount: 14 },
    { name: '特撰ロース', viewCount: 25, cartCount: 11 },
  ]

  return (
    <div className="space-y-5">
      {/* イベント統計 */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">イベント統計（本日）</p>
        <div className="grid grid-cols-4 gap-2">
          {stats.slice(0, 4).map((s) => (
            <div key={s.type} className="bg-[#111] border border-white/10 rounded-xl p-2 text-center">
              <p className="text-xl mb-1">{EVENT_ICONS[s.type]}</p>
              <p className="text-lg font-black text-white">{s.count}</p>
              <p className="text-[8px] text-gray-400 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 人気商品 */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">よく見られている商品</p>
        <div className="space-y-2">
          {popularItems.map((item) => (
            <div key={item.name} className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-xl px-3 py-2">
              <p className="text-sm font-bold text-white flex-1">{item.name}</p>
              <span className="text-[10px] text-blue-400">閲覧 {item.viewCount}</span>
              <span className="text-[10px] text-amber-400">カート {item.cartCount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* テーブル別タイムライン */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-bold text-gray-400">行動タイムライン</p>
          <div className="ml-auto flex gap-1">
            {(['all', ...ALL_TABLES] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: selectedTable === t ? '#f97316' : '#1f2937',
                  color: selectedTable === t ? '#fff' : '#9ca3af',
                }}
              >
                {t === 'all' ? '全席' : `席${t}`}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 max-h-96 overflow-y-auto">
          {filtered.sort((a, b) => b.timestamp - a.timestamp).map((ev) => (
            <TimelineItem key={ev.id} ev={ev} />
          ))}
        </div>
      </div>
    </div>
  )
}
