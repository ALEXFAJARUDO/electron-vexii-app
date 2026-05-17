'use client'
import { GenreEditorProvider } from '@/components/GenreEditorProvider'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <GenreEditorProvider>
      <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col gap-4">
        <AdminSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </GenreEditorProvider>
  )
}
