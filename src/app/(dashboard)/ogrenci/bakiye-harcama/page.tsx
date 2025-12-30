import {
    Calendar,
    ChevronDown,
    ChevronRight,
    CreditCard,
    Download,
    Filter,
    ShoppingBag,
    Wallet,
    TrendingDown,
    Info
} from 'lucide-react'
import Link from 'next/link'

interface Transaction {
    id: string
    date: string
    time: string
    type: 'Harcama' | 'Bakiye Yükleme'
    location: string
    amount: number
    balance: number
    icon: any
    iconColor: string
    isPositive: boolean
}

const transactions: Transaction[] = [
    {
        id: '1',
        date: '14.10.2023',
        time: '12:30',
        type: 'Harcama',
        location: 'Kantin 1',
        amount: 45.00,
        balance: 150.00,
        icon: ShoppingBag,
        iconColor: 'orange',
        isPositive: false
    },
    {
        id: '2',
        date: '13.10.2023',
        time: '10:15',
        type: 'Harcama',
        location: 'Kantin 2',
        amount: 15.00,
        balance: 195.00,
        icon: ShoppingBag,
        iconColor: 'orange',
        isPositive: false
    },
    {
        id: '3',
        date: '10.10.2023',
        time: '09:00',
        type: 'Bakiye Yükleme',
        location: 'Kredi Kartı ile Yükleme',
        amount: 200.00,
        balance: 210.00,
        icon: CreditCard,
        iconColor: 'blue',
        isPositive: true
    },
    {
        id: '4',
        date: '09.10.2023',
        time: '15:45',
        type: 'Harcama',
        location: 'Kantin 1',
        amount: 35.00,
        balance: 10.00,
        icon: ShoppingBag,
        iconColor: 'orange',
        isPositive: false
    },
    {
        id: '5',
        date: '08.10.2023',
        time: '12:10',
        type: 'Harcama',
        location: 'Kantin 3',
        amount: 65.00,
        balance: 45.00,
        icon: ShoppingBag,
        iconColor: 'orange',
        isPositive: false
    },
]

export default function BakiyeHarcamaPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Öğrenci Bakiye ve Harcama</h1>
                <p className="text-gray-500">Kantin bakiyenizi, yüklemelerinizi ve harcama geçmişinizi buradan detaylıca takip edebilirsiniz.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Current Balance */}
                <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                <Wallet className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Mevcut Bakiye</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">₺ 150.00</div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Info className="h-3 w-3" />
                            Kullanılabilir bakiye
                        </div>
                    </div>
                    <Wallet className="h-20 w-20 text-blue-50" />
                </div>

                {/* Spent This Month */}
                <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Bu Ay Harcanan</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">₺ 435.50</div>
                        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
                            <TrendingDown className="h-3 w-3" />
                            Geçen aya göre %12 daha az
                        </div>
                    </div>
                    <ShoppingBag className="h-20 w-20 text-orange-50" />
                </div>

                {/* Last Load */}
                <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Son Yükleme</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">₺ 200.00</div>
                        <div className="mt-1 text-xs text-gray-500">
                            10 Ekim 2023 tarihinde
                        </div>
                    </div>
                    <CreditCard className="h-20 w-20 text-green-50" />
                </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-end gap-4 rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label className="mb-2 block text-sm font-bold text-gray-700">Başlangıç Tarihi</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-lg border px-4 py-2 pl-10 text-gray-600 focus:border-blue-500 focus:outline-none"
                            defaultValue="01.10.2023"
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="mb-2 block text-sm font-bold text-gray-700">Bitiş Tarihi</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-lg border px-4 py-2 pl-10 text-gray-600 focus:border-blue-500 focus:outline-none"
                            defaultValue="15.10.2023"
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white hover:bg-blue-700">
                    <Filter className="h-4 w-4" />
                    Filtrele
                </button>
                <button className="ml-auto flex items-center gap-2 rounded-lg border px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Rapor İndir
                </button>
            </div>

            {/* Transaction History Table */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-bold text-gray-900">Harcama Geçmişi</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                        Son 30 Gün
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                                <th className="px-6 py-4 font-bold">TARİH / SAAT</th>
                                <th className="px-6 py-4 font-bold">TÜR</th>
                                <th className="px-6 py-4 font-bold">İŞLEM TİPİ</th>
                                <th className="px-6 py-4 text-right font-bold">TUTAR</th>
                                <th className="px-6 py-4 text-right font-bold">KALAN BAKİYE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{tx.date}</div>
                                        <div className="text-gray-500">{tx.time}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${tx.iconColor}-100 text-${tx.iconColor}-600`}>
                                            <tx.icon className="h-5 w-5" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{tx.type}</div>
                                        <div className="text-gray-500">{tx.location}</div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${tx.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.isPositive ? '+' : '-'} ₺ {tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-500">
                                        ₺ {tx.balance.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t p-6">
                    <p className="text-sm font-medium text-gray-500">Toplam 128 işlemden 1-5 arası gösteriliyor</p>
                    <div className="flex gap-2">
                        <button className="rounded px-4 py-2 border text-sm font-medium text-gray-600 hover:bg-gray-50">Önceki</button>
                        <button className="rounded px-4 py-2 border text-sm font-medium text-gray-600 hover:bg-gray-50">Sonraki</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
