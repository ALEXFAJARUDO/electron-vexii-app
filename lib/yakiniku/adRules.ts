export type Ad = {
  id: string
  title: string
  description: string
  emoji: string
  bgGradient: string
  ctaText: string
  targetUrl?: string
}

export type AdContext = {
  orderedItemIds: number[]
  stayMinutes: number
  hourOfDay: number
  isPaymentRequested?: boolean
}

const BEER_IDS = new Set([401, 402, 403])
const MEAT_IDS = new Set([201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233])

const ADS: Ad[] = [
  {
    id: 'ad-nomihoudai',
    title: '飲み放題コース 延長受付中',
    description: '2時間1,800円でビール・焼酎・サワーが飲み放題！今夜も盛り上がろう',
    emoji: '🍻',
    bgGradient: 'linear-gradient(135deg,#d97706,#b45309)',
    ctaText: '飲み放題を追加する',
  },
  {
    id: 'ad-shime',
    title: 'そろそろ〆はいかがですか？',
    description: '手打ち冷麺・石鍋ビビンバ・チゲなど〆メニュー豊富にご用意',
    emoji: '🍜',
    bgGradient: 'linear-gradient(135deg,#0284c7,#0369a1)',
    ctaText: '〆メニューを見る',
  },
  {
    id: 'ad-sanchu',
    title: 'サンチュ・ご飯セットで焼肉を楽しもう',
    description: '焼いた肉をサンチュで巻いて♪ご飯もセットで注文できます',
    emoji: '🥬',
    bgGradient: 'linear-gradient(135deg,#16a34a,#15803d)',
    ctaText: '一品を追加する',
  },
  {
    id: 'ad-coupon',
    title: '次回ご来店で使えるクーポン',
    description: 'またのご来店でカルビ1皿無料クーポンをプレゼント！LINE登録でゲット',
    emoji: '🎟',
    bgGradient: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
    ctaText: 'クーポンをもらう',
  },
  {
    id: 'ad-default',
    title: '白雲台 特選コースのご案内',
    description: '神戸牛・黒毛和牛を楽しむ特選コース。特別な夜に最適です',
    emoji: '👑',
    bgGradient: 'linear-gradient(135deg,#92400e,#78350f)',
    ctaText: '詳しく見る',
  },
]

export const DEMO_ADS: (Ad & { impressions: number; clicks: number })[] = ADS.map((ad, i) => ({
  ...ad,
  impressions: [342, 218, 167, 95, 401][i] ?? 100,
  clicks: [48, 31, 19, 22, 38][i] ?? 10,
}))

export function selectAd(ctx: AdContext): Ad {
  const ordered = new Set(ctx.orderedItemIds)
  const hasBeer = [...BEER_IDS].some(id => ordered.has(id))
  const hasMeat = [...MEAT_IDS].some(id => ordered.has(id))

  if (ctx.isPaymentRequested) return ADS[3] // クーポン
  if (ctx.stayMinutes >= 90) return ADS[1]   // 〆
  if (ctx.hourOfDay === 19 && hasBeer) return ADS[0] // 飲み放題
  if (ctx.stayMinutes >= 60) return ADS[1]   // 〆
  if (hasMeat && !hasBeer) return ADS[2]     // サンチュ・ご飯
  if (ctx.hourOfDay >= 19 && ctx.hourOfDay <= 21) return ADS[0] // 飲み放題
  return ADS[4] // デフォルト
}
