'use client'

import { LogOut } from 'lucide-react'
import { useSidebarStore } from '@/store/sidebar-store'

export function LogoutButton() {
    const closeMobileSidebar = useSidebarStore((state) => state.closeMobileSidebar)

    const handleLogout = () => {
        // Şu aşamada fonksiyonsuz - sadece UI
        console.log('Logout clicked - functionality not implemented yet')
        closeMobileSidebar()
    }

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
        </button>
    )
}
