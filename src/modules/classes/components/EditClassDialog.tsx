'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ClassForm } from './ClassForm'
import type { ClassItem, UpdateClassDto } from '../types'

interface EditClassDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    classItem: ClassItem | null
    onSubmit: (id: string, data: UpdateClassDto) => void
    isLoading?: boolean
}

export function EditClassDialog({ open, onOpenChange, classItem, onSubmit, isLoading }: EditClassDialogProps) {
    if (!classItem) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Sınıf Düzenle</DialogTitle>
                </DialogHeader>
                <ClassForm
                    initialData={classItem}
                    onSubmit={(data) => onSubmit(classItem.id, data)}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}

