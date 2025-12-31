'use client'

import { useState } from 'react'
import {
    Plus,
    Minus,
    ArrowUpRight,
    ArrowDownLeft,
    Info,
    Copy,
    Search,
    ChevronDown,
    ChevronRight,
    Filter,
    CreditCard,
    Building2,
    Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'

const children = [
    { id: 1, name: 'Ali Yılmaz', class: '5-A', initials: 'A' },
    { id: 2, name: 'Zeynep Yılmaz', class: '2-C', initials: 'Z' },
]

const transactions = [
    {
        id: 1,
        date: '24 Ekim 2023',
        type: 'Bakiye Yükleme',
        description: 'Mobil Bankacılık - EFT',
        amount: 500.0,
        isPositive: true,
        status: 'Onay Bekliyor',
        statusColor: 'orange'
    },
    {
        id: 2,
        date: '23 Ekim 2023',
        type: 'Kantin Harcaması',
        description: 'Öğle Yemeği Menüsü',
        amount: 45.0,
        isPositive: false,
        status: 'Onaylandı',
        statusColor: 'green'
    },
    {
        id: 3,
        date: '23 Ekim 2023',
        type: 'Kantin Harcaması',
        description: 'Su (500ml), Tost',
        amount: 25.0,
        isPositive: false,
        status: 'Onaylandı',
        statusColor: 'green'
    },
    {
        id: 4,
        date: '20 Ekim 2023',
        type: 'Bakiye Yükleme',
        description: 'Kredi Kartı (Sanal POS)',
        amount: 300.0,
        isPositive: true,
        status: 'Onaylandı',
        statusColor: 'green'
    },
    {
        id: 5,
        date: '18 Ekim 2023',
        type: 'Kantin Harcaması',
        description: 'Meyve Suyu, Bisküvi',
        amount: 35.0,
        isPositive: false,
        status: 'Onaylandı',
        statusColor: 'green'
    }
]

export default function BakiyeBilgisiPage() {
    const [selectedChild, setSelectedChild] = useState(children[0])

    return (
        <div className="flex flex-col gap-6 p-6 font-sans bg-[#F9FAFB]">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bakiye Yönetimi</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Öğrenci kantin bakiyesini yönetin ve işlem geçmişini görüntüleyin.
                    </p>
                </div>

                <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChild(child)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all font-bold text-sm",
                                selectedChild.id === child.id
                                    ? "bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            )}
                        >
                            <div className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center text-[10px]",
                                selectedChild.id === child.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-100 text-gray-400"
                            )}>
                                {child.initials}
                            </div>
                            {child.name} ({child.class})
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Alert */}
            <div className="bg-[#EFF6FF] rounded-3xl p-6 border border-[#DBEAFE] flex gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                    <Info className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-black text-[#1E40AF]">Önemli Bilgilendirme</h4>
                    <p className="text-sm font-semibold text-[#3B82F6] mt-1 leading-relaxed">
                        Havale/EFT işlemlerinde açıklama kısmına öğrenci T.C. kimlik numarasını yazmayı unutmayınız. İşlemlerin yansıması 24-48 saati bulabilir.
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2 items-start">

                {/* Left Column: Summary & Bank Info */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Balance Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Mevcut Bakiye</p>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter transition-transform group-hover:scale-105 duration-300 block">₺450.00</span>
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-2xl text-xs font-black ring-1 ring-green-100">
                                <Plus className="h-3 w-3" />
                                Son yükleme: ₺500
                            </div>
                        </div>
                        {/* Background Icon Decoration */}
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                            <Wallet className="h-40 w-40" />
                        </div>
                    </div>

                    {/* Bank Info Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                Banka Bilgileri
                            </h3>
                            <Building2 className="h-6 w-6 text-gray-300" />
                        </div>

                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">BANKA</p>
                                <p className="text-sm font-black text-gray-800">Ziraat Bankası</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ŞUBE</p>
                                <p className="text-sm font-black text-gray-800">Kurumsal Şube</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ALICI ADI</p>
                                <p className="text-sm font-black text-gray-800">GOOS Eğitim Kurumları A.Ş.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 mb-6 ring-1 ring-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">IBAN</p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-black text-primary tracking-tight">TR12 0001 0002 34...</p>
                                <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-primary shadow-sm">
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                                !
                            </div>
                            <p className="text-[11px] font-bold text-orange-700 leading-relaxed">
                                Açıklama kısmına <span className="font-black underline italic">12345678901</span> (Öğrenci T.C.) yazılması zorunludur.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 flex items-center justify-between border-b border-gray-50">
                        <h3 className="text-xl font-black text-gray-900">Hesap Hareketleri</h3>
                        <div className="flex items-center gap-3">
                            <button className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-black text-gray-600 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                Son 30 Gün <ChevronDown className="h-3 w-3" />
                            </button>
                            <button className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-black text-gray-600 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Filter className="h-3 w-3" /> Filtrele
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto px-2">
                        <table className="w-full text-left">
                            <thead className="bg-[#FBFCFD]">
                                <tr>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">TARİH</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">İŞLEM TÜRÜ</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">AÇIKLAMA</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">TUTAR</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">DURUM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/40 transition-colors group">
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-black text-gray-800">{tx.date}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                                    tx.isPositive ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                                                )}>
                                                    {tx.isPositive ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                                                </div>
                                                <span className="text-sm font-black text-gray-800">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-semibold text-gray-500 max-w-[180px] leading-snug">{tx.description}</p>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={cn(
                                                "text-sm font-black tracking-tight",
                                                tx.isPositive ? "text-green-600" : "text-gray-900"
                                            )}>
                                                {tx.isPositive ? '+' : '-'}₺{tx.amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex justify-center">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black ring-1 ring-inset",
                                                    tx.statusColor === 'orange' ? "bg-orange-50 text-orange-600 ring-orange-100" : "bg-green-50 text-green-600 ring-green-100"
                                                )}>
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", tx.statusColor === 'orange' ? "bg-orange-500 animate-pulse" : "bg-green-500")} />
                                                    {tx.status}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 flex justify-center border-t border-gray-50">
                        <button className="text-sm font-black text-primary hover:underline flex items-center gap-2 group">
                            Tüm İşlemleri Gör
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
