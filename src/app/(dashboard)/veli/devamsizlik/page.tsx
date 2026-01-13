'use client'

import { useState } from 'react'
import {
    Search,
    ChevronDown,
    Calendar as CalendarIcon,
    ChevronRight,
    ChevronLeft,
    X,
    Check,
    AlertCircle,
    Clock,
    Info,
    Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const children = [
    { id: 1, name: 'Can Yılmaz', class: '10-A' },
    { id: 2, name: 'Ayşe Yılmaz', class: '3-B' },
]

const attendanceData = [
    {
        date: '05 Ekim 2023',
        day: 'Perşembe',
        status: 'Yok',
        type: 'negative',
        checkInOut: '-',
        description: 'Bildirim yapılmadı.',
    },
    {
        date: '19 Ekim 2023',
        day: 'Perşembe',
        status: 'Yok',
        type: 'negative',
        checkInOut: '-',
        description: 'Hastalık nedeniyle raporlu.',
    }
]

const calendarDays = [
    { day: 1, status: 'none' },
    { day: 2, status: 'geldi' },
    { day: 3, status: 'geldi' },
    { day: 4, status: 'geldi' },
    { day: 5, status: 'yok' },
    { day: 6, status: 'geldi' },
    { day: 7, status: 'none' },
    { day: 8, status: 'none' },
    { day: 9, status: 'geldi' },
    { day: 10, status: 'gec' },
    { day: 11, status: 'geldi' },
    { day: 12, status: 'geldi' },
    { day: 13, status: 'geldi' },
    { day: 14, status: 'none' },
    { day: 15, status: 'none' },
    { day: 16, status: 'geldi' },
    { day: 17, status: 'geldi' },
    { day: 18, status: 'geldi' },
    { day: 19, status: 'yok' },
    { day: 20, status: 'none' },
    { day: 21, status: 'none' },
    { day: 22, status: 'none' },
]

export default function VeliDevamsizlikPage() {
    const [selectedChild, setSelectedChild] = useState(children[0])
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2023, 9, 1),
        to: new Date(2023, 9, 31),
    })

    return (
        <div className="flex flex-col gap-6 p-6 font-sans bg-[#F8FAFC]">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Ana Sayfa</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-primary">Devamsızlık Durumu</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Çocuğun Devamsızlık Durumu</h1>
                <p className="text-sm text-gray-500 mt-1 italic">
                    Çocuğunuzun okul devam durumunu detaylı inceleyin.
                </p>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Öğrenci Seçin</label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                            value={selectedChild.id}
                            onChange={(e) => setSelectedChild(children.find(c => c.id === Number(e.target.value)) || children[0])}
                        >
                            {children.map(child => (
                                <option key={child.id} value={child.id}>{child.name} ({child.class})</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tarih Aralığı</label>
                    <div className="relative">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-between text-left font-semibold border-gray-200 rounded-xl px-4 py-6 text-sm hover:bg-gray-50 bg-white",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "d LLL y", { locale: tr })} -{" "}
                                                    {format(date.to, "d LLL y", { locale: tr })}
                                                </>
                                            ) : (
                                                format(date.from, "d LLL y", { locale: tr })
                                            )
                                        ) : (
                                            <span>Tarih seçin</span>
                                        )}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                    locale={tr}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <X className="h-6 w-6" strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Devamsızlık</p>
                        <p className="text-2xl font-black text-gray-900">3.5 Gün</p>
                    </div>
                </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Calendar Column */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Ekim 2023</h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 mb-4">
                        {['PT', 'SA', 'ÇA', 'PE', 'CU', 'CT', 'PZ'].map(day => (
                            <div key={day} className="text-center text-xs font-bold text-gray-400">{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-4">
                        {calendarDays.map((date, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center">
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer",
                                    date.status === 'none' && "text-gray-300",
                                    date.status === 'geldi' && "bg-[#DCFCE7] text-[#166534]",
                                    date.status === 'yok' && "bg-[#FEE2E2] text-[#991B1B] ring-2 ring-[#FCA5A5]",
                                    date.status === 'gec' && "bg-[#FEF3C7] text-[#92400E]",
                                    idx === 18 && "ring-2 ring-primary" // Highlight selected day like in image (Oct 19)
                                )}>
                                    {date.day}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-8 flex items-center justify-center gap-6 border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#DCFCE7]" />
                            <span className="text-xs font-bold text-gray-500">Geldi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#FEE2E2]" />
                            <span className="text-xs font-bold text-gray-500">Yok</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#FEF3C7]" />
                            <span className="text-xs font-bold text-gray-500">Geç</span>
                        </div>
                    </div>
                </div>

                {/* Detailed List Column */}
                <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 flex items-center justify-between border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-900">Detaylı Liste</h3>
                        <button className="text-xs font-bold text-primary hover:underline transition-all">Tümünü Gör</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">TARİH</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">GİRİŞ / ÇIKIŞ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">AÇIKLAMA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {attendanceData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-bold text-gray-900">{item.date}</p>
                                            <p className="text-xs font-medium text-gray-400 mt-0.5">{item.day}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-400">
                                            {item.checkInOut}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={cn(
                                                "text-sm font-medium",
                                                idx === 0 ? "text-red-500 font-bold" : "text-gray-500"
                                            )}>
                                                {item.description}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-[#EFF6FF] rounded-2xl p-5 border border-[#DBEAFE] flex items-start gap-4 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Info className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-[#1E40AF] leading-relaxed">
                    Bu sayfadaki veriler anlık olarak güncellenmektedir. Eğer bir hata olduğunu düşünüyorsanız lütfen sınıf öğretmeni ile veya <a href="#" className="underline font-bold text-[#1D4ED8]">Okul İdaresi</a> ile iletişime geçiniz.
                </p>
            </div>
        </div>
    )
}
