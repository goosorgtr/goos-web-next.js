'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CourseForm } from './CourseForm'
import type { Course, UpdateCourseDto } from '../types'

interface EditCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: Course | null
    onSubmit: (id: string, data: UpdateCourseDto) => void
    isLoading?: boolean
}

export function EditCourseDialog({ open, onOpenChange, course, onSubmit, isLoading }: EditCourseDialogProps) {
    if (!course) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Ders Düzenle</DialogTitle>
                </DialogHeader>
                <CourseForm
                    initialData={course}
                    onSubmit={(data) => onSubmit(course.id, data)}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}

