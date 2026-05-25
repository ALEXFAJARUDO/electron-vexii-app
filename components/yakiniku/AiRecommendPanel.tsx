'use client'
import { useMemo } from 'react'
import { getRecommendations, type RecommendContext } from '@/lib/yakiniku/recommendationRules'

type Props = {
  orderedItemIds: number[]
  stayMinutes: number
  onAddToCart: (id: number, name: string) => void
}

export default function AiRecommendPanel({ orderedItemIds, stayMinutes, onAddToCart }: Props) {
  const ctx: RecommendContext = useMemo(() => ({
    orderedItemIds,
    stayMinutes,
    hourOfDay: new Date().getHours(),
    isLastOrder: new Date().getHours() >= 22,
  }), [orderedItemIds, stayMinutes])

  const recommendations = useMemo(() => getRecommendations(ctx), [ctx])

  if (recommendations.length === 0) return null

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#0c0c1e', borderColor: '#2d1b69' }}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#1e1b4b,#0c0c1e)', borderBottom: '1px solid #2d1b69' }}>
        <span className="text-base">✨</span>
        <p className="text-xs font-black" style={{ color: '#a78bfa' }}>AIおすすめ</p>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#2d1b69', color: '#a78bfa' }}>
          ルールベース
        </span>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {recommendations.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddToCart(item.id, item.name)}
            className="flex flex-col gap-1.5 p-2.5 rounded-xl text-left active:scale-95 transition-transform"
            style={{ background: '#1a1a3e', border: '1px solid #312e81' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">{item.name}</p>
                <p className="text-[10px] font-bold" style={{ color: '#f97316' }}>¥{item.price.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-[9px] leading-tight" style={{ color: '#a78bfa' }}>{item.reason}</p>
            <div className="flex items-center justify-end">
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: '#7c3aed' }}>
                + カートへ
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
