import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PdfPrintButtonProps {
    onClick: () => void
    disabled?: boolean
    className?: string
    label?: string
    variant?: 'default' | 'outline' | 'ghost'
}

export function PdfPrintButton({
    onClick,
    disabled = false,
    className,
    label = 'Yazdır',
    variant = 'outline',
}: PdfPrintButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant={variant}
            className={cn(
                'font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                className
            )}
        >
            <Printer className="w-4 h-4" />
            {label}
        </Button>
    )
}
