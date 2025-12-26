'use client'

import { useState } from 'react'
import { Download, Plus, ChevronDown, Edit, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Mock data
const MOCK_ATTENDANCE = [
  {
    id: '1',
    studentName: 'Ahmet Yılmaz',
    studentId: '2024045',
    avatar: 'AY',
    avatarColor: 'bg-blue-500',
    class: '10-A Sınıfı',
    date: '24 Kas 2024',
    status: 'absent',
    entryTime: null
  },
  {
    id: '2',
    studentName: 'Ayşe Kaya',
    studentId: '2024115',
    avatar: 'AK',
    avatarColor: 'bg-green-500',
    class: '9-A Sınıfı',
    date: '24 Kas 2024',
    status: 'absent',
    entryTime: null
  },
  {
    id: '3',
    studentName: 'Mehmet Çelik',
    studentId: '2024189',
    avatar: 'MÇ',
    avatarColor: 'bg-blue-600',
    class: '11-B Sınıfı',
    date: '24 Kas 2024',
    status: 'absent',
    entryTime: null
  }
]

const CLASSES = ['Tüm Sınıflar', '9-A Sınıfı', '9-B Sınıfı', '10-A Sınıfı', '10-B Sınıfı', '11-A Sınıfı', '11-B Sınıfı']
const STATUS_OPTIONS = ['Yok', 'Geç', 'İzinli', 'Var']

export default function DevamsizlikPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('Tüm Sınıflar')
  const [selectedStatus, setSelectedStatus] = useState('Yok')
  const [selectedDate, setSelectedDate] = useState('24 Kas 2024')
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === MOCK_ATTENDANCE.length ? [] : MOCK_ATTENDANCE.map(a => a.id)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Devamsızlık Listesi</h1>
          <p className="text-sm text-muted-foreground">
            Öğrenci devamsızlık kayıtlarını yönetin ve görüntüleyin.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Dışa Aktar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Devamsızlık Ekle
          </Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Günlük Katılım Oranı */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Günlük Katılım Oranı</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">94.2%</p>
            <span className="mb-1 text-sm font-medium text-green-600">+1.2%</span>
          </div>
        </div>

        {/* Bugün Gelenler */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Bugün Gelenler</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">1,168</p>
            <span className="mb-1 text-sm text-muted-foreground">Öğrenci</span>
          </div>
        </div>

        {/* Devamsız */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span>Devamsız</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">42</p>
            <span className="mb-1 text-sm font-medium text-red-600">Yüksek</span>
          </div>
        </div>

        {/* Geç Kalanlar */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
            <span>Geç Kalanlar</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">30</p>
            <span className="mb-1 text-sm text-muted-foreground">Öğrenci</span>
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div className="rounded-xl border bg-white shadow-sm">
        {/* Filtreler */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          {/* Arama */}
          <div className="flex-1">
            <Input
              placeholder="İsim veya ID ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Sınıf Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
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
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-white shadow-lg">
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

          {/* Durum Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              <span>{selectedStatus}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showStatusDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border bg-white shadow-lg">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status)
                        setShowStatusDropdown(false)
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tarih */}
          <div className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{selectedDate}</span>
          </div>

          {/* Filtre Butonu */}
          <button className="rounded-lg border p-2 hover:bg-gray-50">
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Tablo İçeriği */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === MOCK_ATTENDANCE.length}
                    onChange={toggleAllRows}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ÖĞRENCİ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  SINIF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  TARİH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  DURUM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  GİRİŞ SAATİ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İŞLEMLER
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_ATTENDANCE.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(record.id)}
                      onChange={() => toggleRowSelection(record.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>

                  {/* Öğrenci */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${record.avatarColor} text-sm font-semibold text-white`}>
                        {record.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{record.studentName}</p>
                        <p className="text-sm text-muted-foreground">ID: {record.studentId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Sınıf */}
                  <td className="px-6 py-4">
                    <p className="text-sm">{record.class}</p>
                  </td>

                  {/* Tarih */}
                  <td className="px-6 py-4">
                    <p className="text-sm">{record.date}</p>
                  </td>

                  {/* Durum */}
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Yok
                    </span>
                  </td>

                  {/* Giriş Saati */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">-- : --</p>
                  </td>

                  {/* İşlemler */}
                  <td className="px-6 py-4">
                    <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t p-4">
          <p className="text-sm text-muted-foreground">
            42 kayıttan <span className="font-medium">1-3</span> arası gösteriliyor
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              ‹
            </button>
            <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white">
              1
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              2
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              3
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:bg-gray-50">
              ...
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
