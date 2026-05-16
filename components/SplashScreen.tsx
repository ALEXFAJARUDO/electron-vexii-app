'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [entered, setEntered] = useState(false)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('splashDone')) {
      setDone(true)
      return
    }
    sessionStorage.setItem('splashDone', '1')
    const t0 = setTimeout(() => setEntered(true), 60)
    const t1 = setTimeout(() => setFading(true), 1600)
    const t2 = setTimeout(() => setDone(true), 2100)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (done) return null

  return (
    <>
      <style>{`
        @keyframes splash-progress {
          from { width: 0% }
          to   { width: 100% }
        }
        @keyframes splash-glow {
          0%, 100% { opacity: 0.6 }
          50%       { opacity: 1 }
        }
      `}</style>
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0f2a50 55%, #0a1628 100%)' }}
      >
        {/* Center content */}
        <div
          className={`flex flex-col items-center gap-6 transition-all duration-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Logo */}
          <img
            src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
            alt="Vexii"
            className="h-10 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)', animation: 'splash-glow 2s ease-in-out infinite' }}
          />

          {/* Text */}
          <div className="text-center space-y-1">
            <p className="text-[10px] font-semibold tracking-[0.55em] text-blue-300 uppercase">
              Powered by Electron Vexii
            </p>
            <h1 className="text-white text-3xl font-black tracking-widest uppercase">
              Smart Charger
            </h1>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5 pt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                style={{ animation: `splash-glow 1s ease-in-out ${i * 0.25}s infinite` }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-28 h-px bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ animation: 'splash-progress 2s linear forwards' }}
          />
        </div>
      </div>
    </>
  )
}
