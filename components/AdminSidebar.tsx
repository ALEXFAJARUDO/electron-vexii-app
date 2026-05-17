'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { GENRES } from '@/lib/genreConfig'
import { useGenreEditor } from '@/components/GenreEditorProvider'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { saveFn, saved, tab, setTab, availableTabs } = useGenreEditor()

  const isDashboard = pathname === '/admin'
  const currentGenre = GENRES.find((g) => pathname === `/admin/genres/${g.id}`)

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Dashboard + Genre selector */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            isDashboard
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
          }`}
        >
          <span className="text-base leading-none">📊</span>
          <span>ダッシュボード</span>
        </Link>

        <select
          value={currentGenre?.id ?? ''}
          onChange={(e) => {
            if (e.target.value) router.push(`/admin/genres/${e.target.value}`)
          }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="" disabled>業種を選択…</option>
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.label}
            </option>
          ))}
        </select>
      </div>

      {currentGenre && (
        <>
          {/* Row 2: Genre icon + name + save button */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
              style={{ background: `linear-gradient(135deg, ${currentGenre.light}33, ${currentGenre.color}22)` }}
            >
              {currentGenre.emoji}
            </div>
            <span className="font-semibold text-gray-800 text-sm">{currentGenre.label}</span>
            <button
              onClick={() => saveFn?.()}
              disabled={!saveFn}
              className={`ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                saved
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm disabled:opacity-40'
              }`}
            >
              {saved ? '✓ 保存済み' : '保存する'}
            </button>
          </div>

          {/* Row 3: Tab nav */}
          {availableTabs.length > 0 && (
            <div className="flex gap-1 overflow-x-auto pb-1">
              {availableTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    tab === t.id
                      ? 'bg-white shadow-sm text-gray-800'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-white/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
