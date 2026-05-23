'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'
import VoiceOrderButton from '@/components/restaurant/VoiceOrderButton'
import { type ParsedItem } from '@/lib/voiceCommandParser'

type PanelId = 'wifi' | 'coupons' | 'order' | 'ad' | 'app' | 'store' | 'staff' | 'payment'
type OrderItem = { id: number; name: string; desc: string; price: number; photo: string; photoBg: string; photoUrl?: string; tag?: string }

const DEMO_WIFI = { ssid: 'HAKUUNDAI_WIFI', password: 'hakuundai2024' }

const COUPONS = [
  { id: 1, title: 'カルビ1皿無料', code: 'KARUBI1', expires: '2026/05/31' },
  { id: 2, title: 'ドリンク1杯無料', code: 'DRINK', expires: '2026/05/25' },
  { id: 3, title: 'デザート 30%OFF', code: 'DESSERT30', expires: '2026/06/30' },
]

const HP = 'https://www.hakuundai.net/img/'

const ORDER_MENU: Record<string, OrderItem[]> = {
  menu01: [
    { id: 101, name: '白雲台コース',       desc: '人気No.1コース',               price: 5000,  photo: '🍽', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', photoUrl: `${HP}img_menu02.jpg`, tag: '人気' },
    { id: 102, name: '肉三昧コース',       desc: 'ガッツリ！肉三昧',             price: 6000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', photoUrl: `${HP}nikuzanmai.jpg` },
    { id: 103, name: 'お手軽コース',       desc: '気軽に楽しめるコース',          price: 3700,  photo: '🍴', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_menu01.jpg` },
    { id: 104, name: '贅沢コース',         desc: 'プレミアムな贅沢コース',        price: 8000,  photo: '✨', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_menu04.jpg`, tag: '特選' },
    { id: 105, name: 'ファミリーセット',   desc: 'みんなで楽しむファミリー向け',  price: 4950,  photo: '👨‍👩‍👧‍👦', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)', photoUrl: `${HP}img_menu12.jpg` },
    { id: 106, name: '黄金カルビ定食',     desc: 'カルビ150g・ライス・スープ付き', price: 1500, photo: '🍱', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', photoUrl: `${HP}img_lunch01.webp`, tag: 'ランチ' },
    { id: 107, name: 'ハラミ・カルビ定食', desc: 'ハラミ＋カルビ150g',           price: 1600,  photo: '🍱', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', photoUrl: `${HP}img_lunch02.jpg`, tag: 'ランチ' },
    { id: 108, name: 'ハラミ定食',         desc: 'ハラミ120g・ライス・スープ付き', price: 1500, photo: '🍱', photoBg: 'linear-gradient(135deg,#78350f,#6b2a0e)', photoUrl: `${HP}img_lunch03.jpg`, tag: 'ランチ' },
  ],
  menu02: [
    { id: 201, name: '特撰バラ',           desc: 'とろける旨みの最高峰',            price: 2900,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', photoUrl: `${HP}img_yaki01.jpg`, tag: '人気' },
    { id: 202, name: '特撰ロース',          desc: '柔らか上質ロース',               price: 3000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#991b1b)', photoUrl: `${HP}img_yaki02.jpg` },
    { id: 203, name: '特撰厚切り牛タン',   desc: '厚切りでジューシー',              price: 3000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_yaki03.jpg` },
    { id: 204, name: 'シャトーブリアン',   desc: '最高部位・フィレ肉の王様',        price: 6800,  photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_yaki04.jpg`, tag: '特選' },
    { id: 205, name: '骨付きカルビ',       desc: '骨付きカルビ・甘口たれ',          price: 1400,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', photoUrl: `${HP}img_yaki05.jpg`, tag: '人気' },
    { id: 206, name: '中落ちカルビ',       desc: 'ジューシーな中落ちカルビ',        price: 1000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', photoUrl: `${HP}img_yaki06.jpg` },
    { id: 207, name: 'ロース',              desc: '厚切りロース',                   price: 2300,  photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_yaki07.jpg` },
    { id: 208, name: 'ネギ塩牛タン',       desc: 'ネギ塩ダレ・香ばしい牛タン',      price: 2000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_yaki_gyu3type.jpg` },
    { id: 209, name: '薄切り牛タン',       desc: 'やわらか薄切りタン',              price: 1800,  photo: '🥩', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', photoUrl: `${HP}img_yaki03.jpg` },
    { id: 210, name: '上ミノ',              desc: '第一胃・コリコリ食感',            price: 950,   photo: '🐄', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', photoUrl: `${HP}img_horumon01.jpg`, tag: '人気' },
    { id: 211, name: 'しまちょう',          desc: '大腸・とろける旨み',              price: 960,   photo: '🐄', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', photoUrl: `${HP}img_horumon_shimacho.jpg` },
    { id: 212, name: 'ハツ',               desc: '心臓・コリコリ食感',              price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)', photoUrl: `${HP}img_horumon02.jpg` },
    { id: 213, name: '焼きレバー',          desc: '新鮮レバー・ごまだれ',            price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#9d174d,#831843)', photoUrl: `${HP}img_horumon03.jpg` },
    { id: 214, name: '白雲台サラダ',       desc: '特製ドレッシング',                price: 800,   photo: '🥗', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { id: 215, name: 'キムチ盛り合わせ',   desc: '白菜・カクテキ・オイキムチ',       price: 740,   photo: '🥬', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 216, name: 'ナムル4種盛り',      desc: 'ほうれん草・もやし・ぜんまい',     price: 580,   photo: '🥗', photoBg: 'linear-gradient(135deg,#65a30d,#4d7c0f)' },
  ],
  menu03: [
    { id: 301, name: '手打ち冷麺',          desc: '牛骨スープ・さっぱり',            price: 1130,  photo: '🍜', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', photoUrl: `${HP}img_ippin01.jpg`, tag: '人気' },
    { id: 302, name: '全州石鍋ビビンバ',   desc: 'おこげが香ばしい本格ビビンバ',    price: 1350,  photo: '🍳', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', photoUrl: `${HP}img_ippin02.jpg` },
    { id: 303, name: 'クッパ',              desc: '牛骨スープのおじや',              price: 800,   photo: '🍲', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_ippin03.jpg` },
    { id: 304, name: 'チゲ',               desc: 'キムチorホルモンチゲ',            price: 960,   photo: '🫕', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', photoUrl: `${HP}img_ippin05.jpg` },
    { id: 305, name: 'テールスープ',       desc: '濃厚牛テールスープ',              price: 960,   photo: '🍵', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_ippin06.jpg` },
    { id: 306, name: '海鮮チヂミ',          desc: '海鮮たっぷりチヂミ',              price: 1100,  photo: '🦑', photoBg: 'linear-gradient(135deg,#0369a1,#1e40af)', photoUrl: `${HP}img_ippin11.jpg` },
    { id: 307, name: '炙りユッケ',          desc: '新鮮牛肉の炙りユッケ',            price: 800,   photo: '🥚', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', photoUrl: `${HP}img_ippin09.jpg` },
    { id: 308, name: '生センマイ',          desc: '新鮮センマイ・ごまだれ',          price: 690,   photo: '🐄', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)', photoUrl: `${HP}img_ippin04.jpg` },
    { id: 309, name: '桜ハラミ刺し',       desc: '新鮮ハラミ刺し',                  price: 1000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#e11d48,#be123c)', photoUrl: `${HP}img_ippin10.jpg` },
  ],
  menu04: [
    { id: 401, name: 'ザ・プレミアムモルツ', desc: '中ジョッキ・キンキン冷え',      price: 680,   photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', tag: '人気' },
    { id: 402, name: '角ハイボール',        desc: 'サントリー角・ソーダ割り',        price: 580,   photo: '🥃', photoBg: 'linear-gradient(135deg,#475569,#334155)' },
    { id: 403, name: 'レモンサワー',        desc: 'さっぱり爽快レモン',              price: 530,   photo: '🍋', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', tag: '人気' },
    { id: 404, name: 'ソウルマッコリ',      desc: '韓国伝統のお酒',                  price: 560,   photo: '🍶', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)' },
    { id: 405, name: '翠ジンソーダ',        desc: '爽やかジンソーダ',                price: 530,   photo: '🥤', photoBg: 'linear-gradient(135deg,#059669,#047857)' },
    { id: 406, name: 'ウーロン茶',          desc: 'ソフトドリンク',                  price: 450,   photo: '🍵', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 407, name: 'オレンジシャーベット', desc: 'さっぱりデザート',               price: 450,   photo: '🍊', photoBg: 'linear-gradient(135deg,#ea580c,#c2410c)' },
    { id: 408, name: 'マンゴーシャーベット', desc: '南国の甘みたっぷり',             price: 550,   photo: '🥭', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
  ],
}

const ALL_ITEMS = Object.values(ORDER_MENU).flat()

const ORDER_CATEGORIES = [
  { id: 'menu01', label: 'コース・セット・ランチ', img: 'https://www.hakuundai.net/img/menu_list01.png' },
  { id: 'menu02', label: '焼肉・ホルモン・その他', img: 'https://www.hakuundai.net/img/menu_list02.png' },
  { id: 'menu03', label: '手打ち冷麺・一品メニュー', img: 'https://www.hakuundai.net/img/menu_list03.png' },
  { id: 'menu04', label: 'ドリンク・デザート', img: 'https://www.hakuundai.net/img/menu_list04.png' },
]

const CAT_LABEL: Record<string, string> = {
  menu01: 'コース・セット・ランチ',
  menu02: '焼肉・ホルモン・その他',
  menu03: '手打ち冷麺・一品メニュー',
  menu04: 'ドリンク・デザート',
}

export default function YakinikuPage() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [copied, setCopied] = useState<'ssid' | 'pass' | null>(null)
  const [barcode, setBarcode] = useState<{ code: string; title: string } | null>(null)
  const [orderCat, setOrderCat] = useState<string | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [quickAdded, setQuickAdded] = useState<string | null>(null)
  const [tableId, setTableId] = useState<string>('')
  const [showTableModal, setShowTableModal] = useState(false)
  const [tableInput, setTableInput] = useState('')
  const [logoImage, setLogoImage] = useState('/restaurant-logo.png')
  const [kvImage, setKvImage] = useState('/restaurant-hero.png')

  useEffect(() => {
    const saved = localStorage.getItem('yakiniku_table_id') ?? ''
    setTableId(saved)
    if (!saved) setShowTableModal(true)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genreConfig_yakiniku')
      if (raw) {
        const cfg = JSON.parse(raw)
        if (cfg.logoImage) setLogoImage(cfg.logoImage)
        if (cfg.kvImage) setKvImage(cfg.kvImage)
      }
    } catch {}
  }, [])

  function saveTableId() {
    const v = tableInput.trim()
    if (!v) return
    localStorage.setItem('yakiniku_table_id', v)
    setTableId(v)
    setShowTableModal(false)
  }

  const cartTotal = ALL_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0) * i.price, 0)
  const cartCount = ALL_ITEMS.reduce((s, i) => s + (cart[i.id] ?? 0), 0)

  function addItem(id: number) { setCart(p => ({ ...p, [id]: (p[id] ?? 0) + 1 })) }
  function remItem(id: number) { setCart(p => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) - 1) })) }

  function quickAdd(id: number, name: string) {
    addItem(id)
    setQuickAdded(name)
    setTimeout(() => setQuickAdded(null), 1800)
  }

  function openCat(cat: string) { setPanel('order'); setOrderCat(cat) }

  async function placeOrder() {
    setOrderPlaced(true)
    setTimeout(() => {
      setCart({})
      setOrderPlaced(false)
      setOrderCat(null)
      setPanel(null)
    }, 3000)
  }

  async function copy(text: string, type: 'ssid' | 'pass') {
    try { await navigator.clipboard.writeText(text); setCopied(type); setTimeout(() => setCopied(null), 2000) } catch {}
  }

  function closePanel() { setPanel(null); setCopied(null); setOrderCat(null) }

  return (
    <>
      <main className="min-h-dvh flex flex-col bg-black">
        <header className="bg-black border-b border-gray-800 py-3 shrink-0">
          <div className="max-w-lg mx-auto w-full px-3 flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoImage} alt="焼肉屋" style={{ height: '40px', width: 'auto' }} />
            </Link>
            <button
              onClick={() => { setTableInput(tableId); setShowTableModal(true) }}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1 active:opacity-70 transition-opacity"
              style={tableId ? { background: '#fff1f2', border: '1px solid #fecdd3' } : { background: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <svg className="w-3.5 h-3.5" style={{ color: tableId ? '#dc2626' : '#ef4444' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              <span className="text-xs font-black" style={{ color: tableId ? '#dc2626' : '#dc2626' }}>
                {tableId ? `席 ${tableId}` : '席番号を設定'}
              </span>
            </button>
            {cartCount > 0 && (
              <button onClick={() => setPanel('order')} className="ml-1 flex items-center gap-1.5 bg-red-50 border border-red-300 rounded-lg px-2.5 py-1">
                <span className="text-xs font-black text-red-700">カート {cartCount}点</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 max-w-lg mx-auto w-full p-3 pb-6 flex flex-col gap-[15px]">
          {/* ヒーロー画像 */}
          <div className="rounded-2xl overflow-hidden shrink-0" style={{ height: '25vh' }}>
            <img
              src={kvImage}
              alt="焼肉屋"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ━━ 音声注文 ━━ */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-200">🎤 音声でかんたん注文</p>
              <p className="text-[10px] text-gray-500 mt-0.5">「カルビ2つとレモンサワー」と話してください</p>
            </div>
            <VoiceOrderButton
              menu={ALL_ITEMS}
              onConfirm={(items: ParsedItem[]) => {
                items.forEach(({ item, qty }) => {
                  for (let i = 0; i < qty; i++) addItem(item.id)
                })
                setQuickAdded(`音声注文をカートに追加しました`)
                setTimeout(() => setQuickAdded(null), 2000)
              }}
            />
          </div>

          {/* クイック追加トースト */}
          {quickAdded && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg">
              🥩 {quickAdded} をカートに追加しました
            </div>
          )}

          {/* ━━ クイックドリンク ━━ */}
          <div className="grid grid-cols-3 gap-[10px]">
            {[
              { id: 501, label: 'とりあえず\nプレモル', emoji: '🍺', color: '#fbbf24', bg: '#1c1007', border: '#92400e' },
              { id: 502, label: '角ハイボール', emoji: '🥃', color: '#94a3b8', bg: '#0f172a', border: '#334155' },
              { id: 503, label: 'レモンサワー', emoji: '🍋', color: '#fde047', bg: '#1a1500', border: '#854d0e' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => quickAdd(d.id, d.label.replace('\n', ''))}
                className="rounded-[20px] border flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 py-3 px-1 min-h-[90px]"
                style={{ background: d.bg, borderColor: d.border }}
              >
                <span className="text-3xl leading-none">{d.emoji}</span>
                <p className="font-bold text-[11px] leading-tight text-center whitespace-pre-line" style={{ color: d.color }}>{d.label}</p>
                <span className="text-[9px] text-gray-500 font-semibold px-1.5 py-0.5 rounded-full">1タップ注文</span>
              </button>
            ))}
          </div>

          {/* ━━ メニュー & サービス ━━ */}
          <div className="grid grid-cols-2 gap-[10px]">
            {/* 4カテゴリ画像ボタン */}
            {ORDER_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => openCat(cat.id)}
                className="rounded-xl overflow-hidden active:scale-95 transition-transform duration-150 border border-gray-700 flex flex-col"
                style={{ aspectRatio: '1/1' }}
              >
                <div className="bg-black px-2 py-3 shrink-0 border-b border-gray-700">
                  <p className="text-[#cc2200] font-bold text-[22px] text-center leading-tight tracking-wide">{cat.label}</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover object-bottom" />
                </div>
              </button>
            ))}

            {/* スタッフ呼び出し */}
            <button onClick={() => setPanel('staff')}
              className="rounded-[20px] border flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#0c1a2e', borderColor: '#1e3a5f' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-200 text-sm leading-tight">スタッフ呼び出し</p>
                <p className="text-[10px] text-gray-500 leading-tight">スタッフを呼ぶ</p>
              </div>
            </button>

            {/* クーポン */}
            <button onClick={() => setPanel('coupons')}
              className="rounded-[20px] border flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#0a1f0a', borderColor: '#1a4d1a' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)', color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-200 text-sm leading-tight">クーポン</p>
                <p className="text-[10px] text-gray-500 leading-tight">割引クーポンを見る</p>
              </div>
            </button>

            {/* WiFi接続 */}
            <button onClick={() => setPanel('wifi')}
              className="rounded-[20px] border flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#0c1a2e', borderColor: '#1e3a5f' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-200 text-sm leading-tight">WiFi接続</p>
                <p className="text-[10px] text-gray-500 leading-tight">フリーWiFiに接続</p>
              </div>
            </button>

            {/* 店舗情報 */}
            <button onClick={() => setPanel('store')}
              className="rounded-[20px] border col-span-2 flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#0a1f1e', borderColor: '#134e4a' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#14b8a6,#0f766e)', color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-200 text-sm leading-tight">店舗情報</p>
                <p className="text-[10px] text-gray-500 leading-tight">住所・営業時間など</p>
              </div>
            </button>
          </div>

          {/* お会計 — 全幅 */}
          <button
            onClick={() => setPanel('payment')}
            className="rounded-[20px] border flex items-center justify-center gap-3 p-4 active:scale-95 transition-transform duration-150"
            style={{ background: '#0a1f0a', borderColor: '#1a4d1a' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>
            </div>
            <p className="font-black text-green-400 text-base">お会計</p>
          </button>

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
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 cursor-pointer" onClick={() => setPanel(null)} />

            {/* ===== モバイルオーダー ===== */}
            {panel === 'order' && (
              <div className="pb-8">
                {!orderCat && (
                  <div className="px-5">
                    <h2 className="font-bold text-gray-900 text-lg mb-4">モバイルオーダー</h2>
                    {cartCount > 0 && (
                      <div className="flex items-center gap-2 mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <span className="text-red-500 text-sm">🛒</span>
                        <p className="text-xs font-bold text-red-700 flex-1">カートに {cartCount}点（¥{cartTotal.toLocaleString()}）</p>
                        <button onClick={placeOrder} className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg font-bold">注文する</button>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-[11px]">
                      {ORDER_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setOrderCat(cat.id)}
                          className="rounded-xl overflow-hidden active:scale-95 transition-transform duration-150 border border-gray-700 flex flex-col"
                          style={{ aspectRatio: '1/1' }}
                        >
                          <div className="bg-black px-2 py-3 shrink-0 border-b border-gray-700">
                            <p className="text-[#cc2200] font-bold text-[22px] text-center leading-tight tracking-wide">{cat.label}</p>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <img src={cat.img} alt={cat.label} className="w-full h-full object-cover object-bottom" />
                          </div>
                        </button>
                      ))}
                    </div>
                    {orderPlaced && (
                      <div className="mt-4 w-full py-4 rounded-xl bg-green-500 text-white font-bold text-sm text-center">
                        ✓ ご注文を受け付けました！
                      </div>
                    )}
                  </div>
                )}

                {orderCat && orderCat !== 'history' && (
                  <div className="px-5">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => setOrderCat(null)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                        </svg>
                      </button>
                      <h2 className="font-bold text-gray-900 text-lg">{CAT_LABEL[orderCat]}</h2>
                    </div>

                    <div className="space-y-3 mb-4">
                      {(ORDER_MENU[orderCat] ?? []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            {item.photoUrl ? (
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: item.photoBg }}>
                                {item.photo}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                              {item.tag && (
                                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">{item.tag}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mb-1">{item.desc}</p>
                            <p className="text-sm font-black text-red-600">¥{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => remItem(item.id)} className="w-8 h-8 rounded-full bg-white border border-red-200 text-red-500 font-bold text-base flex items-center justify-center">−</button>
                            <span className="w-4 text-center font-black text-gray-800 text-sm">{cart[item.id] ?? 0}</span>
                            <button onClick={() => addItem(item.id)} className="w-8 h-8 rounded-full bg-red-500 text-white font-bold text-base flex items-center justify-center">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {orderPlaced ? (
                      <div className="w-full py-4 rounded-xl bg-green-500 text-white font-bold text-sm text-center">
                        ✓ ご注文を受け付けました！
                      </div>
                    ) : (
                      <button
                        disabled={cartTotal === 0}
                        onClick={placeOrder}
                        className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform"
                      >
                        注文する{cartTotal > 0 ? `　¥${cartTotal.toLocaleString()}` : ''}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== WiFi ===== */}
            {panel === 'wifi' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">WiFi接続情報</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-sky-50 rounded-xl p-4">
                    <p className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">SSID</p>
                    <p className="font-mono font-semibold text-sky-900 mt-0.5">{DEMO_WIFI.ssid}</p>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-4">
                    <p className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">パスワード</p>
                    <p className="font-mono font-semibold text-sky-900 mt-0.5">{DEMO_WIFI.password}</p>
                  </div>
                  <button
                    onClick={() => copy(DEMO_WIFI.password, 'pass')}
                    className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold text-sm active:bg-sky-700"
                  >
                    {copied === 'pass' ? '✓ 接続済' : '接続'}
                  </button>
                </div>
              </div>
            )}

            {/* ===== クーポン ===== */}
            {panel === 'coupons' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">お得なクーポン</h2>
                </div>
                <div className="space-y-2">
                  {COUPONS.map((c) => (
                    <div key={c.id} className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between active:scale-95 transition-transform cursor-pointer"
                      onClick={() => setBarcode({ code: c.code, title: c.title })}>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.expires}まで</p>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-green-500 text-white font-semibold shrink-0 ml-3">使う</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== スタッフ呼び出し ===== */}
            {panel === 'staff' && (
              <div className="px-5 pb-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-4 mt-2">
                  <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                  </svg>
                </div>
                <h2 className="font-black text-gray-900 text-xl mb-1">スタッフを呼びますか？</h2>
                <p className="text-sm text-gray-400 mb-6">ボタンを押すとスタッフに通知が届きます</p>
                <button
                  onClick={() => { setPanel(null); setQuickAdded('スタッフに通知しました'); setTimeout(() => setQuickAdded(null), 2000) }}
                  className="w-full py-4 rounded-2xl bg-sky-500 text-white font-black text-base active:scale-95 transition-transform shadow-md shadow-sky-200"
                >
                  呼び出す
                </button>
              </div>
            )}

            {/* ===== お会計 ===== */}
            {panel === 'payment' && (
              <div className="px-5 pb-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 mt-2">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                  </svg>
                </div>
                <h2 className="font-black text-gray-900 text-xl mb-1">お会計</h2>
                <p className="text-sm text-gray-400 mb-4">スタッフにお会計をお伝えします</p>
                {cartCount > 0 && (
                  <div className="w-full bg-green-50 border border-green-100 rounded-xl p-4 mb-4 text-left">
                    <p className="text-xs text-green-600 font-semibold mb-1">注文合計</p>
                    <p className="text-2xl font-black text-green-700">¥{cartTotal.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{cartCount}点のご注文</p>
                  </div>
                )}
                <button
                  onClick={() => { setPanel(null); setQuickAdded('お会計の準備をします'); setTimeout(() => setQuickAdded(null), 2000) }}
                  className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-base active:scale-95 transition-transform shadow-md shadow-green-200"
                >
                  お会計をお願いする
                </button>
              </div>
            )}

            {/* ===== 店舗情報 ===== */}
            {panel === 'store' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">店舗情報</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">住所</p>
                      <p className="text-sm text-gray-700 font-medium">東京都渋谷区恵比寿1-2-3<br/>焼肉ビル 1F</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">電話番号</p>
                      <a href="tel:03-1234-5679" className="text-sm text-gray-700 font-medium">03-1234-5679</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">営業時間</p>
                      <p className="text-sm text-gray-700 font-medium">月〜金　17:00 – 24:00</p>
                      <p className="text-sm text-gray-700 font-medium">土・日　16:00 – 24:00</p>
                      <p className="text-xs text-gray-400 mt-1">定休日：毎週火曜日</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-wider mb-0.5">アクセス</p>
                      <p className="text-sm text-gray-700 font-medium">JR恵比寿駅 東口より徒歩3分</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {barcode && <BarcodeModal code={barcode.code} title={barcode.title} onClose={() => setBarcode(null)} />}

      {/* ── 席番号入力モーダル ── */}
      {showTableModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-6" onClick={() => tableId && setShowTableModal(false)}>
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
              <h2 className="font-black text-gray-900 text-lg">席番号を入力</h2>
              <p className="text-sm text-gray-400 mt-1">テーブルのQRコードまたは席札の番号を入力してください</p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="例：3、A-2、カウンター1"
              value={tableInput}
              onChange={e => setTableInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveTableId()}
              autoFocus
              className="w-full border-2 border-gray-200 focus:border-red-400 rounded-xl px-4 py-3 text-center text-2xl font-black text-gray-800 outline-none mb-4 transition-colors"
            />
            <button
              onClick={saveTableId}
              disabled={!tableInput.trim()}
              className="w-full py-3.5 rounded-xl bg-red-500 text-white font-black text-base disabled:opacity-40 active:scale-95 transition-transform"
            >
              決定
            </button>
            {tableId && (
              <button onClick={() => setShowTableModal(false)} className="w-full mt-2 py-2.5 text-sm text-gray-400 font-semibold">
                キャンセル
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
