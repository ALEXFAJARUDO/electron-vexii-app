'use client'
import { useState, useEffect } from 'react'
import { selectAd, type AdContext } from '@/lib/yakiniku/adRules'

type Props = {
  orderedItemIds: number[]
  stayMinutes: number
  isPaymentRequested?: boolean
  onAdClick?: (adId: string) => void
}

export default function AdBannerSlot({ orderedItemIds, stayMinutes, isPaymentRequested, onAdClick }: Props) {
  const [visible, setVisible] = useState(true)

  const ctx: AdContext = {
    orderedItemIds,
    stayMinutes,
    hourOfDay: new Date().getHours(),
    isPaymentRequested,
  }

  const ad = selectAd(ctx)

  useEffect(() => {
    setVisible(true)
  }, [ad.id])

  if (!visible) return null

  function handleClick() {
    onAdClick?.(ad.id)
    // Track click in localStorage
    try {
      const key = 'yakiniku_ad_clicks'
      const raw = localStorage.getItem(key)
      const clicks: Record<string, number> = raw ? JSON.parse(raw) : {}
      clicks[ad.id] = (clicks[ad.id] ?? 0) + 1
      localStorage.setItem(key, JSON.stringify(clicks))
    } catch {}
  }

  return (
    <div
      className="rounded-2xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-transform"
      style={{ background: ad.bgGradient, minHeight: '90px' }}
      onClick={handleClick}
    >
      <button
        onClick={(e) => { e.stopPropagation(); setVisible(false) }}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-white/70 text-xs"
      >
        ✕
      </button>
      <div className="px-4 py-4 flex items-center gap-4">
        <span className="text-4xl">{ad.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-sm leading-tight mb-1">{ad.title}</p>
          <p className="text-[10px] text-white/80 leading-snug mb-2">{ad.description}</p>
          <span className="text-[10px] font-black text-white px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {ad.ctaText} →
          </span>
        </div>
      </div>
      <div className="absolute bottom-1.5 left-4">
        <span className="text-[8px] text-white/40">AD</span>
      </div>
    </div>
  )
}
