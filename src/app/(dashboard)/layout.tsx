'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Suspense, lazy, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useSidebarStore } from '@/store/sidebar-store'
import { cn } from '@/lib/utils'

// Lazy load sidebar'lar - sadece kullanılan yüklenecek
const AdminSidebar = lazy(() => import('@/components/admin/layout/AdminSidebar').then(m => ({ default: m.default })))
const VeliSidebar = lazy(() => import('@/components/veli/layout/VeliSidebar').then(m => ({ default: m.default })))
const OgrenciSidebar = lazy(() => import('@/components/ogrenci/layout/OgrenciSidebar').then(m => ({ default: m.default })))
const OgretmenSidebar = lazy(() => import('@/components/ogretmen/layout/OgretmenSidebar').then(m => ({ default: m.default })))
const KantinciSidebar = lazy(() => import('@/components/kantinci/layout/KantinciSidebar').then(m => ({ default: m.default })))
const ServiciSidebar = lazy(() => import('@/components/servici/layout/ServiciSidebar').then(m => ({ default: m.default })))

// Loading fallback
const SidebarLoader = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
  </div>
)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { isMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebarStore()

  // Rol bazlı sidebar seçimi - memoize edilmiş
  const SidebarComponent = useMemo(() => {
    if (!user) return null

    switch (user.role) {
      case 'ADMIN':
        return AdminSidebar
      case 'VELI':
        return VeliSidebar
      case 'OGRENCI':
        return OgrenciSidebar
      case 'OGRETMEN':
        return OgretmenSidebar
      case 'KANTINCI':
        return KantinciSidebar
      case 'SERVICI':
        return ServiciSidebar
      default:
        return null
    }
  }, [user?.role])

  const renderSidebar = () => {
    if (!SidebarComponent) return null

    return (
      <Suspense fallback={<SidebarLoader />}>
        <SidebarComponent />
      </Suspense>
    )
  }

  // Rol bazlı header seçimi
  const renderHeader = () => {
    if (!user) return null

    switch (user.role) {
      // Diğer roller için standart header
      default:
        return (
          <header className="flex h-[92px] items-center justify-between border-b bg-white px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileSidebar}
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>

            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                <span className="sr-only">Bildirimler</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>

              <Link
                href={`/${user.role.toLowerCase()}/ayarlar`}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Ayarlar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38 a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>

              <div className="h-8 w-px bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </header >
        )
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      user?.role === 'OGRENCI' && 'theme-ogrenci',
      user?.role === 'OGRETMEN' && 'theme-ogretmen',
      user?.role === 'VELI' && 'theme-veli'
    )}>
      {/* Desktop Sidebar - Fixed */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-white lg:block">
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

      {/* Main Content - With left margin for sidebar */}
      <div className="flex min-h-screen flex-col lg:ml-64">
        {/* Header - Fixed */}
        <div className="fixed right-0 top-0 z-20 w-full lg:w-[calc(100%-16rem)]">
          {renderHeader()}
        </div>

        {/* Page Content - Scrollable */}
        <main className="mt-[92px] flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
