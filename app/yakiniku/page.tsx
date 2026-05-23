'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BarcodeModal from '@/components/BarcodeModal'
import VoiceOrderButton from '@/components/restaurant/VoiceOrderButton'
import { type ParsedItem } from '@/lib/voiceCommandParser'

type PanelId = 'wifi' | 'coupons' | 'order' | 'ad' | 'app' | 'store' | 'staff' | 'payment' | 'history'
type OrderItem = { id: number; name: string; desc: string; price: number; photo: string; photoBg: string; photoUrl?: string; keywords?: string[]; tag?: string }
type HistoryEntry = { id: string; tableId: string; items: { name: string; price: number; qty: number }[]; total: number; placedAt: number }

const DEMO_WIFI = { ssid: 'HAKUUNDAI_WIFI', password: 'hakuundai2024' }

const COUPONS = [
  { id: 1, title: 'カルビ1皿無料', code: 'KARUBI1', expires: '2026/05/31' },
  { id: 2, title: 'ドリンク1杯無料', code: 'DRINK', expires: '2026/05/25' },
  { id: 3, title: 'デザート 30%OFF', code: 'DESSERT30', expires: '2026/06/30' },
]

const HP = 'https://www.hakuundai.net/img/'

const ORDER_MENU: Record<string, OrderItem[]> = {
  menu01: [
    { id: 101, name: '白雲台コース',       desc: '一人前',  price: 5000,  photo: '🍽', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', photoUrl: `${HP}img_menu02.jpg`, keywords: ['はくうんだいコース', 'ハクウンダイコース', '白雲台'], tag: '人気' },
    { id: 102, name: '肉三昧コース',       desc: '一人前',  price: 6000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', photoUrl: `${HP}nikuzanmai.jpg` },
    { id: 103, name: 'お手軽コース',       desc: '一人前',  price: 3700,  photo: '🍴', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_menu01.jpg` },
    { id: 104, name: '贅沢コース',         desc: '一人前',  price: 8000,  photo: '✨', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_menu04.jpg`, tag: '特選' },
    { id: 105, name: 'プレミアムコース',   desc: '一人前',  price: 13000, photo: '👑', photoBg: 'linear-gradient(135deg,#78350f,#451a03)', photoUrl: `${HP}img_menu05.jpg`, tag: '特選' },
    { id: 106, name: 'お肉のケーキコース', desc: '一人前',  price: 6000,  photo: '🎂', photoBg: 'linear-gradient(135deg,#e11d48,#be123c)', photoUrl: `${HP}img_menu06.png` },
    { id: 107, name: '極みコース',         desc: '要予約・一人前', price: 20000, photo: '🌟', photoBg: 'linear-gradient(135deg,#713f12,#451a03)', tag: '要予約' },
  ],
  menu02: [
    { id: 201, name: '神戸牛3種盛り合わせ', desc: '神戸牛の最高3部位',    price: 15000, photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_yaki01.jpg`, keywords: ['神戸牛3種', '神戸牛盛り', '神戸牛三種'], tag: '特選' },
    { id: 202, name: '特撰バラ',            desc: 'とろける旨みの最高峰', price: 2900,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', photoUrl: `${HP}img_yaki02.jpg`, keywords: ['特選バラ', 'とくせんバラ'], tag: '人気' },
    { id: 203, name: '特撰ロース',           desc: '柔らか上質ロース',    price: 3000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#991b1b)', photoUrl: `${HP}img_yaki03.jpg`, keywords: ['特選ロース', 'とくせんロース'] },
    { id: 204, name: '特撰焼きしゃぶ',      desc: '薄切り・旨みが引き立つ', price: 3000, photo: '🥩', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_yaki04.jpg`, keywords: ['特選焼きしゃぶ', '焼きしゃぶ', 'しゃぶしゃぶ'] },
    { id: 205, name: '特撰厚切り牛タン',    desc: '厚切りでジューシー',   price: 3000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_yaki05.jpg`, keywords: ['特選厚切り牛タン', '特選タン', '厚切りタン'] },
    { id: 206, name: 'シャトーブリアン',    desc: '最高部位・フィレ肉の王様', price: 6800, photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_yaki06.jpg`, tag: '特選' },
    { id: 207, name: '上撰バラ',            desc: 'とろける上質なバラ肉', price: 1800,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', keywords: ['上選バラ', 'じょうせんバラ'] },
    { id: 208, name: '上撰骨付きカルビ',    desc: '骨付きで旨みが凝縮',   price: 2100,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', keywords: ['上選骨付きカルビ', '上カルビ', '上選カルビ'] },
    { id: 209, name: '上撰赤身',            desc: '赤身のうまみをシンプルに', price: 1760, photo: '🥩', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', keywords: ['上選赤身', '上赤身', '赤身'] },
    { id: 210, name: 'ネギ塩牛タン',        desc: 'ネギ塩ダレ・香ばしい牛タン', price: 2000, photo: '🥩', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_yaki_gyu3type.jpg`, keywords: ['ネギ塩タン', 'ねぎ塩タン', 'ネギ塩', 'ねぎ塩'] },
    { id: 211, name: '薄切り牛タン',        desc: 'やわらか薄切りタン',   price: 1800,  photo: '🥩', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', keywords: ['タン', '牛タン', 'タン塩'] },
    { id: 212, name: '牛タン3種食べ比べ',   desc: '3種のタンを食べ比べ',  price: 1300,  photo: '🥩', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', keywords: ['タン3種', '牛タン3種', 'タン三種'] },
    { id: 213, name: '和牛上撰ハラミ',      desc: '柔らかジューシー',     price: 2000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', keywords: ['和牛上選ハラミ', '上選ハラミ', '上ハラミ'] },
    { id: 214, name: 'ロース',              desc: '厚切りロース',         price: 2300,  photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_yaki07.jpg` },
    { id: 215, name: '壺漬けカルビ',        desc: '特製壺漬けダレのカルビ', price: 1300, photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)' },
    { id: 216, name: '牛タン4種食べ比べ',   desc: '4種のタンを食べ比べ',  price: 1800,  photo: '🥩', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', keywords: ['タン4種', '牛タン4種', 'タン四種'] },
    { id: 217, name: '和牛ハラミ',          desc: '和牛のやわらかハラミ', price: 1850,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', keywords: ['ハラミ'] },
    { id: 218, name: '黒毛牛ハラミ',        desc: '黒毛牛のハラミ',       price: 1000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#78350f,#451a03)' },
    { id: 219, name: '壺漬けハラミ',        desc: '壺漬けダレのハラミ',   price: 1650,  photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 220, name: '骨付きカルビ',        desc: '骨付きカルビ・甘口たれ', price: 1400, photo: '🥩', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', photoUrl: `${HP}img_yaki05.jpg`, keywords: ['カルビ', 'カルビ肉', '骨付き', 'ほねつき', '骨つき'], tag: '人気' },
    { id: 221, name: '中落ちカルビ',        desc: 'ジューシーな中落ちカルビ', price: 1000, photo: '🥩', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', photoUrl: `${HP}img_yaki06.jpg`, keywords: ['中落ち', '中落ちカルビ'] },
    { id: 222, name: '日替わり3種盛り',     desc: '部位の指定は出来ません', price: 1000, photo: '🥩', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 223, name: '日替わり5種盛り',     desc: '部位の指定は出来ません', price: 1800, photo: '🥩', photoBg: 'linear-gradient(135deg,#78350f,#451a03)' },
    { id: 224, name: '上ミノ',              desc: '第一胃・コリコリ食感', price: 950,   photo: '🐄', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', photoUrl: `${HP}img_horumon01.jpg`, keywords: ['ミノ'], tag: '人気' },
    { id: 225, name: 'アカセン',            desc: '第3胃・コリコリ食感', price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 226, name: 'とろコリコリ',        desc: 'とろけるコリコリ食感', price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { id: 227, name: 'しまちょう',          desc: '大腸・とろける旨み',   price: 960,   photo: '🐄', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', photoUrl: `${HP}img_horumon_shimacho.jpg` },
    { id: 228, name: 'ハツ',               desc: '心臓・コリコリ食感',   price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)', photoUrl: `${HP}img_horumon02.jpg` },
    { id: 229, name: '焼きレバー',          desc: '新鮮レバー・ごまだれ', price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#9d174d,#831843)', photoUrl: `${HP}img_horumon03.jpg`, keywords: ['レバー'] },
    { id: 230, name: '焼きセンマイ',        desc: 'センマイの香ばしい焼き', price: 800,  photo: '🐄', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)' },
    { id: 231, name: 'ツラミ',             desc: '頬肉・コラーゲンたっぷり', price: 900, photo: '🐄', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)' },
    { id: 232, name: 'はらみスジ',          desc: 'ハラミのスジ・濃厚な旨み', price: 600, photo: '🐄', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 233, name: 'ウルテ',             desc: '軟骨・コリコリ食感',   price: 800,   photo: '🐄', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
  ],
  menu03: [
    { id: 301, name: '手打ち冷麺（中）',    desc: '牛骨スープ・さっぱり',           price: 1130,  photo: '🍜', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', photoUrl: `${HP}img_ippin01.jpg`, tag: '人気' },
    { id: 302, name: '手打ち冷麺（大）',    desc: '牛骨スープ・大盛り',             price: 1350,  photo: '🍜', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', photoUrl: `${HP}img_ippin01.jpg` },
    { id: 303, name: '全州石鍋ビビンバ',   desc: 'おこげが香ばしい本格ビビンバ',   price: 1350,  photo: '🍳', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)', photoUrl: `${HP}img_ippin02.jpg` },
    { id: 304, name: 'チゲ',              desc: 'キムチorホルモンチゲ',           price: 960,   photo: '🫕', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)', photoUrl: `${HP}img_ippin05.jpg` },
    { id: 305, name: 'クッパ',             desc: '牛骨スープのおじや',             price: 800,   photo: '🍲', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', photoUrl: `${HP}img_ippin03.jpg` },
    { id: 306, name: 'ビビンバ',           desc: 'シンプルなビビンバ',             price: 800,   photo: '🥢', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 307, name: 'テールスープ',       desc: '濃厚牛テールスープ',             price: 960,   photo: '🍵', photoBg: 'linear-gradient(135deg,#92400e,#78350f)', photoUrl: `${HP}img_ippin06.jpg` },
    { id: 308, name: 'ユッケジャンスープ', desc: '牛肉と野菜の辛口スープ',         price: 960,   photo: '🫕', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)' },
    { id: 309, name: 'カルビスープ',       desc: 'カルビ入り牛骨スープ',           price: 960,   photo: '🍵', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 310, name: 'シレギスープ',       desc: '干し大根葉のさっぱりスープ',     price: 960,   photo: '🥣', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { id: 311, name: 'サムゲタンスープ',   desc: '参鶏湯風・滋養たっぷり',         price: 960,   photo: '🍲', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
    { id: 312, name: '玉子スープ',         desc: '卵入りあっさりスープ',           price: 470,   photo: '🥚', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
    { id: 313, name: 'ワカメスープ',       desc: 'わかめたっぷりスープ',           price: 470,   photo: '🌿', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { id: 314, name: 'わか玉スープ',       desc: 'わかめと卵のスープ',             price: 520,   photo: '🥣', photoBg: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { id: 315, name: '炙りユッケ',         desc: '新鮮牛肉の炙りユッケ',           price: 800,   photo: '🥚', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', photoUrl: `${HP}img_ippin09.jpg` },
    { id: 316, name: 'さくらユッケ',       desc: 'さくら肉のユッケ',               price: 1130,  photo: '🥩', photoBg: 'linear-gradient(135deg,#e11d48,#be123c)', photoUrl: `${HP}img_ippin10.jpg` },
    { id: 317, name: '海鮮チヂミ',         desc: '海鮮たっぷりチヂミ',             price: 1100,  photo: '🦑', photoBg: 'linear-gradient(135deg,#0369a1,#1e40af)', photoUrl: `${HP}img_ippin11.jpg` },
    { id: 318, name: '生センマイ',         desc: '新鮮センマイ・ごまだれ',         price: 690,   photo: '🐄', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)', photoUrl: `${HP}img_ippin04.jpg` },
    { id: 319, name: '桜ハラミ刺し',       desc: '新鮮ハラミ刺し',                 price: 1000,  photo: '🥩', photoBg: 'linear-gradient(135deg,#e11d48,#be123c)' },
  ],
  menu04: [
    { id: 401, name: 'ザ・プレミアムモルツ［小］', desc: '小ジョッキ',              price: 530,   photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', keywords: ['プレモル小', 'モルツ小'] },
    { id: 402, name: 'ザ・プレミアムモルツ［中］', desc: '中ジョッキ・キンキン冷え', price: 680,  photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)', keywords: ['プレモル', 'モルツ', 'プレミアムモルツ', 'ビール'], tag: '人気' },
    { id: 403, name: 'ザ・プレミアムモルツ［中瓶］', desc: '中瓶ビール',            price: 730,   photo: '🍺', photoBg: 'linear-gradient(135deg,#b45309,#92400e)', keywords: ['プレモル中瓶', 'モルツ中瓶'] },
    { id: 404, name: 'オールフリー',             desc: 'ノンアルコールビール',      price: 530,   photo: '🍺', photoBg: 'linear-gradient(135deg,#65a30d,#4d7c0f)' },
    { id: 405, name: 'ソウルマッコリ',           desc: '韓国伝統のお酒',            price: 560,   photo: '🍶', photoBg: 'linear-gradient(135deg,#6d28d9,#5b21b6)' },
    { id: 406, name: '虎マッコリ',              desc: '濃厚虎マッコリ',            price: 680,   photo: '🍶', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { id: 407, name: 'カシスソーダ',            desc: 'カクテル',                  price: 630,   photo: '🍸', photoBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { id: 408, name: 'カシスオレンジ',          desc: 'カクテル',                  price: 630,   photo: '🍊', photoBg: 'linear-gradient(135deg,#ea580c,#c2410c)' },
    { id: 409, name: 'シャンディーガフ',        desc: 'ビールジンジャー割り',      price: 630,   photo: '🍺', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
    { id: 410, name: 'ファジーネーブル',        desc: 'カクテル',                  price: 630,   photo: '🍑', photoBg: 'linear-gradient(135deg,#ea580c,#c2410c)' },
    { id: 411, name: 'ピーチウーロン',          desc: '桃の香りウーロン割り',      price: 630,   photo: '🍑', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 412, name: '松竹梅（燗・冷）［小］',  desc: '日本酒',                    price: 530,   photo: '🍶', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)', keywords: ['松竹梅', '日本酒'] },
    { id: 413, name: '松竹梅（燗・冷）［大］',  desc: '日本酒',                    price: 830,   photo: '🍶', photoBg: 'linear-gradient(135deg,#0369a1,#1e40af)', keywords: ['松竹梅大', '日本酒大'] },
    { id: 414, name: '翠(すい)ジンソーダ',     desc: 'ジャパニーズジン',           price: 530,   photo: '🥤', photoBg: 'linear-gradient(135deg,#059669,#047857)', keywords: ['翠ジンソーダ', '翠ジン', '翠', 'すいジン'] },
    { id: 415, name: '大隅 芋',               desc: '芋焼酎・グラス',             price: 530,   photo: '🥃', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 416, name: '大隅 麦',               desc: '麦焼酎・グラス',             price: 530,   photo: '🥃', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 417, name: '鏡月（韓国焼酎）',        desc: 'グラス',                    price: 530,   photo: '🥃', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
    { id: 418, name: '南高梅酒',              desc: 'ロック・水割り・ソーダ割り',  price: 530,   photo: '🍑', photoBg: 'linear-gradient(135deg,#e11d48,#be123c)' },
    { id: 419, name: 'オレンジシャーベット',    desc: 'さっぱりデザート',           price: 450,   photo: '🍊', photoBg: 'linear-gradient(135deg,#ea580c,#c2410c)' },
    { id: 420, name: 'レモンシャーベット',      desc: 'さっぱりデザート',           price: 400,   photo: '🍋', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
    { id: 421, name: '桃シャーベット',         desc: '桃の甘みたっぷり',           price: 550,   photo: '🍑', photoBg: 'linear-gradient(135deg,#e11d48,#be123c)' },
    { id: 422, name: 'マンゴーシャーベット',    desc: '南国の甘みたっぷり',         price: 550,   photo: '🥭', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
    { id: 423, name: 'カルロ・ロッシ レッド',  desc: 'ワイン・グラス',             price: 560,   photo: '🍷', photoBg: 'linear-gradient(135deg,#7f1d1d,#991b1b)' },
    { id: 424, name: 'ダークホース ビッグレッドブレンド', desc: 'ワイン・ボトル',   price: 4800,  photo: '🍾', photoBg: 'linear-gradient(135deg,#7f1d1d,#450a0a)' },
    { id: 425, name: '甲州 日本の白',          desc: 'ワイン・ボトル',             price: 4600,  photo: '🍾', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
    { id: 426, name: 'カーニヴォ',             desc: 'ワイン・ボトル',             price: 4800,  photo: '🍾', photoBg: 'linear-gradient(135deg,#7f1d1d,#991b1b)' },
    { id: 427, name: 'ジムビームハイボール',    desc: 'ハイボール',                 price: 530,   photo: '🥃', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
    { id: 428, name: 'ジムビームコーラ',        desc: 'ハイボール',                 price: 580,   photo: '🥃', photoBg: 'linear-gradient(135deg,#1c1917,#292524)' },
    { id: 429, name: 'ジムビームジンジャー',    desc: 'ハイボール',                 price: 580,   photo: '🥃', photoBg: 'linear-gradient(135deg,#b45309,#78350f)' },
    { id: 430, name: '角ハイボール',           desc: 'サントリー角・ソーダ割り',   price: 580,   photo: '🥃', photoBg: 'linear-gradient(135deg,#475569,#334155)' },
    { id: 431, name: '碧Aoハイボール',         desc: 'ハイボール',                 price: 800,   photo: '🥃', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
    { id: 432, name: '知多ハイボール',         desc: 'ハイボール',                 price: 800,   photo: '🥃', photoBg: 'linear-gradient(135deg,#b45309,#92400e)' },
    { id: 433, name: 'メーカーズハイボール',    desc: 'ハイボール',                 price: 700,   photo: '🥃', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)' },
    { id: 434, name: 'レモンサワー',           desc: 'さっぱり爽快レモン',         price: 530,   photo: '🍋', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)', tag: '人気' },
    { id: 435, name: 'Wレモンサワー',          desc: 'ダブルレモンサワー',         price: 580,   photo: '🍋', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
    { id: 436, name: 'ゆずサワー',            desc: 'ゆずの香りサワー',           price: 530,   photo: '🍊', photoBg: 'linear-gradient(135deg,#ca8a04,#a16207)' },
    { id: 437, name: '赤玉パンチ',            desc: 'サワー',                     price: 530,   photo: '🍹', photoBg: 'linear-gradient(135deg,#b91c1c,#991b1b)' },
    { id: 438, name: '赤玉レモンソーダ',       desc: 'サワー',                     price: 530,   photo: '🍹', photoBg: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { id: 439, name: 'ウーロンハイ',           desc: 'ウーロン茶割り',             price: 530,   photo: '🥤', photoBg: 'linear-gradient(135deg,#78350f,#451a03)' },
    { id: 440, name: '黒ウーロン茶',           desc: 'ソフトドリンク',             price: 550,   photo: '🍵', photoBg: 'linear-gradient(135deg,#1c1917,#292524)' },
    { id: 441, name: 'ウーロン茶',            desc: 'ソフトドリンク',             price: 450,   photo: '🍵', photoBg: 'linear-gradient(135deg,#92400e,#78350f)' },
    { id: 442, name: 'ペプシコーラ',           desc: 'ソフトドリンク',             price: 450,   photo: '🥤', photoBg: 'linear-gradient(135deg,#1d4ed8,#1e40af)' },
    { id: 443, name: 'ジンジャーエール',        desc: 'ソフトドリンク',             price: 450,   photo: '🥤', photoBg: 'linear-gradient(135deg,#65a30d,#4d7c0f)' },
    { id: 444, name: 'なっちゃんオレンジ',      desc: 'ソフトドリンク',             price: 450,   photo: '🍊', photoBg: 'linear-gradient(135deg,#ea580c,#c2410c)' },
    { id: 445, name: 'カルピス',              desc: 'ソフトドリンク',             price: 450,   photo: '🥛', photoBg: 'linear-gradient(135deg,#0284c7,#0369a1)' },
    { id: 446, name: 'カルピスソーダ',         desc: 'ソフトドリンク',             price: 450,   photo: '🥤', photoBg: 'linear-gradient(135deg,#0369a1,#1e40af)' },
    { id: 447, name: '飲み放題コース',         desc: '2時間・瓶ビール・焼酎など',  price: 1800,  photo: '🍻', photoBg: 'linear-gradient(135deg,#d97706,#b45309)' },
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
  const [orderHistory, setOrderHistory] = useState<HistoryEntry[]>([])
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yakiniku_order_history')
      if (raw) setOrderHistory(JSON.parse(raw))
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
    const orderedItems = ALL_ITEMS
      .filter(i => (cart[i.id] ?? 0) > 0)
      .map(i => ({ name: i.name, price: i.price, qty: cart[i.id] }))
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      tableId,
      items: orderedItems,
      total: cartTotal,
      placedAt: Date.now(),
    }
    const newHistory = [entry, ...orderHistory]
    setOrderHistory(newHistory)
    localStorage.setItem('yakiniku_order_history', JSON.stringify(newHistory))

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
              { id: 402, label: 'とりあえず\nプレモル', emoji: '🍺', color: '#fbbf24', bg: '#1c1007', border: '#92400e' },
              { id: 430, label: '角ハイボール', emoji: '🥃', color: '#94a3b8', bg: '#0f172a', border: '#334155' },
              { id: 434, label: 'レモンサワー', emoji: '🍋', color: '#fde047', bg: '#1a1500', border: '#854d0e' },
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
                  <p className="text-[#cc2200] font-bold text-[15px] text-center leading-tight tracking-wide">{cat.label}</p>
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

            {/* 注文履歴 */}
            <button onClick={() => setPanel('history')}
              className="rounded-[20px] border flex items-center gap-3 p-3.5 active:scale-95 transition-transform duration-150"
              style={{ background: '#0f0a2e', borderColor: '#2d1f6e' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-200 text-sm leading-tight">注文履歴</p>
                <p className="text-[10px] text-gray-500 leading-tight">過去の注文を確認</p>
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
                            <p className="text-[#cc2200] font-bold text-[15px] text-center leading-tight tracking-wide">{cat.label}</p>
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
                      <h2 className="font-bold text-gray-900 text-lg flex-1">{CAT_LABEL[orderCat]}</h2>
                      {orderPlaced ? (
                        <span className="text-xs font-bold text-green-600 shrink-0">✓ 注文済み</span>
                      ) : (
                        <button
                          disabled={cartTotal === 0}
                          onClick={placeOrder}
                          className={`shrink-0 px-3 py-2 rounded-xl font-bold text-xs active:scale-95 transition-transform leading-tight text-center ${cartTotal > 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                        >
                          <span className="block">注文する</span>
                          {cartTotal > 0 && <span className="block text-[10px] text-red-200">¥{cartTotal.toLocaleString()}</span>}
                        </button>
                      )}
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

            {/* ===== 注文履歴 ===== */}
            {panel === 'history' && (
              <div className="px-5 pb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">注文履歴</h2>
                </div>
                {orderHistory.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">まだ注文履歴はありません</p>
                ) : (
                  <div className="space-y-3">
                    {orderHistory.map((entry) => (
                      <div key={entry.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-400">
                            {new Date(entry.placedAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {entry.tableId && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">席 {entry.tableId}</span>
                          )}
                        </div>
                        <div className="space-y-1 mb-3">
                          {entry.items.map((it, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-gray-700">{it.name} × {it.qty}</span>
                              <span className="text-gray-500">¥{(it.price * it.qty).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <span className="text-xs font-bold text-gray-600">合計</span>
                          <span className="text-sm font-black text-red-600">¥{entry.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => { setOrderHistory([]); localStorage.removeItem('yakiniku_order_history') }}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-400 text-xs font-bold active:bg-gray-50"
                    >
                      履歴をすべてクリア
                    </button>
                  </div>
                )}
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
