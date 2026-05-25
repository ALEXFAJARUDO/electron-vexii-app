'use client'
import { useState, useEffect } from 'react'
import { DEMO_ADS } from '@/lib/yakiniku/adRules'

export default function AdDeliveryDashboard() {
  const [clickData, setClickData] = useState<Record<string, number>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yakiniku_ad_clicks')
      if (raw) setClickData(JSON.parse(raw))
    } catch {}
  }, [])

  const ads = DEMO_ADS.map(ad => {
    const extraClicks = clickData[ad.id] ?? 0
    const clicks = ad.clicks + extraClicks
    const impressions = ad.impressions
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0'
    return { ...ad, clicks, impressions, ctr }
  })

  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0)
  const totalClicks = ads.reduce((s, a) => s + a.clicks, 0)
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-5">
      {/* サマリー */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '総表示数', value: totalImpressions.toLocaleString(), unit: '', color: '#3b82f6' },
          { label: '総クリック数', value: totalClicks.toLocaleString(), unit: '', color: '#22c55e' },
          { label: '平均CTR', value: avgCtr, unit: '%', color: '#f97316' },
        ].map((card) => (
          <div key={card.label} className="bg-[#111] border border-white/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-400 mb-1">{card.label}</p>
            <p className="text-2xl font-black" style={{ color: card.color }}>
              {card.value}<span className="text-sm ml-0.5">{card.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 広告一覧 */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400">配信広告一覧</p>
        {ads.map((ad) => (
          <div key={ad.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: ad.bgGradient }}
              >
                {ad.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{ad.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{ad.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-white/10">
              {[
                { label: '表示数', value: ad.impressions.toLocaleString(), color: '#3b82f6' },
                { label: 'クリック', value: ad.clicks.toLocaleString(), color: '#22c55e' },
                { label: 'CTR', value: `${ad.ctr}%`, color: '#f97316' },
              ].map((stat) => (
                <div key={stat.label} className="px-3 py-2 text-center">
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                  <p className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 表示条件ルール */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">配信ルール</p>
        <div className="space-y-1.5">
          {[
            { condition: '19〜21時台', result: '飲み放題延長広告', emoji: '🕖' },
            { condition: '肉注文後', result: 'サンチュ・ご飯広告', emoji: '🥩' },
            { condition: '滞在60分以上', result: '締めメニュー広告', emoji: '⏱' },
            { condition: '滞在90分以上', result: '締めメニュー広告（優先）', emoji: '⏰' },
            { condition: '会計前', result: '次回クーポン広告', emoji: '🎟' },
          ].map((rule) => (
            <div key={rule.condition} className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2">
              <span className="text-base shrink-0">{rule.emoji}</span>
              <span className="text-[10px] text-gray-400 flex-1">{rule.condition}</span>
              <span className="text-[10px] font-bold text-orange-400">→ {rule.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
