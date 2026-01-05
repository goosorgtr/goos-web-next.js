'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DonemForm } from './DonemForm'
import type { Donem, UpdateDonemDto } from '../types'

interface EditDonemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    donem: Donem | null
    onSubmit: (id: string, data: UpdateDonemDto) => void
    isLoading?: boolean
}

export function EditDonemDialog({ open, onOpenChange, donem, onSubmit, isLoading }: EditDonemDialogProps) {
    if (!donem) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Dönem Düzenle</DialogTitle>
                </DialogHeader>
                <DonemForm
                    initialData={donem}
                    onSubmit={(data) => {
                        onSubmit(donem.id, data)
                    }}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
