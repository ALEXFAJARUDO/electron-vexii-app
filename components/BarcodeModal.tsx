'use client'

interface Props {
  code: string
  title: string
  onClose: () => void
}

function buildBars(code: string): { x: number; w: number }[] {
  const widths: number[] = [3, 1, 3, 1, 3]
  for (let i = 0; i < code.length; i++) {
    const c = code.charCodeAt(i)
    for (let b = 6; b >= 0; b--) {
      widths.push(((c >> b) & 1) ? 3 : 1)
    }
    widths.push(1)
  }
  widths.push(3, 1, 3, 1, 3)

  const rects: { x: number; w: number }[] = []
  let x = 0
  widths.forEach((w, i) => {
    if (i % 2 === 0) rects.push({ x, w })
    x += w
  })
  return rects
}

function totalWidth(code: string): number {
  let t = 10 + 1 // start guard
  for (let i = 0; i < code.length; i++) {
    const c = code.charCodeAt(i)
    for (let b = 6; b >= 0; b--) t += ((c >> b) & 1) ? 3 : 1
    t += 1
  }
  t += 10
  return t
}

export default function BarcodeModal({ code, title, onClose }: Props) {
  const bars = buildBars(code)
  const vw = totalWidth(code)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl mx-5 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-2">
          <p className="text-sm font-bold text-gray-800 text-center leading-snug">{title}</p>
        </div>
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-5">
            <svg
              width="100%"
              viewBox={`0 0 ${vw} 72`}
              preserveAspectRatio="none"
              style={{ height: 72, display: 'block' }}
            >
              {bars.map(({ x, w }, i) => (
                <rect key={i} x={x} y={0} width={w} height={72} fill="#111" />
              ))}
            </svg>
            <p className="text-center font-mono text-base font-bold text-gray-700 mt-3 tracking-widest">
              {code}
            </p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
