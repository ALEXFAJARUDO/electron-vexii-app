'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type PanelId = 'waiting' | 'map' | 'questionnaire' | 'pharmacy' | 'payment' | 'wifi' | 'visitor' | 'seat'

const BUTTONS: { id: PanelId; label: string; desc: string; color: string; bg: string; border: string; badge?: string; icon: React.ReactNode }[] = [
  {
    id: 'waiting', label: '診察待ち通知', desc: '呼ばれたらお知らせ', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', badge: '通知',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>,
  },
  {
    id: 'map', label: '院内マップ', desc: '各科・フロア案内', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>,
  },
  {
    id: 'questionnaire', label: '問診票', desc: '事前に記入する', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/></svg>,
  },
  {
    id: 'pharmacy', label: '薬局情報', desc: '処方箋・待ち時間', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    id: 'payment', label: '会計', desc: '支払い・明細確認', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z"/></svg>,
  },
  {
    id: 'wifi', label: 'WiFi接続', desc: '院内WiFiに接続', color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>,
  },
  {
    id: 'visitor', label: 'お見舞い案内', desc: '面会ルール・場所', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>,
  },
  {
    id: 'seat', label: '充電・席管理', desc: '充電状況・座席', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', badge: '⚡',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  },
]

const FLOOR_MAP = [
  { floor: '5F', dept: '外科・整形外科', color: '#f97316' },
  { floor: '4F', dept: '内科・循環器科', color: '#22c55e' },
  { floor: '3F', dept: '検査室・放射線科', color: '#0ea5e9' },
  { floor: '2F', dept: '外来受付・小児科', color: '#a855f7' },
  { floor: '1F', dept: '受付・薬局・会計', color: '#6366f1' },
]

const QUESTIONNAIRE_ITEMS = [
  { q: '本日の症状を教えてください', type: 'text', placeholder: '例: 頭痛、発熱、腹痛' },
  { q: 'いつ頃から症状がありますか', type: 'text', placeholder: '例: 3日前から' },
  { q: '体温を教えてください', type: 'text', placeholder: '例: 37.5℃' },
  { q: 'アレルギーはありますか', type: 'select', options: ['なし', '薬物アレルギー', '食物アレルギー', 'その他'] },
]

export default function HospitalPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [waitingNumber] = useState(47)
  const [currentNumber] = useState(41)
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [wifiCopied, setWifiCopied] = useState(false)
  const [chargePercent] = useState(35)

  const seatNo = 'W-15'
  const waitCount = waitingNumber - currentNumber

  function enableNotif() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          setNotifEnabled(true)
          new Notification('診察待ち通知を設定しました', {
            body: `番号 ${waitingNumber} 番。呼ばれたらお知らせします。`,
          })
        }
      })
    } else {
      setNotifEnabled(true)
    }
  }

  function copyWifi() {
    navigator.clipboard.writeText('hospital_guest_2026').catch(() => {})
    setWifiCopied(true)
    setTimeout(() => setWifiCopied(false), 2000)
  }

  function closePanel() { setPanel(null) }

  return (
    <>
      <main className="h-dvh flex flex-col bg-gray-50 max-w-md mx-auto overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="h-6 w-auto object-contain"/>
            <span className="font-bold text-sm silver-gradient">Vexii</span>
          </Link>
          <span className="text-gray-200 text-lg leading-none mx-0.5">|</span>
          <span className="text-sm font-semibold text-gray-500">🏥 病院</span>
        </header>

        <div className="flex-1 min-h-0 p-3 grid grid-cols-2 grid-rows-4 gap-3">
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
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: btn.bg, color: btn.color }}>
                {btn.icon}
              </div>
              <p className="font-bold text-gray-800 text-xs leading-tight text-center">{btn.label}</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">{btn.desc}</p>
            </button>
          ))}
        </div>
      </main>

      {panel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closePanel}>
          <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4"/>

            {/* 診察待ち通知 */}
            {panel === 'waiting' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">診察待ち通知</h2>
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-4 text-center">
                  <p className="text-xs text-sky-500 font-semibold mb-2">あなたの番号</p>
                  <p className="font-black text-5xl text-sky-600 mb-1">{waitingNumber}</p>
                  <p className="text-xs text-gray-400">内科 · 外来受付</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">現在呼出中</p>
                    <p className="font-black text-2xl text-gray-800">{currentNumber}<span className="text-xs font-semibold">番</span></p>
                  </div>
                  <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">あなたの前</p>
                    <p className="font-black text-2xl text-amber-600">{waitCount}<span className="text-xs font-semibold">人</span></p>
                  </div>
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">予想待ち時間</p>
                    <p className="font-black text-2xl text-gray-800">{waitCount * 7}<span className="text-xs font-semibold">分</span></p>
                  </div>
                </div>
                {notifEnabled ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                    <p className="font-bold text-green-700">✓ 通知を設定しました</p>
                    <p className="text-xs text-green-500 mt-1">呼ばれたらこのスマホに通知が届きます</p>
                  </div>
                ) : (
                  <button onClick={enableNotif} className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold text-base active:scale-95 transition-transform">
                    呼ばれたら通知する
                  </button>
                )}
              </div>
            )}

            {/* 院内マップ */}
            {panel === 'map' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">院内マップ</h2>
                <div className="rounded-2xl bg-cyan-50 border border-cyan-100 aspect-video flex items-center justify-center mb-4">
                  <p className="text-cyan-300 text-sm font-semibold">院内マップ表示エリア</p>
                </div>
                <div className="space-y-2">
                  {FLOOR_MAP.map((f) => (
                    <button key={f.floor} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-left active:scale-[0.98] transition-transform">
                      <span className="text-xs font-black w-7 text-center" style={{ color: f.color }}>{f.floor}</span>
                      <span className="text-sm text-gray-700">{f.dept}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['トイレ', 'コンビニ', 'ATM', 'ロッカー', '授乳室', '喫煙所'].map((loc) => (
                    <button key={loc} className="py-2 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-semibold active:scale-95 transition-transform">
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 問診票 */}
            {panel === 'questionnaire' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-1">問診票</h2>
                <p className="text-xs text-gray-400 mb-4">診察前にご記入ください。受付で提出が不要になります。</p>
                <div className="space-y-4">
                  {QUESTIONNAIRE_ITEMS.map((item) => (
                    <div key={item.q} className="bg-green-50 border border-green-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-2">{item.q}</p>
                      {item.type === 'text' ? (
                        <input type="text" placeholder={item.placeholder} className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:border-green-400 bg-white"/>
                      ) : (
                        <select className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm outline-none focus:border-green-400 bg-white text-gray-700">
                          {item.options?.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 py-3.5 rounded-xl bg-green-500 text-white font-bold text-sm">
                  問診票を送信する
                </button>
              </div>
            )}

            {/* 薬局情報 */}
            {panel === 'pharmacy' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">薬局情報</h2>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-4">
                  <p className="text-xs text-orange-500 font-semibold mb-1">処方箋番号</p>
                  <p className="font-black text-2xl text-orange-700 font-mono">RX-20260515-047</p>
                  <p className="text-xs text-gray-400 mt-1">内科 1F 薬局</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">現在処理中</p>
                    <p className="font-black text-2xl text-gray-800">38<span className="text-xs font-semibold">番</span></p>
                  </div>
                  <div className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">お待ちの方</p>
                    <p className="font-black text-2xl text-orange-600">9<span className="text-xs font-semibold">人</span></p>
                  </div>
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">予想時間</p>
                    <p className="font-black text-2xl text-gray-800">25<span className="text-xs font-semibold">分</span></p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">薬の準備ができたら通知</p>
                  <button className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm">
                    準備完了を通知する
                  </button>
                </div>
              </div>
            )}

            {/* 会計 */}
            {panel === 'payment' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">会計</h2>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-4">
                  <p className="text-xs text-indigo-500 font-semibold mb-3">本日の診療明細</p>
                  <div className="space-y-2 mb-4">
                    {[
                      { item: '初診料', amount: '¥2,880' },
                      { item: '検査料', amount: '¥1,560' },
                      { item: '処方箋料', amount: '¥680' },
                    ].map((row) => (
                      <div key={row.item} className="flex justify-between py-1.5 border-b border-indigo-100">
                        <span className="text-sm text-gray-600">{row.item}</span>
                        <span className="font-semibold text-gray-800 text-sm">{row.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">合計 (3割負担)</span>
                    <span className="font-black text-indigo-600 text-xl">¥5,120</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3 text-center">お支払いは1F 会計窓口またはセルフ精算機</p>
                <div className="grid grid-cols-2 gap-2">
                  {['現金', 'クレジットカード', 'QRコード決済', '電子マネー'].map((m) => (
                    <button key={m} className="py-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold active:scale-95 transition-transform">
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WiFi接続 */}
            {panel === 'wifi' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-5">WiFi接続</h2>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-6">
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl px-4 py-3 border border-purple-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">ネットワーク名 (SSID)</p>
                      <p className="font-mono font-bold text-gray-800">Hospital_Guest_WiFi</p>
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 border border-purple-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">パスワード</p>
                      <p className="font-mono font-bold text-gray-800">hospital_guest_2026</p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-700 font-semibold">ご注意</p>
                  <p className="text-xs text-amber-600 mt-1">院内では医療機器への影響を避けるため、一部エリアでの通信は制限されています。</p>
                </div>
                <button
                  onClick={copyWifi}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 active:scale-95 ${wifiCopied ? 'bg-green-500 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                >
                  {wifiCopied ? '✓ コピーしました' : '接続'}
                </button>
              </div>
            )}

            {/* お見舞い案内 */}
            {panel === 'visitor' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-4">お見舞い案内</h2>
                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 mb-4">
                  <p className="font-bold text-gray-800 text-sm mb-3">面会時間</p>
                  {[
                    { label: '一般病棟', time: '14:00〜20:00' },
                    { label: 'ICU・HCU', time: '家族のみ・要確認' },
                    { label: '小児病棟', time: '10:00〜18:00 (保護者のみ)' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between py-2 border-b border-pink-100 last:border-none">
                      <span className="text-sm text-gray-600">{r.label}</span>
                      <span className="font-semibold text-pink-700 text-sm">{r.time}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mb-4">
                  <p className="font-bold text-gray-800 text-sm mb-2">お見舞いのマナー</p>
                  {['入室前に手洗い・消毒を行ってください', 'お花・食べ物の持ち込みは事前に確認', '患者さんが疲れている場合は短めに', '大声での会話はお控えください'].map((r) => (
                    <p key={r} className="text-xs text-gray-500 py-1 border-b border-pink-100 last:border-none">• {r}</p>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 mb-1">病室フロア案内</p>
                  {['4F 一般病棟 (内科・外科)', '5F 一般病棟 (整形外科)', '6F 産科・小児科'].map((floor) => (
                    <button key={floor} className="w-full px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-100 text-left text-sm text-gray-700 font-semibold active:scale-[0.98] transition-transform">
                      {floor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 充電・席管理 */}
            {panel === 'seat' && (
              <div className="px-5 pb-8">
                <h2 className="font-bold text-gray-900 text-lg mb-2">充電・席管理</h2>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-5 mb-4 text-white">
                  <p className="text-xs opacity-70 mb-1">現在の座席</p>
                  <p className="font-black text-4xl mb-1">{seatNo}</p>
                  <p className="text-xs opacity-60">待合室 W · 15番席</p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">充電状況</p>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">充電中 ⚡</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full" style={{ width: `${chargePercent}%` }}/>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{chargePercent}% · 残り約1時間25分で満充電</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '診察待ち確認', icon: '🔔', action: () => setPanel('waiting') },
                    { label: '問診票を記入', icon: '📋', action: () => setPanel('questionnaire') },
                    { label: '院内マップ', icon: '🗺', action: () => setPanel('map') },
                    { label: 'WiFi接続', icon: '📶', action: () => setPanel('wifi') },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl active:scale-95 transition-transform text-left">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold text-teal-800 text-xs leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
