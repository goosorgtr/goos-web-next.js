'use client'

import { useState } from 'react'
import { Eye, Edit, ChevronDown, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradeDetailDialog } from '@/components/admin/notlar/GradeDetailDialog'
import { EditGradeDialog } from '@/components/admin/notlar/EditGradeDialog'


// Mock data
const MOCK_GRADES = [
  {
    id: '1',
    studentName: 'Ahmet Yılmaz',
    studentId: '2024001',
    avatar: 'AY',
    avatarColor: 'bg-blue-500',
    assessment: 'Ara Sınav',
    score: 85,
    maxScore: 100,
    class: '10-A Sınıfı',
    subject: 'Matematik'
  },
  {
    id: '2',
    studentName: 'Ayşe Demir',
    studentId: '2024045',
    avatar: 'AD',
    avatarColor: 'bg-purple-500',
    assessment: 'Dönem Projesi',
    score: 92,
    maxScore: 100,
    class: '10-A Sınıfı',
    subject: 'Fizik'
  },
  {
    id: '3',
    studentName: 'Mehmet Kaya',
    studentId: '2024102',
    avatar: 'MK',
    avatarColor: 'bg-orange-500',
    assessment: 'Laboratuvar Raporu 3',
    score: null,
    maxScore: 50,
    class: '9-B Sınıfı',
    subject: 'Kimya'
  },
  {
    id: '4',
    studentName: 'Zeynep Şahin',
    studentId: '2024088',
    avatar: 'ZŞ',
    avatarColor: 'bg-green-500',
    assessment: 'Okuma Sınavı',
    score: 18,
    maxScore: 20,
    class: '11-A Sınıfı',
    subject: 'İngilizce'
  }
]

const CLASSES = ['9-A Sınıfı', '9-B Sınıfı', '10-A Sınıfı', '10-B Sınıfı', '11-A Sınıfı']
const CLASS_GRADES = ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf']
const SUBJECTS = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'İngilizce']
const BRANCHES = ['A', 'B', 'C', 'D', 'E', 'F']

export default function DersNotlariPage() {
  const [grades, setGrades] = useState(MOCK_GRADES)
  const [selectedClass, setSelectedClass] = useState('10-A Sınıfı')
  const [selectedSubject, setSelectedSubject] = useState('Matematik')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedUploadClass, setSelectedUploadClass] = useState('')
  const [selectedUploadSubject, setSelectedUploadSubject] = useState('')
  const [studentSearch, setStudentSearch] = useState('')
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const [showUploadClassDropdown, setShowUploadClassDropdown] = useState(false)
  const [showUploadSubjectDropdown, setShowUploadSubjectDropdown] = useState(false)
  const [showBranchDropdown, setShowBranchDropdown] = useState(false)

  // Dialog states
  const [selectedGrade, setSelectedGrade] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleSaveGrade = (gradeId: string, newScore: number | null) => {
    setGrades(currentGrades =>
      currentGrades.map(g =>
        g.id === gradeId ? { ...g, score: newScore } : g
      )
    )
  }

  const handleReset = () => {
    setSelectedClass('')
    setSelectedSubject('')
    setStudentSearch('')
  }

  const filteredGrades = grades.filter(grade => {
    // Sınıf filtresi
    if (selectedClass && grade.class !== selectedClass) return false

    // Ders filtresi
    if (selectedSubject && grade.subject !== selectedSubject) return false

    // Öğrenci arama filtresi
    if (studentSearch) {
      const searchLower = studentSearch.toLowerCase()
      const nameMatch = grade.studentName.toLowerCase().includes(searchLower)
      const idMatch = grade.studentId.includes(searchLower)
      if (!nameMatch && !idMatch) return false
    }

    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Not Yönetimi</h1>
        <p className="text-sm text-muted-foreground">
          Öğrenci notlarını, değerlendirmeleri ve geçmiş akademik kayıtları görüntüleyin ve yönetin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        {/* Sol Taraf - Kayıtları Filtrele */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Kayıtları Filtrele</h2>

          <div className="space-y-4">
            {/* Sınıf */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">SINIF</Label>
              <div className="relative">
                <button
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span className={selectedClass ? '' : 'text-muted-foreground'}>
                    {selectedClass || 'Tüm Sınıflar'}
                  </span>
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

            {/* Ders */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">DERS</Label>
              <div className="relative">
                <button
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span className={selectedSubject ? '' : 'text-muted-foreground'}>
                    {selectedSubject || 'Tüm Dersler'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showSubjectDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSubjectDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                      {SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            setSelectedSubject(subject)
                            setShowSubjectDropdown(false)
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Öğrenci */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">ÖĞRENCİ</Label>
              <Input
                placeholder="İsim veya ID"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            {/* Butonlar */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Sıfırla
              </Button>
              <Button className="flex-1 gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtreleri Uygula
              </Button>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Not Yükleme */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Not Yükleme</h2>

          <div className="space-y-4">
            {/* Sınıf Seç */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">SINIF SEÇ</Label>
              <div className="relative">
                <button
                  onClick={() => setShowUploadClassDropdown(!showUploadClassDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span className={selectedUploadClass ? '' : 'text-muted-foreground'}>
                    {selectedUploadClass || 'Sınıf seçin...'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showUploadClassDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUploadClassDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                      {CLASS_GRADES.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setSelectedUploadClass(cls)
                            setShowUploadClassDropdown(false)
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

            {/* Şube Seç */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">ŞUBE SEÇ</Label>
              <div className="relative">
                <button
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span className={selectedBranch ? '' : 'text-muted-foreground'}>
                    {selectedBranch || 'Şube seçin...'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showBranchDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBranchDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
                      {BRANCHES.map((branch) => (
                        <button
                          key={branch}
                          onClick={() => {
                            setSelectedBranch(branch)
                            setShowBranchDropdown(false)
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                        >
                          {branch}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Ders Seç (Upload) */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">DERS SEÇ</Label>
              <div className="relative">
                <button
                  onClick={() => setShowUploadSubjectDropdown(!showUploadSubjectDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <span className={selectedUploadSubject ? '' : 'text-muted-foreground'}>
                    {selectedUploadSubject || 'Ders seçin...'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showUploadSubjectDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUploadSubjectDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                      {SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            setSelectedUploadSubject(subject)
                            setShowUploadSubjectDropdown(false)
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Not Excel Dosyası Yükleme Alanı */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">
                NOT EXCEL DOSYASI YÜKLEME ALANI
              </Label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-primary">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="mb-1 text-sm font-medium">
                  Dosya yükle veya sürükleyip bırakın
                </p>
                <p className="text-xs text-muted-foreground">
                  XLSX, CSV 5MB'a kadar
                </p>
              </div>
            </div>

            {/* Dosyayı Yükle Butonu */}
            <Button className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Dosyayı Yükle
            </Button>
          </div>
        </div>
      </div>

      {/* Not Girişleri Tablosu */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Not Girişleri</h2>
          <p className="text-sm text-muted-foreground">Son 24 giriş gösteriliyor</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İşlemler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sınıf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Branş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Değerlendirme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Puan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    {/* İşlemler */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedGrade(grade)
                            setIsViewOpen(true)
                          }}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGrade(grade)
                            setIsEditOpen(true)
                          }}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                    {/* Öğrenci */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${grade.avatarColor} text-sm font-semibold text-white`}>
                          {grade.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{grade.studentName}</p>
                          <p className="text-sm text-muted-foreground">ID: {grade.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Sınıf */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{grade.class}</p>
                    </td>

                    {/* Branş */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{grade.subject}</p>
                    </td>

                    {/* Değerlendirme */}
                    <td className="px-6 py-4">
                      <p className="text-sm">{grade.assessment}</p>
                    </td>

                    {/* Puan */}
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold">
                        {grade.score !== null ? (
                          <>
                            {grade.score} <span className="text-sm font-normal text-muted-foreground">/{grade.maxScore}</span>
                          </>
                        ) : (
                          <>
                            - <span className="text-sm font-normal text-muted-foreground">/{grade.maxScore}</span>
                          </>
                        )}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    Kayıt bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            Tüm Girişleri Görüntüle
          </button>
        </div>
      </div>
      <GradeDetailDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        grade={selectedGrade}
      />

      <EditGradeDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        grade={selectedGrade}
        onSave={handleSaveGrade}
      />
    </div>
  )
}
