'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useSemesters } from '@/modules/donem/hooks/useSemesters'
import { AddDonemDialog } from '@/modules/donem/components/AddDonemDialog'
import { EditDonemDialog } from '@/modules/donem/components/EditDonemDialog'
import { DeleteDonemDialog } from '@/modules/donem/components/DeleteDonemDialog'
import type { Donem } from '@/modules/donem/types'

export function AdminDonemDashboard() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingDonem, setEditingDonem] = useState<Donem | null>(null)
  const [deletingDonem, setDeletingDonem] = useState<Donem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDateFilter, setStartDateFilter] = useState<string>('')
  const [endDateFilter, setEndDateFilter] = useState<string>('')

  const {
    data: semesters,
    isLoading,
    error,
    refetch,
    createSemester,
    updateSemester,
    deleteSemester,
    isCreating,
    isUpdating,
    isDeleting,
    isCreateSuccess,
    isUpdateSuccess,
    isDeleteSuccess,
    resetCreate,
    resetUpdate,
    resetDelete
  } = useSemesters()

  // Dialog açıldığında mutation'ları reset et
  useEffect(() => {
    if (showAddDialog) {
      resetCreate()
    }
  }, [showAddDialog, resetCreate])

  useEffect(() => {
    if (editingDonem) {
      resetUpdate()
    }
  }, [editingDonem, resetUpdate])

  // Başarılı işlem sonrası dialog'ları kapat
  useEffect(() => {
    if (isCreateSuccess && !isCreating) {
      setShowAddDialog(false)
      resetCreate()
    }
  }, [isCreateSuccess, isCreating, resetCreate])

  useEffect(() => {
    if (isUpdateSuccess && !isUpdating) {
      setEditingDonem(null)
      resetUpdate()
    }
  }, [isUpdateSuccess, isUpdating, resetUpdate])

  // Silme işlemi başarılı olduğunda dialog'u kapat
  useEffect(() => {
    if (isDeleteSuccess && !isDeleting && deletingDonem) {
      setDeletingDonem(null)
      resetDelete()
    }
  }, [isDeleteSuccess, isDeleting, deletingDonem, resetDelete])

  // Format date for display (YYYY-MM-DD to DD.MM.YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  // Filtreleme mantığı
  const filteredSemesters = semesters.filter((semester) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === '' ||
      semester.name.toLowerCase().includes(searchLower) ||
      semester.startDate.includes(searchQuery) ||
      semester.endDate.includes(searchQuery)

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && semester.isActive) ||
      (statusFilter === 'inactive' && !semester.isActive)

    const matchesDateRange =
      (startDateFilter === '' && endDateFilter === '') ||
      (() => {
        if (startDateFilter && endDateFilter && startDateFilter > endDateFilter) {
          return false
        }

        const semesterStart = new Date(semester.startDate)
        const semesterEnd = new Date(semester.endDate)
        semesterStart.setHours(0, 0, 0, 0)
        semesterEnd.setHours(23, 59, 59, 999)

        const filterStart = startDateFilter ? new Date(startDateFilter) : null
        const filterEnd = endDateFilter ? new Date(endDateFilter) : null

        if (filterStart && filterEnd) {
          filterStart.setHours(0, 0, 0, 0)
          filterEnd.setHours(23, 59, 59, 999)
          return semesterStart <= filterEnd && semesterEnd >= filterStart
        } else if (filterStart) {
          filterStart.setHours(0, 0, 0, 0)
          return semesterEnd >= filterStart
        } else if (filterEnd) {
          filterEnd.setHours(23, 59, 59, 999)
          return semesterStart <= filterEnd
        }

        return true
      })()

    return matchesSearch && matchesStatus && matchesDateRange
  })

  const handleDelete = (donem: Donem) => {
    setDeletingDonem(donem)
  }

  const confirmDelete = () => {
    if (deletingDonem) {
      deleteSemester(deletingDonem.id)
    }
  }

  const handleToggleActive = (donem: Donem) => {
    const newActiveState = !donem.isActive
    updateSemester({ 
      id: donem.id, 
      dto: { isActive: newActiveState } 
    })
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dönem</h1>
        </div>
        <div className="rounded-xl border bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bir hata oluştu</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dönemler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
              </p>
              <p className="mt-2 text-xs text-red-600">
                {error instanceof Error ? error.message : 'Bilinmeyen hata'}
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dönem</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="h-10 w-80 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Dönem Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Başlangıç</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Bitiş</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Durum</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-5 w-48 animate-pulse rounded bg-gray-200" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 animate-pulse rounded bg-gray-200" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 animate-pulse rounded bg-gray-200" /></td>
                    <td className="px-6 py-4 text-center"><div className="mx-auto h-6 w-16 animate-pulse rounded-full bg-gray-200" /></td>
                    <td className="px-6 py-4"><div className="mx-auto h-8 w-40 animate-pulse rounded bg-gray-200" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

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
          <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            Dönem Tanımla
          </Button>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Dönem adı veya tarih ile ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Başlangıç:</label>
              <Input
                type="date"
                className="w-auto min-w-[150px]"
                value={startDateFilter}
                max={endDateFilter || undefined}
                onChange={(e) => {
                  const value = e.target.value
                  if (endDateFilter && value > endDateFilter) {
                    setEndDateFilter('')
                  }
                  setStartDateFilter(value)
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Bitiş:</label>
              <Input
                type="date"
                className="w-auto min-w-[150px]"
                value={endDateFilter}
                min={startDateFilter || undefined}
                onChange={(e) => {
                  const value = e.target.value
                  if (startDateFilter && value < startDateFilter) {
                    setStartDateFilter('')
                  }
                  setEndDateFilter(value)
                }}
              />
            </div>
          </div>
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
                  Durum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSemesters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Arama kriterlerinize uygun dönem bulunamadı
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Lütfen farklı arama kriterleri deneyin
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSemesters.map((semester) => (
                  <tr key={semester.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{semester.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{formatDate(semester.startDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{formatDate(semester.endDate)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Checkbox
                          checked={semester.isActive}
                          onCheckedChange={() => handleToggleActive(semester)}
                          disabled={isUpdating}
                          className="cursor-pointer"
                        />
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            semester.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {semester.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDonem(semester)}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(semester)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Sil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kayıt Sayısı */}
        {filteredSemesters.length > 0 && (
          <div className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Toplam <span className="font-medium">{filteredSemesters.length}</span> dönem gösteriliyor
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddDonemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(data) => {
          createSemester(data)
        }}
        isLoading={isCreating}
      />

      <EditDonemDialog
        open={!!editingDonem}
        onOpenChange={(open) => {
          if (!open) {
            setEditingDonem(null)
          }
        }}
        donem={editingDonem}
        onSubmit={(id, data) => {
          updateSemester({ id, dto: data })
        }}
        isLoading={isUpdating}
        hasActiveSemester={semesters.some(s => s.isActive)}
      />

      <DeleteDonemDialog
        open={!!deletingDonem}
        onOpenChange={(open) => !open && setDeletingDonem(null)}
        donemName={deletingDonem?.name || ''}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

