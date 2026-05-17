import Link from 'next/link'
import MenuButton from '@/components/MenuButton'
import AdminShell from './AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <header className="neu-header px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png"
            alt="Vexii"
            className="h-8 w-auto object-contain"
          />
          <span className="text-gray-400 text-xs font-medium">Admin</span>
        </Link>
        <MenuButton />
      </header>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
