'use client'

import { OgrenciDersProgramiDashboard } from '@/components/ogrenci/ders-programi/OgrenciDersProgramiDashboard'
import { useAuth } from '@/contexts/auth-context'

export default function DersProgramiPage() {
    const { user } = useAuth()

    if (!user) return null

    return <OgrenciDersProgramiDashboard userId={user.id} ogrenciId={user.id} />
}
