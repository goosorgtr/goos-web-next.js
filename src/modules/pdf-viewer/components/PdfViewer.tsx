'use client'

import { cn } from '@/lib/utils'
import { PdfToolbar } from './PdfToolbar'
import { PdfDownloadButton } from '@/components/ui/pdf-download-button'
import { isImage, isExcel, isHtml } from '../utils/pdf-helpers'
import type { PdfViewerProps } from '../types'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'

export function PdfViewer({
    document,
    actions = ['download', 'print', 'zoom-in', 'zoom-out', 'zoom-reset'],
    onAction,
    className,
    scale = 1.0,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onDownload,
    onPrint,
    isDownloading = false,
}: Omit<PdfViewerProps, 'document'> & {
    document?: PdfViewerProps['document']
    scale?: number
    onZoomIn?: () => void
    onZoomOut?: () => void
    onZoomReset?: () => void
    onDownload?: () => void
    onPrint?: () => void
    isDownloading?: boolean
}) {
    if (!document) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">Belge bulunamadı</p>
            </div>
        )
    }

    const handleAction = (action: string) => {
        if (onAction) {
            onAction(action as any)
        }
    }

    // Render image files
    if (isImage(document.url)) {
        return (
            <div className={cn('flex flex-col gap-4', className)}>
                <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between rounded-t-lg shadow-lg">
                    <h3 className="text-sm font-medium truncate">{document.title}</h3>
                    <div className="flex items-center gap-2">
                        {actions.includes('download') && onDownload && (
                            <PdfDownloadButton
                                onClick={onDownload}
                                isLoading={isDownloading}
                                className="bg-blue-600 hover:bg-blue-700"
                            />
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-b-lg shadow-lg p-4 flex justify-center">
                    <Image
                        src={document.url}
                        alt={document.title}
                        width={800}
                        height={600}
                        className="max-w-full h-auto rounded"
                    />
                </div>

                {actions.includes('download') && onDownload && (
                    <div className="flex justify-center">
                        <PdfDownloadButton
                            onClick={onDownload}
                            isLoading={isDownloading}
                            label="Resmi İndir"
                        />
                    </div>
                )}
            </div>
        )
    }

    // Render Excel files
    if (isExcel(document.url)) {
        return (
            <div className={cn('flex flex-col gap-4', className)}>
                <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between rounded-t-lg shadow-lg">
                    <h3 className="text-sm font-medium truncate">{document.title}</h3>
                </div>

                <div className="bg-white rounded-b-lg shadow-lg p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">Excel Dosyası</p>
                    <p className="text-gray-500 text-sm mb-6">
                        Excel dosyalarını görüntülemek için indirmeniz gerekmektedir
                    </p>
                    {actions.includes('download') && onDownload && (
                        <PdfDownloadButton
                            onClick={onDownload}
                            isLoading={isDownloading}
                            label="Excel İndir"
                        />
                    )}
                </div>
            </div>
        )
    }

    // Render HTML files OR PDF files (both use iframe for now)
    // TODO: When backend is ready with real PDFs, add proper PDF.js rendering
    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {/* Toolbar */}
            {(actions.includes('zoom-in') ||
                actions.includes('zoom-out') ||
                actions.includes('print')) && (
                    <PdfToolbar
                        scale={scale}
                        onZoomIn={onZoomIn || (() => { })}
                        onZoomOut={onZoomOut || (() => { })}
                        onZoomReset={onZoomReset || (() => { })}
                        onDownload={onDownload || (() => { })}
                        onPrint={onPrint || (() => { })}
                        isDownloading={isDownloading}
                        title={document.title}
                    />
                )}

            {/* Document in iframe (works for both HTML and PDF) */}
            <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
                <iframe
                    src={document.url}
                    className="w-full h-[800px] border-0"
                    title={document.title}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        height: `${800 / scale}px`
                    }}
                />
            </div>

            {/* Download Button */}
            {actions.includes('download') && onDownload && (
                <div className="flex justify-center">
                    <PdfDownloadButton
                        onClick={onDownload}
                        isLoading={isDownloading}
                    />
                </div>
            )}
        </div>
    )
}

