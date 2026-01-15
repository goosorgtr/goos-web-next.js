'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreateClassDto, ClassItem } from '../types'

const classSchema = z.object({
    name: z.string().min(1, 'Sınıf adı zorunludur'),
    grade: z.coerce.number().min(1, 'Sınıf seviyesi 1-12 arasında olmalı').max(12, 'Sınıf seviyesi 1-12 arasında olmalı'),
    isActive: z.boolean().optional()
})

type ClassFormData = z.infer<typeof classSchema>

interface ClassFormProps {
    initialData?: Partial<ClassItem>
    onSubmit: (data: CreateClassDto) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function ClassForm({ initialData, onSubmit, onCancel, isSubmitting }: ClassFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<ClassFormData>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: initialData?.name || '',
            grade: initialData?.grade || 1,
            isActive: initialData?.isActive ?? true
        }
    })

    const onFormSubmit = (data: ClassFormData) => {
        onSubmit({
            name: data.name,
            grade: data.grade,
            isActive: data.isActive
        })
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Sınıf Adı</Label>
                <Input
                    id="name"
                    placeholder="Örn: 10-A"
                    {...register('name')}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="grade">Sınıf Seviyesi</Label>
                <Input
                    id="grade"
                    type="number"
                    min={1}
                    max={12}
                    placeholder="1-12 arası"
                    {...register('grade')}
                />
                {errors.grade && <p className="text-xs text-red-500">{errors.grade.message}</p>}
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

