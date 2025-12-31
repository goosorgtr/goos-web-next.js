'use client'

import { useState } from 'react'
import {
    Search,
    ChevronDown,
    ChevronRight,
    Calendar,
    Filter,
    CheckCircle2,
    Clock,
    User,
    GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const children = [
    { id: 1, name: 'Ali Yılmaz', class: '5-A', initials: 'A', active: true },
    { id: 2, name: 'Ayşe Yılmaz', class: '8-C', initials: 'A', active: false },
]

const exams = [
    {
        id: 1,
        name: '1. Ara Sınav',
        subject: 'Matematik',
        code: 'MAT101',
        date: '14 Kasım 2023',
        time: '09:30 - 11:00',
        status: 'Yaklaşıyor (2 Gün)',
        statusType: 'upcoming',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        name: 'Kompozisyon',
        subject: 'Türkçe',
        code: 'TUR202',
        date: '16 Kasım 2023',
        time: '13:00 - 14:30',
        status: 'Planlandı',
        statusType: 'planned',
        color: 'bg-purple-500'
    },
    {
        id: 3,
        name: 'Laboratuvar Sınavı',
        subject: 'Fen Bilimleri',
        code: 'FEN301',
        date: '18 Kasım 2023',
        time: '10:00 - 11:30',
        status: 'Planlandı',
        statusType: 'planned',
        color: 'bg-green-500'
    },
    {
        id: 4,
        name: 'İngilizce Quiz',
        subject: 'İngilizce',
        code: 'ING401',
        date: '05 Aralık 2023',
        time: '14:00 - 14:45',
        status: 'Planlandı',
        statusType: 'planned',
        color: 'bg-orange-500'
    },
    {
        id: 5,
        name: 'Ünite Sınavı',
        subject: 'Sosyal Bilgiler',
        code: 'SOS101',
        date: '01 Kasım 2023',
        time: '10:00 - 11:30',
        status: 'Tamamlandı',
        statusType: 'completed',
        color: 'bg-gray-400'
    }
]

export default function VeliSinavlarPage() {
    const [selectedChild, setSelectedChild] = useState(children[0])

    return (
        <div className="flex flex-col gap-8 p-8 font-sans bg-[#F9FAFB]">
            {/* Header & Student Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Sınav Tarihleri</h1>
                    <p className="text-base font-medium text-gray-500 mt-2">
                        Öğrencinizin sınav takvimini ve detaylarını buradan inceleyebilirsiniz.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChild(child)}
                            className="group flex flex-col items-center gap-2 relative"
                        >
                            <div className={cn(
                                "h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 relative",
                                selectedChild.id === child.id
                                    ? "ring-4 ring-primary ring-offset-4 scale-110"
                                    : "bg-gray-200 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                            )}>
                                <div className="h-full w-full rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                                    <User className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                                    {child.class}
                                </div>
                            </div>
                            <span className={cn(
                                "text-xs font-black transition-colors uppercase tracking-widest",
                                selectedChild.id === child.id ? "text-primary" : "text-gray-400"
                            )}>
                                {child.name}
                            </span>
                            {selectedChild.id === child.id && (
                                <div className="absolute -bottom-4 w-12 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Ders veya Sınav Ara"
                        className="w-full bg-gray-50 border-transparent border focus:bg-white focus:border-primary/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none transition-all shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-primary/20 px-4 py-3.5 min-w-[220px] shadow-inner cursor-pointer transition-all group">
                    <Calendar className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-gray-600 flex-1">Tarih aralığı seç</span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-5 py-3.5 min-w-[160px] shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                    <span className="text-sm font-bold text-gray-900 flex-1">Tüm Dersler</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-5 py-3.5 min-w-[160px] shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                    <span className="text-sm font-bold text-gray-900 flex-1">Tüm Tarihler</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            {/* Exams Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FBFCFD] border-b border-gray-100">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">SINAV ADI</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">DERS</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">TARİH</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">SAAT</th>
                                <th className="px-10 py-6 text-[10px) font-black text-gray-400 uppercase tracking-widest text-center">DURUM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {exams.map((exam) => (
                                <tr key={exam.id} className={cn(
                                    "hover:bg-gray-50/50 transition-all group",
                                    exam.statusType === 'completed' && "opacity-60"
                                )}>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("h-2.5 w-2.5 rounded-full ring-4 shadow-sm", exam.color, exam.statusType === 'completed' ? "ring-gray-100" : "ring-gray-100/50")} />
                                            <span className={cn(
                                                "text-lg font-black tracking-tight group-hover:translate-x-1 transition-transform",
                                                exam.statusType === 'completed' ? "text-gray-400 line-through decoration-2" : "text-gray-900"
                                            )}>
                                                {exam.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div>
                                            <p className="text-base font-black text-gray-800">{exam.subject}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">{exam.code}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-center">
                                        <span className="text-base font-bold text-gray-600">{exam.date}</span>
                                    </td>
                                    <td className="px-10 py-7 text-center">
                                        <div className="inline-flex items-center gap-2 text-primary font-bold">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-base">{exam.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex justify-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black shadow-sm transition-all",
                                                exam.statusType === 'upcoming' && "bg-[#FFF7ED] text-[#EA580C] ring-1 ring-[#FFEDD5] scale-105 shadow-[#EA580C]/5",
                                                exam.statusType === 'planned' && "bg-[#F0F9FF] text-[#0284C7] ring-1 ring-[#E0F2FE]",
                                                exam.statusType === 'completed' && "bg-[#F0FDF4] text-[#16A34A] ring-1 ring-[#DCFCE7]"
                                            )}>
                                                {exam.statusType === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                                                {exam.status}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
