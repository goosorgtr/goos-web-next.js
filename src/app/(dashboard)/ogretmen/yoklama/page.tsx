'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, Filter, CheckCircle2 } from 'lucide-react'

// Mock Data
const CLASSES = ['10-A', '10-B', '11-A', '12-A']
const COURSES = ['İleri Matematik', 'Fizik', 'Geometri']
const TIME_SLOTS = ['09:00 - 09:40', '09:50 - 10:30', '10:40 - 11:20']

const ABSENT_STUDENTS = [
    {
        id: '455',
        name: 'Elif Demir',
        no: '455',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elif',
    },
    {
        id: '472',
        name: 'Selin Yılmaz',
        no: '472',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selin',
    },
    {
        id: '478',
        name: 'Mert Şahin',
        no: '478',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mert',
    }
]

export default function YoklamaPage() {
    const [selectedClass, setSelectedClass] = useState('10-A')
    const [selectedCourse, setSelectedCourse] = useState('İleri Matematik')
    const [selectedTime, setSelectedTime] = useState('09:00 - 09:40')

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)]">
            {/* Scrollable Content Area */}
            <div className="flex-1 space-y-6 p-6 overflow-y-auto pb-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Yoklama Alma</h1>
                        <p className="text-gray-500 mt-1">
                            Bugünün ders kayıtlarını ve devamsızlık durumunu yönetin
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>15 Mayıs 2024, Çarşamba</span>
                    </div>
                </div>

                {/* Filters & Stats Card */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">

                        {/* Dropdowns */}
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="space-y-1.5 flex-1">
                                <label className="text-sm font-semibold text-gray-600">Sınıf Seç</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5 flex-[1.5]">
                                <label className="text-sm font-semibold text-gray-600">Ders Seç</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        {COURSES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5 flex-1">
                                <label className="text-sm font-semibold text-gray-600">Saat Aralığı Seç</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    >
                                        {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 border-l pl-0 lg:pl-6 pt-4 lg:pt-0 mt-2 lg:mt-0">
                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg px-4 py-2 min-w-[80px]">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Mevcut</span>
                                <span className="text-2xl font-bold text-gray-900">28</span>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg px-4 py-2 min-w-[80px] border border-green-100">
                                <span className="text-xs font-semibold text-green-600 uppercase">Var</span>
                                <span className="text-2xl font-bold text-green-700">24</span>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-red-50 rounded-lg px-4 py-2 min-w-[80px] border border-red-100">
                                <span className="text-xs font-semibold text-red-600 uppercase">Yok</span>
                                <span className="text-2xl font-bold text-red-700">4</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Student List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-gray-900">Devamsız Öğrenci Listesi</h2>
                            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                Sadece 'YOK' Olanlar
                            </span>
                        </div>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                            <Filter className="w-4 h-4" />
                            Filtreleri Temizle
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ABSENT_STUDENTS.map((student) => (
                            <div key={student.id} className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                        <img
                                            src={student.avatar}
                                            alt={student.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{student.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">No: {student.no}</p>
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100">
                                    Var olarak işaretle
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 px-6 flex items-center justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-6">
                    Taslak Kaydet
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 gap-2">
                    Yoklamayı Onayla
                    <CheckCircle2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
