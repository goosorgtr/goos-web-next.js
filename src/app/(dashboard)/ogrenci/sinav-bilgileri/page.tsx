import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Search
} from 'lucide-react'

interface Exam {
    id: string
    name: string
    course: string
    color: string
    date: string
    day: string
    time: string
}

const exams: Exam[] = [
    {
        id: '1',
        name: 'Sınav 1',
        course: 'Matematik',
        color: 'blue',
        date: '15 Kasım 2023',
        day: 'Çarşamba',
        time: '14:00 - 15:30'
    },
    {
        id: '2',
        name: 'Sınav 2',
        course: 'Fizik',
        color: 'purple',
        date: '22 Kasım 2023',
        day: 'Çarşamba',
        time: '09:30 - 11:00'
    },
    {
        id: '3',
        name: 'Proje',
        course: 'Kimya',
        color: 'orange',
        date: '28 Ekim 2023',
        day: 'Cumartesi',
        time: '10:00 - 10:45'
    }
]

export default function SinavBilgileriPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Sınav Bilgileri</h1>
                <p className="mt-1 text-gray-500">Yaklaşan sınavlarınızı planlayın ve geçmiş sonuçlarınızı inceleyin.</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ders veya sınav ara..."
                        className="w-full rounded-lg bg-gray-50 px-4 py-2.5 pl-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100">
                        Tüm Dersler
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100">
                        Tüm Tarihler
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Exams List */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-bold text-gray-900">Sınavlar</h2>
                    <span className="text-sm font-medium text-gray-500">Toplam 3 sınav</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                                <th className="px-6 py-4 font-bold">SINAV ADI</th>
                                <th className="px-6 py-4 font-bold">DERS</th>
                                <th className="px-6 py-4 font-bold">TARİH</th>
                                <th className="px-6 py-4 font-bold">SAAT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {exam.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full bg-${exam.color}-500`} />
                                            <span className="font-bold text-gray-700">{exam.course}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{exam.date}</div>
                                        <div className="text-xs text-gray-500">{exam.day}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">{exam.time}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t p-4 text-sm text-gray-500">
                    <span>1-3 arası gösteriliyor</span>
                    <div className="flex items-center gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
