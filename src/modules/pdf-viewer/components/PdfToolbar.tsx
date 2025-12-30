'use client'

import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PdfDownloadButton } from '@/components/ui/pdf-download-button'
import { PdfPrintButton } from '@/components/ui/pdf-print-button'
import type { PdfToolbarProps } from '../types'

export function PdfToolbar({
    scale,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onDownload,
    onPrint,
    isDownloading = false,
    title,
}: PdfToolbarProps) {
    const scalePercentage = Math.round(scale * 100)

    return (
        <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between rounded-t-lg shadow-lg">
            {/* Left: Title */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{title || 'Belge'}</h3>
            </div>

            {/* Center: Zoom Controls */}
            <div className="flex items-center gap-2 mx-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomOut}
                    className="text-white hover:bg-slate-700 h-8 w-8 p-0"
                    title="Uzaklaştır"
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomReset}
                    className="text-white hover:bg-slate-700 px-3 h-8 min-w-[60px]"
                    title="Sıfırla"
                >
                    {scalePercentage}%
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onZoomIn}
                    className="text-white hover:bg-slate-700 h-8 w-8 p-0"
                    title="Yakınlaştır"
                >
                    <ZoomIn className="w-4 h-4" />
                </Button>
            </div>

            {/* Right: Print Button */}
            <div className="flex items-center gap-2">
                <PdfPrintButton
                    onClick={onPrint}
                    variant="ghost"
                    className="text-white hover:bg-slate-700"
                />
            </div>
        </div>
    )
}
