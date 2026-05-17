'use client'
import { iconGradient } from '@/lib/colorLight'

import { useState } from 'react'
import Link from 'next/link'

type PanelId = 'setlist' | 'artist' | 'goods' | 'vendor' | 'community' | 'next' | 'photo' | 'seat' | 'ad'

const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; badge?: string; icon: React.ReactNode }[] = [
  {
    id: 'setlist', label: 'セトリ速報', desc: '演奏中の曲をチェック', color: '#ef4444', bg: '#fff1f2', border: '#fecdd3', badge: 'LIVE',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/></svg>,
  },
  {
    id: 'artist', label: 'アーティスト情報', desc: 'プロフィール・SNS', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  },
  {
    id: 'goods', label: 'グッズEC', desc: '限定グッズを購入', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>,
  },
  {
    id: 'vendor', label: '売り子呼び出し', desc: 'スタッフを呼ぶ', color: '#eab308', bg: '#fefce8', border: '#fde68a',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>,
  },
  {
    id: 'community', label: 'ファンコミュニティ', desc: 'ファンと盛り上がる', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>,
  },
  {
    id: 'next', label: '次公演情報', desc: 'ツアー・チケット', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>,
  },
  {
    id: 'photo', label: '写真・動画', desc: '公式フォトを取得', color: '#475569', bg: '#f8fafc', border: '#e2e8f0',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>,
  },
  {
    id: 'seat', label: '充電・席管理', desc: '充電状況・座席', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', badge: '⚡',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
]

const SETLIST = [
  { no: 1, title: 'Opening SE', status: '済', time: '18:01' },
  { no: 2, title: 'Starlight', status: '済', time: '18:03' },
  { no: 3, title: 'Midnight Dream', status: '済', time: '18:07' },
  { no: 4, title: 'Electric Soul', status: '済', time: '18:12' },
  { no: 5, title: 'Lost in You', status: '済', time: '18:16' },
  { no: 6, title: '〜MC〜', status: '済', time: '18:22' },
  { no: 7, title: 'Galaxy Ride', status: '演奏中', time: '18:28' },
  { no: 8, title: 'Neon Wings', status: '未', time: '—' },
  { no: 9, title: 'Forever Yours', status: '未', time: '—' },
  { no: 10, title: 'Encore: The Beginning', status: '未', time: '—' },
]

const GOODS_LIST = [
  { name: 'ツアーTシャツ', price: '¥5,500', tag: '限定' },
  { name: 'フォトブック', price: '¥3,800', tag: '限定' },
  { name: 'ペンライト', price: '¥2,200', tag: 'NEW' },
  { name: 'ブレスレット', price: '¥1,500', tag: '' },
]

const NEXT_SHOWS = [
  { date: '2026/06/01', venue: '東京ドーム', ticket: '発売中' },
  { date: '2026/06/15', venue: '大阪城ホール', ticket: '発売中' },
  { date: '2026/07/03', venue: '名古屋ガイシホール', ticket: '先行中' },
  { date: '2026/07/20', venue: '福岡マリンメッセ', ticket: '近日発売' },
]

export default function ConcertPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [vendorCalled, setVendorCalled] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chargePercent] = useState(48)

  const seatNo = 'B-24'

  function callVendor() {
    setVendorCalled(true)
    setTimeout(() => setVendorCalled(false), 4000)
  }

  function closePanel() { setPanel(null) }

  return (
    <>
      <main className="min-h-dvh flex flex-col bg-[#edf1f7]">
        <header className="neu-header px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-24 rounded-md bg-gray-100 flex items-center justify-center">
              <span className="text-[10px] text-gray-300 font-semibold tracking-wider">SHOP LOGO</span>
            </div>
          </Link>
          <span className="ml-auto text-sm font-semibold text-gray-500">🎵 コンサート会場</span>
        </header>

        <div className="flex-1 max-w-lg mx-auto w-full p-3 pb-6 grid grid-cols-2 auto-rows-[minmax(110px,auto)] gap-[15px]">
          {/* ヒーロー画像 */}
          <div className="col-span-2 rounded-2xl overflow-hidden shrink-0" style={{ height: '25vh' }}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                 style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)' }}>
              <span className="text-5xl">🎵</span>
              <p className="text-white font-black text-xl tracking-wide">コンサート会場</p>
            </div>
          </div>


          {BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPanel(btn.id)}
              className="card-light flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 p-2 relative"
              style={{ borderColor: btn.border }}
            >
              {btn.badge && (
                <span className="absolute top-1.5 right-2 text-[9px] font-black" style={{ color: btn.color }}>{btn.badge}</span>
              )}
              <div className="w-12 h-12 rounded-full flex items-center justify-center neu-icon" style={{ background: iconGradient(btn.color), color: '#ffffff' }}>
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-xs leading-tight text-center">{btn.label}</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">{btn.desc}</p>
            </button>
          ))}
          {/* 広告スペース */}
          <div className="col-span-2 rounded-2xl overflow-hidden aspect-video">
            <iframe
              src="https://www.youtube.com/embed/vNVdeRkjT2Y?autoplay=1&mute=1&loop=1&playlist=vNVdeRkjT2Y&controls=0&modestbranding=1"
              title="Advertisement"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="py-2 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-blue-900 mr-1.5">Powered by</span><img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
        </div>
      </main>

      {panel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closePanel}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setPanel(null)} />

            {/* セトリ速報 */}
            {panel === 'setlist' && (
              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-gray-900 text-lg">セトリ速報</h2>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">● LIVE</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Vexii Arena Tour 2026</p>
                <div className="space-y-1.5">
                  {SETLIST.map((s) => (
                    <div key={s.no} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${s.status === '演奏中' ? 'bg-red-50 border-red-300' : s.status === '済' ? 'bg-[#edf1f7] border-gray-100' : 'bg-white border-gray-100'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${s.status === '演奏中' ? 'bg-red-500 text-white' : s.status === '済' ? 'bg-gray-300 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {s.no}
                      </span>
                      <p className={`flex-1 text-sm font-semibold ${s.status === '演奏中' ? 'text-red-700' : s.status === '済' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {s.title}
                      </p>
                      {s.status === '演奏中' && <span className="text-[10px] text-red-500 font-bold animate-pulse">♪</span>}
                      {s.time !== '—' && s.status === '済' && <span className="text-[10px] text-gray-300">{s.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* アーティスト情報 */}
            {panel === 'artist' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">アーティスト情報</h2>
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 mb-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">🎤</div>
                    <div>
                      <p className="font-black text-xl">Vexii Stars</p>
                      <p className="text-xs opacity-70 mt-0.5">J-Pop / Electronic</p>
                      <p className="text-xs opacity-60 mt-1">デビュー2019 · 累計100万枚</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-800 mb-1">本日のセットリスト</p>
                    <p className="text-xs text-gray-500">「Vexii Arena Tour 2026」全国ツアー8公演中の5公演目。アンコール含む全10曲を予定。</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-400 mb-2">公式SNS</p>
                <div className="grid grid-cols-3 gap-2">
                  {['X (Twitter)', 'Instagram', 'YouTube'].map((sns) => (
                    <button key={sns} className="py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold active:scale-95 transition-transform">
                      {sns}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* グッズEC */}
            {panel === 'goods' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">グッズEC</h2>
                <p className="text-xs text-red-500 font-semibold mb-4">本日会場限定グッズあり！</p>
                <div className="grid grid-cols-2 gap-[15px]">
                  {GOODS_LIST.map((item) => (
                    <div key={item.name} className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                      <div className="aspect-square rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
                        <span className="text-3xl">🎵</span>
                      </div>
                      {item.tag && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">{item.tag}</span>}
                      <p className="font-semibold text-gray-800 text-xs mt-1 leading-tight">{item.name}</p>
                      <p className="font-bold text-indigo-600 text-sm">{item.price}</p>
                      <button className="w-full mt-2 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-bold">カートへ</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 売り子呼び出し */}
            {panel === 'vendor' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">売り子呼び出し</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">ボタンを押すと近くのスタッフに通知が届きます</p>
                <button
                  onClick={callVendor}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${vendorCalled ? 'bg-green-500 text-white scale-95' : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 active:scale-95'}`}
                >
                  {vendorCalled ? '✓ スタッフを呼びました！' : '売り子を呼ぶ'}
                </button>
                {vendorCalled && <p className="text-xs text-green-500 text-center mt-3">席 {seatNo} にまもなく参ります</p>}
              </div>
            )}

            {/* ファンコミュニティ */}
            {panel === 'community' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">ファンコミュニティ</h2>
                <p className="text-xs text-gray-400 mb-4">今日の会場でファンと繋がろう</p>
                <div className="space-y-2 mb-4">
                  {[
                    { user: 'みかん🍊', msg: 'Galaxy Ride 最高すぎる！！😭', time: '18:30' },
                    { user: 'ファン10年目', msg: 'Lost in You で泣いた、本当に来て良かった', time: '18:28' },
                    { user: 'StarFan_Hana', msg: 'ペンライト青にして！！一緒に🟦', time: '18:25' },
                    { user: 'コンサート初参加', msg: '初めてだけどめちゃくちゃ楽しい🎵', time: '18:20' },
                  ].map((post, i) => (
                    <div key={i} className="bg-pink-50 border border-pink-100 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-pink-700 text-xs">{post.user}</p>
                        <p className="text-[10px] text-gray-300">{post.time}</p>
                      </div>
                      <p className="text-sm text-gray-700">{post.msg}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    placeholder="感想を送る..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-300"
                  />
                  <button onClick={() => setChatMsg('')} className="px-4 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-sm">送信</button>
                </div>
              </div>
            )}

            {/* 次公演情報 */}
            {panel === 'next' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">次公演情報</h2>
                <p className="text-xs text-gray-400 mb-4">Vexii Stars Arena Tour 2026</p>
                <div className="space-y-3 mb-5">
                  {NEXT_SHOWS.map((show) => (
                    <div key={show.date} className="flex items-center justify-between p-4 bg-sky-50 border border-sky-100 rounded-xl">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{show.venue}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{show.date}</p>
                      </div>
                      <button className={`text-xs px-3 py-1.5 rounded-lg font-bold ${show.ticket === '発売中' ? 'bg-sky-500 text-white' : show.ticket === '先行中' ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-400'}`}>
                        {show.ticket}
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3.5 rounded-xl bg-sky-500 text-white font-bold text-sm">
                  全公演スケジュールを見る
                </button>
              </div>
            )}

            {/* 写真・動画 */}
            {panel === 'photo' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">写真・動画</h2>
                <p className="text-xs text-gray-400 mb-4">公式撮影の写真をダウンロードできます</p>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-3">本日公演の公式フォト</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="aspect-square rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                        <span className="text-2xl">🎤</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-2">※公演終了後に順次追加されます</p>
                </div>
                <button className="w-full py-3.5 rounded-xl bg-slate-500 text-white font-bold text-sm">
                  全写真をダウンロード
                </button>
              </div>
            )}

            {/* 充電・席管理 */}
            {panel === 'seat' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">充電・席管理</h2>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">現在の座席</p>
                  <p className="font-black text-4xl mb-1">{seatNo}</p>
                  <p className="text-xs opacity-60">Bブロック 24番 · アリーナ席</p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">充電状況</p>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">充電中 ⚡</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full" style={{ width: `${chargePercent}%` }}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{chargePercent}% · 残り約1時間で満充電</p>
                </div>
                <div className="grid grid-cols-2 gap-[11px]">
                  {[
                    { label: 'セトリを確認', icon: '🎵', action: () => setPanel('setlist') },
                    { label: 'グッズを買う', icon: '🛍', action: () => setPanel('goods') },
                    { label: '売り子呼ぶ', icon: '🙋', action: () => setPanel('vendor') },
                    { label: 'ファンチャット', icon: '💬', action: () => setPanel('community') },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl active:scale-95 transition-transform text-left">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold text-teal-800 text-xs leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {panel === 'ad' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">広告スペース</h2>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-video mb-4">
                  <iframe
                    src="https://www.youtube.com/embed/vNVdeRkjT2Y"
                    title="Advertisement"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">広告掲載のお問い合わせは Vexii までご連絡ください</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
