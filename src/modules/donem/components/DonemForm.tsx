'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { donemSchema, type DonemFormData } from '../validations/donem.validation'
import type { CreateDonemDto, Donem } from '../types'

interface DonemFormProps {
    initialData?: Partial<Donem>
    onSubmit: (data: CreateDonemDto) => void
    onCancel: () => void
    isSubmitting?: boolean
    allowActiveToggle?: boolean
}

export function DonemForm({ initialData, onSubmit, onCancel, isSubmitting, allowActiveToggle = false }: DonemFormProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(donemSchema),
        defaultValues: {
            name: initialData?.name || '',
            startDate: initialData?.startDate || '',
            endDate: initialData?.endDate || '',
            isActive: initialData?.isActive || false
        }
    })

    const onFormSubmit = (data: any) => {
        // Eğer allowActiveToggle true ise, isActive değerini her zaman gönder (true veya false)
        // Aksi halde undefined bırak (otomatik tarih kontrolü yapılacak)
        const submitData: CreateDonemDto = {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            // allowActiveToggle true ise isActive'i gönder, false ise undefined
            ...(allowActiveToggle && { isActive: Boolean(data.isActive) })
        }
        onSubmit(submitData)
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Dönem Adı</Label>
                <Input
                    id="name"
                    placeholder="Örn: 2024-2025 Eğitim Öğretim Yılı 1.Dönem"
                    {...register('name')}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                    <Input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                    />
                    {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">Bitiş Tarihi</Label>
                    <Input
                        id="endDate"
                        type="date"
                        {...register('endDate')}
                    />
                    {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
                </div>
            </div>

            {allowActiveToggle && (
                <div className="flex items-center space-x-2">
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <input
                                id="isActive"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                    <Label htmlFor="isActive" className="font-normal cursor-pointer">
                        Aktif dönem olarak ayarla
                    </Label>
                </div>
            )}

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
