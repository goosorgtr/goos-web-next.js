'use client'

import { AdminDersProgramiDashboard } from '@/components/admin/ders-programi/AdminDersProgramiDashboard'
import { useAuth } from '@/contexts/auth-context'

export default function AdminDersProgramiPage() {
    const { user } = useAuth()

    if (!user) return null

    // Admin can view specific class or teacher schedule
    // For now, showing default schedule
    return <AdminDersProgramiDashboard userId={user.id} />
}
