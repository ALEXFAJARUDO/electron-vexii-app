import Link from 'next/link'
import { GENRES } from '@/lib/genreConfig'

export default function GenresPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold silver-gradient mb-2">業種管理</h1>
      <p className="text-[#2d5a8e] text-sm mb-8">業種を選択してコンテンツを編集できます</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GENRES.map((genre) => (
          <Link
            key={genre.id}
            href={`/admin/genres/${genre.id}`}
            className="rounded-2xl bg-[#060f1e] silver-border card-glow p-5 flex items-center gap-4 hover:bg-[#0a1628] transition-colors group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${genre.light}33, ${genre.color}33)` }}
            >
              {genre.emoji}
            </div>
            <div>
              <p className="font-semibold text-[#bfdbfe] text-sm group-hover:text-white transition-colors">
                {genre.label}
              </p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {genre.hasMenu && <Tag label="メニュー" />}
                {genre.hasFloor && <Tag label="フロア" />}
                {genre.hasSchedule && <Tag label="スケジュール" />}
                <Tag label="WiFi" />
                <Tag label="クーポン" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#1e3c72] text-[#3b82f6]">
      {label}
    </span>
  )
}
