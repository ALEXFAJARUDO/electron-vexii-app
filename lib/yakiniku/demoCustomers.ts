export type CustomerRank = 'new' | 'repeat' | 'regular' | 'vip'

export type DemoCustomer = {
  anonymousId: string
  rank: CustomerRank
  visitCount: number
  avgOrderAmount: number
  favoriteCategory: string
  lastVisitDate: string
  tags: string[]
  couponEligible: boolean
  couponCode?: string
}

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    anonymousId: 'anon-A4F2',
    rank: 'regular',
    visitCount: 8,
    avgOrderAmount: 7200,
    favoriteCategory: '焼肉・カルビ',
    lastVisitDate: '2026-05-20',
    tags: ['常連候補', '肉多め', 'ドリンク少なめ'],
    couponEligible: true,
    couponCode: 'REGULAR10',
  },
  {
    anonymousId: 'anon-B9C1',
    rank: 'vip',
    visitCount: 15,
    avgOrderAmount: 12400,
    favoriteCategory: '特選コース',
    lastVisitDate: '2026-05-22',
    tags: ['VIP', '高単価', 'コース注文多め'],
    couponEligible: true,
    couponCode: 'VIP20',
  },
  {
    anonymousId: 'anon-C3E7',
    rank: 'repeat',
    visitCount: 3,
    avgOrderAmount: 5600,
    favoriteCategory: '焼肉・ホルモン',
    lastVisitDate: '2026-05-18',
    tags: ['リピーター', 'ホルモン好き'],
    couponEligible: true,
    couponCode: 'REPEAT5',
  },
  {
    anonymousId: 'anon-D7A5',
    rank: 'new',
    visitCount: 1,
    avgOrderAmount: 9800,
    favoriteCategory: '特選コース',
    lastVisitDate: '2026-05-25',
    tags: ['初回来店', '高単価注文', 'VIP候補'],
    couponEligible: false,
  },
  {
    anonymousId: 'anon-E1B8',
    rank: 'repeat',
    visitCount: 5,
    avgOrderAmount: 4200,
    favoriteCategory: 'ドリンク・デザート',
    lastVisitDate: '2026-05-15',
    tags: ['リピーター', 'ドリンク多め'],
    couponEligible: true,
    couponCode: 'REPEAT5',
  },
  {
    anonymousId: 'anon-F6D3',
    rank: 'regular',
    visitCount: 12,
    avgOrderAmount: 6800,
    favoriteCategory: '焼肉・カルビ',
    lastVisitDate: '2026-05-24',
    tags: ['常連', '家族連れ', 'ランチ利用多め'],
    couponEligible: true,
    couponCode: 'REGULAR10',
  },
]

export const RANK_LABELS: Record<CustomerRank, string> = {
  new: '初回',
  repeat: 'リピーター',
  regular: '常連候補',
  vip: 'VIP',
}

export const RANK_COLORS: Record<CustomerRank, string> = {
  new: '#22c55e',
  repeat: '#3b82f6',
  regular: '#f59e0b',
  vip: '#ec4899',
}
