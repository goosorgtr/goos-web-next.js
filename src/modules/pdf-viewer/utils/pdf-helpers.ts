import type { PdfDocument } from '../types'

/**
 * Download a PDF file
 */
export async function downloadPdf(url: string, filename: string): Promise<void> {
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up
        window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
        console.error('PDF download failed:', error)
        throw new Error('PDF indirilemedi')
    }
}

/**
 * Print a PDF document
 */
export function printPdf(url: string): void {
    try {
        const printWindow = window.open(url, '_blank')
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print()
            }
        } else {
            throw new Error('Print window could not be opened')
        }
    } catch (error) {
        console.error('PDF print failed:', error)
        throw new Error('PDF yazdırılamadı')
    }
}

/**
 * Get file extension from URL or filename
 */
export function getFileExtension(url: string): string {
    const parts = url.split('.')
    return parts[parts.length - 1].toLowerCase()
}

/**
 * Check if file is PDF
 */
export function isPdf(url: string): boolean {
    return getFileExtension(url) === 'pdf'
}

/**
 * Check if file is image
 */
export function isImage(url: string): boolean {
    const ext = getFileExtension(url)
    return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
}

/**
 * Check if file is Excel
 */
export function isExcel(url: string): boolean {
    const ext = getFileExtension(url)
    return ['xls', 'xlsx', 'xlsm'].includes(ext)
}

/**
 * Check if file is HTML
 */
export function isHtml(url: string): boolean {
    const ext = getFileExtension(url)
    return ['html', 'htm'].includes(ext)
}

/**
 * Generate filename from document
 */
export function generateFilename(document: PdfDocument): string {
    const { title, type, format, metadata } = document
    const timestamp = new Date().toISOString().split('T')[0]

    let filename = title || type

    if (metadata?.sinifAdi) {
        filename += `_${metadata.sinifAdi}`
    }

    if (metadata?.ogretmenAdi) {
        filename += `_${metadata.ogretmenAdi}`
    }

    filename += `_${timestamp}.${format}`

    return filename
}

/**
 * Calculate zoom scale
 */
export function calculateZoomScale(
    currentScale: number,
    action: 'in' | 'out' | 'reset'
): number {
    const ZOOM_STEP = 0.25
    const MIN_SCALE = 0.5
    const MAX_SCALE = 3.0
    const DEFAULT_SCALE = 1.0

    switch (action) {
        case 'in':
            return Math.min(currentScale + ZOOM_STEP, MAX_SCALE)
        case 'out':
            return Math.max(currentScale - ZOOM_STEP, MIN_SCALE)
        case 'reset':
            return DEFAULT_SCALE
        default:
            return currentScale
    }
}
