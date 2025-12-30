'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Loader2, FileX } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker - use local worker file
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString()
}

interface PdfDocumentProps {
    url: string
    scale: number
    className?: string
}

export function PdfDocument({ url, scale, className }: PdfDocumentProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setIsLoading(false)
        setError(null)
    }

    function onDocumentLoadError(error: Error) {
        console.error('PDF load error:', error)
        setError('PDF yüklenemedi')
        setIsLoading(false)
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
                <FileX className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">{error}</p>
                <p className="text-gray-500 text-sm mt-2">Lütfen daha sonra tekrar deneyin</p>
            </div>
        )
    }

    return (
        <div className={className}>
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                }
                className="flex flex-col items-center"
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        scale={scale}
                        className="mb-4 shadow-lg"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                ))}
            </Document>
        </div>
    )
}
