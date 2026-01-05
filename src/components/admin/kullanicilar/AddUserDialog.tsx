'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { KullaniciForm } from '@/modules/kullanicilar/components/KullaniciForm'
import type { CreateKullaniciDto } from '@/modules/kullanicilar/types'

interface AddUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreateKullaniciDto) => void
    isLoading?: boolean
}

export function AddUserDialog({ open, onOpenChange, onSubmit, isLoading }: AddUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                </DialogHeader>
                <KullaniciForm
                    onSubmit={(data) => {
                        onSubmit(data)
                        // Note: In a real app, we'd wait for the mutation and only close on success
                        // But for now, we follow the UI flow
                    }}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
