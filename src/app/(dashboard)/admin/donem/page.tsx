'use client'

import { useState } from 'react'
import { Plus, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock data
const MOCK_SEMESTERS = [
  {
    id: '1',
    name: '2024 ve 2025 Eğitim Öğretim Yılı 2.Dönem',
    startDate: '05.02.2025',
    endDate: '12.06.2026',
    isActive: false
  },
  {
    id: '2',
    name: '2024 ve 2025 Eğitim Öğretim Yılı 1.Dönem',
    startDate: '11.09.2024',
    endDate: '19.01.2025',
    isActive: false
  },
  {
    id: '3',
    name: '2023 ve 2024 Yaz Okulu',
    startDate: '01.07.2024',
    endDate: '30.08.2024',
    isActive: true
  }
]

export default function DonemPage() {
  const [selectedSemester, setSelectedSemester] = useState('2024 Güz Dönemi')
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false)
  const [semesterName, setSemesterName] = useState('')
  const [semesterYear, setSemesterYear] = useState('')
  const [openActionsId, setOpenActionsId] = useState<string | null>(null)

  const semesters = ['2024 Güz Dönemi', '2024 Bahar Dönemi', '2023 Yaz Okulu']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dönem</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            Excel
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Dönem Tanımla
          </Button>
        </div>
      </div>

      {/* Semester Selection & Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {/* Dropdown */}
        <div className="mb-6">
          <div className="relative w-64">
            <button
              onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedSemester}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showSemesterDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSemesterDropdown(false)}
                />
                <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
                  {semesters.map((semester) => (
                    <button
                      key={semester}
                      onClick={() => {
                        setSelectedSemester(semester)
                        setShowSemesterDropdown(false)
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      <span className={selectedSemester === semester ? 'text-primary font-medium' : ''}>
                        {semester}
                      </span>
                      {selectedSemester === semester && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="semester-name">Dönem Adı</Label>
            <Input
              id="semester-name"
              placeholder=""
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester-year">Dönem Yılı</Label>
            <div className="relative">
              <Input
                id="semester-year"
                placeholder=""
                value={semesterYear}
                onChange={(e) => setSemesterYear(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button>Temizle</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dönem Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dönem Başlangıç Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dönem Bitiş Tarihi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_SEMESTERS.map((semester) => (
                <tr key={semester.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{semester.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{semester.startDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{semester.endDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionsId(openActionsId === semester.id ? null : semester.id)}
                          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          İşlemler
                        </button>

                        {/* Actions Dropdown */}
                        {openActionsId === semester.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenActionsId(null)}
                            />
                            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-white shadow-lg">
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50">
                                <span>Düzenle</span>
                              </button>
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50">
                                <span>Aktif Et</span>
                              </button>
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50">
                                <span>Sil</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      {semester.isActive && (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Aktif
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
