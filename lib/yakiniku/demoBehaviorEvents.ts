export type BehaviorEventType =
  | 'nfc_login'
  | 'menu_view'
  | 'cart_add'
  | 'order_submit'
  | 'staff_call'
  | 'payment_request'
  | 'ad_click'
  | 'coupon_view'

export type BehaviorEvent = {
  id: string
  tableId: string
  eventType: BehaviorEventType
  detail: string
  timestamp: number
}

const EVENT_LABELS: Record<BehaviorEventType, string> = {
  nfc_login: 'NFCログイン',
  menu_view: 'メニュー閲覧',
  cart_add: 'カート追加',
  order_submit: '注文送信',
  staff_call: 'スタッフ呼び出し',
  payment_request: '会計依頼',
  ad_click: '広告クリック',
  coupon_view: 'クーポン閲覧',
}

export function getEventLabel(type: BehaviorEventType): string {
  return EVENT_LABELS[type]
}

export type EventTypeStat = {
  type: BehaviorEventType
  label: string
  count: number
}

export function getDemoBehaviorEvents(): BehaviorEvent[] {
  const now = Date.now()
  const ago = (m: number) => now - m * 60 * 1000

  return [
    { id: 'ev-001', tableId: '1', eventType: 'nfc_login',       detail: 'テーブル1 NFCタップ',       timestamp: ago(72) },
    { id: 'ev-002', tableId: '1', eventType: 'menu_view',        detail: '焼肉・ホルモンカテゴリ閲覧',  timestamp: ago(70) },
    { id: 'ev-003', tableId: '1', eventType: 'cart_add',         detail: '上カルビ × 2',             timestamp: ago(68) },
    { id: 'ev-004', tableId: '1', eventType: 'cart_add',         detail: '生ビール × 2',             timestamp: ago(67) },
    { id: 'ev-005', tableId: '1', eventType: 'order_submit',     detail: '合計 ¥5,960',              timestamp: ago(67) },
    { id: 'ev-006', tableId: '1', eventType: 'menu_view',        detail: 'ドリンクカテゴリ閲覧',       timestamp: ago(50) },
    { id: 'ev-007', tableId: '1', eventType: 'ad_click',         detail: '飲み放題延長広告クリック',   timestamp: ago(45) },
    { id: 'ev-008', tableId: '1', eventType: 'cart_add',         detail: 'レモンサワー × 2',          timestamp: ago(40) },
    { id: 'ev-009', tableId: '1', eventType: 'order_submit',     detail: '合計 ¥1,060',              timestamp: ago(40) },
    { id: 'ev-010', tableId: '1', eventType: 'staff_call',       detail: '網交換依頼',               timestamp: ago(20) },

    { id: 'ev-011', tableId: '2', eventType: 'nfc_login',        detail: 'テーブル2 NFCタップ',       timestamp: ago(55) },
    { id: 'ev-012', tableId: '2', eventType: 'menu_view',        detail: 'コース・セットカテゴリ閲覧', timestamp: ago(54) },
    { id: 'ev-013', tableId: '2', eventType: 'cart_add',         detail: '肉三昧コース × 2',         timestamp: ago(52) },
    { id: 'ev-014', tableId: '2', eventType: 'order_submit',     detail: '合計 ¥12,000',             timestamp: ago(52) },
    { id: 'ev-015', tableId: '2', eventType: 'menu_view',        detail: '一品メニューカテゴリ閲覧',  timestamp: ago(30) },
    { id: 'ev-016', tableId: '2', eventType: 'coupon_view',      detail: 'クーポン一覧閲覧',          timestamp: ago(25) },

    { id: 'ev-017', tableId: '3', eventType: 'nfc_login',        detail: 'テーブル3 NFCタップ',       timestamp: ago(35) },
    { id: 'ev-018', tableId: '3', eventType: 'menu_view',        detail: '焼肉・ホルモンカテゴリ閲覧', timestamp: ago(34) },
    { id: 'ev-019', tableId: '3', eventType: 'cart_add',         detail: 'タン塩 × 1',              timestamp: ago(33) },
    { id: 'ev-020', tableId: '3', eventType: 'cart_add',         detail: '角ハイボール × 2',         timestamp: ago(33) },
    { id: 'ev-021', tableId: '3', eventType: 'order_submit',     detail: '合計 ¥3,460',              timestamp: ago(32) },

    { id: 'ev-022', tableId: '5', eventType: 'nfc_login',        detail: 'テーブル5 NFCタップ',       timestamp: ago(118) },
    { id: 'ev-023', tableId: '5', eventType: 'menu_view',        detail: 'コース・セットカテゴリ閲覧', timestamp: ago(116) },
    { id: 'ev-024', tableId: '5', eventType: 'order_submit',     detail: '合計 ¥13,940',             timestamp: ago(115) },
    { id: 'ev-025', tableId: '5', eventType: 'menu_view',        detail: 'ドリンクカテゴリ閲覧',      timestamp: ago(90) },
    { id: 'ev-026', tableId: '5', eventType: 'order_submit',     detail: '合計 ¥3,180',              timestamp: ago(85) },
    { id: 'ev-027', tableId: '5', eventType: 'ad_click',         detail: '締めメニュー広告クリック',  timestamp: ago(30) },
    { id: 'ev-028', tableId: '5', eventType: 'payment_request',  detail: '会計依頼',                 timestamp: ago(5) },
  ]
}

export function getEventTypeStats(events: BehaviorEvent[]): EventTypeStat[] {
  const counts: Partial<Record<BehaviorEventType, number>> = {}
  for (const ev of events) {
    counts[ev.eventType] = (counts[ev.eventType] ?? 0) + 1
  }
  return (Object.entries(counts) as [BehaviorEventType, number][])
    .map(([type, count]) => ({ type, label: EVENT_LABELS[type], count }))
    .sort((a, b) => b.count - a.count)
}
