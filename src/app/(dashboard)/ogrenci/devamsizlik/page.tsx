import { Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface AttendanceRecord {
    date: string
    day: string
    type: 'Tam Gün' | 'Yarım Gün' // Assuming type might be needed, though image doesn't explicitly show it, list items look simple.
}

const attendanceData: AttendanceRecord[] = [
    { date: '05 Mart 2024', day: 'Salı', type: 'Tam Gün' },
    { date: '12 Şubat 2024', day: 'Pazartesi', type: 'Tam Gün' },
    { date: '10 Ocak 2024', day: 'Çarşamba', type: 'Tam Gün' },
    { date: '15 Aralık 2023', day: 'Cuma', type: 'Tam Gün' },
    { date: '02 Kasım 2023', day: 'Perşembe', type: 'Tam Gün' },
]

export default function DevamsizlikPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/ogrenci" className="hover:text-blue-600">Ana Sayfa</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900">Devamsızlık Bilgisi</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Devamsızlık Durumu</h1>
                <p className="mt-1 text-gray-500">Devamsızlık yapılan günlerin listesi.</p>
            </div>

            {/* Main Card */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-bold text-gray-900">Devamsızlık Geçmişi</h2>
                    <span className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-600">
                        Toplam 5 Gün
                    </span>
                </div>

                <div className="divide-y">
                    {attendanceData.map((record, i) => (
                        <div key={i} className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{record.date}</h3>
                                <p className="text-gray-500">{record.day}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
