export type Charger = {
  id: string
  store_id: string
  label: string
  status: 'available' | 'in_use' | 'offline'
  created_at: string
}

export type Store = {
  id: string
  name: string
  description: string
  address: string
  phone: string | null
  hours: string | null
  logo_url: string | null
  lat: number | null
  lng: number | null
  wifi_ssid: string | null
  wifi_password: string | null
  mobile_order_url: string | null
  created_at: string
}

export type Ad = {
  id: string
  store_id: string
  image_url: string | null
  link_url: string | null
  title: string
  sort_order: number
  active: boolean
}

export type Coupon = {
  id: string
  store_id: string
  title: string
  description: string
  discount: string
  code: string
  expires_at: string | null
  active: boolean
}
