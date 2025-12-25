'use client'

import { useAuth } from '@/contexts/auth-context'
import { getSidebarConfig } from '@/config/sidebar-config'
import { BaseSidebar } from '@/components/layout/BaseSidebar'

export default function OgretmenSidebar() {
    const { user } = useAuth()

    if (!user || user.role !== 'OGRETMEN') return null

    const config = getSidebarConfig('OGRETMEN')

    return <BaseSidebar config={config} user={user} />
}
