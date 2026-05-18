'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/lib/restaurantSession'

const DEMO_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8']

export default function NFCPage() {
  return (
    <Suspense>
      <NFCContent />
    </Suspense>
  )
}

function NFCContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session, isLoading, startSession } = useSession()
  const [scanning, setScanning] = useState(false)
  const [scannedTable, setScannedTable] = useState<string | null>(null)

  // 既存セッションがあれば元のテーブルへ
  useEffect(() => {
    if (!isLoading && session) {
      router.replace(`/restaurant/${session.tableId}`)
    }
  }, [isLoading, session, router])

  // URLパラメータ ?table=X でNFCタグから直接遷移した場合
  useEffect(() => {
    const t = searchParams.get('table')
    if (t && !scanning) handleTap(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleTap(tableId: string) {
    if (scanning) return
    setScannedTable(tableId)
    setScanning(true)
    setTimeout(() => {
      startSession(tableId)
      router.push(`/restaurant/${tableId}`)
    }, 1400)
  }

  if (isLoading) return null

  return (
    <div className="min-h-dvh bg-gray-950 flex flex-col items-center justify-center px-6">

      {/* ロゴ */}
      <div className="mb-8 opacity-80">
        <img src="/restaurant-logo.png" alt="翠旬" style={{ height: 44, width: 'auto', filter: 'brightness(0) invert(1)' }} />
      </div>

      {scanning ? (
        /* スキャン中アニメーション */
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30" />
            <span className="absolute inset-4 rounded-full border-2 border-emerald-400 animate-ping opacity-50" style={{ animationDelay: '0.2s' }} />
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-emerald-400 font-black text-xl">テーブル {scannedTable} を認証中…</p>
            <p className="text-gray-500 text-sm mt-1">セッションを開始しています</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-6">

          {/* NFCアニメーション */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-gray-700 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
              <span className="absolute inset-4 rounded-full border border-gray-600 animate-ping opacity-30" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <span className="absolute inset-8 rounded-full border border-gray-500 animate-ping opacity-40" style={{ animationDuration: '2s', animationDelay: '1s' }} />
              <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                </svg>
              </div>
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">テーブルにスマートフォンを<br/>タッチしてください</p>
              <p className="text-gray-500 text-xs mt-2">NFCでセッションを開始します</p>
            </div>
          </div>

          {/* 区切り */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <p className="text-gray-600 text-xs font-semibold">またはテーブルを選択</p>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* テーブル選択 (デモ用) */}
          <div>
            <p className="text-gray-500 text-xs font-semibold mb-3 text-center">デモ用テーブル選択</p>
            <div className="grid grid-cols-4 gap-2">
              {DEMO_TABLES.map(t => (
                <button
                  key={t}
                  onClick={() => handleTap(t)}
                  className="aspect-square rounded-2xl bg-gray-800 border border-gray-700 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all active:bg-gray-700"
                >
                  <span className="text-xs text-gray-500 font-semibold">卓</span>
                  <span className="text-white font-black text-lg leading-none">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-700 text-[10px] text-center">
            セッションは30分間の無操作で自動終了します
          </p>
        </div>
      )}
    </div>
  )
}
