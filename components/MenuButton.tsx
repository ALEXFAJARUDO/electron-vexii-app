'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const MENU_ITEMS = [
  { label: 'ホーム', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: '充電スポット (デモ)', href: '/s/11111111-1111-1111-1111-111111111111', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { label: 'スポットマップ', href: '/map', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { label: '管理画面', href: '/admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function MenuButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="メニュー"
        className="w-9 h-9 rounded-none bg-[#0d1f3c] silver-border flex items-center justify-center transition-colors hover:bg-[#0f2545]"
      >
        <span className="flex flex-col gap-[5px] items-center justify-center">
          <span className={`block w-4 h-[1.5px] bg-[#60a5fa] transition-all origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-[#60a5fa] transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-[#60a5fa] transition-all origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 rounded-2xl bg-[#060f1e] silver-border card-glow overflow-hidden z-50">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#7db4e8] hover:text-[#bfdbfe] hover:bg-[#0d1f3c] transition-colors first:pt-4 last:pb-4"
            >
              <svg className="w-4 h-4 shrink-0 text-[#2d5a8e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
