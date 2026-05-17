import Link from 'next/link'
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
    <main className="min-h-screen bg-[#edf1f7]">
      {/* Header */}
      <header className="sticky top-0 z-10 neu-header px-5 py-4 flex items-center justify-between">
        <Link href="/">
          <img
            src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
            alt="Vexii"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <ChargerMenuButton store={store} />
      </header>

      <div className="max-w-lg mx-auto w-full px-4 pt-4 pb-16 space-y-3">
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
