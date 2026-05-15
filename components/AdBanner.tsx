'use client'

import { useState } from 'react'
import type { Ad } from '@/lib/types'

export default function AdBanner({ ads }: { ads: Ad[] }) {
  const [current, setCurrent] = useState(0)

  if (ads.length === 0) return null

  const ad = ads[current]

  return (
    <div>
      <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-2 px-1">Advertisement</p>
      <div className="relative card-light overflow-hidden">
        {ad.link_url ? (
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
            <AdImage ad={ad} />
          </a>
        ) : (
          <AdImage ad={ad} />
        )}

        {ads.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-blue-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdImage({ ad }: { ad: Ad }) {
  return ad.image_url ? (
    <img src={ad.image_url} alt={ad.title} className="w-full h-40 object-cover" />
  ) : (
    <div className="w-full h-36 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center gap-2">
      <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18v18H3V3z"/>
      </svg>
      <span className="text-gray-400 text-sm">{ad.title}</span>
    </div>
  )
}
