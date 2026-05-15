'use client'

import { useState } from 'react'
import type { Coupon } from '@/lib/types'

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = coupon.expires_at ? new Date(coupon.expires_at) < new Date() : false
  const expiresLabel = coupon.expires_at
    ? new Date(coupon.expires_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) + ' まで'
    : null

  return (
    <div className={`card-light p-4 ${isExpired ? 'opacity-40' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <span className="inline-block text-xs font-bold tracking-wide px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-2">
            {coupon.discount}
          </span>
          <h3 className="font-bold text-gray-800 text-sm leading-snug">{coupon.title}</h3>
          {coupon.description && (
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{coupon.description}</p>
          )}
        </div>
        {expiresLabel && (
          <p className="text-gray-300 text-xs shrink-0">{expiresLabel}</p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 font-mono text-sm text-gray-600 tracking-widest border border-gray-100">
          {coupon.code}
        </div>
        <button
          onClick={copyCode}
          disabled={isExpired}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
            copied
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
          }`}
        >
          {copied ? '✓ コピー済' : 'コピー'}
        </button>
      </div>
    </div>
  )
}
