'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GENRES } from '@/lib/genreConfig'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItem = (href: string, label: string, emoji?: string) => {
    const active = pathname === href
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          active
            ? 'bg-[#0d1f3c] silver-border text-[#bfdbfe]'
            : 'text-[#2d5a8e] hover:text-[#7db4e8] hover:bg-[#060f1e]'
        }`}
      >
        {emoji && <span className="text-base leading-none">{emoji}</span>}
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <aside className="w-52 shrink-0 flex flex-col gap-1">
      {navItem('/admin', 'ダッシュボード', '📊')}

      <div className="mt-5 mb-1.5 px-3 text-[10px] font-semibold text-[#1e3c72] tracking-widest uppercase">
        業種
      </div>

      {GENRES.map((g) =>
        navItem(`/admin/genres/${g.id}`, g.label, g.emoji)
      )}
    </aside>
  )
}
