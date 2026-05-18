'use client'
import { useState, useMemo } from 'react'
import { MENU_SECTIONS, ALL_MENU_ITEMS, type RestaurantOrder, type MenuEntry } from '@/lib/restaurantOrder'

type Props = {
  history: RestaurantOrder[]
  onAddToCart: (item: MenuEntry) => void
}

export default function OrderRecommendation({ history, onAddToCart }: Props) {
  const [added, setAdded] = useState<number | null>(null)

  const { suggestions, insight } = useMemo(() => {
    const ordered = new Map<number, number>()
    history.filter(o => o.type === 'order').forEach(o =>
      o.items.forEach(i => ordered.set(i.id, (ordered.get(i.id) ?? 0) + i.qty))
    )

    const hasDrink = history.some(o => o.items.some(i => i.category === 'drink'))
    const hasFood  = history.some(o => o.items.some(i => i.category === 'food'))
    const total    = history.filter(o => o.type === 'order').reduce((s, o) => s + o.total, 0)

    // Suggest unordered items with priority weighting
    const candidates = ALL_MENU_ITEMS
      .filter(i => !ordered.has(i.id))
      .map(i => {
        let score = 0
        if (!hasDrink && i.category === 'drink') score += 3
        if (!hasFood  && i.category === 'food')  score += 3
        if (i.tag === '人気') score += 2
        if (i.tag === 'NEW')  score += 1
        if (i.price < 600)    score += 1
        return { item: i, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(c => c.item)

    let insight = ''
    if (ordered.size === 0) {
      insight = 'とりあえず一杯！人気ドリンクからどうぞ'
    } else if (!hasFood) {
      insight = 'まだフードを頼んでいません。おつまみはいかがですか？'
    } else if (!hasDrink) {
      insight = 'ドリンクが切れそうです。次の一杯はいかがですか？'
    } else if (total > 3000) {
      insight = 'そろそろ締めのタイミング？ラーメン・うどんが人気です'
    } else {
      insight = '次に頼みたいメニューはこちらです'
    }

    return { suggestions: candidates, insight }
  }, [history])

  function tap(item: MenuEntry) {
    onAddToCart(item)
    setAdded(item.id)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-emerald-400 text-lg">💡</span>
          <p className="text-xs text-gray-400">AIが分析中</p>
        </div>
        <p className="text-sm text-white font-semibold">{insight}</p>
      </div>

      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-1">おすすめメニュー</p>

      {suggestions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-sm">全メニュー制覇です！</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map(item => (
            <button
              key={item.id}
              onClick={() => tap(item)}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-3 text-left active:scale-95 transition-all relative overflow-hidden"
            >
              {added === item.id && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center rounded-2xl">
                  <span className="text-emerald-400 font-black text-sm">✓ カートへ</span>
                </div>
              )}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2"
                style={{ background: item.photoBg }}
              >
                {item.photo}
              </div>
              {item.tag && (
                <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {item.tag}
                </span>
              )}
              <p className="font-bold text-white text-xs mt-1 truncate">{item.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>
              <p className="text-emerald-400 font-black text-sm mt-1">¥{item.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
        <p className="text-[10px] text-gray-500 font-semibold mb-2">注文実績</p>
        {history.filter(o => o.type === 'order').length === 0 ? (
          <p className="text-xs text-gray-600">まだ注文はありません</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-emerald-400 font-black text-lg">
                {history.filter(o => o.type === 'order').reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0)}
              </p>
              <p className="text-[10px] text-gray-500">点注文</p>
            </div>
            <div className="text-center">
              <p className="text-cyan-400 font-black text-lg">
                {history.filter(o => o.type === 'order').length}
              </p>
              <p className="text-[10px] text-gray-500">回注文</p>
            </div>
            <div className="text-center">
              <p className="text-purple-400 font-black text-lg">
                ¥{history.filter(o => o.type === 'order').reduce((s, o) => s + o.total, 0).toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">合計</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
