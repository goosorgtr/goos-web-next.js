'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { pdfViewerService } from '../services/pdf-viewer.service'
import { downloadPdf, printPdf, generateFilename, calculateZoomScale } from '../utils/pdf-helpers'
import type { PdfDocument, PdfViewerOptions, DocumentType } from '../types'

interface UsePdfViewerReturn {
    // Data
    document: PdfDocument | undefined
    isLoading: boolean
    error: Error | null

    // Zoom state
    scale: number

    // Actions
    handleDownload: () => Promise<void>
    handlePrint: () => void
    handleZoomIn: () => void
    handleZoomOut: () => void
    handleZoomReset: () => void

    // Loading states
    isDownloading: boolean
}

export function usePdfViewer({
    role,
    userId,
    type,
    sinifId,
    ogretmenId,
    ogrenciId,
}: PdfViewerOptions): UsePdfViewerReturn {
    const queryClient = useQueryClient()
    const [scale, setScale] = useState(1.0)
    const [isDownloading, setIsDownloading] = useState(false)

    // Fetch PDF document based on role and type
    const { data: document, isLoading, error } = useQuery({
        queryKey: ['pdf-viewer', type, role, userId, sinifId, ogretmenId, ogrenciId],
        queryFn: () => {
            // Role-based logic for fetching the correct PDF
            if (role === 'ADMIN') {
                // Admin can view all documents
                return pdfViewerService.getPdfByType(type, role, userId, {
                    sinifId,
                    ogretmenId,
                    ogrenciId,
                })
            } else if (role === 'OGRETMEN' && ogretmenId) {
                // Teacher views their own schedule
                return pdfViewerService.getPdfByTeacher(ogretmenId, type)
            } else if (role === 'OGRENCI' && ogrenciId) {
                // Student views their class schedule
                return pdfViewerService.getPdfByStudent(ogrenciId, type)
            } else if (role === 'VELI' && ogrenciId) {
                // Parent views their child's schedule
                return pdfViewerService.getPdfByStudent(ogrenciId, type)
            } else {
                // Fallback to general fetch
                return pdfViewerService.getPdfByType(type, role, userId)
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    })

    // Download handler
    const handleDownload = useCallback(async () => {
        if (!document) return

        try {
            setIsDownloading(true)
            const filename = generateFilename(document)
            await downloadPdf(document.url, filename)
        } catch (error) {
            console.error('Download failed:', error)
            throw error
        } finally {
            setIsDownloading(false)
        }
    }, [document])

    // Print handler
    const handlePrint = useCallback(() => {
        if (!document) return

        try {
            printPdf(document.url)
        } catch (error) {
            console.error('Print failed:', error)
            throw error
        }
    }, [document])

    // Zoom handlers
    const handleZoomIn = useCallback(() => {
        setScale((prev) => calculateZoomScale(prev, 'in'))
    }, [])

    const handleZoomOut = useCallback(() => {
        setScale((prev) => calculateZoomScale(prev, 'out'))
    }, [])

    const handleZoomReset = useCallback(() => {
        setScale(calculateZoomScale(scale, 'reset'))
    }, [scale])

    return {
        document,
        isLoading,
        error: error as Error | null,
        scale,
        handleDownload,
        handlePrint,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        isDownloading,
    }
}
