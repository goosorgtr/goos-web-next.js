import type { PdfDocument } from '../types'

/**
 * Mock PDF documents for testing
 * These will be used until backend API is implemented
 */
export const MOCK_PDF_DOCUMENTS: Record<string, PdfDocument> = {
    // Yemek Programı - Genel (tüm roller için)
    'yemek-programi-genel': {
        id: 'yemek-1',
        title: 'Ocak 2025 Haftalık Yemek Programı',
        url: '/mock-pdfs/yemek-programi-ocak-2025.html',
        type: 'yemek-programi',
        format: 'pdf',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        metadata: {
            hafta: 1,
            donem: '2024-2025 Güz Dönemi',
        },
    },

    // Ders Programı - 10/A Sınıfı
    'ders-programi-10a': {
        id: 'ders-1',
        title: '10-A Sınıfı Ders Programı',
        url: '/mock-pdfs/ders-programi-10a.html',
        type: 'ders-programi',
        format: 'pdf',
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: '2024-09-01T00:00:00Z',
        metadata: {
            sinifId: '10a',
            sinifAdi: '10-A',
            donem: '2024-2025 Güz Dönemi',
        },
    },

    // Ders Programı - Hakan Yılmaz (Matematik Öğretmeni)
    'ders-programi-hakan-yilmaz': {
        id: 'ders-2',
        title: 'Hakan Yılmaz - Matematik Öğretmeni Ders Programı',
        url: '/mock-pdfs/hakan-yilmaz-ders-programi.html',
        type: 'ders-programi',
        format: 'pdf',
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: '2024-09-01T00:00:00Z',
        metadata: {
            ogretmenId: '4',
            ogretmenAdi: 'Hakan Yılmaz',
            donem: '2024-2025 Güz Dönemi',
        },
    },

    // Excel örneği
    'yemek-programi-excel': {
        id: 'yemek-2',
        title: 'Şubat 2025 Yemek Programı',
        url: '/mock-pdfs/yemek-programi-subat-2025.xlsx',
        type: 'yemek-programi',
        format: 'excel',
        createdAt: '2025-02-01T00:00:00Z',
        updatedAt: '2025-02-01T00:00:00Z',
    },

    // PNG örneği
    'ders-programi-image': {
        id: 'ders-3',
        title: '9-B Sınıfı Ders Programı',
        url: '/mock-pdfs/ders-programi-9b.png',
        type: 'ders-programi',
        format: 'png',
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: '2024-09-01T00:00:00Z',
        metadata: {
            sinifId: '9b',
            sinifAdi: '9-B',
        },
    },
}

/**
 * Mock service implementation for testing
 * Returns mock data instead of making API calls
 */
export const mockPdfViewerService = {
    async getPdfByType(
        type: 'yemek-programi' | 'ders-programi',
        role: string,
        userId: string
    ): Promise<PdfDocument> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (type === 'yemek-programi') {
            return MOCK_PDF_DOCUMENTS['yemek-programi-genel']
        }

        // Ders programı için rol bazlı mock data
        if (role === 'OGRETMEN') {
            return MOCK_PDF_DOCUMENTS['ders-programi-hakan-yilmaz']
        }

        if (role === 'OGRENCI' || role === 'VELI') {
            return MOCK_PDF_DOCUMENTS['ders-programi-10a']
        }

        // Admin için default
        return MOCK_PDF_DOCUMENTS['ders-programi-10a']
    },

    async getPdfByClass(sinifId: string): Promise<PdfDocument> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return MOCK_PDF_DOCUMENTS['ders-programi-10a']
    },

    async getPdfByTeacher(ogretmenId: string): Promise<PdfDocument> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return MOCK_PDF_DOCUMENTS['ders-programi-hakan-yilmaz']
    },

    async getPdfByStudent(ogrenciId: string): Promise<PdfDocument> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return MOCK_PDF_DOCUMENTS['ders-programi-10a']
    },

    async downloadPdf(pdfId: string): Promise<Blob> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Return empty blob for testing
        return new Blob(['Mock PDF content'], { type: 'application/pdf' })
    },
}

/**
 * Helper function to get mock document by key
 */
export function getMockDocument(key: keyof typeof MOCK_PDF_DOCUMENTS): PdfDocument {
    return MOCK_PDF_DOCUMENTS[key]
}

/**
 * Helper function to get all mock documents
 */
export function getAllMockDocuments(): PdfDocument[] {
    return Object.values(MOCK_PDF_DOCUMENTS)
}
