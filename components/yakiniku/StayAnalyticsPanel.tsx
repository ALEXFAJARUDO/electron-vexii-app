'use client'
import { useState, useEffect } from 'react'

type TableSession = {
  tableId: string
  startedAt: number
  lastOrderAt: number
  orderCount: number
  totalAmount: number
}

type DerivedSession = TableSession & {
  stayMinutes: number
  lastOrderMinutesAgo: number
  isHighlight: boolean
  isCheckoutCandidate: boolean
  suggestion: string
}

const DEMO_SESSIONS: TableSession[] = [
  { tableId: '1',  startedAt: Date.now() - 72 * 60000, lastOrderAt: Date.now() - 12 * 60000, orderCount: 3, totalAmount: 8200 },
  { tableId: '2',  startedAt: Date.now() - 45 * 60000, lastOrderAt: Date.now() - 8  * 60000, orderCount: 2, totalAmount: 13480 },
  { tableId: '3',  startedAt: Date.now() - 35 * 60000, lastOrderAt: Date.now() - 5  * 60000, orderCount: 2, totalAmount: 4540 },
  { tableId: '4',  startedAt: Date.now() - 18 * 60000, lastOrderAt: Date.now() - 18 * 60000, orderCount: 1, totalAmount: 2400 },
  { tableId: '5',  startedAt: Date.now() - 118 * 60000, lastOrderAt: Date.now() - 55 * 60000, orderCount: 5, totalAmount: 17120 },
  { tableId: '6',  startedAt: Date.now() - 28 * 60000, lastOrderAt: Date.now() - 10 * 60000, orderCount: 2, totalAmount: 5800 },
  { tableId: '8',  startedAt: Date.now() - 62 * 60000, lastOrderAt: Date.now() - 30 * 60000, orderCount: 4, totalAmount: 9640 },
]

function derive(s: TableSession, now: number): DerivedSession {
  const stayMinutes = Math.floor((now - s.startedAt) / 60000)
  const lastOrderMinutesAgo = Math.floor((now - s.lastOrderAt) / 60000)
  const isCheckoutCandidate = stayMinutes >= 100 || (stayMinutes >= 60 && lastOrderMinutesAgo >= 40)
  const isHighlight = stayMinutes >= 80 && !isCheckoutCandidate

  let suggestion = ''
  if (isCheckoutCandidate) suggestion = '会計候補'
  else if (stayMinutes >= 60 && lastOrderMinutesAgo >= 20) suggestion = '追加提案あり'
  else if (stayMinutes >= 40) suggestion = '〆メニュー提案'

  return { ...s, stayMinutes, lastOrderMinutesAgo, isHighlight, isCheckoutCandidate, suggestion }
}

export default function StayAnalyticsPanel() {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const sessions = DEMO_SESSIONS.map(s => derive(s, now))
  const activeCount = sessions.length
  const avgStay = Math.round(sessions.reduce((s, t) => s + t.stayMinutes, 0) / sessions.length)
  const checkoutCandidates = sessions.filter(s => s.isCheckoutCandidate)

  return (
    <div className="space-y-5">
      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '稼働テーブル', value: activeCount, unit: '席', color: '#22c55e' },
          { label: '平均滞在', value: avgStay, unit: '分', color: '#3b82f6' },
          { label: '会計候補', value: checkoutCandidates.length, unit: '席', color: '#f97316' },
        ].map((card) => (
          <div key={card.label} className="bg-[#111] border border-white/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-400 mb-1">{card.label}</p>
            <p className="text-2xl font-black" style={{ color: card.color }}>
              {card.value}<span className="text-sm ml-0.5">{card.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* テーブル一覧 */}
      <div className="space-y-2">
        {sessions.sort((a, b) => b.stayMinutes - a.stayMinutes).map((s) => (
          <div
            key={s.tableId}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{
              background: s.isCheckoutCandidate ? '#1a0a00' : s.isHighlight ? '#1a1000' : '#111',
              border: `1px solid ${s.isCheckoutCandidate ? '#9a3412' : s.isHighlight ? '#92400e' : '#ffffff15'}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
              style={{
                background: s.isCheckoutCandidate ? '#9a3412' : s.isHighlight ? '#92400e' : '#1f2937',
                color: '#fff',
              }}
            >
              {s.tableId}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-black text-white">テーブル {s.tableId}</p>
                {s.suggestion && (
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: s.isCheckoutCandidate ? '#9a3412' : '#b45309',
                      color: '#fff',
                    }}
                  >
                    {s.suggestion}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400">
                最終注文：{s.lastOrderMinutesAgo}分前 / 合計 ¥{s.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-lg" style={{ color: s.isCheckoutCandidate ? '#f97316' : s.isHighlight ? '#fbbf24' : '#94a3b8' }}>
                {s.stayMinutes}<span className="text-xs ml-0.5">分</span>
              </p>
              <p className="text-[9px] text-gray-500">{s.orderCount}回注文</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
