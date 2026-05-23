import Link from 'next/link'
import MenuButton from '@/components/MenuButton'
import SplashScreen from '@/components/SplashScreen'

const DEMO_CHARGER_ID = '11111111-1111-1111-1111-111111111111'

const GENRE_HREF: Record<string, string> = {
  cafe: '/cafe',
  restaurant: '/restaurant',
  convenience: '/convenience',
  stadium: '/stadium',
  mall: '/mall',
  hotel: '/hotel',
  racing: '/racing',
  airport: '/airport',
  'theme-park': '/theme-park',
  concert: '/concert',
  hospital: '/hospital',
  yakiniku: '/yakiniku',
}

const GENRES = [
  {
    id: 'cafe',
    label: 'カフェ',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5h13.5v9A2.25 2.25 0 0116.5 18.75H7.5A2.25 2.25 0 015.25 16.5V7.5zm13.5 2.25h2.25a2.25 2.25 0 010 4.5H18.75M10.5 3l-1.125 2.25M12 3v2.25M13.5 3l1.125 2.25"/>
      </svg>
    ),
    color: '#92400e',
    light: '#fbbf24',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  {
    id: 'restaurant',
    label: '飲食店',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v6m2-6v6m2-6v6M6 9h4M8 9v12"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3V21M14.5 3a3 3 0 013 3v3a3 3 0 01-3 3"/>
      </svg>
    ),
    color: '#f97316',
    light: '#fdba74',
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
    light: '#7dd3fc',
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
    light: '#86efac',
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
    light: '#d8b4fe',
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
    light: '#fca5a5',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
  {
    id: 'mall',
    label: 'ショッピングモール',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
      </svg>
    ),
    color: '#8b5cf6',
    light: '#c4b5fd',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    id: 'airport',
    label: '空港',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-1 0-2 1-2 2v6L3.5 14v1.5l6.5-2V19L8 21v1l4-1 4 1V21l-2-2v-5.5l6.5 2V14L14 10V4c0-1-1-2-2-2Z"/>
      </svg>
    ),
    color: '#0ea5e9',
    light: '#7dd3fc',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    id: 'theme-park',
    label: 'テーマパーク',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21V9.75A8.25 8.25 0 0112 1.5a8.25 8.25 0 018.25 8.25V21m-16.5 0h16.5m-11.25 0v-3.75A3 3 0 0112 14.25a3 3 0 013 3V21"/>
      </svg>
    ),
    color: '#ec4899',
    light: '#f9a8d4',
    bg: '#fdf2f8',
    border: '#fbcfe8',
  },
  {
    id: 'concert',
    label: 'コンサート会場',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/>
      </svg>
    ),
    color: '#7c3aed',
    light: '#c4b5fd',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    id: 'hospital',
    label: '病院',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    color: '#10b981',
    light: '#6ee7b7',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  {
    id: 'yakiniku',
    label: '焼肉屋',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>
      </svg>
    ),
    color: '#dc2626',
    light: '#fca5a5',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#edf1f7]">
      <SplashScreen />
      {/* Header */}
      <header className="neu-header px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
            alt="Vexii"
            className="h-8 w-auto object-contain"
          />
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
        <div className="grid grid-cols-2 gap-[15px]">
          {GENRES.map((genre) => (
            <Link
              key={genre.id}
              href={GENRE_HREF[genre.id] ?? `/s/${DEMO_CHARGER_ID}`}
              className="group card-light p-5 flex flex-col items-center gap-3 transition-all duration-200 active:scale-95"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 neu-icon"
                style={{
                  background: `linear-gradient(to bottom, ${genre.light}, ${genre.color})`,
                  color: '#ffffff',
                }}
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

      <footer className="text-center text-gray-400 text-xs pb-8">
        &copy; {new Date().getFullYear()} Electron Vexii
      </footer>
    </main>
  )
}
