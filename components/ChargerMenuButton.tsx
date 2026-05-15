'use client'

import { useState, useEffect, useRef } from 'react'
import type { Store } from '@/lib/types'

export default function ChargerMenuButton({ store }: { store: Store }) {
  const [open, setOpen] = useState(false)
  const [wifiOpen, setWifiOpen] = useState(false)
  const [copied, setCopied] = useState<'ssid' | 'pass' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setWifiOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function copy(text: string, type: 'ssid' | 'pass') {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const hasWifi = !!store.wifi_ssid
  const hasMobileOrder = !!store.mobile_order_url

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen((v) => !v); setWifiOpen(false) }}
        aria-label="メニュー"
        className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors hover:bg-gray-200"
      >
        <span className="flex flex-col gap-[5px] items-center justify-center">
          <span className={`block w-4 h-[1.5px] bg-gray-500 transition-all origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-gray-500 transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-4 h-[1.5px] bg-gray-500 transition-all origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-64 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden z-50">

          {/* WiFi */}
          <button
            onClick={() => setWifiOpen((v) => !v)}
            disabled={!hasWifi}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-b border-gray-100"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">WiFi に接続</p>
              {hasWifi && <p className="text-xs text-gray-400 mt-0.5">{store.wifi_ssid}</p>}
            </div>
            {hasWifi && (
              <svg className={`w-4 h-4 text-gray-300 transition-transform ${wifiOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
              </svg>
            )}
          </button>

          {/* WiFi detail panel */}
          {wifiOpen && hasWifi && (
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider">SSID</p>
                  <p className="text-sm font-mono font-semibold text-blue-900">{store.wifi_ssid}</p>
                </div>
                <button
                  onClick={() => copy(store.wifi_ssid!, 'ssid')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {copied === 'ssid' ? '✓' : 'コピー'}
                </button>
              </div>
              {store.wifi_password && (
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider">パスワード</p>
                    <p className="text-sm font-mono font-semibold text-blue-900">{store.wifi_password}</p>
                  </div>
                  <button
                    onClick={() => copy(store.wifi_password!, 'pass')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    {copied === 'pass' ? '✓' : 'コピー'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Order */}
          {hasMobileOrder ? (
            <a
              href={store.mobile_order_url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">モバイルオーダー</p>
                <p className="text-xs text-gray-400 mt-0.5">注文ページを開く</p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3.5 text-sm border-b border-gray-100 opacity-40 cursor-not-allowed">
              <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">モバイルオーダー</p>
                <p className="text-xs text-gray-400 mt-0.5">準備中</p>
              </div>
            </div>
          )}

          {/* Coupon */}
          <a
            href="#coupons"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-gray-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
              </svg>
            </span>
            <div>
              <p className="font-semibold text-gray-800">クーポン</p>
              <p className="text-xs text-gray-400 mt-0.5">お得なクーポンを確認</p>
            </div>
          </a>
        </div>
      )}
    </div>
  )
}
