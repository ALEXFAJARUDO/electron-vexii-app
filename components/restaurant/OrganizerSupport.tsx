'use client'
import { useState, useEffect, useRef } from 'react'
import { type RestaurantOrder } from '@/lib/restaurantOrder'

type Props = {
  history: RestaurantOrder[]
  tableId: string
  onRequestPayment: () => void
  onCallStaff: () => void
}

const NOMIHODAI_MINUTES = 90

export default function OrganizerSupport({ history, onRequestPayment, onCallStaff }: Props) {
  const [headcount, setHeadcount] = useState(4)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerStart, setTimerStart] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [extensions, setExtensions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = history.filter(o => o.type === 'order').reduce((s, o) => s + o.total, 0)
  const perPerson = headcount > 0 ? Math.ceil(total / headcount) : 0

  const limitSec = (NOMIHODAI_MINUTES + extensions * 30) * 60
  const remaining = Math.max(0, limitSec - elapsed)
  const remainMin = Math.floor(remaining / 60)
  const remainSec = remaining % 60
  const isWarning = remaining > 0 && remaining <= 15 * 60
  const isDone    = remaining === 0 && timerRunning

  useEffect(() => {
    if (timerRunning && timerStart !== null) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - timerStart) / 1000))
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning, timerStart])

  function startTimer() {
    setTimerStart(Date.now())
    setElapsed(0)
    setTimerRunning(true)
    setExtensions(0)
  }
  function stopTimer() {
    setTimerRunning(false)
    setTimerStart(null)
    setElapsed(0)
    setExtensions(0)
  }
  function extend() {
    setExtensions(e => e + 1)
    onCallStaff()
  }

  const pct = timerRunning ? Math.min(100, (elapsed / limitSec) * 100) : 0

  return (
    <div className="space-y-4">

      {/* 飲み放題タイマー */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⏱</span>
          <p className="font-black text-white">飲み放題タイマー</p>
          {extensions > 0 && (
            <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
              +{extensions * 30}分延長
            </span>
          )}
        </div>

        {/* Timer display */}
        <div className={`text-center py-6 rounded-xl mb-4 ${
          isDone ? 'bg-red-900/30 border border-red-500/30' :
          isWarning ? 'bg-amber-900/30 border border-amber-500/30' :
          'bg-gray-900/50 border border-gray-700'
        }`}>
          {!timerRunning ? (
            <div>
              <p className="text-5xl font-black text-gray-600 tabular-nums">
                {NOMIHODAI_MINUTES}:00
              </p>
              <p className="text-xs text-gray-500 mt-2">{NOMIHODAI_MINUTES}分コース</p>
            </div>
          ) : isDone ? (
            <div>
              <p className="text-2xl font-black text-red-400 animate-pulse">⏰ 時間終了！</p>
              <p className="text-xs text-red-400 mt-1">お会計をどうぞ</p>
            </div>
          ) : (
            <div>
              <p className={`text-5xl font-black tabular-nums ${isWarning ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                {String(remainMin).padStart(2, '0')}:{String(remainSec).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 mt-2">残り時間</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {timerRunning && !isDone && (
          <div className="h-1.5 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <div className="flex gap-2">
          {!timerRunning ? (
            <button
              onClick={startTimer}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-black text-sm active:bg-emerald-600"
            >
              スタート
            </button>
          ) : (
            <>
              <button
                onClick={extend}
                disabled={extensions >= 2 || isDone}
                className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm disabled:opacity-40 active:bg-purple-700"
              >
                +30分延長
              </button>
              <button
                onClick={stopTimer}
                className="px-5 py-3 rounded-xl bg-gray-700 text-gray-300 font-bold text-sm active:bg-gray-600"
              >
                リセット
              </button>
            </>
          )}
        </div>
      </div>

      {/* 割り勘 */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">💴</span>
          <p className="font-black text-white">割り勘計算</p>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-gray-400">人数</p>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setHeadcount(h => Math.max(1, h - 1))}
              className="w-9 h-9 rounded-full bg-gray-700 text-white font-bold text-lg flex items-center justify-center active:bg-gray-600"
            >−</button>
            <span className="text-2xl font-black text-white w-8 text-center">{headcount}</span>
            <button
              onClick={() => setHeadcount(h => Math.min(20, h + 1))}
              className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center active:bg-emerald-700"
            >+</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/50 rounded-xl p-4 text-center">
            <p className="text-[10px] text-gray-500 mb-1">合計金額</p>
            <p className="text-xl font-black text-white">¥{total.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-[10px] text-emerald-400 mb-1">一人あたり</p>
            <p className="text-xl font-black text-emerald-400">¥{perPerson.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 mt-2 text-right">※ 注文履歴から自動集計</p>
      </div>

      {/* アクション */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onCallStaff}
          className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <span className="text-2xl">🔔</span>
          <p className="text-xs font-bold text-white">スタッフ呼び出し</p>
        </button>
        <button
          onClick={onRequestPayment}
          className="bg-gray-800 border border-emerald-700/50 rounded-xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <span className="text-2xl">💳</span>
          <p className="text-xs font-bold text-emerald-400">お会計依頼</p>
        </button>
      </div>
    </div>
  )
}
