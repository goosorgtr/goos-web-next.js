'use client'

import { useState } from 'react'
import {
    Search,
    ChevronDown,
    Calendar,
    ChevronRight,
    Calculator,
    FlaskConical,
    BookOpen,
    User
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const children = [
    { id: 1, name: 'Ahmet Yılmaz', class: '5A', year: '2023-2024', avatar: null },
    { id: 2, name: 'Ayşe Yılmaz', class: '3B', year: '2023-2024', avatar: null },
]

const homeworks = [
    {
        id: 1,
        title: 'Kesirler Çalışma Kağıdı #4',
        subject: 'Matematik',
        teacher: 'Selim Hoca',
        description: 'Sayfa 45-48 arasındaki alıştırmaların tamamlanması gerekiyor. Lütfen işlemleri gösterin.',
        dueDate: '25 Ekim 2023',
        status: 'Yarın Son Gün',
        type: 'homework',
        icon: Calculator,
        color: 'orange'
    },
    {
        id: 2,
        title: 'Güneş Sistemi Maketi Projesi',
        subject: 'Fen Bilgisi',
        teacher: 'Ayşe Hoca',
        description: 'Grup ödevi için malzeme listesinin hazırlanması.',
        dueDate: '28 Ekim 2023',
        status: 'Bekliyor',
        type: 'project',
        icon: FlaskConical,
        color: 'purple'
    },
    {
        id: 3,
        title: 'Kitap Özeti: Küçük Prens',
        subject: 'Türkçe',
        teacher: 'Mehmet Hoca',
        description: 'İlk 3 bölümün özeti çıkarılacak.',
        dueDate: 'Dün',
        status: 'Gecikmiş',
        type: 'homework',
        icon: BookOpen,
        color: 'red'
    }
]

export default function VeliOdevlerPage() {
    const [selectedChild, setSelectedChild] = useState(children[0])
    const [selectedPeriod, setSelectedPeriod] = useState('2023-2024 Güz')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('Tüm Durumlar')
    const [selectedSubject, setSelectedSubject] = useState('Tüm Dersler')

    const subjects = ['Tüm Dersler', ...Array.from(new Set(homeworks.map(h => h.subject)))]
    const statuses = ['Tüm Durumlar', ...Array.from(new Set(homeworks.map(h => h.status)))]

    const filteredHomeworks = homeworks.filter(hw => {
        const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hw.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === 'Tüm Durumlar' || hw.status === selectedStatus
        const matchesSubject = selectedSubject === 'Tüm Dersler' || hw.subject === selectedSubject

        return matchesSearch && matchesStatus && matchesSubject
    })

    return (
        <div className="flex flex-col gap-6 p-6 font-sans">
            {/* Top Bar (Dönem & Search) - Matches header pattern in image */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">DÖNEM</span>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-700 bg-transparent outline-none cursor-pointer"
                    >
                        <option value="2023-2024 Güz">2023-2024 Güz</option>
                        <option value="2023-2024 Bahar">2023-2024 Bahar</option>
                        <option value="2022-2023 Yaz">2022-2023 Yaz</option>
                    </select>
                </div>
            </div>

            {/* Child Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-100">
                {children.map((child) => (
                    <button
                        key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className={cn(
                            "flex items-center gap-3 pb-4 transition-all relative",
                            selectedChild.id === child.id
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <div className={cn(
                            "h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center",
                            selectedChild.id === child.id && "ring-2 ring-primary ring-offset-2"
                        )}>
                            <User className="h-5 w-5" />
                        </div>
                        <span className="font-bold">{child.name}</span>
                    </button>
                ))}
            </div>

            {/* Page Header */}
            <div className="mt-2">
                <h1 className="text-3xl font-extrabold text-gray-900">Ödevler ve Projeler</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {selectedChild.name} • {selectedChild.class} Sınıfı • {selectedChild.year} Eğitim Yılı
                </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white/50 p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ödev ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border-none bg-gray-100/50 py-2 pl-10 pr-4 text-sm outline-none"
                    />
                </div>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 outline-none appearance-none cursor-pointer"
                >
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 outline-none appearance-none cursor-pointer"
                >
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>

                <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50">
                    <Calendar className="h-4 w-4 text-gray-400" /> Tarih
                </button>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Bu Hafta</h2>

                <div className="grid gap-4">
                    {filteredHomeworks.length > 0 ? (
                        filteredHomeworks.map((hw) => (
                            <div
                                key={hw.id}
                                className={cn(
                                    "group relative flex items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm transition-all hover:shadow-md border border-gray-100",
                                    "before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1.5 before:rounded-r-full",
                                    hw.color === 'orange' && "before:bg-orange-500",
                                    hw.color === 'purple' && "before:bg-purple-500",
                                    hw.color === 'red' && "before:bg-red-500"
                                )}
                            >
                                <div className="flex items-center gap-5 flex-1">
                                    {/* Icon Box */}
                                    <div className={cn(
                                        "flex h-14 w-14 items-center justify-center rounded-2xl shrink-0",
                                        hw.color === 'orange' && "bg-orange-50 text-orange-600",
                                        hw.color === 'purple' && "bg-purple-50 text-purple-600",
                                        hw.color === 'red' && "bg-red-50 text-red-600"
                                    )}>
                                        <hw.icon className="h-7 w-7" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                                hw.color === 'orange' && "bg-orange-100 text-orange-700",
                                                hw.color === 'purple' && "bg-purple-100 text-purple-700",
                                                hw.color === 'red' && "bg-red-100 text-red-700"
                                            )}>
                                                {hw.subject}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">•</span>
                                            <span className="text-sm font-bold text-gray-600">{hw.teacher}</span>
                                        </div>
                                        <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors">
                                            {hw.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                                            {hw.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Status & Navigation */}
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold",
                                            hw.status === 'Yarın Son Gün' && "bg-orange-100 text-orange-600",
                                            hw.status === 'Bekliyor' && "bg-blue-100 text-blue-600",
                                            hw.status === 'Gecikmiş' && "bg-red-100 text-red-600"
                                        )}>
                                            {hw.status === 'Yarın Son Gün' && <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />}
                                            {hw.status === 'Bekliyor' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                                            {hw.status === 'Gecikmiş' && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                                            {hw.status}
                                        </div>
                                        <p className="mt-2 text-xs font-bold text-gray-400 px-1">
                                            {hw.dueDate}
                                        </p>
                                    </div>

                                    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 transition-all hover:bg-gray-50 hover:text-primary">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
                            <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-bold text-gray-500">Ödev bulunamadı</p>
                            <p className="text-sm text-gray-400">Filtreleri değiştirmeyi deneyebilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
