'use client'
import { useState } from 'react'

const QUESTIONS = [
  {
    q: '最初の一杯は何を頼む？',
    opts: ['生ビール一択！', 'ハイボールかサワー', 'ソフトドリンクから', '何でもOK・空気を読む'],
  },
  {
    q: '飲み会でのあなたのポジションは？',
    opts: ['場を盛り上げる', '聞き役・相づち上手', '幹事・仕切り役', '気づいたら隅にいる'],
  },
  {
    q: '好きなおつまみのジャンルは？',
    opts: ['揚げ物（唐揚げ・ポテト）', '刺身・海鮮系', '野菜・ヘルシー系', '〆のラーメン・うどん'],
  },
  {
    q: '理想の飲み会の人数は？',
    opts: ['2〜3人のこじんまり', '4〜6人がベスト', '7〜10人で賑やか', '大人数ほど楽しい'],
  },
  {
    q: '二次会のスタンスは？',
    opts: ['必ず行く！', '気分・相手次第', '基本は帰る派', '幹事として引率する'],
  },
]

type Result = {
  type: string
  emoji: string
  desc: string
  color: string
}

function calcResult(answers: number[]): Result {
  const a = answers[0], b = answers[1], c = answers[2], d = answers[3], e = answers[4]
  const score = a + b + c + d + e
  if (a === 0 && b === 0) return {
    type: '盛り上げ番長', emoji: '🎉',
    desc: '飲み会のムードメーカー！あなたがいると場が一気に明るくなります。飲みは勢いと楽しさが大事！',
    color: 'from-orange-500 to-red-500',
  }
  if (b === 1 && d === 0) return {
    type: 'まったり親友タイプ', emoji: '☕',
    desc: '聞き上手で場の温度を読む達人。相手の話をしっかり聞いてくれる信頼できる存在。',
    color: 'from-blue-500 to-indigo-500',
  }
  if (b === 2 || e === 3) return {
    type: '飲み会マイスター', emoji: '🏆',
    desc: '幹事気質で全体を把握・仕切れる！細かいケアができ、メンバーから信頼される存在です。',
    color: 'from-purple-500 to-violet-600',
  }
  if (score <= 5) return {
    type: '縁の下の力持ち', emoji: '💪',
    desc: '目立たないけど確実に飲み会を支えるタイプ。気遣いができて、実は場の核心にいる存在。',
    color: 'from-emerald-500 to-teal-600',
  }
  return {
    type: 'フリースタイル飲み人', emoji: '🌊',
    desc: 'そのときの空気と仲間に合わせて変幻自在！どんな飲み会にも馴染める万能タイプ。',
    color: 'from-cyan-500 to-sky-600',
  }
}

export default function CompatibilityQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)

  function answer(i: number) {
    const next = [...answers, i]
    if (next.length >= QUESTIONS.length) {
      setAnswers(next)
      setResult(calcResult(next))
    } else {
      setAnswers(next)
      setStep(s => s + 1)
    }
  }

  function reset() {
    setStep(0); setAnswers([]); setResult(null); setCopied(false)
  }

  async function share() {
    if (!result) return
    const text = `飲み会相性診断の結果：\n${result.emoji} ${result.type}\n${result.desc}`
    try {
      if (navigator.share) {
        await navigator.share({ title: '飲み会相性診断', text })
      } else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl p-6 bg-gradient-to-br ${result.color} shadow-lg text-center`}>
          <p className="text-6xl mb-3">{result.emoji}</p>
          <p className="text-white/70 text-xs mb-1">あなたの飲み会タイプ</p>
          <p className="text-white font-black text-2xl mb-4">{result.type}</p>
          <p className="text-white/90 text-sm leading-relaxed">{result.desc}</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-3">あなたの回答</p>
          <div className="space-y-2">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs text-gray-600 shrink-0 w-4">{i + 1}.</span>
                <div>
                  <p className="text-[10px] text-gray-500">{q.q}</p>
                  <p className="text-xs text-white font-semibold">{q.opts[answers[i]]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={share}
            className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-bold text-sm active:bg-gray-600"
          >
            {copied ? '✓ コピーしました' : '📤 シェア'}
          </button>
          <button
            onClick={reset}
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm active:bg-emerald-700"
          >
            もう一度
          </button>
        </div>
      </div>
    )
  }

  const q = QUESTIONS[step]

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500">質問 {step + 1}/{QUESTIONS.length}</p>
        <p className="text-xs text-emerald-400 font-bold">{Math.round((step / QUESTIONS.length) * 100)}%</p>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all"
          style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
        <p className="text-white font-bold text-base leading-snug mb-5">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className="w-full text-left px-4 py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-sm text-gray-300 font-semibold active:bg-gray-600 transition-all flex items-center gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
