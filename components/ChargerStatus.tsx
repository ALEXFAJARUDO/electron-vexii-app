import type { Charger } from '@/lib/types'

const STATUS = {
  available: { label: '利用可能', color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e', border: '#bbf7d0' },
  in_use:    { label: '使用中',   color: '#ca8a04', bg: '#fefce8', dot: '#eab308', border: '#fde68a' },
  offline:   { label: 'オフライン', color: '#9ca3af', bg: '#f9fafb', dot: '#d1d5db', border: '#e5e7eb' },
}

export default function ChargerStatus({ charger }: { charger: Charger }) {
  const s = STATUS[charger.status]

  return (
    <div className="card-light p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Charger</p>
          <h3 className="text-gray-800 font-semibold">{charger.label}</h3>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
          style={{ background: s.bg, color: s.color, borderColor: s.border }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.dot }} />
          {s.label}
        </div>
      </div>
    </div>
  )
}
