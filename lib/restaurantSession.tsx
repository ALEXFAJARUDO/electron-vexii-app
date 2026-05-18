'use client'
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const SESSION_KEY = 'vexii_restaurant_session'
export const INACTIVITY_MS = 30 * 60 * 1000 // 30分

export type Session = {
  tableId: string
  sessionId: string
  startedAt: number
  lastActivityAt: number
}

type SessionCtx = {
  session: Session | null
  isLoading: boolean
  startSession: (tableId: string) => Session
  endSession: () => void
  refreshActivity: () => void
  remainingSec: number
  showLogoutModal: boolean
  setShowLogoutModal: (v: boolean) => void
  isExpiringSoon: boolean // < 5分
  isCritical: boolean     // < 2分
}

const SessionContext = createContext<SessionCtx | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [remainingSec, setRemainingSec] = useState(INACTIVITY_MS / 1000)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // ── localStorage から復元 ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) {
        const s: Session = JSON.parse(raw)
        if (Date.now() - s.lastActivityAt < INACTIVITY_MS) {
          setSession(s)
          setRemainingSec(Math.floor((INACTIVITY_MS - (Date.now() - s.lastActivityAt)) / 1000))
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      }
    } catch {}
    setIsLoading(false)
  }, [])

  // ── カウントダウンタイマー (localStorage から最新の lastActivityAt を読む) ──
  const sessionIdRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    sessionIdRef.current = session?.sessionId
    if (!session) { setRemainingSec(INACTIVITY_MS / 1000); return }

    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem(SESSION_KEY)
        if (!raw) { internalEnd(); return }
        const s: Session = JSON.parse(raw)
        const elapsed = Date.now() - s.lastActivityAt
        const remaining = Math.max(0, INACTIVITY_MS - elapsed)
        setRemainingSec(Math.floor(remaining / 1000))
        if (remaining === 0) internalEnd()
      } catch {}
    }, 1000)

    return () => clearInterval(id)
  }, [session?.sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── グローバルな操作でアクティビティ更新 ──
  const refreshRef = useRef<() => void>(() => {})
  useEffect(() => {
    const handler = () => refreshRef.current()
    window.addEventListener('pointerdown', handler, { passive: true })
    window.addEventListener('keydown', handler, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [])

  function internalEnd() {
    setSession(null)
    setRemainingSec(INACTIVITY_MS / 1000)
    setShowLogoutModal(false)
    localStorage.removeItem(SESSION_KEY)
  }

  function startSession(tableId: string): Session {
    const s: Session = {
      tableId,
      sessionId: crypto.randomUUID(),
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
    }
    setSession(s)
    setRemainingSec(INACTIVITY_MS / 1000)
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    return s
  }

  function endSession() {
    internalEnd()
  }

  const refreshActivity = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev
      const updated = { ...prev, lastActivityAt: Date.now() }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // refreshRef を最新の refreshActivity に保つ
  useEffect(() => { refreshRef.current = refreshActivity }, [refreshActivity])

  return (
    <SessionContext.Provider value={{
      session,
      isLoading,
      startSession,
      endSession,
      refreshActivity,
      remainingSec,
      showLogoutModal,
      setShowLogoutModal,
      isExpiringSoon: remainingSec < 5 * 60,
      isCritical: remainingSec < 2 * 60,
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionCtx {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be inside SessionProvider')
  return ctx
}

export function formatRemaining(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
