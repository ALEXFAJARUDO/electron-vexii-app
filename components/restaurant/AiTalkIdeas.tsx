'use client'
import { useState } from 'react'

type Scenario = 'boss' | 'first' | 'warmup'

const SCENARIOS: Record<Scenario, { label: string; emoji: string; color: string; ideas: string[] }> = {
  boss: {
    label: '上司と', emoji: '👔', color: 'from-blue-600 to-blue-800',
    ideas: [
      '「最近〇〇の本を読んだんですが、△△という考え方が面白くて…」と自分の学びをシェア',
      '「〇〇さんって昔どんなお仕事されてたんですか？」と過去のキャリアを聞く',
      '「最近プロジェクトで△△に悩んでるんですが、どう思われますか？」と相談を持ちかける',
      '「〇〇さんが一番印象に残った仕事・プロジェクトって何ですか？」',
      '「今の業界って5年後どうなると思いますか？」と将来予測を聞く',
      '「最近おすすめの本や映画はありますか？」とインプットの話題',
      '「〇〇さんのキャリアで一番のターニングポイントはいつですか？」',
      '「最近仕事で一番面白いと感じた瞬間を教えてください」',
    ],
  },
  first: {
    label: '初対面と', emoji: '🤝', color: 'from-emerald-600 to-teal-700',
    ideas: [
      '「どのくらいこの会社(仕事)をされてるんですか？」と経歴を自然に聞く',
      '「今日来る前に何か面白いことありましたか？」と今日の話から入る',
      '「普段どの辺に住んでるんですか？」と地元・エリア話で共通点を探す',
      '「週末はどんなことして過ごされることが多いですか？」',
      '「最近ハマってることとかありますか？」とフランクな自己開示を促す',
      '「このお店に来るのは初めてですか？」と場の共有から入る',
      '「どんな食べ物・お酒が好きですか？」と今夜の場を利用した話題',
      '「〇〇さんって名前の由来とかあるんですか？」と名前ネタで打ち解ける',
    ],
  },
  warmup: {
    label: 'ウォームアップ', emoji: '🔥', color: 'from-orange-500 to-red-600',
    ideas: [
      '「今日ここに来るまでに一番大変だったことは？」で場を温める',
      '「最近テレビ・SNSで見て気になったニュースは？」',
      '「今日の天気みたいに、今の自分の気分を天気で表すと？」',
      '「今夜の目標って決めてますか？（例：〇〇を聞く、〇〇と仲良くなる）」',
      '「今一番ストレス解消になってることって何ですか？」',
      '「最近笑った一番くだらないこと、教えてください」',
      '「今日ここに来なかった理由を3つ言ってみてください（笑）」',
      '「もし今夜が終わって何か一つ覚えてもらうとしたら何を話したいですか？」',
    ],
  },
}

export default function AiTalkIdeas() {
  const [scenario, setScenario] = useState<Scenario>('boss')
  const [idx, setIdx] = useState(0)
  const [saved, setSaved] = useState<{ s: Scenario; i: number }[]>([])

  const sc = SCENARIOS[scenario]
  const idea = sc.ideas[idx % sc.ideas.length]

  function save() {
    const key = { s: scenario, i: idx }
    if (!saved.some(k => k.s === key.s && k.i === key.i)) {
      setSaved(p => [...p, key])
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <p className="text-xs text-gray-400">
          会話のきっかけを提案します。将来はAI APIによる動的生成対応予定。
        </p>
      </div>

      {/* Scenario */}
      <div className="flex gap-2">
        {(Object.keys(SCENARIOS) as Scenario[]).map(s => (
          <button
            key={s}
            onClick={() => { setScenario(s); setIdx(0) }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              scenario === s
                ? 'bg-gray-700 border-gray-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
          >
            <span className="text-xl">{SCENARIOS[s].emoji}</span>
            {SCENARIOS[s].label}
          </button>
        ))}
      </div>

      {/* Idea card */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${sc.color} shadow-lg`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{sc.emoji}</span>
          <p className="text-white/70 text-xs font-semibold">{sc.label}の話し方</p>
          <span className="ml-auto text-white/50 text-xs">{(idx % sc.ideas.length) + 1}/{sc.ideas.length}</span>
        </div>
        <p className="text-white font-semibold text-sm leading-relaxed">{idea}</p>
        <div className="flex gap-2 mt-5">
          <button
            onClick={save}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              saved.some(k => k.s === scenario && k.i === idx)
                ? 'bg-yellow-500'
                : 'bg-white/20 active:bg-white/30'
            }`}
          >
            ⭐
          </button>
          <button
            onClick={() => setIdx(i => i + 1)}
            className="flex-1 py-2.5 rounded-xl bg-white/20 text-white font-black text-sm active:bg-white/30"
          >
            次のネタ →
          </button>
        </div>
      </div>

      {/* Saved */}
      {saved.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-yellow-400 font-semibold mb-2">⭐ 保存したネタ</p>
          <div className="space-y-2">
            {saved.map((k, n) => (
              <div key={n} className="bg-gray-700/50 rounded-lg px-3 py-2 flex gap-2 items-start">
                <span className="text-sm shrink-0">{SCENARIOS[k.s].emoji}</span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {SCENARIOS[k.s].ideas[k.i % SCENARIOS[k.s].ideas.length]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
