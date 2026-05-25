'use client'
import { useState } from 'react'
import { getRecommendations } from '@/lib/yakiniku/recommendationRules'

const DEMO_TABLES = [
  { tableId: '1', orderedItemIds: [402, 220, 434], stayMinutes: 72 },
  { tableId: '2', orderedItemIds: [101, 102], stayMinutes: 45 },
  { tableId: '3', orderedItemIds: [402, 211, 220], stayMinutes: 35 },
  { tableId: '5', orderedItemIds: [201, 202, 402, 434, 301], stayMinutes: 118 },
]

export default function AiRecommendAdminPanel() {
  const [selected, setSelected] = useState<string>('1')
  const table = DEMO_TABLES.find(t => t.tableId === selected) ?? DEMO_TABLES[0]

  const recommendations = getRecommendations({
    orderedItemIds: table.orderedItemIds,
    stayMinutes: table.stayMinutes,
    hourOfDay: new Date().getHours(),
    isLastOrder: new Date().getHours() >= 22,
  })

  return (
    <div className="space-y-5">
      <div className="bg-[#0c0c1e] border border-purple-900/50 rounded-xl p-4">
        <p className="text-xs text-purple-300 mb-1 font-bold">現在の実装</p>
        <p className="text-[10px] text-gray-400">ルールベースエンジン。将来的にOpenAI API等へ差し替え可能な設計。</p>
      </div>

      {/* テーブル選択 */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">テーブル選択</p>
        <div className="flex gap-2 flex-wrap">
          {DEMO_TABLES.map(t => (
            <button
              key={t.tableId}
              onClick={() => setSelected(t.tableId)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              style={{
                background: selected === t.tableId ? '#7c3aed' : '#1f2937',
                color: selected === t.tableId ? '#fff' : '#9ca3af',
              }}
            >
              席{t.tableId}（滞在{t.stayMinutes}分）
            </button>
          ))}
        </div>
      </div>

      {/* 注文済みアイテム */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">注文済みアイテム ID</p>
        <div className="flex flex-wrap gap-1.5">
          {table.orderedItemIds.map(id => (
            <span key={id} className="text-[10px] px-2 py-0.5 rounded-lg bg-[#1f2937] text-gray-300 font-mono">
              #{id}
            </span>
          ))}
        </div>
      </div>

      {/* レコメンド結果 */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">AIおすすめ結果</p>
        {recommendations.length === 0 ? (
          <p className="text-gray-500 text-sm">このテーブルへのおすすめはありません</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recommendations.map(rec => (
              <div key={rec.id} className="bg-[#1a1a3e] border border-purple-900/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{rec.emoji}</span>
                  <div>
                    <p className="text-sm font-black text-white">{rec.name}</p>
                    <p className="text-xs" style={{ color: '#f97316' }}>¥{rec.price.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-[10px] text-purple-300">{rec.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ルール一覧 */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2">適用ルール</p>
        <div className="space-y-1.5">
          {[
            { trigger: 'ビール注文後', result: '牛タン塩・骨付きカルビをおすすめ', emoji: '🍺' },
            { trigger: '肉注文後', result: '手打ち冷麺・ビビンバ・スープをおすすめ', emoji: '🥩' },
            { trigger: '滞在60分以上', result: '追加ドリンク・締めメニューをおすすめ', emoji: '⏱' },
            { trigger: '19時台', result: '飲み放題コースをおすすめ', emoji: '🕖' },
            { trigger: 'ドリンク2杯以上・肉未注文', result: '骨付きカルビをおすすめ', emoji: '🍹' },
            { trigger: 'ラストオーダー前（22時〜）', result: 'デザートをおすすめ', emoji: '🌙' },
          ].map(rule => (
            <div key={rule.trigger} className="flex items-start gap-3 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2">
              <span className="text-base shrink-0">{rule.emoji}</span>
              <span className="text-[10px] text-gray-400 w-32 shrink-0">{rule.trigger}</span>
              <span className="text-[10px] font-bold text-purple-300">→ {rule.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
