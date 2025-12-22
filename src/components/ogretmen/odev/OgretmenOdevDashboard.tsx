'use client'

import { useState } from 'react'
import { useHomework } from '@/modules/odev/hooks/useHomework'
import { HomeworkCard } from '@/modules/odev/components/HomeworkCard'
import { Button } from '@/components/ui/button'
import { Plus, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Homework } from '@/modules/odev/types'

/**
 * Öğretmen ödev dashboard componenti
 * Layer 2: Rol-spesifik component
 */
export function OgretmenOdevDashboard() {
    const router = useRouter()
    const [filters, setFilters] = useState({})

    const { data: homeworks = [], isLoading } = useHomework({ filters })

    const handleAction = (action: string, homework: Homework) => {
        switch (action) {
            case 'view':
                router.push(`/ogretmen/odev/${homework.id}`)
                break
            case 'edit':
                router.push(`/ogretmen/odev/${homework.id}/edit`)
                break
            case 'grade':
                router.push(`/ogretmen/odev/${homework.id}/notla`)
                break
            case 'delete':
                // Delete logic
                break
        }
    }

    if (isLoading) {
        return <div>Yükleniyor...</div>
    }

    return (
        <div className="space-y-6">
            {/* Öğretmene özel header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Ödevler</h1>
                    <p className="text-muted-foreground">
                        Ödev oluşturun, düzenleyin ve öğrenci teslimlerini değerlendirin
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { }}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrele
                    </Button>
                    <Button onClick={() => router.push('/ogretmen/odev/yeni')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Ödev
                    </Button>
                </div>
            </div>

            {/* Öğretmene özel istatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Toplam Ödev"
                    value={homeworks.length}
                    description="Oluşturduğunuz ödevler"
                />
                <StatCard
                    title="Bekleyen Notlama"
                    value={12}
                    description="Değerlendirilmemiş teslimler"
                />
                <StatCard
                    title="Bu Hafta"
                    value={5}
                    description="Yeni oluşturulan ödevler"
                />
            </div>

            {/* Ödev listesi - Paylaşımlı component kullanımı */}
            <div className="grid gap-4">
                {homeworks.map(homework => (
                    <HomeworkCard
                        key={homework.id}
                        homework={homework}
                        actions={['view', 'edit', 'delete', 'grade']}
                        onAction={handleAction}
                    />
                ))}
            </div>
        </div>
    )
}

function StatCard({ title, value, description }: { title: string; value: number; description: string }) {
    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col space-y-1.5">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
