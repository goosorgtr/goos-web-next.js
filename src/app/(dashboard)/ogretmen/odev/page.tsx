import { OgretmenOdevDashboard } from '@/components/ogretmen/odev/OgretmenOdevDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ödevler - Öğretmen Paneli',
    description: 'Ödev yönetimi ve değerlendirme sistemi'
}

/**
 * Layer 1: Routing katmanı
 * Sadece component çağırma ve metadata
 */
export default function OgretmenOdevPage() {
    return <OgretmenOdevDashboard />
}
