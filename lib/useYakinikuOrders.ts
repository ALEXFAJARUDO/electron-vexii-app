'use client'
import { useState, useEffect, useCallback } from 'react'
import { getDemoOrders, type DemoOrder, type OrderStatus } from './demoYakinikuOrders'

const STORAGE_KEY = 'yakiniku_admin_orders'

export function useYakinikuOrders() {
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = (): DemoOrder[] => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
      } catch {}
      return getDemoOrders()
    }
    setOrders(load())
    setLoaded(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try { setOrders(JSON.parse(e.newValue)) } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const updateStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const resetToDemo = useCallback(() => {
    const demo = getDemoOrders()
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(demo)) } catch {}
    setOrders(demo)
  }, [])

  return { orders, updateStatus, resetToDemo, loaded }
}
