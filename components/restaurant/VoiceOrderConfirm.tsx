'use client'
import { type ParsedItem } from '@/lib/voiceCommandParser'

type Props = {
  transcript: string
  items: ParsedItem[]
  onConfirm: (items: ParsedItem[]) => void
  onCancel: () => void
}

export default function VoiceOrderConfirm({ transcript, items, onConfirm, onCancel }: Props) {
  const hasItems = items.length > 0
  const total = items.reduce((s, { item, qty }) => s + item.price * qty, 0)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl p-5 pb-safe"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-5 cursor-pointer" onClick={onCancel} />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">🎤</div>
          <div className="min-w-0">
            <p className="font-black text-gray-900">音声注文の確認</p>
            {transcript && (
              <p className="text-xs text-gray-400 truncate mt-0.5">「{transcript}」</p>
            )}
          </div>
        </div>

        {hasItems ? (
          <>
            <div className="space-y-2 mb-4">
              {items.map(({ item, qty }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-orange-50 rounded-xl p-3 border border-orange-100"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ background: item.photoBg }}
                  >
                    {item.photo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">¥{item.price.toLocaleString()} × {qty}</p>
                  </div>
                  <p className="font-black text-orange-600 text-sm shrink-0">
                    ¥{(item.price * qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-1 pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-500 font-semibold">合計</p>
              <p className="font-black text-gray-900">¥{total.toLocaleString()}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 mb-2">
            <p className="text-2xl mb-2">😔</p>
            <p className="text-gray-500 text-sm font-semibold">メニューを認識できませんでした</p>
            <p className="text-gray-300 text-xs mt-1">メニュー名をはっきりとお話しください</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm active:bg-gray-200"
          >
            キャンセル
          </button>
          {hasItems && (
            <button
              onClick={() => onConfirm(items)}
              className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white font-black text-sm active:bg-orange-600 active:scale-95 transition-transform"
            >
              カートに追加
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
