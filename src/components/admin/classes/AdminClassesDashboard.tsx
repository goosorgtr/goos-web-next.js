'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2, Edit, AlertCircle, RefreshCw, Users, Loader2, Filter, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useClasses } from '@/modules/classes/hooks/useClasses'
import { AddClassDialog } from '@/modules/classes/components/AddClassDialog'
import { EditClassDialog } from '@/modules/classes/components/EditClassDialog'
import { DeleteClassDialog } from '@/modules/classes/components/DeleteClassDialog'
import type { ClassItem } from '@/modules/classes/types'

export function AdminClassesDashboard() {
  const router = useRouter()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [gradeFilter, setGradeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [studentCountFilter, setStudentCountFilter] = useState<string>('all')

  const {
    data: classes,
    isLoading,
    error,
    refetch,
    createClass,
    updateClass,
    deleteClass,
    isCreating,
    isUpdating,
    isDeleting,
    isCreateSuccess,
    isUpdateSuccess,
    isDeleteSuccess,
    resetCreate,
    resetUpdate,
    resetDelete
  } = useClasses()

  useEffect(() => {
    if (showAddDialog) resetCreate()
  }, [showAddDialog, resetCreate])

  useEffect(() => {
    if (editingClass) resetUpdate()
  }, [editingClass, resetUpdate])

  useEffect(() => {
    if (isCreateSuccess && !isCreating) {
      setShowAddDialog(false)
      resetCreate()
    }
  }, [isCreateSuccess, isCreating, resetCreate])

  useEffect(() => {
    if (isUpdateSuccess && !isUpdating) {
      setEditingClass(null)
      resetUpdate()
    }
  }, [isUpdateSuccess, isUpdating, resetUpdate])

  useEffect(() => {
    if (isDeleteSuccess && !isDeleting && deletingClass) {
      setDeletingClass(null)
      resetDelete()
    }
  }, [isDeleteSuccess, isDeleting, deletingClass, resetDelete])

  const filteredClasses = classes.filter((cls) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === '' || cls.name.toLowerCase().includes(searchLower)
    const matchesGrade = gradeFilter === 'all' || cls.grade === parseInt(gradeFilter)
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && cls.isActive) || 
      (statusFilter === 'inactive' && !cls.isActive)
    const matchesStudentCount = studentCountFilter === 'all' ||
      (studentCountFilter === 'empty' && (cls.studentCount ?? 0) === 0) ||
      (studentCountFilter === 'hasStudents' && (cls.studentCount ?? 0) > 0)
    return matchesSearch && matchesGrade && matchesStatus && matchesStudentCount
  })

  const uniqueGrades = [...new Set(classes.map(c => c.grade))].sort((a, b) => a - b)

  const handleToggleActive = (cls: ClassItem) => {
    updateClass({ id: cls.id, dto: { isActive: !cls.isActive } })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredClasses.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id))
    }
  }

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true)
    for (const id of selectedIds) {
      deleteClass(id)
    }
    setSelectedIds([])
    setIsBulkDeleting(false)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sınıflar</h1>
        </div>
        <div className="rounded-xl border bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bir hata oluştu</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sınıflar yüklenirken bir hata oluştu.
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sınıflar</h1>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="h-10 w-80 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Sınıf Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Seviye</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="h-5 w-32 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-16 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="mx-auto h-8 w-56 animate-pulse rounded bg-gray-200" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sınıflar</h1>
        <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Sınıf Ekle
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Sınıf adı ile ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtreler:</span>
          </div>
          
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Seviye" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Seviyeler</SelectItem>
              {uniqueGrades.map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  {grade}. Sınıf
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={studentCountFilter} onValueChange={setStudentCountFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Mevcudu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Mevcutlar</SelectItem>
              <SelectItem value="empty">Boş Sınıflar</SelectItem>
              <SelectItem value="hasStudents">Öğrencili</SelectItem>
            </SelectContent>
          </Select>

          {(gradeFilter !== 'all' || statusFilter !== 'all' || studentCountFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGradeFilter('all')
                setStatusFilter('all')
                setStudentCountFilter('all')
              }}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Filtreleri Temizle
            </Button>
          )}

          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="gap-2 ml-auto"
            >
              {isBulkDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {selectedIds.length} Sınıf Sil
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 w-12">
                  <Checkbox
                    checked={selectedIds.length === filteredClasses.length && filteredClasses.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Sınıf Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Seviye</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Mevcudu</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Durum</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">Sınıf bulunamadı</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(cls.id)}
                        onCheckedChange={(checked) => handleSelectOne(cls.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{cls.name}</p>
                    </td>
<td className="px-6 py-4">
                                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                        {cls.grade}. Sınıf
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="inline-flex items-center gap-1 text-sm font-medium">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        {cls.studentCount ?? 0}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <Switch
                                          checked={cls.isActive}
                                          onCheckedChange={() => handleToggleActive(cls)}
                                          disabled={isUpdating}
                                        />
                                        <span className={`text-xs font-medium ${cls.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                          {cls.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => router.push(`/admin/siniflar/${cls.id}`)} 
                          className="gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Yönet
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingClass(cls)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingClass(cls)}
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
        {filteredClasses.length > 0 && (
          <div className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Toplam <span className="font-medium">{filteredClasses.length}</span> sınıf
            </p>
          </div>
        )}
      </div>

      <AddClassDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={createClass}
        isLoading={isCreating}
      />

      <EditClassDialog
        open={!!editingClass}
        onOpenChange={(open) => !open && setEditingClass(null)}
        classItem={editingClass}
        onSubmit={(id, data) => updateClass({ id, dto: data })}
        isLoading={isUpdating}
      />

      <DeleteClassDialog
        open={!!deletingClass}
        onOpenChange={(open) => !open && setDeletingClass(null)}
        className={deletingClass?.name || ''}
        onConfirm={() => deletingClass && deleteClass(deletingClass.id)}
        isLoading={isDeleting}
      />
    </div>
  )
}
