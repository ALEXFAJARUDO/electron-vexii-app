'use client'
import { useState } from 'react'
import { DEMO_CUSTOMERS, RANK_LABELS, RANK_COLORS, type DemoCustomer } from '@/lib/yakiniku/demoCustomers'

function CustomerCard({ customer, onIssueCoupon }: { customer: DemoCustomer; onIssueCoupon: (id: string) => void }) {
  const rankColor = RANK_COLORS[customer.rank]
  const rankLabel = RANK_LABELS[customer.rank]
  const lastVisitDaysAgo = Math.floor((Date.now() - new Date(customer.lastVisitDate).getTime()) / 86400000)

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
          style={{ background: rankColor + '33', border: `1.5px solid ${rankColor}` }}
        >
          {customer.anonymousId.slice(-2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-white">{customer.anonymousId}</p>
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: rankColor + '22', color: rankColor, border: `1px solid ${rankColor}40` }}
            >
              {rankLabel}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            来店{customer.visitCount}回 / 平均 ¥{customer.avgOrderAmount.toLocaleString()} / {lastVisitDaysAgo}日前来店
          </p>
        </div>
      </div>

      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1f2937] text-gray-300">
          好き：{customer.favoriteCategory}
        </span>
        {customer.tags.map(tag => (
          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-[#1f2937] text-gray-300">{tag}</span>
        ))}
      </div>

      {customer.couponEligible && (
        <div className="px-4 pb-3">
          <button
            onClick={() => onIssueCoupon(customer.anonymousId)}
            className="w-full py-2 rounded-xl text-xs font-black transition-colors"
            style={{ background: '#16a34a22', border: '1px solid #16a34a44', color: '#22c55e' }}
          >
            🎟 クーポン発行 ({customer.couponCode})
          </button>
        </div>
      )}
    </div>
  )
}

export default function CrmDashboard() {
  const [issuedCoupons, setIssuedCoupons] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'vip' | 'regular' | 'repeat' | 'new'>('all')

  function handleIssueCoupon(id: string) {
    setIssuedCoupons(prev => [...prev, id])
  }

  const filtered = filter === 'all' ? DEMO_CUSTOMERS : DEMO_CUSTOMERS.filter(c => c.rank === filter)

  const stats = {
    total: DEMO_CUSTOMERS.length,
    vip: DEMO_CUSTOMERS.filter(c => c.rank === 'vip').length,
    regular: DEMO_CUSTOMERS.filter(c => c.rank === 'regular').length,
    avgVisits: Math.round(DEMO_CUSTOMERS.reduce((s, c) => s + c.visitCount, 0) / DEMO_CUSTOMERS.length),
  }

  return (
    <div className="space-y-5">
      {/* サマリー */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '顧客数', value: stats.total, color: '#3b82f6' },
          { label: 'VIP', value: stats.vip, color: '#ec4899' },
          { label: '常連候補', value: stats.regular, color: '#f59e0b' },
          { label: '平均来店', value: `${stats.avgVisits}回`, color: '#22c55e' },
        ].map((card) => (
          <div key={card.label} className="bg-[#111] border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-[9px] text-gray-400 mb-1">{card.label}</p>
            <p className="text-xl font-black" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* クーポン発行通知 */}
      {issuedCoupons.length > 0 && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-green-400">✅ クーポン発行済み: {issuedCoupons.join(', ')}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">LINE連携でお客様に自動送信されます（デモ）</p>
        </div>
      )}

      {/* フィルタ */}
      <div className="flex gap-1.5 flex-wrap">
        {(['all', 'vip', 'regular', 'repeat', 'new'] as const).map((rank) => (
          <button
            key={rank}
            onClick={() => setFilter(rank)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
            style={{
              background: filter === rank ? '#f97316' : '#1f2937',
              color: filter === rank ? '#fff' : '#9ca3af',
            }}
          >
            {rank === 'all' ? '全員' : RANK_LABELS[rank]}
          </button>
        ))}
      </div>

      {/* 顧客一覧 */}
      <div className="space-y-3">
        {filtered.map((customer) => (
          <CustomerCard
            key={customer.anonymousId}
            customer={customer}
            onIssueCoupon={handleIssueCoupon}
          />
        ))}
      </div>

      <p className="text-[10px] text-gray-600 text-center">
        ※ 匿名セッションIDベースのデモデータです。個人情報は取り扱っていません。
      </p>
    </div>
  )
}
