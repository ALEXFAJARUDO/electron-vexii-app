import { getAllStores, getAllChargers } from '@/lib/supabase'

export default async function AdminPage() {
  const [stores, chargers] = await Promise.all([getAllStores(), getAllChargers()])

  const available = chargers.filter((c) => c.status === 'available').length
  const inUse = chargers.filter((c) => c.status === 'in_use').length

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">ダッシュボード</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="店舗数" value={stores.length} color="text-blue-500" />
        <StatCard label="充電器" value={chargers.length} color="text-blue-500" />
        <StatCard label="利用可能" value={available} color="text-green-500" />
        <StatCard label="使用中" value={inUse} color="text-amber-500" />
      </div>

      {/* Charger list */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">充電器一覧</h2>
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          {chargers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">充電器がありません</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs tracking-wider">ラベル</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs tracking-wider">店舗</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs tracking-wider">ステータス</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs tracking-wider">URL</th>
                </tr>
              </thead>
              <tbody>
                {chargers.map((c, i) => (
                  <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${i < chargers.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <td className="px-5 py-3.5 text-gray-300 font-mono text-xs">{c.id.slice(0, 8)}…</td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{c.label}</td>
                    <td className="px-5 py-3.5 text-gray-500">{c.store_name}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`/s/${c.id}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-600 font-mono text-xs transition-colors"
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
      <section className="mt-8">
        <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">店舗一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.length === 0 ? (
            <p className="text-gray-400 text-sm col-span-2 text-center py-8">店舗がありません</p>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-2">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                      {store.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">{store.name}</p>
                    <p className="text-gray-300 text-xs font-mono">{store.id.slice(0, 8)}…</p>
                  </div>
                </div>
                {store.address && <p className="text-gray-400 text-xs mt-2">{store.address}</p>}
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
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
      <p className="text-gray-400 text-xs tracking-wider uppercase mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: 'available' | 'in_use' | 'offline' }) {
  const map = {
    available: { label: '利用可能', cls: 'bg-green-50 text-green-600' },
    in_use:    { label: '使用中',   cls: 'bg-amber-50 text-amber-600' },
    offline:   { label: 'オフライン', cls: 'bg-gray-100 text-gray-400' },
  }
  const s = map[status]
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}
