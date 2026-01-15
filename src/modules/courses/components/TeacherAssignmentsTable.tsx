'use client'

import { useState } from 'react'
import { Search, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTeacherCourses } from '../hooks/useTeacherCourses'
import { AssignTeacherDialog } from './AssignTeacherDialog'
import type { TeacherCourse } from '../types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface TeacherAssignmentsTableProps {
  searchQuery?: string
  selectedCourseId?: string
  selectedSemesterId?: string
}

export function TeacherAssignmentsTable({ 
  searchQuery: externalSearchQuery,
  selectedCourseId: externalCourseId,
  selectedSemesterId: externalSemesterId
}: TeacherAssignmentsTableProps) {
  const [editingAssignment, setEditingAssignment] = useState<TeacherCourse | null>(null)
  const [deletingAssignment, setDeletingAssignment] = useState<TeacherCourse | null>(null)
  
  const searchQuery = externalSearchQuery || ''
  const selectedCourseId = externalCourseId || 'all'
  const selectedSemesterId = externalSemesterId || 'all'
  
  const {
    data: assignments,
    isLoading,
    updateTeacherCourse,
    deleteTeacherCourse,
    isUpdating,
    isDeleting
  } = useTeacherCourses({
    courseId: selectedCourseId !== 'all' ? selectedCourseId : undefined,
    semesterId: selectedSemesterId !== 'all' ? selectedSemesterId : undefined
  })

  const handleToggleActive = (assignment: TeacherCourse) => {
    updateTeacherCourse({ id: assignment.id, dto: { isActive: !assignment.isActive } })
  }

  const filteredAssignments = assignments.filter((assignment) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    const teacherName = `${assignment.teacher?.firstName || ''} ${assignment.teacher?.lastName || ''}`.toLowerCase()
    const courseName = assignment.course?.name?.toLowerCase() || ''
    const className = assignment.class?.name?.toLowerCase() || ''
    return teacherName.includes(searchLower) || courseName.includes(searchLower) || className.includes(searchLower)
  })

  const handleDelete = () => {
    if (deletingAssignment) {
      deleteTeacherCourse(deletingAssignment.id)
      setDeletingAssignment(null)
    }
  }

  if (isLoading) {
    return (
      <div>
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-gray-600">Öğretmen</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-gray-600">Ders</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-gray-600">Sınıf</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-gray-600">Dönem</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase text-gray-600">Durum</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase text-gray-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4"><div className="h-5 w-32 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-5 w-24 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-5 w-16 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="h-5 w-24 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="mx-auto h-6 w-20 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-6 py-4"><div className="mx-auto h-8 w-24 animate-pulse rounded bg-gray-200" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Öğretmen</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Ders</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Sınıf</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Dönem</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">Durum</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Atama bulunamadı</p>
                  </div>
                </td>
              </tr>
            ) : (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {assignment.teacher?.firstName} {assignment.teacher?.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{assignment.course?.name || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {assignment.class?.name || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{assignment.semester?.name || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={assignment.isActive}
                          onCheckedChange={() => handleToggleActive(assignment)}
                          disabled={isUpdating}
                        />
                        <span className={`text-xs font-medium ${assignment.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {assignment.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAssignment(assignment)}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingAssignment(assignment)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
      {filteredAssignments.length > 0 && (
        <div className="border-t bg-gray-50/50 px-6 py-3">
          <p className="text-sm text-gray-500">
            Toplam <span className="font-semibold text-gray-700">{filteredAssignments.length}</span> atama
          </p>
        </div>
      )}

      <AssignTeacherDialog
        open={!!editingAssignment}
        onOpenChange={(open) => !open && setEditingAssignment(null)}
        editingAssignment={editingAssignment}
      />

      <AlertDialog open={!!deletingAssignment} onOpenChange={(open) => !open && setDeletingAssignment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atamayı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu öğretmen atamasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

