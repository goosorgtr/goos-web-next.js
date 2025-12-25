'use client'

import { useAuth } from '@/contexts/auth-context'
import { getSidebarConfig } from '@/config/sidebar-config'
import { BaseSidebar } from '@/components/layout/BaseSidebar'

export default function VeliSidebar() {
    const { user } = useAuth()

    if (!user || user.role !== 'VELI') return null

    const config = getSidebarConfig('VELI')

    return <BaseSidebar config={config} user={user} />
}
