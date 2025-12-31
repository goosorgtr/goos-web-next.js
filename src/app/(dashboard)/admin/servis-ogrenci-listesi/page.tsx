'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Mock data
const MOCK_ALL_STUDENTS = [
  { id: '1', name: 'Ahmet Yılmaz', class: '5/A' },
  { id: '2', name: 'Zeynep Kaya', class: '3/B' },
  { id: '3', name: 'Mehmet Can', class: '8/C' },
  { id: '4', name: 'Elif Demir', class: '2/A' },
  { id: '5', name: 'Mustafa Arslan', class: '7/B' }
]

const MOCK_ASSIGNED_STUDENTS = [
  { id: '6', name: 'Ayşe Fatma', class: '6/C' },
  { id: '7', name: 'Ali Veli', class: '4/D' }
]

export default function ServisOgrenciListesiPage() {
  const [selectedVehicle, setSelectedVehicle] = useState('Servis 1 - 34 ABC 123 (Kadiköy Güzergahı)')
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)
  const [searchAll, setSearchAll] = useState('')
  const [searchAssigned, setSearchAssigned] = useState('')
  const [selectedAllStudents, setSelectedAllStudents] = useState<string[]>([])
  const [selectedAssignedStudents, setSelectedAssignedStudents] = useState<string[]>([])

  const toggleAllStudent = (id: string) => {
    setSelectedAllStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const toggleAssignedStudent = (id: string) => {
    setSelectedAssignedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const toggleAllCheckboxAll = () => {
    setSelectedAllStudents(prev =>
      prev.length === MOCK_ALL_STUDENTS.length ? [] : MOCK_ALL_STUDENTS.map(s => s.id)
    )
  }

  const toggleAllCheckboxAssigned = () => {
    setSelectedAssignedStudents(prev =>
      prev.length === MOCK_ASSIGNED_STUDENTS.length ? [] : MOCK_ASSIGNED_STUDENTS.map(s => s.id)
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Yönetim Paneli</span>
        <span>›</span>
        <span className="font-medium text-foreground">Okul Aracına Öğrenci Atama</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Okul Aracına Öğrenci Atama</h1>
          <p className="text-sm text-muted-foreground">
            Servis araçlarını yönetin ve öğrenci listelerini düzenleyin.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
          <HelpCircle className="h-4 w-4" />
          Yardım
        </button>
      </div>

      {/* Araç Seçimi */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium">Araç Seçimi</label>
          <div className="relative">
            <button
              onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
              className="flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-left hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="flex-1">{selectedVehicle}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showVehicleDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowVehicleDropdown(false)}
                />
                <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
                  <button
                    onClick={() => {
                      setSelectedVehicle('Servis 1 - 34 ABC 123 (Kadiköy Güzergahı)')
                      setShowVehicleDropdown(false)
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-50"
                  >
                    Servis 1 - 34 ABC 123 (Kadiköy Güzergahı)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicle('Servis 2 - 34 XYZ 456 (Üsküdar Güzergahı)')
                      setShowVehicleDropdown(false)
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-50"
                  >
                    Servis 2 - 34 XYZ 456 (Üsküdar Güzergahı)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* İki Panel - Tüm Öğrenciler & Araca Atanmış Öğrenciler */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sol Panel - Tüm Öğrenciler */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Tüm Öğrenciler</h2>
            <p className="text-sm text-muted-foreground">Henüz atanmamış öğrencileri seçiniz</p>
          </div>

          <div className="p-6">
            {/* Arama */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="İsim, sınıf veya ID ile ara..."
                value={searchAll}
                onChange={(e) => setSearchAll(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedAllStudents.length === MOCK_ALL_STUDENTS.length}
                        onChange={toggleAllCheckboxAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ÖĞRENCİ ADI
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      SINIF
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MOCK_ALL_STUDENTS
                    .filter(student =>
                      student.name.toLowerCase().includes(searchAll.toLowerCase()) ||
                      student.class.toLowerCase().includes(searchAll.toLowerCase()) ||
                      student.id.includes(searchAll)
                    )
                    .map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedAllStudents.includes(student.id)}
                            onChange={() => toggleAllStudent(student.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{student.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{student.class}</p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Butonlar */}
            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1 gap-2"
                disabled={selectedAllStudents.length === 0}
              >
                Ekle
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={selectedAssignedStudents.length === 0}
              >
                Çıkar
              </Button>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Araca Atanmış Öğrenciler */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Araca Atanmış Öğrenciler</h2>
                <p className="text-sm text-muted-foreground">Bu servisi kullanacak öğrenciler</p>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                {MOCK_ASSIGNED_STUDENTS.length} Öğrenci
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Arama */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="İsim, sınıf veya ID ile ara..."
                value={searchAssigned}
                onChange={(e) => setSearchAssigned(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedAssignedStudents.length === MOCK_ASSIGNED_STUDENTS.length}
                        onChange={toggleAllCheckboxAssigned}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ÖĞRENCİ ADI
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      SINIF
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MOCK_ASSIGNED_STUDENTS
                    .filter(student =>
                      student.name.toLowerCase().includes(searchAssigned.toLowerCase()) ||
                      student.class.toLowerCase().includes(searchAssigned.toLowerCase()) ||
                      student.id.includes(searchAssigned)
                    )
                    .map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedAssignedStudents.includes(student.id)}
                            onChange={() => toggleAssignedStudent(student.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{student.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{student.class}</p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Butonlar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="px-8">
          İptal
        </Button>
        <Button className="px-8">
          Kaydet
        </Button>
      </div>
    </div>
  )
}
