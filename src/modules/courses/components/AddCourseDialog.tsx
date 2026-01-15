'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CourseForm } from './CourseForm'
import type { CreateCourseDto } from '../types'

interface AddCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreateCourseDto) => void
    isLoading?: boolean
}

export function AddCourseDialog({ open, onOpenChange, onSubmit, isLoading }: AddCourseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Yeni Ders Ekle</DialogTitle>
                </DialogHeader>
                <CourseForm
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}

