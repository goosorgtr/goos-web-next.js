'use client'

import { useAuth } from '@/contexts/auth-context'
import { getSidebarConfig } from '@/config/sidebar-config'
import { BaseSidebar } from '@/components/layout/BaseSidebar'

export default function KantinciSidebar() {
    const { user } = useAuth()

    if (!user || user.role !== 'KANTINCI') return null

    const config = getSidebarConfig('KANTINCI')

    return <BaseSidebar config={config} user={user} />
}
