'use client'

import { usePdfViewer } from '@/modules/pdf-viewer/hooks/usePdfViewer'
import { PdfViewer } from '@/modules/pdf-viewer/components/PdfViewer'
import { Loader2 } from 'lucide-react'

interface AdminDersProgramiDashboardProps {
    userId: string
    sinifId?: string
    ogretmenId?: string
}

export function AdminDersProgramiDashboard({
    userId,
    sinifId,
    ogretmenId,
}: AdminDersProgramiDashboardProps) {
    const {
        document,
        isLoading,
        error,
        scale,
        handleDownload,
        handlePrint,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        isDownloading,
    } = usePdfViewer({
        role: 'ADMIN',
        userId,
        type: 'ders-programi',
        sinifId,
        ogretmenId,
    })

    const actions = ['download', 'print', 'zoom-in', 'zoom-out', 'zoom-reset'] as const

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Hata: {error.message}</p>
                    <p className="text-gray-500 text-sm mt-2">Ders programı yüklenemedi</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ders Programı</h1>
                <p className="text-gray-600 mt-1">
                    {sinifId ? 'Sınıf' : ogretmenId ? 'Öğretmen' : 'Genel'} ders programını görüntüleyin
                </p>
            </div>

            <PdfViewer
                document={document}
                actions={actions}
                scale={scale}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                onDownload={handleDownload}
                onPrint={handlePrint}
                isDownloading={isDownloading}
            />
        </div>
    )
}
