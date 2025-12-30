'use client'

import { OgretmenDersProgramiDashboard } from '@/components/ogretmen/ders-programi/OgretmenDersProgramiDashboard'
import { useAuth } from '@/contexts/auth-context'

export default function OgretmenDersProgramiPage() {
    const { user } = useAuth()

    if (!user) return null

    return <OgretmenDersProgramiDashboard userId={user.id} ogretmenId={user.id} />
}
