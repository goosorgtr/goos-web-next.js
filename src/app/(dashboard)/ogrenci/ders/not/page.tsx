import {
    ArrowLeft,
    BookOpen,
    ChevronDown,
    Download,
    TrendingUp,
    Star,
    Bookmark,
    CheckCircle2,
    Calculator,
    Beaker,
    Book,
    Globe,
    Languages
} from 'lucide-react'
import Link from 'next/link'

interface GradeRow {
    course: string
    icon: any
    written1: number
    written2: number
    oral: number
    project: number | '-'
    perf: number | '-'
    average: number
    status: 'Geçti' | 'Kaldı'
    color: string
}

const gradesData: GradeRow[] = [
    { course: 'Matematik', icon: Calculator, written1: 85, written2: 90, oral: 95, project: '-', perf: 100, average: 92.5, status: 'Geçti', color: 'orange' },
    { course: 'Fizik', icon: Beaker, written1: 60, written2: 55, oral: 70, project: 80, perf: '-', average: 66.25, status: 'Geçti', color: 'blue' },
    { course: 'Türk Dili ve Edebiyatı', icon: Book, written1: 75, written2: 82, oral: 90, project: 85, perf: 95, average: 85.4, status: 'Geçti', color: 'purple' },
    { course: 'Tarih', icon: BookOpen, written1: 95, written2: 90, oral: 100, project: '-', perf: 100, average: 96.25, status: 'Geçti', color: 'yellow' },
    { course: 'Kimya', icon: Beaker, written1: 45, written2: 30, oral: 60, project: '-', perf: 55, average: 47.5, status: 'Kaldı', color: 'red' },
    { course: 'Coğrafya', icon: Globe, written1: 70, written2: 75, oral: 85, project: '-', perf: 90, average: 80.0, status: 'Geçti', color: 'emerald' },
    { course: 'İngilizce', icon: Languages, written1: 92, written2: 88, oral: 95, project: 90, perf: 100, average: 93.0, status: 'Geçti', color: 'indigo' },
]

export default function DersNotlariPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/ogrenci" className="hover:text-blue-600">Anasayfa</Link>
                        <span>/</span>
                        <Link href="/ogrenci/ders" className="hover:text-blue-600">Ders</Link>
                        <span>/</span>
                        <span className="text-gray-900">Not Bilgisi</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Öğrenci Not Bilgisi</h1>
                    <p className="mt-1 text-gray-500">Dönemlik not durumunuzu ve ortalamalarınızı buradan takip edebilirsiniz.</p>
                </div>

                <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    2023-2024 / 2. Dönem
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Overall Average */}
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm">
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">GENEL ORTALAMA</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900">88.4</span>
                            <div className="flex items-center text-sm font-bold text-green-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                +2.1
                            </div>
                        </div>
                    </div>
                    <Star className="absolute -right-4 -top-4 h-32 w-32 fill-gray-50 text-gray-100" />
                </div>

                {/* Total Courses */}
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm">
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">TOPLAM DERS</h3>
                        <div className="mt-2">
                            <span className="text-4xl font-bold text-gray-900">12</span>
                        </div>
                    </div>
                    <Bookmark className="absolute -right-4 -top-4 h-32 w-32 fill-gray-50 text-gray-100" />
                </div>

                {/* Successful Courses */}
                <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm">
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">BAŞARILI DERSLER</h3>
                        <div className="mt-2">
                            <span className="text-4xl font-bold text-gray-900">11</span>
                        </div>
                    </div>
                    <CheckCircle2 className="absolute -right-4 -top-4 h-32 w-32 fill-gray-50 text-gray-100" />
                </div>
            </div>

            {/* Grades Table */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-bold text-gray-900">Ders Notları</h2>
                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                        <Download className="h-4 w-4" />
                        PDF İndir
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                                <th className="px-6 py-4 font-bold">DERS ADI</th>
                                <th className="px-6 py-4 text-center font-bold">YAZILI 1</th>
                                <th className="px-6 py-4 text-center font-bold">YAZILI 2</th>
                                <th className="px-6 py-4 text-center font-bold">SÖZLÜ 1</th>
                                <th className="px-6 py-4 text-center font-bold">PROJE</th>
                                <th className="px-6 py-4 text-center font-bold">PERF.</th>
                                <th className="px-6 py-4 text-center font-bold">ORTALAMA</th>
                                <th className="px-6 py-4 text-center font-bold">DURUM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {gradesData.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${row.color}-100 text-${row.color}-600`}>
                                                <row.icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-bold text-gray-900">{row.course}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-gray-600">{row.written1}</td>
                                    <td className="px-6 py-4 text-center font-medium text-gray-600">{row.written2}</td>
                                    <td className="px-6 py-4 text-center font-medium text-gray-600">{row.oral}</td>
                                    <td className="px-6 py-4 text-center font-medium text-gray-600">{row.project}</td>
                                    <td className="px-6 py-4 text-center font-medium text-gray-600">{row.perf}</td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-900">{row.average}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${row.status === 'Geçti'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 border-t p-4 text-sm font-medium text-gray-600">
                    <button className="rounded px-3 py-1 hover:bg-gray-100">Önceki</button>
                    <button className="rounded bg-blue-600 px-3 py-1 text-white">1</button>
                    <button className="rounded px-3 py-1 hover:bg-gray-100">2</button>
                    <button className="rounded px-3 py-1 hover:bg-gray-100">Sonraki</button>
                </div>
            </div>
        </div>
    )
}
