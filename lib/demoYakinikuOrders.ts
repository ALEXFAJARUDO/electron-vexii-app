export type OrderStatus = 'new' | 'cooking' | 'served' | 'cancelled'
export type ItemCategory = 'food' | 'drink'

export type OrderLineItem = {
  id: string
  name: string
  qty: number
  price: number
  category: ItemCategory
}

export type DemoOrder = {
  id: string
  tableId: string
  items: OrderLineItem[]
  status: OrderStatus
  placedAt: number
  total: number
  checkedItemIds: string[]
}

export function getDemoOrders(): DemoOrder[] {
  const now = Date.now()
  const ago = (m: number) => now - m * 60 * 1000

  return [
    {
      id: 'ord-001',
      tableId: '1',
      items: [
        { id: 'i001', name: '上カルビ', qty: 2, price: 1400, category: 'food' },
        { id: 'i002', name: 'タン塩', qty: 1, price: 1800, category: 'food' },
        { id: 'i003', name: '生ビール', qty: 2, price: 680, category: 'drink' },
      ],
      status: 'new',
      placedAt: ago(2),
      total: 5960,
      checkedItemIds: [],
    },
    {
      id: 'ord-002',
      tableId: '2',
      items: [
        { id: 'i004', name: 'ハラミ', qty: 2, price: 1850, category: 'food' },
        { id: 'i005', name: 'ロース', qty: 1, price: 2300, category: 'food' },
        { id: 'i006', name: 'キムチ', qty: 1, price: 400, category: 'food' },
        { id: 'i007', name: 'ハイボール', qty: 3, price: 530, category: 'drink' },
      ],
      status: 'cooking',
      placedAt: ago(8),
      total: 7990,
      checkedItemIds: [],
    },
    {
      id: 'ord-003',
      tableId: '2',
      items: [
        { id: 'i008', name: 'ハイボール', qty: 2, price: 530, category: 'drink' },
        { id: 'i009', name: 'ウーロン茶', qty: 1, price: 420, category: 'drink' },
      ],
      status: 'new',
      placedAt: ago(1),
      total: 1480,
      checkedItemIds: [],
    },
    {
      id: 'ord-004',
      tableId: '3',
      items: [
        { id: 'i010', name: '石焼ビビンバ', qty: 2, price: 1350, category: 'food' },
        { id: 'i011', name: 'ナムル盛り合わせ', qty: 1, price: 600, category: 'food' },
        { id: 'i012', name: '生ビール', qty: 2, price: 680, category: 'drink' },
        { id: 'i013', name: 'レモンサワー', qty: 1, price: 530, category: 'drink' },
      ],
      status: 'served',
      placedAt: ago(20),
      total: 5190,
      checkedItemIds: [],
    },
    {
      id: 'ord-005',
      tableId: '5',
      items: [
        { id: 'i014', name: '上カルビ', qty: 3, price: 1400, category: 'food' },
        { id: 'i015', name: 'タン塩', qty: 2, price: 1800, category: 'food' },
        { id: 'i016', name: '特撰ロース', qty: 1, price: 3000, category: 'food' },
        { id: 'i017', name: '生ビール', qty: 4, price: 680, category: 'drink' },
        { id: 'i018', name: 'ウーロン茶', qty: 1, price: 420, category: 'drink' },
      ],
      status: 'new',
      placedAt: ago(3),
      total: 13940,
      checkedItemIds: [],
    },
    {
      id: 'ord-006',
      tableId: '8',
      items: [
        { id: 'i019', name: 'ハラミ', qty: 1, price: 1850, category: 'food' },
        { id: 'i020', name: 'キムチ', qty: 1, price: 400, category: 'food' },
        { id: 'i021', name: 'ハイボール', qty: 2, price: 530, category: 'drink' },
      ],
      status: 'cooking',
      placedAt: ago(12),
      total: 3310,
      checkedItemIds: [],
    },
    {
      id: 'ord-007',
      tableId: '8',
      items: [
        { id: 'i022', name: '石焼ビビンバ', qty: 1, price: 1350, category: 'food' },
        { id: 'i023', name: 'ナムル盛り合わせ', qty: 1, price: 600, category: 'food' },
        { id: 'i024', name: '生ビール', qty: 1, price: 680, category: 'drink' },
      ],
      status: 'new',
      placedAt: ago(4),
      total: 2630,
      checkedItemIds: [],
    },
  ]
}
