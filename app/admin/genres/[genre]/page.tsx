'use client'
import { use, useState, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_CONFIG, STORAGE_KEY, getGenre, GENRE_IMAGE_DEFAULTS } from '@/lib/genreConfig'
import type { GenreConfig, Coupon, MenuItem, FloorEntry, ScheduleEntry, GenreId } from '@/lib/genreConfig'
import { notFound } from 'next/navigation'
import { useGenreEditor } from '@/components/GenreEditorProvider'
import type { Tab } from '@/components/GenreEditorProvider'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function GenreEditorPage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre: genreId } = use(params)
  const genre = getGenre(genreId)
  if (!genre) notFound()

  const [config, setConfig] = useState<GenreConfig>(DEFAULT_CONFIG)
  const { setSaveFn, setSaved, tab, setTab, setAvailableTabs } = useGenreEditor()

  useEffect(() => {
    const imageDefaults = GENRE_IMAGE_DEFAULTS[genreId as GenreId] ?? {}
    const raw = localStorage.getItem(STORAGE_KEY(genreId))
    try {
      const parsed = raw ? JSON.parse(raw) : {}
      setConfig({ ...DEFAULT_CONFIG, ...imageDefaults, ...parsed })
    } catch {
      setConfig({ ...DEFAULT_CONFIG, ...imageDefaults })
    }
    setSaved(false)
    setTab('info')
  }, [genreId, setSaved, setTab])

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY(genreId), JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [genreId, config, setSaved])

  useEffect(() => {
    setSaveFn(() => save)
    return () => setSaveFn(null)
  }, [save, setSaveFn])

  const set = <K extends keyof GenreConfig>(key: K, value: GenreConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }))

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: '基本情報' },
    { id: 'wifi', label: 'WiFi' },
    { id: 'coupons', label: 'クーポン' },
    { id: 'media', label: 'メディア' },
    ...(genre.hasMenu ? [{ id: 'menu' as Tab, label: 'メニュー' }] : []),
    ...(genre.hasFloor ? [{ id: 'floor' as Tab, label: 'フロアガイド' }] : []),
    ...(genre.hasSchedule ? [{ id: 'schedule' as Tab, label: 'スケジュール' }] : []),
  ]

  useEffect(() => {
    setAvailableTabs(tabs)
    return () => setAvailableTabs([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId])

  return (
    <div>
      {/* Tab content */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        {tab === 'info' && (
          <InfoTab config={config} set={set} />
        )}
        {tab === 'wifi' && (
          <WifiTab config={config} set={set} />
        )}
        {tab === 'coupons' && (
          <CouponsTab config={config} set={set} />
        )}
        {tab === 'media' && (
          <MediaTab config={config} set={set} genreId={genreId} />
        )}
        {tab === 'menu' && genre.hasMenu && (
          <MenuTab config={config} set={set} />
        )}
        {tab === 'floor' && genre.hasFloor && (
          <FloorTab config={config} set={set} />
        )}
        {tab === 'schedule' && genre.hasSchedule && (
          <ScheduleTab config={config} set={set} />
        )}
      </div>
    </div>
  )
}

// --- shared field ---
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors'

// --- tabs ---

function InfoTab({ config, set }: TabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="店舗名">
        <input className={inputCls} value={config.storeName} onChange={(e) => set('storeName', e.target.value)} placeholder="店舗名を入力" />
      </Field>
      <Field label="電話番号">
        <input className={inputCls} value={config.phone} onChange={(e) => set('phone', e.target.value)} placeholder="03-xxxx-xxxx" />
      </Field>
      <Field label="住所">
        <input className={inputCls} value={config.address} onChange={(e) => set('address', e.target.value)} placeholder="東京都〇〇区…" />
      </Field>
      <Field label="営業時間">
        <input className={inputCls} value={config.hours} onChange={(e) => set('hours', e.target.value)} placeholder="10:00〜22:00" />
      </Field>
    </div>
  )
}

function WifiTab({ config, set }: TabProps) {
  return (
    <div className="space-y-5 max-w-md">
      <Field label="SSID（ネットワーク名）">
        <input className={inputCls} value={config.wifiSsid} onChange={(e) => set('wifiSsid', e.target.value)} placeholder="MyWiFi_5G" />
      </Field>
      <Field label="パスワード">
        <input className={inputCls} value={config.wifiPassword} onChange={(e) => set('wifiPassword', e.target.value)} placeholder="password123" />
      </Field>
      {config.wifiSsid && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
          <p className="text-gray-300 text-xs uppercase tracking-wider font-semibold">プレビュー</p>
          <p className="text-gray-600"><span className="text-gray-400">SSID: </span>{config.wifiSsid}</p>
          {config.wifiPassword && (
            <p className="text-gray-600"><span className="text-gray-400">パスワード: </span>{config.wifiPassword}</p>
          )}
        </div>
      )}
    </div>
  )
}

function CouponsTab({ config, set }: TabProps) {
  const add = () =>
    set('coupons', [
      ...config.coupons,
      { id: uid(), title: '', code: '', discount: '', expires: '' },
    ])

  const update = (id: string, field: keyof Coupon, value: string) =>
    set('coupons', config.coupons.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const remove = (id: string) =>
    set('coupons', config.coupons.filter((c) => c.id !== id))

  return (
    <div className="space-y-4">
      {config.coupons.map((c, i) => (
        <div key={c.id} className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">クーポン {i + 1}</span>
            <button onClick={() => remove(c.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">削除</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="タイトル">
              <input className={inputCls} value={c.title} onChange={(e) => update(c.id, 'title', e.target.value)} placeholder="ドリンク10%OFF" />
            </Field>
            <Field label="コード">
              <input className={inputCls} value={c.code} onChange={(e) => update(c.id, 'code', e.target.value)} placeholder="DRINK10" />
            </Field>
            <Field label="割引内容">
              <input className={inputCls} value={c.discount} onChange={(e) => update(c.id, 'discount', e.target.value)} placeholder="10% OFF" />
            </Field>
            <Field label="有効期限">
              <input className={inputCls} type="date" value={c.expires} onChange={(e) => update(c.id, 'expires', e.target.value)} />
            </Field>
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-400 text-sm font-semibold transition-colors"
      >
        + クーポンを追加
      </button>
    </div>
  )
}

function ImageUploadField({
  label,
  value,
  onChange,
  aspect,
  genreId,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  aspect: 'logo' | 'kv'
  genreId: string
  placeholder?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('genre', genreId)
      fd.append('type', aspect)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'upload failed')
      onChange(json.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const isLogo = aspect === 'logo'

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{label}</label>

      <div className={`flex ${isLogo ? 'items-center gap-5' : 'flex-col gap-3'}`}>
        {/* Preview */}
        {value ? (
          <div
            className={`rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center ${
              isLogo ? 'w-20 h-20' : 'w-full'
            }`}
            style={isLogo ? {} : { height: '180px' }}
          >
            <img
              src={value}
              alt={label}
              className={isLogo ? 'w-full h-full object-contain p-1' : 'w-full h-full object-cover'}
            />
          </div>
        ) : (
          <div
            className={`rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 shrink-0 ${
              isLogo ? 'w-20 h-20' : 'w-full'
            }`}
            style={isLogo ? {} : { height: '180px' }}
          >
            <span className="text-2xl opacity-30">{isLogo ? '🏷️' : '🖼️'}</span>
            <span className="text-[10px] text-gray-300">未設定</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold hover:text-gray-800 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {uploading ? 'アップロード中…' : 'ファイルを選択'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 text-xs font-semibold hover:text-red-400 hover:border-[#ef4444] transition-colors"
              >
                削除
              </button>
            )}
            {value && (
              <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">{value}</span>
            )}
          </div>

          <input
            className={inputCls}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? 'https://example.com/image.png'}
          />

          {error && <p className="text-[11px] text-red-400">{error}</p>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  )
}

function MediaTab({ config, set, genreId }: TabProps & { genreId: string }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold text-blue-500 tracking-widest uppercase mb-5">店舗画像</p>
        <div className="space-y-6">
          <ImageUploadField
            label="ロゴ"
            aspect="logo"
            genreId={genreId}
            value={config.logoImage}
            onChange={(v) => set('logoImage', v)}
            placeholder="https://example.com/logo.png"
          />
          <ImageUploadField
            label="KV（キービジュアル）"
            aspect="kv"
            genreId={genreId}
            value={config.kvImage}
            onChange={(v) => set('kvImage', v)}
            placeholder="https://example.com/kv.jpg"
          />
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div>
        <p className="text-xs font-semibold text-blue-500 tracking-widest uppercase mb-5">動画・広告</p>
        <div className="space-y-5">
          <Field label="YouTube動画ID（広告・プロモーション）">
            <input
              className={inputCls}
              value={config.youtubeUrl}
              onChange={(e) => set('youtubeUrl', e.target.value)}
              placeholder="vNVdeRkjT2Y（URLのv=以降）"
            />
          </Field>
          {config.youtubeUrl && (
            <div className="rounded-xl overflow-hidden aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${config.youtubeUrl}?mute=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MenuTab({ config, set }: TabProps) {
  const categories = [...new Set(config.menuItems.map((m) => m.category))].filter(Boolean)

  const add = () =>
    set('menuItems', [
      ...config.menuItems,
      { id: uid(), category: '', name: '', desc: '', price: 0, tag: '' },
    ])

  const update = (id: string, field: keyof MenuItem, value: string | number) =>
    set('menuItems', config.menuItems.map((m) => (m.id === id ? { ...m, [field]: value } : m)))

  const remove = (id: string) =>
    set('menuItems', config.menuItems.filter((m) => m.id !== id))

  return (
    <div className="space-y-4">
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {categories.map((cat) => (
            <span key={cat} className="text-xs px-2.5 py-1 rounded-full bg-[#1e3c72] text-blue-400 font-semibold">
              {cat} ({config.menuItems.filter((m) => m.category === cat).length}件)
            </span>
          ))}
        </div>
      )}
      {config.menuItems.map((m, i) => (
        <div key={m.id} className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">アイテム {i + 1}</span>
            <button onClick={() => remove(m.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">削除</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Field label="カテゴリ">
              <input className={inputCls} value={m.category} onChange={(e) => update(m.id, 'category', e.target.value)} placeholder="おすすめ" />
            </Field>
            <Field label="商品名">
              <input className={inputCls} value={m.name} onChange={(e) => update(m.id, 'name', e.target.value)} placeholder="カフェラテ" />
            </Field>
            <Field label="価格（円）">
              <input className={inputCls} type="number" value={m.price} onChange={(e) => update(m.id, 'price', Number(e.target.value))} placeholder="480" />
            </Field>
            <Field label="説明">
              <input className={inputCls} value={m.desc} onChange={(e) => update(m.id, 'desc', e.target.value)} placeholder="まろやかなミルクと…" />
            </Field>
            <Field label="タグ（任意）">
              <input className={inputCls} value={m.tag} onChange={(e) => update(m.id, 'tag', e.target.value)} placeholder="人気 / NEW" />
            </Field>
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-400 text-sm font-semibold transition-colors"
      >
        + メニューアイテムを追加
      </button>
    </div>
  )
}

function FloorTab({ config, set }: TabProps) {
  const add = () =>
    set('floorEntries', [
      ...config.floorEntries,
      { id: uid(), floor: '', name: '', icon: '' },
    ])

  const update = (id: string, field: keyof FloorEntry, value: string) =>
    set('floorEntries', config.floorEntries.map((f) => (f.id === id ? { ...f, [field]: value } : f)))

  const remove = (id: string) =>
    set('floorEntries', config.floorEntries.filter((f) => f.id !== id))

  return (
    <div className="space-y-3">
      {config.floorEntries.map((f, i) => (
        <div key={f.id} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400">フロア {i + 1}</span>
            <button onClick={() => remove(f.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">削除</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="フロア名">
              <input className={inputCls} value={f.floor} onChange={(e) => update(f.id, 'floor', e.target.value)} placeholder="1F" />
            </Field>
            <Field label="施設名">
              <input className={inputCls} value={f.name} onChange={(e) => update(f.id, 'name', e.target.value)} placeholder="レストラン・ラウンジ" />
            </Field>
            <Field label="絵文字">
              <input className={inputCls} value={f.icon} onChange={(e) => update(f.id, 'icon', e.target.value)} placeholder="🍽️" />
            </Field>
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-400 text-sm font-semibold transition-colors"
      >
        + フロアを追加
      </button>
    </div>
  )
}

function ScheduleTab({ config, set }: TabProps) {
  const add = () =>
    set('scheduleEntries', [
      ...config.scheduleEntries,
      { id: uid(), date: '', title: '', note: '' },
    ])

  const update = (id: string, field: keyof ScheduleEntry, value: string) =>
    set('scheduleEntries', config.scheduleEntries.map((s) => (s.id === id ? { ...s, [field]: value } : s)))

  const remove = (id: string) =>
    set('scheduleEntries', config.scheduleEntries.filter((s) => s.id !== id))

  return (
    <div className="space-y-3">
      {config.scheduleEntries.map((s, i) => (
        <div key={s.id} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400">エントリー {i + 1}</span>
            <button onClick={() => remove(s.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">削除</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="日時">
              <input className={inputCls} value={s.date} onChange={(e) => update(s.id, 'date', e.target.value)} placeholder="5/31 (土) 20:00〜" />
            </Field>
            <Field label="タイトル">
              <input className={inputCls} value={s.title} onChange={(e) => update(s.id, 'title', e.target.value)} placeholder="花火大会" />
            </Field>
            <Field label="備考">
              <input className={inputCls} value={s.note} onChange={(e) => update(s.id, 'note', e.target.value)} placeholder="要予約" />
            </Field>
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-400 text-sm font-semibold transition-colors"
      >
        + エントリーを追加
      </button>
    </div>
  )
}

type TabProps = {
  config: GenreConfig
  set: <K extends keyof GenreConfig>(key: K, value: GenreConfig[K]) => void
}
