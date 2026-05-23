import { ALL_MENU_ITEMS } from './restaurantOrder'

export interface VoiceMenuItem {
  id: number
  name: string
  price: number
  photo: string
  photoBg: string
}

export type ParsedItem = {
  item: VoiceMenuItem
  qty: number
}

const NUM_WORDS: [RegExp, number][] = [
  [/[６6]つ|六つ|むっつ|ろっ?こ|六個|六本|六杯/, 6],
  [/[５5]つ|五つ|いつつ|ごこ|五個|五本|五杯/, 5],
  [/[４4]つ|四つ|よっつ|よんこ|四個|四本|四杯/, 4],
  [/[３3]つ|三つ|みっつ|さんこ|三個|三本|三杯/, 3],
  [/[２2]つ|二つ|ふたつ|にこ|二個|二本|二杯|ふた/, 2],
  [/一つ|[１1]つ|ひとつ|いっ?こ|一個|一本|一杯|ひと/, 1],
  [/([０-９0-9]+)[つ個本杯]/, 0],
]

function extractQty(text: string): number {
  for (const [pattern, qty] of NUM_WORDS) {
    if (qty === 0) {
      const m = text.match(/([０-９0-9]+)[つ個本杯]/)
      if (m) {
        const n = parseInt(m[1].replace(/[０-９]/g, c => String(c.charCodeAt(0) - 0xff10)))
        if (!isNaN(n) && n > 0) return n
      }
      continue
    }
    if (pattern.test(text)) return qty
  }
  return 1
}

export function parseVoiceCommand(
  transcript: string,
  menu: VoiceMenuItem[] = ALL_MENU_ITEMS,
): ParsedItem[] {
  const results: ParsedItem[] = []
  const seen = new Set<number>()

  for (const item of menu) {
    if (transcript.includes(item.name) && !seen.has(item.id)) {
      seen.add(item.id)
      const idx = transcript.indexOf(item.name)
      const surrounding = transcript.slice(
        Math.max(0, idx - 12),
        idx + item.name.length + 12,
      )
      results.push({ item, qty: extractQty(surrounding) })
    }
  }

  return results
}
