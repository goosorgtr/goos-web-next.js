'use client'

import { useState } from 'react'
import { User, Lock, Trash2, Bell, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileSettingsForm } from '@/components/shared/ProfileSettingsForm'
import { PasswordChangeForm } from '@/components/shared/PasswordChangeForm'

const tabs = [
    { id: 'profile', label: 'Profil Ayarları', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Lock },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'privacy', label: 'Gizlilik', icon: Shield },
    { id: 'account', label: 'Hesap Yönetimi', icon: Trash2, color: 'text-red-600' },
]

export function SettingsContent() {
    const [activeTab, setActiveTab] = useState('profile')

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettingsForm />
            case 'security':
                return <PasswordChangeForm />
            case 'account':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Hesabı Sil</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </p>
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={() => confirm('Hesabınızı silmek istediğinizden emin misiniz?') && alert('Hesap silme talebi alındı (Mock)')}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Hesabı Kalıcı Olarak Sil
                            </button>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">Bu bölüm çok yakında hizmete girecektir.</p>
                    </div>
                )
        }
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Ayarlar</h1>
                <p className="text-gray-500">Profil bilgilerinizi ve hesap ayarlarınızı buradan yönetebilirsiniz.</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Sidebar Tabs */}
                <aside className="w-full lg:w-64">
                    <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                                        activeTab === tab.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:bg-gray-100',
                                        tab.color
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm sm:p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
