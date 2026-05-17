import MenuButton from '@/components/MenuButton'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020c1b]">
      <header className="border-b border-[#1e3c72] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0d1f3c] silver-border flex items-center justify-center p-1">
              <img src="https://e-vexii.com/wordpress/wp-content/uploads/2018/12/logo_mini.png" alt="Vexii" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold silver-gradient">Vexii</span>
              <span className="text-[#2d5a8e] text-xs ml-2">Admin</span>
            </div>
          </div>
          <MenuButton />
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
