'use client'

import { useAuth } from '@/contexts/auth-context'
import { getSidebarConfig } from '@/config/sidebar-config'
import { BaseSidebar } from '@/components/layout/BaseSidebar'

export default function OgrenciSidebar() {
    const { user } = useAuth()

    if (!user || user.role !== 'OGRENCI') return null

    const config = getSidebarConfig('OGRENCI')

    return <BaseSidebar config={config} user={user} />
}
