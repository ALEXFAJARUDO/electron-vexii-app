/** Service Worker を登録する（アプリ起動時に一度だけ呼ぶ） */
export async function registerSW(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    await navigator.serviceWorker.register('/sw.js')
  } catch {
    // SW未対応環境は無視
  }
}

/** 通知許可をリクエストし、許可されたら true を返す */
export async function requestPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

/**
 * プッシュ通知を表示する（delaySec > 0 なら指定秒後に発火）
 * Service Worker の showNotification() を優先し、
 * 未対応なら new Notification() にフォールバック
 */
export async function notify(
  title: string,
  body: string,
  delaySec = 0,
  options?: { tag?: string; requireInteraction?: boolean }
): Promise<void> {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return

  const fire = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready
        await reg.showNotification(title, {
          body,
          icon: 'https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png',
          badge: 'https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png',
          tag: options?.tag ?? 'vexii',
          requireInteraction: options?.requireInteraction ?? true,
          // vibrate はブラウザ固有拡張のためキャスト
          ...({ vibrate: [200, 100, 200] } as object),
        } as NotificationOptions)
        return
      } catch {
        // SW showNotification 失敗時はフォールバック
      }
    }
    new Notification(title, { body })
  }

  if (delaySec <= 0) {
    await fire()
  } else {
    setTimeout(fire, delaySec * 1000)
  }
}
