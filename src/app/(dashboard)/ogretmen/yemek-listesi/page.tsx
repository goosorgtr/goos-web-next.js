'use client'

import { OgretmenYemekListesiDashboard } from '@/components/ogretmen/yemek-listesi/OgretmenYemekListesiDashboard'
import { useAuth } from '@/contexts/auth-context'

export default function OgretmenYemekListesiPage() {
    const { user } = useAuth()

    if (!user) return null

    return <OgretmenYemekListesiDashboard userId={user.id} ogretmenId={user.id} />
}
