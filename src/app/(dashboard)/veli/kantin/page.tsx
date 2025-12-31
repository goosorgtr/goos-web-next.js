'use client'

import { useState } from 'react'
import {
    Plus,
    Search,
    ChevronDown,
    ChevronRight,
    Wallet,
    TrendingDown,
    BarChart3,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    User,
    Coffee
} from 'lucide-react'
import { cn } from '@/lib/utils'

const children = [
    { id: 1, name: 'Ali Yılmaz', avatar: null },
    { id: 2, name: 'Zeynep Yılmaz', avatar: null },
]

const transactions = [
    { id: 1, date: '14 Ekim 2023', time: '12:30', type: 'expense', amount: 35.0, description: 'Öğle Yemeği' },
    { id: 2, date: '14 Ekim 2023', time: '12:35', type: 'expense', amount: 12.0, description: 'Su & Atıştırmalık' },
    { id: 3, date: '13 Ekim 2023', time: '09:00', type: 'income', amount: 500.0, description: 'Bakiye Yükleme' },
    { id: 4, date: '12 Ekim 2023', time: '12:15', type: 'expense', amount: 15.0, description: 'Kantin Harcaması' },
    { id: 5, date: '12 Ekim 2023', time: '12:20', type: 'expense', amount: 5.0, description: 'Kantin Harcaması' },
]

export default function VeliKantinPage() {
    const [selectedChild, setSelectedChild] = useState(children[0])

    return (
        <div className="flex flex-col gap-6 p-6 font-sans bg-[#F8FAFC]">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Ana Sayfa</span>
                <ChevronRight className="h-4 w-4" />
                <span>Kantin</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-primary">İşlem Geçmişi</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kantin İşlem Geçmişi</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    Çocuğunuzun kantin harcamalarını ve bakiyesini detaylı takip edin.
                </p>
            </div>

            {/* Student Selection */}
            <div className="flex items-center gap-8 border-b border-gray-100">
                {children.map((child) => (
                    <button
                        key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className={cn(
                            "flex items-center gap-3 pb-4 transition-all relative group",
                            selectedChild.id === child.id
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <div className={cn(
                            "h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105",
                            selectedChild.id === child.id && "ring-2 ring-primary ring-offset-2"
                        )}>
                            <User className="h-6 w-6" />
                        </div>
                        <span className="font-bold">{child.name}</span>
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="bg-primary rounded-3xl p-8 shadow-xl shadow-primary/20 text-white relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Mevcut Bakiye</p>
                            <h3 className="text-4xl font-black mt-2 tracking-tighter">₺450.00</h3>
                        </div>
                        <button className="mt-8 w-full bg-white text-primary rounded-2xl py-3.5 font-black text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-black/5">
                            <Plus className="h-5 w-5" strokeWidth={3} />
                            Bakiye Yükle
                        </button>
                    </div>
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Wallet className="h-32 w-32" />
                    </div>
                </div>

                {/* Monthly Spend Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bu Ay Harcanan</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter transition-all group-hover:text-primary">₺1,250.00</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <span className="text-sm font-black text-red-500 flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4" />
                            12%
                        </span>
                        <span className="text-xs font-bold text-gray-400">geçen aya göre artış</span>
                    </div>
                </div>

                {/* Daily Average Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Günlük Ortalama</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter transition-all group-hover:text-primary">₺45.00</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    {/* Simple Decorative Chart representation */}
                    <div className="mt-6 flex items-end gap-1.5 h-6">
                        {[30, 45, 25, 60, 40, 50, 45].map((h, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex-1 rounded-t-sm transition-all duration-500",
                                    i === 6 ? "bg-primary" : "bg-primary/20"
                                )}
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white/50 p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-3 min-w-[180px] shadow-sm cursor-pointer hover:bg-gray-50 transition-all group">
                    <Calendar className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-gray-700 flex-1">Bu Hafta</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-3 min-w-[180px] shadow-sm cursor-pointer hover:bg-gray-50 transition-all group">
                    <Filter className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-gray-700 flex-1">Tüm Kategoriler</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ürün ara..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 text-left">
                            <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">TARİH / SAAT</th>
                            <th className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-10 py-7">
                                    <div className="flex items-start gap-5">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-110",
                                            tx.type === 'expense' ? "bg-gray-50 text-gray-400" : "bg-green-50 text-green-500"
                                        )}>
                                            {tx.type === 'expense' ? <Coffee className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-gray-900 group-hover:text-primary transition-colors">
                                                {tx.date}
                                            </h4>
                                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                                {tx.time} • {tx.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <span className={cn(
                                        "text-xl font-black tracking-tighter",
                                        tx.type === 'expense' ? "text-gray-900" : "text-green-500 shadow-sm"
                                    )}>
                                        {tx.type === 'expense' ? '-' : '+'}₺{tx.amount.toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
