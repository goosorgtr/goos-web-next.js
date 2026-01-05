'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DonemForm } from './DonemForm'
import type { CreateDonemDto } from '../types'

interface AddDonemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreateDonemDto) => void
    isLoading?: boolean
}

export function AddDonemDialog({ open, onOpenChange, onSubmit, isLoading }: AddDonemDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Yeni Dönem Tanımla</DialogTitle>
                </DialogHeader>
                <DonemForm
                    onSubmit={(data) => {
                        onSubmit(data)
                    }}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
