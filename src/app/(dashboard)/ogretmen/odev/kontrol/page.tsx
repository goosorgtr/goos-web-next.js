'use client'

import React from 'react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Plus, Eye, FileText, Check, X, Clock, AlertCircle, ListFilter, Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Types
type Status = 'completed' | 'not_completed' | 'late'

interface StudentSubmission {
    id: string
    studentName: string
    studentNo: string
    avatarUrl: string
    submitDate: string
    fileUrl?: string
    fileName?: string
    status: Status
}

// Mock Data
const submissions: StudentSubmission[] = [
    {
        id: '204',
        studentName: 'Ahmet Yılmaz',
        studentNo: '452',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet',
        submitDate: '14.10.2023 - 14:30',
        fileName: 'odev_polinom.pdf',
        fileUrl: '#',
        status: 'completed'
    },
    {
        id: '205',
        studentName: 'Ayşe Demir',
        studentNo: '458',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse',
        submitDate: '--',
        status: 'not_completed'
    },
    {
        id: '206',
        studentName: 'Burak Kaya',
        studentNo: '461',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Burak',
        submitDate: '15.10.2023 - 09:15',
        fileName: 'cozum_kagidi.jpg',
        fileUrl: '#',
        status: 'completed'
    },
    {
        id: '207',
        studentName: 'Elif Sönmez',
        studentNo: '465',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elif',
        submitDate: '16.10.2023 - 10:00 (Geç)',
        fileName: 'odev_v2.pdf',
        fileUrl: '#',
        status: 'late'
    }
]

export default function OdevKontrolPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Ana Sayfa', href: '/ogretmen' },
                    { label: 'Ödev', href: '/ogretmen/odev' },
                    { label: 'Kontrol' },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Öğretmen Ödev Kontrol</h1>
                    <p className="text-muted-foreground mt-1">
                        Ödev teslim durumlarını buradan takip edebilir ve notlandırabilirsiniz.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Ödev Ata
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-blue-500">🎓</span> Ders Seç
                        </label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option>Matematik</option>
                            <option>Fizik</option>
                            <option>Kimya</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-blue-500">👥</span> Sınıf Seç
                        </label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option>9-A</option>
                            <option>9-B</option>
                            <option>10-A</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> Ödev Seç
                        </label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option>Polinomlar Çalışma Kağıdı</option>
                            <option>Fonksiyonlar Testi</option>
                        </select>
                    </div>

                    <Button className="bg-[#1a1f2c] text-white hover:bg-black w-full md:w-auto">
                        <ListFilter className="h-4 w-4 mr-2" />
                        Listele
                    </Button>
                </div>
            </div>

            {/* Student List Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold text-gray-900">Öğrenci Listesi</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">#</th>
                                <th className="px-6 py-4 font-medium">ÖĞRENCİ</th>
                                <th className="px-6 py-4 font-medium">TESLİM TARİHİ</th>
                                <th className="px-6 py-4 font-medium">EK DOSYA</th>
                                <th className="px-6 py-4 font-medium">DURUM</th>
                                <th className="px-6 py-4 font-medium text-right">İŞLEMLER</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                                <img
                                                    src={item.avatarUrl}
                                                    alt={item.studentName}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{item.studentName}</div>
                                                <div className="text-xs text-muted-foreground">No: {item.studentNo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 font-medium ${item.status === 'late' ? 'text-orange-600' : 'text-gray-900'}`}>
                                        {item.submitDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.fileName ? (
                                            <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer group">
                                                <FileText className="h-4 w-4" />
                                                <span className="font-medium group-hover:underline">{item.fileName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">--</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.status !== 'not_completed' ? (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                                                    <Bell className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                <ListFilter className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t bg-gray-50/50 flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Toplam 24 kayıttan 1-4 arası gösteriliyor
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                            &lt;
                        </Button>
                        <Button variant="default" size="icon" className="h-8 w-8 bg-blue-600 text-white hover:bg-blue-700">
                            1
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            2
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            3
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            &gt;
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: Status }) {
    if (status === 'completed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                <Check className="h-3.5 w-3.5" />
                Yapıldı
            </span>
        )
    }
    if (status === 'late') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                <Clock className="h-3.5 w-3.5" />
                Geç Yapıldı
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <X className="h-3.5 w-3.5" />
            Yapılmadı
        </span>
    )
}
