'use client'

import { useState } from 'react'
import { KeyRound, ShieldCheck } from 'lucide-react'

export function PasswordChangeForm() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!')
            return
        }

        setLoading(true)
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setLoading(false)
        alert('Şifreniz başarıyla güncellendi (Mock)')
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                        Mevcut Şifre
                    </label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                        Yeni Şifre
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                        minLength={8}
                    />
                    <p className="text-xs text-gray-500">Şifre en az 8 karakter uzunluğunda olmalıdır.</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Yeni Şifre (Tekrar)
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Şifre Güvenliği</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Güçlü bir şifre için harf, rakam ve özel karakterleri karıştırarak kullanmanızı öneririz.</p>
                        </div>
                    </div>
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
                            <KeyRound className="h-4 w-4" />
                            Şifreyi Güncelle
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
