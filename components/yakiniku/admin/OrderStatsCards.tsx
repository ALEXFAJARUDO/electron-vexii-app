import { type DemoOrder } from '@/lib/demoYakinikuOrders'

export default function OrderStatsCards({ orders }: { orders: DemoOrder[] }) {
  const newCount     = orders.filter(o => o.status === 'new').length
  const cookingCount = orders.filter(o => o.status === 'cooking').length
  const servedCount  = orders.filter(o => o.status === 'served').length
  const totalSales   = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0)

  return (
    <div className="grid grid-cols-4 gap-3">
      <Stat value={newCount}     label="新規"     color="text-red-400"    bg="border-red-500/40 bg-red-500/10"    icon="🔴" />
      <Stat value={cookingCount} label="調理中"   color="text-blue-400"   bg="border-blue-500/40 bg-blue-500/10"  icon="🔵" />
      <Stat value={servedCount}  label="提供済み" color="text-green-400"  bg="border-green-500/40 bg-green-500/10" icon="✅" />
      <Stat
        value={`¥${totalSales.toLocaleString()}`}
        label="本日売上概算"
        color="text-yellow-400"
        bg="border-yellow-500/40 bg-yellow-500/10"
        icon="💰"
      />
    </div>
  )
}

function Stat({
  value,
  label,
  color,
  bg,
  icon,
}: {
  value: number | string
  label: string
  color: string
  bg: string
  icon: string
}) {
  return (
    <div className={`rounded-2xl border p-4 ${bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-sm text-gray-400 font-medium">{label}</span>
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  )
}
