'use client'

import { VeliYemekListesiDashboard } from '@/components/veli/yemek-listesi/VeliYemekListesiDashboard'
import { useAuth } from '@/contexts/auth-context'

export default function VeliYemekListesiPage() {
    const { user } = useAuth()

    if (!user) return null

    // TODO: Get selected child's ID from user context or state
    const selectedChildId = user.id // Placeholder

    return <VeliYemekListesiDashboard userId={user.id} ogrenciId={selectedChildId} />
}
