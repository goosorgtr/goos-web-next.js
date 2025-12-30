// DEVELOPMENT MODE: Using mock data instead of real API
// TODO: Switch to real API when backend is ready
import { mockPdfViewerService } from '../utils/mock-data'
import type { PdfDocument, DocumentType } from '../types'

// Export mock service as the main service for development
export const pdfViewerService = {
    /**
     * Get PDF document by type and role
     * Each user gets their own specific document based on their role and ID
     */
    async getPdfByType(
        type: DocumentType,
        role: string,
        userId: string,
        params?: {
            sinifId?: string
            ogretmenId?: string
            ogrenciId?: string
        }
    ): Promise<PdfDocument> {
        return mockPdfViewerService.getPdfByType(type, role, userId)
    },

    /**
     * Get all PDF documents for a specific type (Admin only)
     */
    async getAllPdfsByType(type: DocumentType): Promise<PdfDocument[]> {
        // Mock implementation - return array with single document
        const doc = await mockPdfViewerService.getPdfByType(type, 'ADMIN', 'admin-1')
        return [doc]
    },

    /**
     * Download PDF as blob
     */
    async downloadPdf(pdfId: string): Promise<Blob> {
        return mockPdfViewerService.downloadPdf(pdfId)
    },

    /**
     * Get PDF by class ID (for class schedule)
     */
    async getPdfByClass(sinifId: string, type: DocumentType): Promise<PdfDocument> {
        return mockPdfViewerService.getPdfByClass(sinifId)
    },

    /**
     * Get PDF by teacher ID (for teacher schedule)
     */
    async getPdfByTeacher(
        ogretmenId: string,
        type: DocumentType
    ): Promise<PdfDocument> {
        return mockPdfViewerService.getPdfByTeacher(ogretmenId)
    },

    /**
     * Get PDF by student ID (for student schedule)
     */
    async getPdfByStudent(
        ogrenciId: string,
        type: DocumentType
    ): Promise<PdfDocument> {
        return mockPdfViewerService.getPdfByStudent(ogrenciId)
    },
}

/* 
 * PRODUCTION SERVICE (commented out for now)
 * Uncomment this when backend API is ready
 * 
import { api } from '@/lib/api'

export const pdfViewerService = {
    async getPdfByType(
        type: DocumentType,
        role: string,
        userId: string,
        params?: {
            sinifId?: string
            ogretmenId?: string
            ogrenciId?: string
        }
    ): Promise<PdfDocument> {
        const queryParams = new URLSearchParams({
            type,
            role,
            userId,
            ...params,
        })
        const { data } = await api.get<PdfDocument>(
            `/api/pdf/document?${queryParams.toString()}`
        )
        return data
    },
    // ... other methods
}
*/
