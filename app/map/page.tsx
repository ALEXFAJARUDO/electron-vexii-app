import { getAllStores, getAllAds } from '@/lib/supabase'
import StoreMapClient from '@/components/StoreMapClient'
import MenuButton from '@/components/MenuButton'
import MapAdBanner from '@/components/MapAdBanner'

export default async function MapPage() {
  const [stores, ads] = await Promise.all([getAllStores(), getAllAds()])
  const mapped = stores.filter((s) => s.lat && s.lng)

  return (
    <div className="flex flex-col h-screen bg-[#020c1b]">
      {/* Header */}
      <header className="shrink-0 border-b border-[#1e3c72] px-5 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0d1f3c] silver-border flex items-center justify-center p-1">
            <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold silver-gradient">Vexii</span>
            <span className="text-[#2d5a8e] text-xs ml-2">充電スポットマップ</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#2d5a8e] text-xs">
            <span className="text-[#60a5fa] font-semibold">{mapped.length}</span> スポット
          </span>
          <MenuButton />
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <StoreMapClient stores={stores} />

        {/* Store list sidebar (desktop) */}
        <div className="hidden md:flex absolute top-4 left-4 z-[1000] flex-col gap-2 max-h-[calc(100%-12rem)] overflow-y-auto">
          {mapped.map((store) => (
            <div
              key={store.id}
              className="w-64 rounded-xl bg-[#060f1e]/90 backdrop-blur-sm silver-border card-glow px-4 py-3"
            >
              <p className="text-[#bfdbfe] font-semibold text-sm">{store.name}</p>
              {store.address && <p className="text-[#2d5a8e] text-xs mt-0.5 line-clamp-1">{store.address}</p>}
              {store.hours && <p className="text-[#1e3c72] text-xs mt-1">{store.hours}</p>}
            </div>
          ))}
        </div>

        {/* Ad banner (desktop: bottom-right, mobile: above bottom sheet) */}
        <div className="hidden md:block">
          <MapAdBanner ads={ads} />
        </div>

        {/* Mobile bottom sheet */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000]">
          {/* Mobile ad banner */}
          {ads.length > 0 && (
            <div className="px-4 pb-2">
              <MobileAdStrip ads={ads} />
            </div>
          )}
          <div className="bg-[#060f1e]/95 backdrop-blur-sm border-t border-[#1e3c72] px-4 pt-3 pb-6">
            <div className="w-8 h-1 bg-[#1e3c72] rounded-full mx-auto mb-3" />
            <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
              {mapped.map((store) => (
                <div
                  key={store.id}
                  className="shrink-0 snap-start w-52 rounded-xl bg-[#0d1f3c] silver-border px-4 py-3"
                >
                  <p className="text-[#bfdbfe] font-semibold text-sm">{store.name}</p>
                  {store.address && <p className="text-[#2d5a8e] text-xs mt-0.5 line-clamp-2">{store.address}</p>}
                  {store.hours && <p className="text-[#1e3c72] text-xs mt-1">{store.hours}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile: horizontal scrollable ad strip
function MobileAdStrip({ ads }: { ads: import('@/lib/types').Ad[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1">
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="shrink-0 snap-start rounded-xl bg-[#060f1e]/95 backdrop-blur-sm silver-border flex items-center gap-3 px-3 py-2"
        >
          <span className="text-[#1e3c72] text-[10px] tracking-widest uppercase shrink-0">AD</span>
          {ad.image_url ? (
            <img src={ad.image_url} alt={ad.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#0d1f3c] silver-border shrink-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#1e3c72]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909"/>
              </svg>
            </div>
          )}
          <p className="text-[#7db4e8] text-xs font-medium line-clamp-1 max-w-[140px]">{ad.title}</p>
        </div>
      ))}
    </div>
  )
}
