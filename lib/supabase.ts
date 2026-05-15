import { createClient } from '@supabase/supabase-js'
import type { Charger, Store, Ad, Coupon } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const isConfigured =
  supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// --- helpers ---

export async function getChargerWithStore(chargerId: string): Promise<{
  charger: Charger | null
  store: Store | null
}> {
  if (!supabase) return DEMO_DATA.getChargerWithStore(chargerId)

  const { data: charger } = await supabase
    .from('chargers')
    .select('*')
    .eq('id', chargerId)
    .single()

  if (!charger) return { charger: null, store: null }

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('id', charger.store_id)
    .single()

  return { charger, store }
}

export async function getAds(storeId: string): Promise<Ad[]> {
  if (!supabase) return DEMO_DATA.getAds(storeId)
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('store_id', storeId)
    .eq('active', true)
    .order('sort_order')
  return data ?? []
}

export async function getCoupons(storeId: string): Promise<Coupon[]> {
  if (!supabase) return DEMO_DATA.getCoupons(storeId)
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('store_id', storeId)
    .eq('active', true)
    .order('expires_at')
  return data ?? []
}

export async function getAllAds(): Promise<Ad[]> {
  if (!supabase) return DEMO_DATA.allAds
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  return data ?? []
}

export async function getAllStores(): Promise<Store[]> {
  if (!supabase) return DEMO_DATA.stores
  const { data } = await supabase.from('stores').select('*').order('name')
  return data ?? []
}

export async function getAllChargers(): Promise<(Charger & { store_name: string })[]> {
  if (!supabase) return DEMO_DATA.chargers
  const { data } = await supabase
    .from('chargers')
    .select('*, stores(name)')
    .order('created_at', { ascending: false })
  return (data ?? []).map((c: Charger & { stores: { name: string } | null }) => ({
    ...c,
    store_name: c.stores?.name ?? '—',
  }))
}

// --- demo data for development without Supabase ---

const STORE_ID = '00000000-0000-0000-0000-000000000001'
const CHARGER_ID = '11111111-1111-1111-1111-111111111111'

const DEMO_DATA = {
  stores: [
    {
      id: STORE_ID,
      name: 'Demo Cafe',
      description: '居心地の良いカフェです',
      address: '東京都渋谷区道玄坂1-1-1',
      phone: '03-1234-5678',
      hours: '8:00〜22:00',
      logo_url: null,
      lat: 35.658,
      lng: 139.7016,
      wifi_ssid: 'VexiiCafe_5G',
      wifi_password: 'vexii2024',
      mobile_order_url: null,
      created_at: new Date().toISOString(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Vexii Lounge 新宿',
      description: 'ゆったりくつろげるラウンジ',
      address: '東京都新宿区西新宿1-1-1',
      phone: '03-9876-5432',
      hours: '10:00〜23:00',
      logo_url: null,
      lat: 35.6896,
      lng: 139.6917,
      wifi_ssid: 'VexiiLounge',
      wifi_password: 'lounge2024',
      mobile_order_url: null,
      created_at: new Date().toISOString(),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Electron Hub 品川',
      description: 'ビジネス利用に最適',
      address: '東京都品川区港南2-16-1',
      phone: null,
      hours: '7:00〜22:00',
      logo_url: null,
      lat: 35.6284,
      lng: 139.7388,
      wifi_ssid: null,
      wifi_password: null,
      mobile_order_url: null,
      created_at: new Date().toISOString(),
    },
  ] as Store[],

  chargers: [
    {
      id: CHARGER_ID,
      store_id: STORE_ID,
      label: 'テーブルA-1',
      status: 'available' as const,
      store_name: 'Demo Cafe',
      created_at: new Date().toISOString(),
    },
  ],

  getChargerWithStore(chargerId: string) {
    const charger = this.chargers.find((c) => c.id === chargerId) ?? null
    const store = charger ? (this.stores.find((s) => s.id === charger.store_id) ?? null) : null
    return { charger, store }
  },

  allAds: [
    {
      id: 'ad-1',
      store_id: STORE_ID,
      title: 'Demo Cafe — 充電中ドリンク割引',
      image_url: null,
      link_url: null,
      sort_order: 0,
      active: true,
    },
    {
      id: 'ad-2',
      store_id: '00000000-0000-0000-0000-000000000002',
      title: 'Vexii Lounge 新宿 — 新規オープン',
      image_url: null,
      link_url: null,
      sort_order: 1,
      active: true,
    },
    {
      id: 'ad-3',
      store_id: '00000000-0000-0000-0000-000000000003',
      title: 'Electron Hub 品川 — 法人プランあり',
      image_url: null,
      link_url: null,
      sort_order: 2,
      active: true,
    },
  ] as Ad[],

  getAds(storeId: string): Ad[] {
    return this.allAds.filter((a) => a.store_id === storeId)
  },

  getCoupons(storeId: string): Coupon[] {
    if (storeId !== STORE_ID) return []
    return [
      {
        id: 'coupon-1',
        store_id: STORE_ID,
        title: 'ドリンク10%OFF',
        description: '充電中にご利用いただけます',
        discount: '10% OFF',
        code: 'VEXII10',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
      },
    ]
  },
}
