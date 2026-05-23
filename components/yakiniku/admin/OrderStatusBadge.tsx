import { type OrderStatus } from '@/lib/demoYakinikuOrders'

const STATUS = {
  new:       { label: '新規',      bg: 'bg-red-500',   pulse: true  },
  cooking:   { label: '調理中',    bg: 'bg-blue-500',  pulse: false },
  served:    { label: '提供済み',  bg: 'bg-green-600', pulse: false },
  cancelled: { label: 'キャンセル', bg: 'bg-gray-600',  pulse: false },
}

export default function OrderStatusBadge({
  status,
  large,
}: {
  status: OrderStatus
  large?: boolean
}) {
  const s = STATUS[status]
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold text-white whitespace-nowrap
        ${large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}
        ${s.bg}
        ${s.pulse ? 'animate-pulse' : ''}
      `}
    >
      {s.label}
    </span>
  )
}
