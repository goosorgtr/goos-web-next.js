'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Save } from 'lucide-react'

export function ProfileSettingsForm() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        bio: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setLoading(false)
        alert('Profil bilgileri başarıyla güncellendi (Mock)')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Ad Soyad
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        E-posta Adresi
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Telefon Numarası
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="+90 5xx xxx xx xx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium text-gray-700">
                        Rol
                    </label>
                    <input
                        id="role"
                        type="text"
                        value={user?.role || ''}
                        disabled
                        className="flex h-10 w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                    />
                </div>

                <div className="col-span-full space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                        Hakkında
                    </label>
                    <textarea
                        id="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Kendinizden kısaca bahsedin..."
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                    {loading ? 'Güncelleniyor...' : (
                        <>
                            <Save className="h-4 w-4" />
                            Değişiklikleri Kaydet
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
