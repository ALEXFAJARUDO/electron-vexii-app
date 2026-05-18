'use client'
import { useState } from 'react'

type Category = 'sports' | 'work' | 'trivia' | 'trend'

const TOPICS: Record<Category, { emoji: string; label: string; color: string; items: string[] }> = {
  sports: {
    emoji: '⚽', label: 'スポーツ', color: 'from-emerald-600 to-teal-700',
    items: [
      '最近スポーツ観戦した試合はありますか？',
      '好きなスポーツチームはどこですか？',
      '学生時代どんなスポーツをやっていましたか？',
      '今年のW杯・オリンピック、注目している競技は？',
      'マラソンや登山など、アウトドアスポーツはしますか？',
      '好きなスポーツ選手・監督は誰ですか？',
      '最近ハマっているフィットネスや運動習慣は？',
      '地元のプロチームを応援していますか？',
    ],
  },
  work: {
    emoji: '💼', label: '仕事', color: 'from-blue-600 to-indigo-700',
    items: [
      '最近仕事で一番うまくいったことは何ですか？',
      '理想の働き方はリモート派？オフィス派？',
      '仕事で一番ストレスを感じる瞬間は？',
      '新しいスキルを習得するときどう勉強しますか？',
      '会社で「この人天才だ」と思った人はいましたか？',
      '転職経験はありますか？今の仕事には満足していますか？',
      '副業や社外活動をしている人はいますか？',
      '10年後どんな仕事をしていたいですか？',
    ],
  },
  trivia: {
    emoji: '🧠', label: '雑学', color: 'from-purple-600 to-violet-700',
    items: [
      'タコはIQが高く、瓶のフタを自分で開けられるって知ってた？',
      'バナナの皮で滑るのは本当らしい。ただし新鮮なものに限る。',
      '蚊に刺されやすい人は血液型より体温・CO2排出量が多い人。',
      '世界一高い山はエベレストだが、地球の中心から最も遠い山は別の山。',
      '「いただきます」に相当する表現は日本語にしかない説がある。',
      'ネコが「ニャー」と鳴くのは人間に向けてだけ。他のネコには鳴かない。',
      '人間の鼻は1兆種類以上のにおいを嗅ぎ分けられる可能性がある。',
      'はちみつは腐らない。エジプトのピラミッドから3000年前のはちみつが発見された。',
    ],
  },
  trend: {
    emoji: '🔥', label: 'トレンド', color: 'from-orange-500 to-red-600',
    items: [
      '最近ハマっているNetflix・アニメ・映画はありますか？',
      'AIツール（ChatGPT等）を仕事や日常で使っていますか？',
      '最近行ってよかったレストランや旅行先は？',
      'SNSで気になっているアカウントや話題はありますか？',
      '最近買ってよかったガジェットやアイテムは？',
      '人気のキャンプや登山、アウトドアブームについてどう思いますか？',
      'コスパ重視？それとも体験にお金をかけたい派？',
      'ChatGPT・AIが仕事を変えると思いますか？',
    ],
  },
}

export default function ConversationTopics() {
  const [category, setCategory] = useState<Category>('sports')
  const [cardIdx, setCardIdx] = useState(0)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const cat = TOPICS[category]
  const card = cat.items[cardIdx % cat.items.length]
  const key = `${category}-${cardIdx}`

  function next() { setCardIdx(i => i + 1) }

  function toggleLike() {
    setLiked(s => {
      const n = new Set(s)
      if (n.has(key)) n.delete(key); else n.add(key)
      return n
    })
  }

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(TOPICS) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setCardIdx(0) }}
            className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all active:scale-95 ${
              category === cat
                ? 'bg-gray-700 border-gray-500'
                : 'bg-gray-800 border-gray-700'
            }`}
          >
            <span className="text-xl">{TOPICS[cat].emoji}</span>
            <span className="text-[10px] text-gray-400 font-semibold">{TOPICS[cat].label}</span>
          </button>
        ))}
      </div>

      {/* Card */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${cat.color} relative min-h-[200px] flex flex-col justify-between shadow-lg`}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-white/70 text-xs font-semibold">{cat.label}</span>
            <span className="ml-auto text-white/50 text-xs">
              {(cardIdx % cat.items.length) + 1}/{cat.items.length}
            </span>
          </div>
          <p className="text-white font-bold text-lg leading-snug">{card}</p>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={toggleLike}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              liked.has(key) ? 'bg-red-500' : 'bg-white/20 active:bg-white/30'
            }`}
          >
            {liked.has(key) ? '❤️' : '🤍'}
          </button>
          <button
            onClick={next}
            className="flex-1 py-2.5 rounded-xl bg-white/20 text-white font-black text-sm active:bg-white/30 transition-all"
          >
            次の話題 →
          </button>
        </div>
      </div>

      {/* Liked cards */}
      {liked.size > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold mb-2">❤️ お気に入りの話題</p>
          <div className="space-y-1.5">
            {Array.from(liked).map(k => {
              const [c, idx] = k.split('-')
              const topic = TOPICS[c as Category]?.items[Number(idx) % TOPICS[c as Category]?.items.length]
              if (!topic) return null
              return (
                <p key={k} className="text-xs text-gray-300 bg-gray-700/50 rounded-lg px-3 py-2">{topic}</p>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
