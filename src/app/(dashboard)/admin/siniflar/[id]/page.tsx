'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Search, AlertCircle, RefreshCw, Loader2, UserMinus, ChevronRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useClassStudents } from '@/modules/classes/hooks/useClassStudents'
import { classService } from '@/modules/classes/services/class.service'
import { useQuery } from '@tanstack/react-query'

export default function ManageClassPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedClassStudents, setSelectedClassStudents] = useState<string[]>([])

  const { data: classItem, isLoading: isLoadingClass, error: classError } = useQuery({
    queryKey: ['class', id],
    queryFn: () => classService.getById(id)
  })

  const {
    students,
    availableStudents,
    isLoading,
    isLoadingAvailable,
    error,
    refetch,
    addStudent,
    removeStudent,
    isAdding,
    isRemoving
  } = useClassStudents(id)

  // Sınıfsız öğrencileri filtrele (class_id = null olan)
  const unassignedStudents = availableStudents.filter(s => !s.currentClassId)
  
  const filteredUnassigned = unassignedStudents.filter((student) => {
    const searchLower = leftSearch.toLowerCase()
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
    return leftSearch === '' ||
      fullName.includes(searchLower) ||
      student.studentNo.toLowerCase().includes(searchLower)
  })

  const filteredClassStudents = students.filter((student) => {
    const searchLower = rightSearch.toLowerCase()
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
    return rightSearch === '' ||
      fullName.includes(searchLower) ||
      student.studentNo.toLowerCase().includes(searchLower)
  })

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId])
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredUnassigned.map(s => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleTransferSelected = async () => {
    for (const studentId of selectedStudents) {
      addStudent({ studentId, classId: id })
    }
    setSelectedStudents([])
  }

  const handleSelectClassStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedClassStudents(prev => [...prev, studentId])
    } else {
      setSelectedClassStudents(prev => prev.filter(id => id !== studentId))
    }
  }

  const handleSelectAllClassStudents = (checked: boolean) => {
    if (checked) {
      setSelectedClassStudents(filteredClassStudents.map(s => s.studentId))
    } else {
      setSelectedClassStudents([])
    }
  }

  const handleRemoveSelected = async () => {
    for (const studentId of selectedClassStudents) {
      removeStudent(studentId)
    }
    setSelectedClassStudents([])
  }

  if (classError || error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold">Sınıf Yönetimi</h1>
        </div>
        <div className="rounded-xl border bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bir hata oluştu</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sınıf bilgileri yüklenirken bir hata oluştu.
              </p>
            </div>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoadingClass) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border bg-white shadow-sm p-6 h-[600px] animate-pulse bg-gray-100" />
          <div className="rounded-xl border bg-white shadow-sm p-6 h-[600px] animate-pulse bg-gray-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/siniflar')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{classItem?.name} Sınıfı</h1>
          <p className="text-sm text-muted-foreground">
            {classItem?.grade}. Sınıf • {students.length} Öğrenci
          </p>
        </div>
      </div>

      {/* İki Panel */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sol Panel - Sınıfsız Öğrenciler */}
        <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                Tüm Öğrenciler
                <span className="text-sm font-normal text-muted-foreground">
                  ({unassignedStudents.length})
                </span>
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ara..."
                className="pl-10"
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tümünü Seç & Aktar */}
          {filteredUnassigned.length > 0 && (
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedStudents.length === filteredUnassigned.length && filteredUnassigned.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                Tümünü Seç
              </label>
              <Button
                size="sm"
                onClick={handleTransferSelected}
                disabled={selectedStudents.length === 0 || isAdding}
                className="gap-2"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Aktar ({selectedStudents.length})
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isLoadingAvailable ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUnassigned.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Users className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {leftSearch ? 'Arama sonucu bulunamadı' : 'Sınıfsız öğrenci yok'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredUnassigned.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium text-sm">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.studentNo}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel - Sınıf Öğrencileri */}
        <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {classItem?.name} Öğrencileri
                <span className="text-sm font-normal text-muted-foreground">
                  ({students.length})
                </span>
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ara..."
                className="pl-10"
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tümünü Seç & Kaldır */}
          {filteredClassStudents.length > 0 && (
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedClassStudents.length === filteredClassStudents.length && filteredClassStudents.length > 0}
                  onCheckedChange={handleSelectAllClassStudents}
                />
                Tümünü Seç
              </label>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveSelected}
                disabled={selectedClassStudents.length === 0 || isRemoving}
                className="gap-2"
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserMinus className="h-4 w-4" />
                )}
                Kaldır ({selectedClassStudents.length})
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                      <div className="space-y-1">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : filteredClassStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Users className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {rightSearch ? 'Arama sonucu bulunamadı' : 'Bu sınıfta öğrenci yok'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Soldan öğrenci seçip aktarabilirsiniz
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredClassStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedClassStudents.includes(student.studentId)}
                      onCheckedChange={(checked) => handleSelectClassStudent(student.studentId, checked as boolean)}
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.studentNo}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {filteredClassStudents.length > 0 && (
            <div className="border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {filteredClassStudents.length} öğrenci gösteriliyor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
