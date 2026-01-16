'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit, AlertCircle, RefreshCw, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import { useSemesters } from '@/modules/donem/hooks/useSemesters'
import { AddCourseDialog } from '@/modules/courses/components/AddCourseDialog'
import { EditCourseDialog } from '@/modules/courses/components/EditCourseDialog'
import { DeleteCourseDialog } from '@/modules/courses/components/DeleteCourseDialog'
import { TeacherAssignmentsTable } from '@/modules/courses/components/TeacherAssignmentsTable'
import { AssignTeacherDialog } from '@/modules/courses/components/AssignTeacherDialog'
import type { Course } from '@/modules/courses/types'

export function AdminCoursesDashboard() {
  const [activeTab, setActiveTab] = useState('courses')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all')
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('all')

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

  const { data: semesters } = useSemesters()

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
        <h1 className="text-2xl font-bold">Ders Yönetimi</h1>
      </div>

      {/* Üst Bar - Arama, Filtreler ve Butonlar */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'courses' ? "Ders adı ile ara..." : "Öğretmen, ders veya sınıf ara..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {activeTab === 'assignments' && (
            <>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Ders Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Dersler</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Dönem Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Dönemler</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <div className="ml-auto">
            {activeTab === 'courses' ? (
              <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4" />
                Ders Ekle
              </Button>
            ) : (
              <Button className="gap-2" onClick={() => setShowAssignDialog(true)}>
                <UserPlus className="h-4 w-4" />
                Atama Ekle
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Sekmeler */}
        <div className="flex justify-center mb-0">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-t-xl rounded-b-none bg-gray-100 p-1.5 border border-b-0">
            <TabsTrigger 
              value="courses" 
              className="rounded-lg px-12 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Dersler
            </TabsTrigger>
            <TabsTrigger 
              value="assignments"
              className="rounded-lg px-12 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Öğretmen Atamaları
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tablo İçeriği */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <TabsContent value="courses" className="mt-0 p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Ders Adı</th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Ders bulunamadı</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{course.name}</p>
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
                              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
              <div className="border-t bg-gray-50/50 px-6 py-3">
                <p className="text-sm text-gray-500">
                  Toplam <span className="font-semibold text-gray-700">{filteredCourses.length}</span> ders
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="mt-0 p-0">
            <TeacherAssignmentsTable 
              searchQuery={searchQuery} 
              selectedCourseId={selectedCourseId}
              selectedSemesterId={selectedSemesterId}
            />
          </TabsContent>
        </div>
      </Tabs>

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

      <AssignTeacherDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        editingAssignment={null}
      />
    </div>
  )
}

