import { notFound } from 'next/navigation'
import { getChargerWithStore, getAds, getCoupons } from '@/lib/supabase'
import StoreInfo from '@/components/StoreInfo'
import AdBanner from '@/components/AdBanner'
import CouponCard from '@/components/CouponCard'
import ChargerStatus from '@/components/ChargerStatus'
import ChargerMenuButton from '@/components/ChargerMenuButton'

export default async function ChargerPage({ params }: { params: Promise<{ chargerId: string }> }) {
  const { chargerId } = await params
  const { charger, store } = await getChargerWithStore(chargerId)

  if (!charger || !store) notFound()

  const [ads, coupons] = await Promise.all([
    getAds(store.id),
    getCoupons(store.id),
  ])

  return (
    <main className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
            alt="Vexii"
            className="h-7 w-auto object-contain"
          />
          <span className="font-bold text-sm silver-gradient">Vexii</span>
        </div>
        <ChargerMenuButton store={store} />
      </header>

      <div className="px-4 pt-4 pb-16 space-y-3">
        {/* Charger Status */}
        <ChargerStatus charger={charger} />

        {/* Store Info */}
        <StoreInfo store={store} />

        {/* Ad Banner */}
        <AdBanner ads={ads} />

        {/* Coupons */}
        {coupons.length > 0 && (
          <section id="coupons">
            <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3 px-1">Coupons</h2>
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="text-center text-gray-300 text-xs pb-8">
        &copy; {new Date().getFullYear()} Electron Vexii
      </footer>
    </main>
  )
}
