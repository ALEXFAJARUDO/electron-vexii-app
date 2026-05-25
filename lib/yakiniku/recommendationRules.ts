export type RecommendItem = {
  id: number
  name: string
  price: number
  reason: string
  emoji: string
}

export type RecommendContext = {
  orderedItemIds: number[]
  stayMinutes: number
  hourOfDay: number
  isLastOrder?: boolean
}

const BEER_IDS = [401, 402, 403]
const DRINK_IDS = new Set([401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447])
const MEAT_IDS = new Set([201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233])

export function getRecommendations(ctx: RecommendContext): RecommendItem[] {
  const results: RecommendItem[] = []
  const ordered = new Set(ctx.orderedItemIds)

  const hasBeer = BEER_IDS.some(id => ordered.has(id))
  const hasMeat = [...MEAT_IDS].some(id => ordered.has(id))
  const drinkCount = [...DRINK_IDS].filter(id => ordered.has(id)).length

  // ビール注文後 → タン塩・枝豆系おすすめ
  if (hasBeer) {
    if (!ordered.has(211))
      results.push({ id: 211, name: '薄切り牛タン', price: 1800, reason: 'ビールのお供に！', emoji: '🥩' })
    if (!ordered.has(220))
      results.push({ id: 220, name: '骨付きカルビ', price: 1400, reason: 'ビールとの相性◎', emoji: '🥩' })
  }

  // 肉注文後 → ご飯もの・スープ・サンチュ
  if (hasMeat) {
    if (!ordered.has(301))
      results.push({ id: 301, name: '手打ち冷麺[中]', price: 1130, reason: '肉の後はさっぱり冷麺で！', emoji: '🍜' })
    if (!ordered.has(303))
      results.push({ id: 303, name: '全州石鍋ビビンバ', price: 1350, reason: '〆にどうぞ', emoji: '🍳' })
    if (!ordered.has(307))
      results.push({ id: 307, name: 'テールスープ', price: 960, reason: '濃厚スープで〆を', emoji: '🍵' })
  }

  // 滞在60分以上 → 追加ドリンク・締め
  if (ctx.stayMinutes >= 60) {
    if (!ordered.has(434))
      results.push({ id: 434, name: 'レモンサワー', price: 530, reason: 'もう一杯いかがですか？', emoji: '🍋' })
    if (!ordered.has(304))
      results.push({ id: 304, name: 'チゲ', price: 960, reason: 'そろそろ〆はいかがですか？', emoji: '🫕' })
  }

  // 19時台 → 飲み放題
  if (ctx.hourOfDay === 19 && !ordered.has(447))
    results.push({ id: 447, name: '飲み放題コース', price: 1800, reason: '今なら飲み放題がお得！', emoji: '🍻' })

  // ドリンクのみの注文 → 肉おすすめ
  if (drinkCount >= 2 && !hasMeat && !ordered.has(220))
    results.push({ id: 220, name: '骨付きカルビ', price: 1400, reason: 'ドリンクのお供に肉はいかがですか？', emoji: '🥩' })

  // ラストオーダー前 → デザート
  if (ctx.isLastOrder) {
    results.push({ id: 419, name: 'オレンジシャーベット', price: 450, reason: '締めのデザートはいかがですか？', emoji: '🍊' })
    results.push({ id: 420, name: 'レモンシャーベット', price: 400, reason: 'さっぱり締めに', emoji: '🍋' })
  }

  // 重複排除・注文済み除外
  const seen = new Set<number>()
  return results.filter(r => {
    if (ordered.has(r.id) || seen.has(r.id)) return false
    seen.add(r.id)
    return true
  }).slice(0, 4)
}
