import Link from 'next/link'
import MenuButton from '@/components/MenuButton'

const DEMO_CHARGER_ID = '11111111-1111-1111-1111-111111111111'

const GENRE_HREF: Record<string, string> = {
  restaurant: '/restaurant',
  convenience: '/convenience',
  stadium: '/stadium',
}

const GENRES = [
  {
    id: 'restaurant',
    label: '飲食店用',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 21H9m6 0h2.25A2.25 2.25 0 0019.5 18.75v-2.892c0-.595-.232-1.165-.645-1.591l-1.2-1.278a.75.75 0 00-1.093.033L15 14.25m0 6.75V14.25m-6 6.75V14.25m0 0l-1.562-1.228a.75.75 0 00-1.093.033l-1.2 1.278A2.254 2.254 0 004.5 15.858v2.892A2.25 2.25 0 006.75 21H9"/>
      </svg>
    ),
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
  },
  {
    id: 'convenience',
    label: 'コンビニ',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
      </svg>
    ),
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    id: 'stadium',
    label: '球場',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
      </svg>
    ),
    color: '#22c55e',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    id: 'hotel',
    label: 'ホテル',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
      </svg>
    ),
    color: '#a855f7',
    bg: '#faf5ff',
    border: '#e9d5ff',
  },
  {
    id: 'racing',
    label: '公営競技場',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"/>
      </svg>
    ),
    color: '#ef4444',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
  {
    id: 'family-restaurant',
    label: 'ファミレス',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
      </svg>
    ),
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
            alt="Vexii"
            className="h-8 w-auto object-contain"
          />
          <span className="font-bold text-lg silver-gradient">Vexii</span>
        </div>
        <MenuButton />
      </header>

      {/* Hero */}
      <div className="text-center px-6 pt-10 pb-8">
        <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-2">Smart Charger</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">業種を選択してください</h1>
        <p className="text-sm text-gray-400">導入をご検討の業種をお選びください</p>
      </div>

      {/* Genre grid */}
      <div className="px-5 pb-12 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {GENRES.map((genre) => (
            <Link
              key={genre.id}
              href={GENRE_HREF[genre.id] ?? `/s/${DEMO_CHARGER_ID}`}
              className="group card-light p-5 flex flex-col items-center gap-3 transition-all duration-200 active:scale-95"
              style={{ borderColor: genre.border }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: genre.bg, color: genre.color }}
              >
                {genre.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center leading-snug">
                {genre.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="text-center text-gray-300 text-xs pb-8">
        &copy; {new Date().getFullYear()} Electron Vexii
      </footer>
    </main>
  )
}
