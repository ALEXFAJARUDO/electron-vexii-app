// Supabase setup (run once):
// create table restaurant_orders (
//   id uuid default gen_random_uuid() primary key,
//   table_id text not null,
//   items jsonb not null default '[]',
//   status text not null default '未対応',
//   type text not null default 'order',
//   total integer not null default 0,
//   created_at timestamptz default now()
// );
// alter table restaurant_orders enable row level security;
// create policy "public" on restaurant_orders for all using (true) with check (true);
// alter publication supabase_realtime add table restaurant_orders;

import { supabase } from './supabase'

export type OrderStatus = '未対応' | '調理中' | '提供済み'
export type OrderType = 'order' | 'staff_call' | 'payment'
export type ItemCategory = 'drink' | 'food'

export type OrderItem = {
  id: number
  name: string
  price: number
  qty: number
  category: ItemCategory
}

export type RestaurantOrder = {
  id: string
  table_id: string
  items: OrderItem[]
  status: OrderStatus
  type: OrderType
  total: number
  created_at: string
}

export type MenuEntry = {
  id: number
  name: string
  desc: string
  price: number
  photo: string
  photoBg: string
  tag?: string
  category: ItemCategory
}

export type MenuSection = {
  id: string
  label: string
  emoji: string
  color: string
  bg: string
  border: string
  catType: ItemCategory
  items: MenuEntry[]
}

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'drink', label: 'ドリンク', emoji: '🍺', color: '#0ea5e9',
    bg: '#f0f9ff', border: '#bae6fd', catType: 'drink',
    items: [
      { id: 501, name: '生ビール',     desc: '中ジョッキ・キンキン冷え',    price: 580, photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', tag: '人気', category: 'drink' },
      { id: 502, name: 'ハイボール',   desc: 'ウイスキーソーダ割り',        price: 480, photo: '🥃', photoBg: 'linear-gradient(135deg,#475569,#334155)', category: 'drink' },
      { id: 506, name: 'レモンサワー', desc: '生レモン搾りたて',            price: 480, photo: '🍋', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', tag: '人気', category: 'drink' },
      { id: 503, name: '酎ハイ',       desc: 'グレープフルーツ・梅',        price: 480, photo: '🍹', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', category: 'drink' },
      { id: 504, name: '日本酒',       desc: '季節の地酒・1合',             price: 680, photo: '🍶', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)', category: 'drink' },
      { id: 505, name: '焼酎',         desc: '芋/麦/米・ロック/水割り',     price: 580, photo: '🥃', photoBg: 'linear-gradient(135deg,#1e40af,#1d4ed8)', category: 'drink' },
    ],
  },
  {
    id: 'speed', label: 'スピード', emoji: '⚡', color: '#f97316',
    bg: '#fff7ed', border: '#fed7aa', catType: 'food',
    items: [
      { id: 101, name: 'キムチ',   desc: '辛さ3段階から選択',           price: 380, photo: '🥬', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', category: 'food' },
      { id: 102, name: '枝豆',     desc: '塩ゆでほくほく',               price: 280, photo: '🫛', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)', category: 'food' },
      { id: 103, name: 'お漬物',   desc: '季節の野菜盛り合わせ',         price: 320, photo: '🥒', photoBg: 'linear-gradient(135deg,#65a30d,#4d7c0f)', category: 'food' },
      { id: 104, name: 'たこわさ', desc: '新鮮タコとわさびの絶妙な相性', price: 480, photo: '🐙', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', category: 'food' },
    ],
  },
  {
    id: 'recommend', label: 'おすすめ', emoji: '⭐', color: '#eab308',
    bg: '#fefce8', border: '#fde68a', catType: 'food',
    items: [
      { id: 201, name: '刺身7種盛り',   desc: '本日の鮮魚7種',          price: 1980, photo: '🐟', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', tag: '人気', category: 'food' },
      { id: 202, name: '鴨ロースト',    desc: '特製ソース仕立て',        price: 1480, photo: '🦆', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', tag: 'NEW',  category: 'food' },
      { id: 203, name: '厚切り塩タン', desc: 'レモン添え・柔らか仕上げ', price: 1280, photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#991b1b)',                 category: 'food' },
      { id: 204, name: '神戸牛ステーキ', desc: 'A5ランク神戸牛',          price: 4800, photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', tag: '特選', category: 'food' },
      { id: 205, name: 'サムゲタン',    desc: '国産鶏の参鶏湯',          price: 1580, photo: '🍲', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)',                 category: 'food' },
    ],
  },
  {
    id: 'yaki', label: '焼き物', emoji: '🔥', color: '#b45309',
    bg: '#fffbeb', border: '#fde68a', catType: 'food',
    items: [
      { id: 601, name: '焼き鳥盛り合わせ', desc: '5本・塩orタレ選択',       price: 780, photo: '🍢', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', tag: '人気', category: 'food' },
      { id: 602, name: '牛タン塩焼き',     desc: '厚切り・レモン添え',       price: 980, photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)',               category: 'food' },
      { id: 603, name: '豚バラねぎ塩',     desc: 'ジューシー豚バラ炭火焼き', price: 680, photo: '🐷', photoBg: 'linear-gradient(135deg,#f97316,#ea580c)',               category: 'food' },
      { id: 604, name: 'ししとう',          desc: '炭火香ばしい一品',         price: 380, photo: '🫑', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)',               category: 'food' },
    ],
  },
  {
    id: 'age', label: '揚げ物', emoji: '🍗', color: '#d97706',
    bg: '#fefce8', border: '#fef08a', catType: 'food',
    items: [
      { id: 701, name: '唐揚げ',         desc: '国産鶏・ニンニク醤油',     price: 680, photo: '🍗', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', tag: '人気', category: 'food' },
      { id: 702, name: 'フライドポテト', desc: '塩・チーズから選択',        price: 480, photo: '🍟', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)',               category: 'food' },
      { id: 703, name: '手羽先',         desc: 'スパイシー甘辛ダレ',        price: 580, photo: '🍗', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)',               category: 'food' },
      { id: 704, name: '海老フライ',     desc: 'タルタルソース添え',        price: 780, photo: '🦐', photoBg: 'linear-gradient(135deg,#f97316,#ea580c)',               category: 'food' },
    ],
  },
  {
    id: 'shime', label: '締め', emoji: '🍜', color: '#6366f1',
    bg: '#eef2ff', border: '#c7d2fe', catType: 'food',
    items: [
      { id: 801, name: '〆ラーメン',  desc: '鶏白湯スープ',             price: 680, photo: '🍜', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', tag: '人気', category: 'food' },
      { id: 802, name: 'お茶漬け',   desc: '梅・鮭・明太子から選択',    price: 580, photo: '🍵', photoBg: 'linear-gradient(135deg,#059669,#047857)',               category: 'food' },
      { id: 803, name: 'チャーハン', desc: '半熟卵と特製XO醤',          price: 680, photo: '🍳', photoBg: 'linear-gradient(135deg,#92400e,#78350f)',               category: 'food' },
      { id: 804, name: 'うどん',     desc: '釜揚げ・ぶっかけから選択',  price: 580, photo: '🍜', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)',               category: 'food' },
    ],
  },
]

export const ALL_MENU_ITEMS: MenuEntry[] = MENU_SECTIONS.flatMap(s => s.items)

// ---- Storage (localStorage + BroadcastChannel fallback) ----

const LS_KEY = 'vexii_restaurant_orders'

function getBC(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  try { return new BroadcastChannel('restaurant_orders') } catch { return null }
}

function lsGet(): RestaurantOrder[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] }
}

function lsSet(orders: RestaurantOrder[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(orders))
  getBC()?.postMessage('update')
}

// ---- Public API ----

export async function submitOrder(
  order: Omit<RestaurantOrder, 'id' | 'created_at'>,
): Promise<RestaurantOrder> {
  const newOrder: RestaurantOrder = {
    ...order,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  if (supabase) {
    const { data, error } = await supabase
      .from('restaurant_orders')
      .insert(newOrder)
      .select()
      .single()
    if (!error && data) return data as RestaurantOrder
  }
  const orders = lsGet()
  orders.unshift(newOrder)
  lsSet(orders)
  return newOrder
}

export async function fetchOrders(tableId?: string): Promise<RestaurantOrder[]> {
  if (supabase) {
    const base = supabase
      .from('restaurant_orders')
      .select('*')
      .order('created_at', { ascending: false })
    const q = tableId ? base.eq('table_id', tableId) : base
    const { data } = await q
    if (data) return data as RestaurantOrder[]
  }
  const all = lsGet()
  return tableId ? all.filter(o => o.table_id === tableId) : all
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (supabase) {
    await supabase.from('restaurant_orders').update({ status }).eq('id', id)
    return
  }
  const orders = lsGet()
  const idx = orders.findIndex(o => o.id === id)
  if (idx !== -1) { orders[idx].status = status; lsSet(orders) }
}

export function subscribeOrders(onUpdate: () => void): () => void {
  if (supabase) {
    const sb = supabase
    const ch = sb
      .channel('ro_changes_' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_orders' }, onUpdate)
      .subscribe()
    return () => { sb.removeChannel(ch) }
  }
  const bc = getBC()
  bc?.addEventListener('message', onUpdate)
  return () => bc?.removeEventListener('message', onUpdate)
}

export function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`
  return `${Math.floor(diff / 3600)}時間前`
}
