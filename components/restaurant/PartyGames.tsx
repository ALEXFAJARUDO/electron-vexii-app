'use client'
import { useState, useRef } from 'react'

type Mode = 'roulette' | 'quiz' | 'topics'

const ROULETTE_ITEMS = [
  '一発芸！', '乾杯の音頭', '自己紹介', '隠し芸',
  '好きなタイプを暴露', 'ドリンク1杯おごり', 'ゲーム勝者に決める',
  '名言を言う', '話題提供', 'みんなに質問',
]

const QUIZ_DATA = [
  { q: '生ビールの「生」とは何を意味する？', opts: ['新鮮なビール', '熱処理をしていない', '発酵途中のもの', '国産麦芽100%'], ans: 1, ex: '「生」は熱処理（パスタライズ）をしていないビールのこと。' },
  { q: '日本酒「純米酒」の特徴は？', opts: ['醸造アルコール添加', '米・米麹・水のみ使用', '3年以上熟成', '秋田県産限定'], ans: 1, ex: '純米酒は米・米麹・水だけで造られた日本酒。' },
  { q: '「ハイボール」の基本的な割合は？', opts: ['1:1', '1:2', '1:3〜4', '1:10'], ans: 2, ex: 'ウイスキー1に対してソーダ3〜4が一般的なハイボールの黄金比率。' },
  { q: 'レモンサワーに使われる「サワー」の語源は？', opts: ['フランス語', '英語の"sour"（酸っぱい）', '日本語造語', 'ドイツ語'], ans: 1, ex: 'サワーは英語の"sour"（酸っぱい）から来ており、酸味のあるカクテルを指す。' },
  { q: '日本の居酒屋文化「とりあえずビール」が定着したのは？', opts: ['江戸時代', '明治時代', '昭和40〜50年代', '平成から'], ans: 2, ex: '高度経済成長期の昭和40〜50年代に会社員文化とともに広まったとされる。' },
]

const PARTY_TOPICS = [
  '今日ここに来るまでに一番大変だったこと', '誰にも言えない食の好み',
  '子供の頃の夢は何だった？', '最近ハマっているYouTubeチャンネル',
  '無人島に持っていくなら何を3つ選ぶ？', '好きな映画のセリフを言ってみて',
  '今一番欲しいもの（予算無制限）', '最近感動したこと・泣いたこと',
]

export default function PartyGames() {
  const [mode, setMode] = useState<Mode>('roulette')

  // Roulette state
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const spinRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Quiz state
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  // Topic state
  const [topicIdx, setTopicIdx] = useState(0)

  function spin() {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const spins = 3 + Math.random() * 3
    const target = rotation + spins * 360 + Math.random() * 360
    setRotation(target)
    spinRef.current = setTimeout(() => {
      const picked = ROULETTE_ITEMS[Math.floor(Math.random() * ROULETTE_ITEMS.length)]
      setResult(picked)
      setSpinning(false)
    }, 2500)
  }

  function answerQuiz(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    if (idx === QUIZ_DATA[qIdx].ans) setScore(s => s + 1)
  }

  function nextQuestion() {
    if (qIdx + 1 >= QUIZ_DATA.length) {
      setFinished(true)
    } else {
      setQIdx(i => i + 1)
      setSelected(null)
    }
  }

  function resetQuiz() {
    setQIdx(0); setSelected(null); setScore(0); setFinished(false)
  }

  const MODES: { id: Mode; label: string; emoji: string }[] = [
    { id: 'roulette', label: 'ルーレット', emoji: '🎯' },
    { id: 'quiz',     label: 'クイズ',     emoji: '🧠' },
    { id: 'topics',   label: 'お題カード', emoji: '🃏' },
  ]

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all ${
              mode === m.id
                ? 'bg-gray-700 border-gray-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
          >
            <span className="text-xl">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Roulette */}
      {mode === 'roulette' && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 mb-4">ボタンを押して当たった人がお題をこなす！</p>
          <div
            className="w-40 h-40 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl select-none cursor-pointer relative border-4 border-gray-600 shadow-2xl"
            style={{
              background: 'conic-gradient(from 0deg, #10b981, #6366f1, #f59e0b, #ef4444, #06b6d4, #8b5cf6, #10b981)',
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 2.5s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-2xl z-10">
              🎯
            </div>
          </div>

          {result && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-3 mb-4 animate-pulse">
              <p className="text-xs text-emerald-400 mb-1">お題</p>
              <p className="text-white font-black text-xl">{result}</p>
            </div>
          )}

          <button
            onClick={spin}
            disabled={spinning}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg disabled:opacity-50 active:scale-95 transition-all shadow-lg"
          >
            {spinning ? '🌀 スピン中…' : '🎯 スピン！'}
          </button>
        </div>
      )}

      {/* Quiz */}
      {mode === 'quiz' && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
          {finished ? (
            <div className="text-center py-6">
              <p className="text-5xl mb-3">{score >= 4 ? '🏆' : score >= 2 ? '👍' : '😅'}</p>
              <p className="text-white font-black text-2xl mb-1">{score}/{QUIZ_DATA.length}点</p>
              <p className="text-gray-400 text-sm mb-6">
                {score >= 4 ? 'お酒マイスター認定！' : score >= 2 ? 'まずまずの結果！' : 'もっとお酒を学ぼう！'}
              </p>
              <button
                onClick={resetQuiz}
                className="px-8 py-3 rounded-xl bg-purple-600 text-white font-black active:bg-purple-700"
              >
                もう一度
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500">問題 {qIdx + 1}/{QUIZ_DATA.length}</p>
                <p className="text-xs text-emerald-400 font-bold">{score}点獲得中</p>
              </div>
              <div className="h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(qIdx / QUIZ_DATA.length) * 100}%` }} />
              </div>
              <p className="text-white font-bold text-sm mb-4 leading-relaxed">{QUIZ_DATA[qIdx].q}</p>
              <div className="space-y-2">
                {QUIZ_DATA[qIdx].opts.map((opt, i) => {
                  const correct  = QUIZ_DATA[qIdx].ans === i
                  const isSelected = selected === i
                  let cls = 'bg-gray-700/50 border-gray-600 text-gray-300'
                  if (selected !== null) {
                    if (correct) cls = 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    else if (isSelected) cls = 'bg-red-500/20 border-red-500 text-red-300'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => answerQuiz(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${cls}`}
                    >
                      <span className="mr-2 text-gray-500">{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  )
                })}
              </div>
              {selected !== null && (
                <div className="mt-3 bg-gray-900/50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{QUIZ_DATA[qIdx].ex}</p>
                  <button
                    onClick={nextQuestion}
                    className="mt-2 w-full py-2.5 rounded-xl bg-purple-600 text-white font-black text-sm active:bg-purple-700"
                  >
                    {qIdx + 1 < QUIZ_DATA.length ? '次の問題 →' : '結果を見る'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Topic cards */}
      {mode === 'topics' && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 mb-4">カードを引いて話のネタにしよう！</p>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 mb-4 shadow-lg">
            <p className="text-5xl mb-4">🃏</p>
            <p className="text-white font-bold text-lg leading-snug">
              {PARTY_TOPICS[topicIdx % PARTY_TOPICS.length]}
            </p>
          </div>
          <p className="text-gray-600 text-xs mb-4">{(topicIdx % PARTY_TOPICS.length) + 1}/{PARTY_TOPICS.length}</p>
          <button
            onClick={() => setTopicIdx(i => i + 1)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg active:scale-95 transition-all shadow-lg"
          >
            🃏 次のカードを引く
          </button>
        </div>
      )}
    </div>
  )
}
