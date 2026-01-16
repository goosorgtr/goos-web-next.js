'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CreateAnnouncementPage() {
    const router = useRouter()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Yeni Duyuru Oluştur</h1>
                    <p className="text-muted-foreground">
                        Sisteme yeni bir duyuru ekleyin.
                    </p>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">Bu sayfa yapım aşamasındadır.</p>
            </div>
        </div>
    )
}
