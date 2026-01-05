'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CreateKullaniciDto } from '../types'

const kullaniciSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    role: z.enum(['Admin', 'Öğretmen', 'Öğrenci', 'Veli', 'Servici', 'Kantinci', 'Veli Uzman'] as const),
    department: z.string().optional(),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').optional(),
    // Role-specific fields
    sinif: z.string().optional(), // Öğrenci için
    sube: z.string().optional(), // Öğrenci için
    brans: z.string().optional(), // Öğretmen için
    ogrenciId: z.string().optional(), // Veli için
    plaka: z.string().optional(), // Servici için
})

type FormData = z.infer<typeof kullaniciSchema>

interface KullaniciFormProps {
    initialData?: Partial<CreateKullaniciDto>
    onSubmit: (data: CreateKullaniciDto) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function KullaniciForm({ initialData, onSubmit, onCancel, isSubmitting }: KullaniciFormProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(kullaniciSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            role: (initialData?.role as any) || 'Öğrenci',
            department: initialData?.department || '',
            password: '',
            sinif: '',
            sube: '',
            brans: '',
            ogrenciId: '',
            plaka: ''
        }
    })

    const selectedRole = watch('role')

    const onFormSubmit = (data: FormData) => {
        onSubmit(data as CreateKullaniciDto)
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                <Input placeholder="Ad Soyad" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-posta</label>
                <Input placeholder="ornek@goos.edu" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Rol</label>
                <select
                    {...register('role')}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="Admin">Admin</option>
                    <option value="Öğretmen">Öğretmen</option>
                    <option value="Öğrenci">Öğrenci</option>
                    <option value="Veli">Veli</option>
                    <option value="Servici">Servici</option>
                    <option value="Kantinci">Kantinci</option>
                </select>
                {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            {/* Öğrenci için Sınıf ve Şube */}
            {selectedRole === 'Öğrenci' && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sınıf</label>
                            <select
                                {...register('sinif')}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Seçiniz</option>
                                <option value="9">9. Sınıf</option>
                                <option value="10">10. Sınıf</option>
                                <option value="11">11. Sınıf</option>
                                <option value="12">12. Sınıf</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Şube</label>
                            <select
                                {...register('sube')}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Seçiniz</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                    </div>
                </>
            )}

            {/* Öğretmen için Branş */}
            {selectedRole === 'Öğretmen' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Branş</label>
                    <select
                        {...register('brans')}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Seçiniz</option>
                        <option value="Matematik">Matematik</option>
                        <option value="Türkçe">Türkçe</option>
                        <option value="Fizik">Fizik</option>
                        <option value="Kimya">Kimya</option>
                        <option value="Biyoloji">Biyoloji</option>
                        <option value="Tarih">Tarih</option>
                        <option value="Coğrafya">Coğrafya</option>
                        <option value="İngilizce">İngilizce</option>
                    </select>
                </div>
            )}

            {/* Veli için Öğrenci Seçimi */}
            {selectedRole === 'Veli' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Velisi Olduğu Öğrenci</label>
                    <Input
                        placeholder="Öğrenci adı veya numarası"
                        {...register('ogrenciId')}
                    />
                    <p className="text-xs text-gray-500">Öğrenci bilgilerini girerek eşleştirin</p>
                </div>
            )}

            {/* Servici için Plaka */}
            {selectedRole === 'Servici' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Araç Plakası</label>
                    <Input
                        placeholder="Örn: 34 ABC 123"
                        {...register('plaka')}
                    />
                    <p className="text-xs text-gray-500">Servis aracının plaka bilgisini giriniz</p>
                </div>
            )}

            {/* Kantinci için Bölüm (opsiyonel) */}
            {selectedRole === 'Kantinci' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kantin Bölümü</label>
                    <Input
                        placeholder="Örn: Ana Kantin, Spor Salonu Kantini"
                        {...register('department')}
                    />
                </div>
            )}

            {!initialData && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Şifre</label>
                    <Input type="password" placeholder="******" {...register('password')} />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
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
