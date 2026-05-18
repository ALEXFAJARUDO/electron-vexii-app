import { SessionProvider } from '@/lib/restaurantSession'

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
