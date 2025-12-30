export type DocumentType = 'yemek-programi' | 'ders-programi'
export type FileFormat = 'pdf' | 'excel' | 'png' | 'jpeg'
export type PdfAction = 'download' | 'print' | 'zoom-in' | 'zoom-out' | 'zoom-reset'

export interface PdfDocument {
    id: string
    title: string
    url: string
    type: DocumentType
    format: FileFormat
    createdAt: string
    updatedAt: string
    metadata?: {
        sinifId?: string
        sinifAdi?: string
        ogretmenId?: string
        ogretmenAdi?: string
        ogrenciId?: string
        ogrenciAdi?: string
        hafta?: number
        donem?: string
    }
}

export interface PdfViewerOptions {
    role: string
    userId: string
    type: DocumentType
    sinifId?: string
    ogretmenId?: string
    ogrenciId?: string
}

export interface PdfViewerState {
    scale: number
    numPages: number
    currentPage: number
    isLoading: boolean
    error: string | null
}

export interface PdfToolbarProps {
    scale: number
    onZoomIn: () => void
    onZoomOut: () => void
    onZoomReset: () => void
    onDownload: () => void
    onPrint: () => void
    isDownloading?: boolean
    title?: string
}

export interface PdfViewerProps {
    document: PdfDocument
    actions?: PdfAction[]
    onAction?: (action: PdfAction) => void
    className?: string
}
