'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import { AddCourseDialog } from '@/modules/courses/components/AddCourseDialog'
import { EditCourseDialog } from '@/modules/courses/components/EditCourseDialog'
import { DeleteCourseDialog } from '@/modules/courses/components/DeleteCourseDialog'
import type { Course } from '@/modules/courses/types'

export function AdminCoursesDashboard() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: courses,
    isLoading,
    error,
    refetch,
    createCourse,
    updateCourse,
    deleteCourse,
    isCreating,
    isUpdating,
    isDeleting,
    isCreateSuccess,
    isUpdateSuccess,
    isDeleteSuccess,
    resetCreate,
    resetUpdate,
    resetDelete
  } = useCourses()

  useEffect(() => {
    if (showAddDialog) resetCreate()
  }, [showAddDialog, resetCreate])

  useEffect(() => {
    if (editingCourse) resetUpdate()
  }, [editingCourse, resetUpdate])

  useEffect(() => {
    if (isCreateSuccess && !isCreating) {
      setShowAddDialog(false)
      resetCreate()
    }
  }, [isCreateSuccess, isCreating, resetCreate])

  useEffect(() => {
    if (isUpdateSuccess && !isUpdating) {
      setEditingCourse(null)
      resetUpdate()
    }
  }, [isUpdateSuccess, isUpdating, resetUpdate])

  useEffect(() => {
    if (isDeleteSuccess && !isDeleting && deletingCourse) {
      setDeletingCourse(null)
      resetDelete()
    }
  }, [isDeleteSuccess, isDeleting, deletingCourse, resetDelete])

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase()
    return searchQuery === '' || course.name.toLowerCase().includes(searchLower)
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dersler</h1>
        </div>
        <div className="rounded-xl border bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bir hata oluştu</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dersler yüklenirken bir hata oluştu.
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
          <h1 className="text-2xl font-bold">Dersler</h1>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="h-10 w-80 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Ders Adı</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="h-5 w-40 animate-pulse rounded bg-gray-200" /></td>
                  <td className="px-6 py-4"><div className="mx-auto h-8 w-40 animate-pulse rounded bg-gray-200" /></td>
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
        <h1 className="text-2xl font-bold">Dersler</h1>
        <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Ders Ekle
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ders adı ile ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Ders Adı</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">Ders bulunamadı</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{course.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingCourse(course)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingCourse(course)}
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
        {filteredCourses.length > 0 && (
          <div className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Toplam <span className="font-medium">{filteredCourses.length}</span> ders
            </p>
          </div>
        )}
      </div>

      <AddCourseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={createCourse}
        isLoading={isCreating}
      />

      <EditCourseDialog
        open={!!editingCourse}
        onOpenChange={(open) => !open && setEditingCourse(null)}
        course={editingCourse}
        onSubmit={(id, data) => updateCourse({ id, dto: data })}
        isLoading={isUpdating}
      />

      <DeleteCourseDialog
        open={!!deletingCourse}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
        courseName={deletingCourse?.name || ''}
        onConfirm={() => deletingCourse && deleteCourse(deletingCourse.id)}
        isLoading={isDeleting}
      />
    </div>
  )
}

