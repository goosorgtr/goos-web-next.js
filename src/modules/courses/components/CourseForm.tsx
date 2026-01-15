'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreateCourseDto, Course } from '../types'

const courseSchema = z.object({
    name: z.string().min(1, 'Ders adı zorunludur'),
    isActive: z.boolean().optional()
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
    initialData?: Partial<Course>
    onSubmit: (data: CreateCourseDto) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function CourseForm({ initialData, onSubmit, onCancel, isSubmitting }: CourseFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: initialData?.name || '',
            isActive: initialData?.isActive ?? true
        }
    })

    const onFormSubmit = (data: CourseFormData) => {
        onSubmit({
            name: data.name,
            isActive: data.isActive
        })
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Ders Adı</Label>
                <Input
                    id="name"
                    placeholder="Örn: Matematik"
                    {...register('name')}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Ekle'}
                </Button>
            </div>
        </form>
    )
}

