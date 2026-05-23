'use client'
import { useState } from 'react'
import { useVoiceRecognition } from '@/lib/useVoiceRecognition'
import { parseVoiceCommand, type ParsedItem, type VoiceMenuItem } from '@/lib/voiceCommandParser'
import VoiceOrderConfirm from './VoiceOrderConfirm'

type Props = {
  onConfirm: (items: ParsedItem[]) => void
  menu?: VoiceMenuItem[]
}

export default function VoiceOrderButton({ onConfirm, menu }: Props) {
  const { state, error, isSupported, start, stop, reset } = useVoiceRecognition()
  const [parsedItems, setParsedItems] = useState<ParsedItem[] | null>(null)
  const [rawTranscript, setRawTranscript] = useState('')

  if (!isSupported) return null

  function handlePress() {
    if (state === 'listening') {
      stop()
      return
    }
    start(transcript => {
      setRawTranscript(transcript)
      setParsedItems(parseVoiceCommand(transcript, menu))
    })
  }

  function handleConfirm(items: ParsedItem[]) {
    onConfirm(items)
    setParsedItems(null)
    reset()
  }

  function handleCancel() {
    setParsedItems(null)
    reset()
  }

  return (
    <>
      <button
        onClick={handlePress}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
          state === 'listening'
            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
            : 'bg-orange-500 text-white shadow-sm'
        }`}
      >
        <MicIcon className="w-4 h-4 shrink-0" />
        {state === 'listening' ? '認識中…' : '音声注文'}
      </button>

      {error && (
        <p className="text-[11px] text-red-500 mt-1 text-center">{error}</p>
      )}

      {parsedItems !== null && (
        <VoiceOrderConfirm
          transcript={rawTranscript}
          items={parsedItems}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
      />
    </svg>
  )
}
