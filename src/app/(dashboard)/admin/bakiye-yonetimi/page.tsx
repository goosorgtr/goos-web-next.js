'use client'

import { useState } from 'react'
import { Download, ChevronDown, Search, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AddBalanceDialog } from '@/components/admin/bakiye/AddBalanceDialog'

// Mock data
const MOCK_STUDENTS = [
  {
    id: '1',
    studentName: 'Zeynep Kaya',
    studentId: '202401',
    avatar: 'ZK',
    avatarColor: 'bg-pink-500',
    class: '10-A',
    lastTransaction: '₺250.00 Yükleme',
    transactionDate: 'Bugün, 09:50',
    balance: '₺345.50'
  },
  {
    id: '2',
    studentName: 'Ahmet Yılmaz',
    studentId: '202405',
    avatar: 'AY',
    avatarColor: 'bg-orange-500',
    class: '11-B',
    lastTransaction: '₺45.00 Harcama',
    transactionDate: 'Dün, 12:15',
    balance: '₺12.00',
    balanceColor: 'text-red-600'
  },
  {
    id: '3',
    studentName: 'Elif Can',
    studentId: '202412',
    avatar: 'EC',
    avatarColor: 'bg-orange-400',
    class: '9-C',
    lastTransaction: '₺500.00 Yükleme',
    transactionDate: '23 Kas, 16:40',
    balance: '₺1,250.00'
  },
  {
    id: '4',
    studentName: 'Mehmet K.',
    studentId: '202422',
    avatar: 'MK',
    avatarColor: 'bg-purple-500',
    class: '12-A',
    lastTransaction: '₺20.00 Harcama',
    transactionDate: 'Bugün, 08:15',
    balance: '₺85.00'
  },
  {
    id: '5',
    studentName: 'Selin Demir',
    studentId: '202489',
    avatar: 'SD',
    avatarColor: 'bg-blue-500',
    class: '10-C',
    lastTransaction: '₺15.00 Harcama',
    transactionDate: '20 Kas, 10:00',
    balance: '₺0.00',
    balanceColor: 'text-red-600'
  }
]

const RECENT_TRANSACTIONS = [
  { id: '1', name: 'Zeynep Kaya', amount: '+250', time: '10 dk', type: 'credit' },
  { id: '2', name: 'Ahmet Yılmaz', amount: '-450', time: '1 saat', type: 'debit' },
  { id: '3', name: 'Elif Can', amount: '+500', time: 'Dün', type: 'credit' },
  { id: '4', name: 'Selin Demir', amount: '-150', time: 'Dün', type: 'debit' }
]

const CLASSES = ['Tüm Sınıflar', '9-A', '9-B', '9-C', '10-A', '10-B', '10-C', '11-A', '11-B', '12-A']

export default function BakiyeYonetimiPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('Tüm Sınıflar')
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedClass('Tüm Sınıflar')
  }

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    // Sınıf Filtresi
    if (selectedClass !== 'Tüm Sınıflar' && student.class !== selectedClass) {
      return false
    }

    // Arama Filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      // Note: student.class is used for class filter, but searching might also optionally cover it. 
      // Usually user expects name or ID.
      return (
        student.studentName.toLowerCase().includes(query) ||
        student.studentId.includes(query)
      )
    }

    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bakiye Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            Öğrenci hesaplarını görüntüleyin ve bakiye işlemlerini yönetin.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Rapor İndir
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Toplam Öğrenci Bakiyesi */}
        <div className="rounded-xl border-l-4 border-l-blue-500 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Öğrenci Bakiyesi</p>
              <p className="mt-2 text-3xl font-bold">₺142,400.00</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bugün Yüklenen */}
        <div className="rounded-xl border-l-4 border-l-green-500 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bugün Yüklenen</p>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-3xl font-bold">₺3,250.00</p>
                <span className="mb-1 text-sm text-muted-foreground">24 İşlem</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Sol Taraf - Arama ve Filtreleme */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Arama ve Filtreleme</h2>

          <div className="space-y-4">
            {/* Öğrenci No ile Arama */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Öğrenci No ile Arama
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Öğrenci no giriniz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sınıf */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sınıf</label>
              <div className="relative">
                <button
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span>{selectedClass}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showClassDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowClassDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                      {CLASSES.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setSelectedClass(cls)
                            setShowClassDropdown(false)
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Son İşlemler */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Son İşlemler</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              Tümünü Gör
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_TRANSACTIONS.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <span className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.type === 'credit' ? 'Ödeme' : 'Harcama'}: {transaction.time}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Öğrenci Listesi Tablosu */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold">Öğrenci Listesi</h2>
          <button
            onClick={handleResetFilters}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Filtreleri Temizle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ÖĞRENCİ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  SINIF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  SON İŞLEM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  BAKİYE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İŞLEM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    {/* Öğrenci */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${student.avatarColor} text-sm font-semibold text-white`}>
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{student.studentName}</p>
                          <p className="text-sm text-muted-foreground">#{student.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Sınıf */}
                    <td className="px-6 py-4">
                      <p className="text-sm">{student.class}</p>
                    </td>

                    {/* Son İşlem */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{student.lastTransaction}</p>
                      <p className="text-xs text-muted-foreground">{student.transactionDate}</p>
                    </td>

                    {/* Bakiye */}
                    <td className="px-6 py-4">
                      <p className={`text-lg font-bold ${student.balanceColor || ''}`}>
                        {student.balance}
                      </p>
                    </td>

                    {/* İşlem */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedStudent(student)
                          setIsAddBalanceOpen(true)
                        }}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Kayıt bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddBalanceDialog
        open={isAddBalanceOpen}
        onOpenChange={setIsAddBalanceOpen}
        student={selectedStudent}
      />
    </div>
  )
}
