export type GenreId =
  | 'restaurant' | 'cafe' | 'hotel' | 'concert' | 'racing'
  | 'stadium' | 'hospital' | 'airport' | 'mall' | 'convenience' | 'theme-park'

export type Coupon = {
  id: string
  title: string
  code: string
  discount: string
  expires: string
}

export type MenuItem = {
  id: string
  category: string
  name: string
  desc: string
  price: number
  tag: string
}

export type FloorEntry = {
  id: string
  floor: string
  name: string
  icon: string
}

export type ScheduleEntry = {
  id: string
  date: string
  title: string
  note: string
}

export type GenreConfig = {
  storeName: string
  address: string
  hours: string
  phone: string
  wifiSsid: string
  wifiPassword: string
  logoImage: string
  kvImage: string
  heroImageUrl: string
  youtubeUrl: string
  coupons: Coupon[]
  menuItems: MenuItem[]
  floorEntries: FloorEntry[]
  scheduleEntries: ScheduleEntry[]
}

export const DEFAULT_CONFIG: GenreConfig = {
  storeName: '',
  address: '',
  hours: '',
  phone: '',
  wifiSsid: '',
  wifiPassword: '',
  logoImage: '',
  kvImage: '',
  heroImageUrl: '',
  youtubeUrl: '',
  coupons: [],
  menuItems: [],
  floorEntries: [],
  scheduleEntries: [],
}

export type GenreMeta = {
  id: GenreId
  label: string
  emoji: string
  color: string
  light: string
  bg: string
  border: string
  hasMenu: boolean
  hasFloor: boolean
  hasSchedule: boolean
}

export const GENRES: GenreMeta[] = [
  { id: 'cafe',        label: 'カフェ',             emoji: '☕', color: '#92400e', light: '#fbbf24', bg: '#fffbeb', border: '#fde68a', hasMenu: true,  hasFloor: false, hasSchedule: false },
  { id: 'restaurant',  label: '飲食店',             emoji: '🍽️', color: '#f97316', light: '#fdba74', bg: '#fff7ed', border: '#fed7aa', hasMenu: true,  hasFloor: false, hasSchedule: false },
  { id: 'convenience', label: 'コンビニ',           emoji: '🏪', color: '#0ea5e9', light: '#7dd3fc', bg: '#f0f9ff', border: '#bae6fd', hasMenu: true,  hasFloor: false, hasSchedule: false },
  { id: 'stadium',     label: '球場',               emoji: '🏟️', color: '#22c55e', light: '#86efac', bg: '#f0fdf4', border: '#bbf7d0', hasMenu: false, hasFloor: true,  hasSchedule: true  },
  { id: 'hotel',       label: 'ホテル',             emoji: '🏨', color: '#a855f7', light: '#d8b4fe', bg: '#faf5ff', border: '#e9d5ff', hasMenu: true,  hasFloor: true,  hasSchedule: false },
  { id: 'racing',      label: '公営競技場',         emoji: '🏁', color: '#ef4444', light: '#fca5a5', bg: '#fff1f2', border: '#fecdd3', hasMenu: false, hasFloor: false, hasSchedule: true  },
  { id: 'mall',        label: 'ショッピングモール', emoji: '🛍️', color: '#8b5cf6', light: '#c4b5fd', bg: '#f5f3ff', border: '#ddd6fe', hasMenu: false, hasFloor: true,  hasSchedule: false },
  { id: 'airport',     label: '空港',               emoji: '✈️', color: '#0ea5e9', light: '#7dd3fc', bg: '#f0f9ff', border: '#bae6fd', hasMenu: false, hasFloor: true,  hasSchedule: true  },
  { id: 'theme-park',  label: 'テーマパーク',       emoji: '🎡', color: '#ec4899', light: '#f9a8d4', bg: '#fdf2f8', border: '#fbcfe8', hasMenu: false, hasFloor: false, hasSchedule: true  },
  { id: 'concert',     label: 'コンサート会場',     emoji: '🎵', color: '#7c3aed', light: '#c4b5fd', bg: '#f5f3ff', border: '#ddd6fe', hasMenu: false, hasFloor: false, hasSchedule: true  },
  { id: 'hospital',    label: '病院',               emoji: '🏥', color: '#10b981', light: '#6ee7b7', bg: '#ecfdf5', border: '#a7f3d0', hasMenu: false, hasFloor: true,  hasSchedule: false },
]

export function getGenre(id: string): GenreMeta | undefined {
  return GENRES.find((g) => g.id === id)
}

export const STORAGE_KEY = (id: string) => `genreConfig_${id}`

export const GENRE_IMAGE_DEFAULTS: Partial<Record<GenreId, { kvImage: string; logoImage: string }>> = {
  cafe:          { kvImage: '/uploads/cafe/kv.png',    logoImage: '/uploads/cafe/logo.png' },
  restaurant:    { kvImage: '/restaurant-hero.png',   logoImage: '/restaurant-logo.png' },
  convenience:   { kvImage: '/convenience-hero.png',  logoImage: '/convenience-logo.png' },
  stadium:       { kvImage: '/stadium-hero.png',      logoImage: '/stadium-logo.png' },
  hotel:         { kvImage: '/hotel-hero.png',        logoImage: '/hotel-logo.png' },
  racing:        { kvImage: '',                       logoImage: '' },
  mall:          { kvImage: '/mall-hero.png',         logoImage: '/mall-logo.png' },
  airport:       { kvImage: '/airport-hero.png',      logoImage: '/airport-logo.png' },
  'theme-park':  { kvImage: '/themepark-hero.png',    logoImage: '/themepark-logo.png' },
  concert:       { kvImage: '',                       logoImage: '' },
  hospital:      { kvImage: '/hospital-hero.png',     logoImage: '/hospital-logo.png' },
}
