'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRoles } from '../hooks/useRoles'
import type { CreateKullaniciDto } from '../types'

const kullaniciSchema = z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    roleId: z.string().min(1, 'Rol seçimi zorunludur'),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female', 'other'] as const).optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
    confirmPassword: z.string(),
    // Role-specific fields
    classId: z.string().optional(),
    studentNo: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
})

type FormData = z.infer<typeof kullaniciSchema>

interface KullaniciFormProps {
    initialData?: Partial<CreateKullaniciDto>
    onSubmit: (data: CreateKullaniciDto) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function KullaniciForm({ initialData, onSubmit, onCancel, isSubmitting }: KullaniciFormProps) {
    const { roles, isLoading: rolesLoading } = useRoles()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(kullaniciSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            roleId: '',
            phone: '',
            gender: undefined,
            dateOfBirth: '',
            address: '',
            password: '',
            confirmPassword: '',
            classId: '',
            studentNo: ''
        }
    })

    const selectedRoleId = watch('roleId')

    const onFormSubmit = (data: FormData) => {
        const { confirmPassword, ...submitData } = data
        onSubmit(submitData as CreateKullaniciDto)
    }

    if (rolesLoading) {
        return <div className="p-8 text-center">Yükleniyor...</div>
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Kişisel Bilgiler</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Ad *</Label>
                        <Input id="firstName" placeholder="Ad" {...register('firstName')} />
                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Soyad *</Label>
                        <Input id="lastName" placeholder="Soyad" {...register('lastName')} />
                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">E-posta *</Label>
                    <Input id="email" type="email" placeholder="ornek@goos.edu" {...register('email')} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" type="tel" placeholder="05XX XXX XX XX" {...register('phone')} />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Doğum Tarihi</Label>
                        <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                        {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Cinsiyet</Label>
                    <select
                        id="gender"
                        {...register('gender')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <option value="">Seçiniz</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input id="address" placeholder="Tam adres" {...register('address')} />
                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
            </div>

            {/* Rol ve Yetki */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-900">Rol ve Yetki</h3>
                
                <div className="space-y-2">
                    <Label htmlFor="roleId">Rol *</Label>
                    <select
                        id="roleId"
                        {...register('roleId')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <option value="">Rol Seçiniz</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.roleId && <p className="text-xs text-red-500">{errors.roleId.message}</p>}
                </div>
            </div>

            {/* Güvenlik */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-900">Güvenlik</h3>
                
                <div className="space-y-2">
                    <Label htmlFor="password">Şifre *</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="En az 8 karakter" 
                        {...register('password')} 
                    />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
                    <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Şifreyi tekrar girin" 
                        {...register('confirmPassword')} 
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
                    <p className="font-medium mb-1">Şifre gereksinimleri:</p>
                    <ul className="space-y-0.5">
                        <li>• En az 8 karakter</li>
                        <li>• Büyük ve küçük harf içermeli</li>
                        <li>• En az bir rakam içermeli</li>
                    </ul>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Kaydediliyor...' : 'Kullanıcı Oluştur'}
                </Button>
            </div>
        </form>
    )
}
