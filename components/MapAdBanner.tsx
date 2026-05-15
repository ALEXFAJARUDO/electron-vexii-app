'use client'

import { useState, useEffect } from 'react'
import type { Ad } from '@/lib/types'

const INTERVAL_MS = 5000

export default function MapAdBanner({ ads }: { ads: Ad[] }) {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (ads.length <= 1) return
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % ads.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [ads.length])

  if (ads.length === 0 || !visible) return null

  const ad = ads[current]

  return (
    <div className="absolute bottom-4 right-4 z-[1000] w-72">
      <div className="relative rounded-2xl overflow-hidden bg-[#060f1e]/95 backdrop-blur-sm silver-border card-glow">
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[#0d1f3c] silver-border flex items-center justify-center text-[#2d5a8e] hover:text-[#60a5fa] transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Ad label */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
          <span className="text-[#1e3c72] text-[10px] tracking-widest uppercase">AD</span>
          {ads.length > 1 && (
            <span className="text-[#1e3c72] text-[10px]">· {current + 1}/{ads.length}</span>
          )}
        </div>

        {/* Image or placeholder */}
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.title} className="w-full h-32 object-cover" />
        ) : (
          <div className="mx-3 mb-1 h-24 rounded-xl bg-[#0d1f3c] silver-border flex items-center justify-center">
            <div className="text-center px-3">
              <svg className="w-6 h-6 text-[#1e3c72] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18v18H3V3z"/>
              </svg>
              <p className="text-[#2d5a8e] text-xs leading-snug">{ad.title}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 pt-2 pb-3">
          {ad.image_url && (
            <p className="text-[#bfdbfe] text-xs font-semibold mb-1 line-clamp-1">{ad.title}</p>
          )}
          {ad.link_url && (
            <a
              href={ad.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs font-semibold text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
            >
              詳しく見る →
            </a>
          )}
        </div>

        {/* Progress bar */}
        {ads.length > 1 && (
          <div className="flex gap-1 px-4 pb-3">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="flex-1 h-0.5 rounded-full transition-colors"
                style={{ background: i === current ? '#3b82f6' : '#1e3c72' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
