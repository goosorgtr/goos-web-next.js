'use client'

import { useAuth } from '@/contexts/auth-context'
import { getSidebarConfig } from '@/config/sidebar-config'
import { BaseSidebar } from '@/components/layout/BaseSidebar'

export default function ServiciSidebar() {
    const { user } = useAuth()

    if (!user || user.role !== 'SERVICI') return null

    const config = getSidebarConfig('SERVICI')

    return <BaseSidebar config={config} user={user} />
}
