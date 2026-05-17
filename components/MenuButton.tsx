'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'ホーム', href: '/', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
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
        className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors hover:bg-gray-200"
      >
        <span className="flex flex-col gap-[5px] items-center justify-center">
          <span className={`block w-4 h-[1.5px] bg-gray-500 transition-all origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-gray-500 transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-gray-500 transition-all origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden z-50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
