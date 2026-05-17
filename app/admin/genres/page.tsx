import Link from 'next/link'
import { GENRES } from '@/lib/genreConfig'

export default function GenresPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">業種管理</h1>
      <p className="text-gray-400 text-sm mb-6">業種を選択してコンテンツを編集できます</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GENRES.map((genre) => (
          <Link
            key={genre.id}
            href={`/admin/genres/${genre.id}`}
            className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${genre.light}33, ${genre.color}22)` }}
            >
              {genre.emoji}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">
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
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
      {label}
    </span>
  )
}
