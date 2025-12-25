'use client'

import { useAuth } from '@/contexts/auth-context'
import { getSidebarConfig } from '@/config/sidebar-config'
import { BaseSidebar } from '@/components/layout/BaseSidebar'

export default function AdminSidebar() {
    const { user } = useAuth()

    if (!user || user.role !== 'ADMIN') return null

    const config = getSidebarConfig('ADMIN')

    return <BaseSidebar config={config} user={user} />
}
