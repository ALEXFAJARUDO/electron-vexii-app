'use client'

import dynamic from 'next/dynamic'
import type { Store } from '@/lib/types'

const StoreMapLeaflet = dynamic(() => import('./StoreMapLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#060f1e]">
      <div className="text-[#2d5a8e] text-sm animate-pulse">地図を読み込み中…</div>
    </div>
  ),
})

export default function StoreMapClient({ stores }: { stores: Store[] }) {
  return <StoreMapLeaflet stores={stores} />
}
