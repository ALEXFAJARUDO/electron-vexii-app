import { getAllStores, getAllChargers } from '@/lib/supabase'

export default async function AdminPage() {
  const [stores, chargers] = await Promise.all([getAllStores(), getAllChargers()])

  const available = chargers.filter((c) => c.status === 'available').length
  const inUse = chargers.filter((c) => c.status === 'in_use').length

  return (
    <div>
      <h1 className="text-2xl font-bold silver-gradient mb-8">ダッシュボード</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="店舗数" value={stores.length} color="#60a5fa" />
        <StatCard label="充電器" value={chargers.length} color="#60a5fa" />
        <StatCard label="利用可能" value={available} color="#4ade80" />
        <StatCard label="使用中" value={inUse} color="#facc15" />
      </div>

      {/* Charger list */}
      <section>
        <h2 className="text-sm font-semibold text-[#2d5a8e] tracking-widest uppercase mb-4">充電器一覧</h2>
        <div className="rounded-2xl bg-[#060f1e] silver-border card-glow overflow-hidden">
          {chargers.length === 0 ? (
            <div className="p-8 text-center text-[#1e3c72] text-sm">充電器がありません</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e3c72]">
                  <th className="text-left px-5 py-3 text-[#1e3c72] font-medium text-xs tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 text-[#1e3c72] font-medium text-xs tracking-wider">ラベル</th>
                  <th className="text-left px-5 py-3 text-[#1e3c72] font-medium text-xs tracking-wider">店舗</th>
                  <th className="text-left px-5 py-3 text-[#1e3c72] font-medium text-xs tracking-wider">ステータス</th>
                  <th className="text-left px-5 py-3 text-[#1e3c72] font-medium text-xs tracking-wider">URL</th>
                </tr>
              </thead>
              <tbody>
                {chargers.map((c, i) => (
                  <tr key={c.id} className={i < chargers.length - 1 ? 'border-b border-[#0d1f3c]' : ''}>
                    <td className="px-5 py-3.5 text-[#2d5a8e] font-mono text-xs">{c.id.slice(0, 8)}…</td>
                    <td className="px-5 py-3.5 text-[#7db4e8]">{c.label}</td>
                    <td className="px-5 py-3.5 text-[#3b82f6]">{c.store_name}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`/s/${c.id}`}
                        target="_blank"
                        className="text-[#2d5a8e] hover:text-[#60a5fa] font-mono text-xs transition-colors"
                      >
                        /s/{c.id.slice(0, 8)}…
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Store list */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-[#2d5a8e] tracking-widest uppercase mb-4">店舗一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.length === 0 ? (
            <p className="text-[#1e3c72] text-sm col-span-2 text-center py-8">店舗がありません</p>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="rounded-2xl bg-[#060f1e] silver-border card-glow p-5">
                <div className="flex items-center gap-3 mb-2">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#0d1f3c] silver-border flex items-center justify-center text-[#3b82f6] font-bold">
                      {store.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-[#bfdbfe] font-semibold text-sm">{store.name}</p>
                    <p className="text-[#1e3c72] text-xs font-mono">{store.id.slice(0, 8)}…</p>
                  </div>
                </div>
                {store.address && <p className="text-[#2d5a8e] text-xs mt-2">{store.address}</p>}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-[#060f1e] silver-border card-glow p-5">
      <p className="text-[#1e3c72] text-xs tracking-wider uppercase mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: 'available' | 'in_use' | 'offline' }) {
  const map = {
    available: { label: '利用可能', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
    in_use: { label: '使用中', color: '#facc15', bg: 'rgba(250,204,21,0.08)' },
    offline: { label: 'オフライン', color: '#2d5a8e', bg: 'rgba(45,90,142,0.15)' },
  }
  const s = map[status]
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  )
}
