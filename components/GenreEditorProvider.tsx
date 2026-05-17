'use client'
import { createContext, useContext, useState } from 'react'

type Tab = 'info' | 'wifi' | 'coupons' | 'media' | 'menu' | 'floor' | 'schedule'

type Ctx = {
  saveFn: (() => void) | null
  setSaveFn: (fn: (() => void) | null) => void
  saved: boolean
  setSaved: (v: boolean) => void
  tab: Tab
  setTab: (t: Tab) => void
  availableTabs: { id: Tab; label: string }[]
  setAvailableTabs: (tabs: { id: Tab; label: string }[]) => void
}

const GenreEditorCtx = createContext<Ctx>({
  saveFn: null, setSaveFn: () => {},
  saved: false, setSaved: () => {},
  tab: 'info', setTab: () => {},
  availableTabs: [], setAvailableTabs: () => {},
})

export function GenreEditorProvider({ children }: { children: React.ReactNode }) {
  const [saveFn, setSaveFn] = useState<(() => void) | null>(null)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<Tab>('info')
  const [availableTabs, setAvailableTabs] = useState<{ id: Tab; label: string }[]>([])

  return (
    <GenreEditorCtx.Provider value={{ saveFn, setSaveFn, saved, setSaved, tab, setTab, availableTabs, setAvailableTabs }}>
      {children}
    </GenreEditorCtx.Provider>
  )
}

export const useGenreEditor = () => useContext(GenreEditorCtx)
export type { Tab }
