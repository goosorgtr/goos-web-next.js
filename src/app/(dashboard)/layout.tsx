'use client'

import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useSidebarStore } from '@/store/sidebar-store'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminHeader from '@/components/admin/layout/AdminHeader'
import VeliSidebar from '@/components/veli/layout/VeliSidebar'
import OgrenciSidebar from '@/components/ogrenci/layout/OgrenciSidebar'
import OgretmenSidebar from '@/components/ogretmen/layout/OgretmenSidebar'
import KantinciSidebar from '@/components/kantinci/layout/KantinciSidebar'
import ServiciSidebar from '@/components/servici/layout/ServiciSidebar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { isMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebarStore()

  // Rol bazlı sidebar seçimi
  const renderSidebar = () => {
    if (!user) return null

    switch (user.role) {
      case 'ADMIN':
        return <AdminSidebar />
      case 'VELI':
        return <VeliSidebar />
      case 'OGRENCI':
        return <OgrenciSidebar />
      case 'OGRETMEN':
        return <OgretmenSidebar />
      case 'KANTINCI':
        return <KantinciSidebar />
      case 'SERVICI':
        return <ServiciSidebar />
      default:
        return null
    }
  }

  // Rol bazlı header seçimi
  const renderHeader = () => {
    if (!user) return null

    switch (user.role) {
      case 'ADMIN':
        return <AdminHeader />
      // Diğer roller için basit header
      default:
        return (
          <header className="border-b bg-white p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileSidebar}
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold">School Management System</h1>
            </div>
          </header>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-white lg:block">
        {renderSidebar()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-300 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeMobileSidebar}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">{renderSidebar()}</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        {renderHeader()}

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
