import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PdfDownloadButtonProps {
    onClick: () => void
    isLoading?: boolean
    disabled?: boolean
    className?: string
    label?: string
}

export function PdfDownloadButton({
    onClick,
    isLoading = false,
    disabled = false,
    className,
    label = 'PDF İndir',
}: PdfDownloadButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(
                'bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all',
                className
            )}
        >
            <Download className="w-5 h-5" />
            {isLoading ? 'İndiriliyor...' : label}
        </Button>
    )
}
