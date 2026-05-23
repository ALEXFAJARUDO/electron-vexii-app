'use client'
import { useState, useRef, useCallback } from 'react'

interface ISpeechRecognition extends EventTarget {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface ISpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}

interface ISpeechRecognitionErrorEvent {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition
    webkitSpeechRecognition: new () => ISpeechRecognition
  }
}

export type VoiceState = 'idle' | 'listening' | 'done' | 'error'

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recRef = useRef<ISpeechRecognition | null>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const start = useCallback(
    (onResult: (transcript: string) => void) => {
      if (!isSupported) {
        setError('音声認識はこのブラウザでは使用できません')
        setState('error')
        return
      }

      const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
      const rec = new SR()
      rec.lang = 'ja-JP'
      rec.interimResults = false
      rec.maxAlternatives = 1
      recRef.current = rec

      rec.onstart = () => {
        setState('listening')
        setError(null)
        setTranscript('')
      }

      rec.onresult = (event: ISpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript
        setTranscript(text)
        setState('done')
        onResult(text)
      }

      rec.onerror = (event: ISpeechRecognitionErrorEvent) => {
        setState('error')
        setError(
          event.error === 'no-speech'
            ? '音声が認識できませんでした'
            : '音声認識エラーが発生しました',
        )
      }

      rec.onend = () => {
        setState(prev => (prev === 'listening' ? 'idle' : prev))
      }

      rec.start()
    },
    [isSupported],
  )

  const stop = useCallback(() => {
    recRef.current?.stop()
    setState('idle')
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setTranscript('')
    setError(null)
  }, [])

  return { state, transcript, error, isSupported, start, stop, reset }
}
