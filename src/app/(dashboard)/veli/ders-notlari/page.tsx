'use client'

import { useState } from 'react'
import {
    BarChart3,
    ChevronDown,
    ChevronRight,
    TrendingUp,
    GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const children = [
    { id: 1, name: 'Ali Yılmaz', class: '8-A' },
    { id: 2, name: 'Ayşe Yılmaz', class: '3-B' },
]

const periods = [
    '2023-2024 Güz Dönemi',
    '2022-2023 Bahar Dönemi',
    '2022-2023 Güz Dönemi'
]

const subjectGrades = [
    {
        name: 'Matematik',
        color: 'bg-blue-500',
        yazili1: 85,
        yazili2: 90,
        sozlu: 95,
        proje: '-',
        ort: 90.0
    },
    {
        name: 'Türkçe',
        color: 'bg-red-500',
        yazili1: 75,
        yazili2: 82,
        sozlu: 85,
        proje: 90,
        ort: 83.0
    },
    {
        name: 'Fen Bilimleri',
        color: 'bg-green-500',
        yazili1: 92,
        yazili2: 95,
        sozlu: 98,
        proje: 100,
        ort: 96.2
    },
    {
        name: 'İnkılap Tarihi',
        color: 'bg-orange-500',
        yazili1: 88,
        yazili2: '-',
        sozlu: 90,
        proje: '-',
        ort: 89.0
    },
    {
        name: 'İngilizce',
        color: 'bg-purple-500',
        yazili1: 65,
        yazili2: 70,
        sozlu: 80,
        proje: 85,
        ort: 75.0
    }
]

export default function VeliDersNotlariPage() {
    const [selectedChild, setSelectedChild] = useState(children[0])
    const [selectedPeriod, setSelectedPeriod] = useState(periods[0])

    return (
        <div className="flex flex-col gap-8 p-8 font-sans bg-[#FAFAFA]">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Kontrol Paneli</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-gray-900">Not Bilgisi</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Not Bilgisi</h1>
                <p className="text-base text-gray-500 mt-2 font-medium">
                    Çocuğunuzun akademik performansını, sınav sonuçlarını ve proje notlarını detaylı olarak inceleyin.
                </p>
            </div>

            {/* Stats & Filters Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Filters Card */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Öğrenci Seçimi</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-gray-100 rounded-full flex items-center justify-center">
                                <div className="h-2 w-2 bg-gray-400 rounded-full" />
                            </div>
                            <select
                                className="w-full appearance-none bg-gray-50 border border-transparent rounded-2xl px-12 py-4 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
                                value={selectedChild.id}
                                onChange={(e) => setSelectedChild(children.find(c => c.id === Number(e.target.value)) || children[0])}
                            >
                                {children.map(child => (
                                    <option key={child.id} value={child.id}>{child.name} ({child.class})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Akademik Dönem</label>
                        <div className="relative">
                            <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 rotate-90" />
                            <select
                                className="w-full appearance-none bg-gray-50 border border-transparent rounded-2xl px-12 py-4 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            >
                                {periods.map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Global Average Card */}
                <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-black">
                            <TrendingUp className="h-3 w-3" />
                            +2.1
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Genel Ortalama</p>
                        <p className="text-5xl font-black text-gray-900 mt-2">88.5</p>
                    </div>
                    {/* Decorative background shape */}
                    <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-primary/5 rounded-full blur-2xl" />
                </div>
            </div>

            {/* Grades Table Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50">
                    <h3 className="text-2xl font-black text-gray-900">Ders Notları</h3>
                    <button className="text-sm font-black text-primary hover:text-primary/80 transition-all">Tümünü Gör</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FAFBFC]">
                            <tr>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">DERS ADI</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">YAZILI 1</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">YAZILI 2</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">SÖZLÜ</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">PROJE</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">ORT.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {subjectGrades.map((grade, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-2 w-2 rounded-full", grade.color)} />
                                            <span className="text-base font-black text-gray-900 group-hover:translate-x-1 transition-transform">{grade.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center text-base font-bold text-gray-600">{grade.yazili1}</td>
                                    <td className="px-6 py-6 text-center text-base font-bold text-gray-600">{grade.yazili2}</td>
                                    <td className="px-6 py-6 text-center text-base font-bold text-gray-600">{grade.sozlu}</td>
                                    <td className="px-6 py-6 text-center text-base font-bold text-gray-600">{grade.proje}</td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-center">
                                            <div className={cn(
                                                "inline-flex items-center justify-center min-w-[3.5rem] px-3 py-1.5 rounded-full text-sm font-black ring-1 ring-inset",
                                                grade.ort >= 90 ? "bg-green-50 text-green-700 ring-green-100" :
                                                    grade.ort >= 80 ? "bg-yellow-50 text-yellow-700 ring-yellow-100" :
                                                        "bg-gray-50 text-gray-700 ring-gray-100"
                                            )}>
                                                {grade.ort.toFixed(1)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            <footer className="mt-6 flex flex-col items-center gap-4 py-8 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-400">
                    © 2024 GOOS Okul Yönetim Sistemi. Tüm hakları saklıdır.
                </p>
                <div className="flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a>
                    <a href="#" className="hover:text-primary transition-colors">Kullanım Şartları</a>
                    <a href="#" className="hover:text-primary transition-colors">Destek</a>
                </div>
            </footer>
        </div>
    )
}
