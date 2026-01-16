'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, Calendar, User, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { homeworkService } from '@/lib/services/homework.service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AdminOdevTableProps {
  homeworks: any[]
  isLoading: boolean
}

export function AdminOdevTable({ homeworks, isLoading }: AdminOdevTableProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Sınıf ve öğretmen isimlerini çek
  const classIds = [...new Set(homeworks.map((hw: any) => hw.class_id).filter(Boolean))]
  const teacherIds = [...new Set(homeworks.map((hw: any) => hw.teacher_id).filter(Boolean))]

  const { data: classesData } = useQuery({
    queryKey: ['classes-for-homework', classIds],
    queryFn: async () => {
      if (classIds.length === 0) return []
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .in('id', classIds)
      if (error) throw error
      return data || []
    },
    enabled: classIds.length > 0
  })

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-for-homework', teacherIds],
    queryFn: async () => {
      if (teacherIds.length === 0) return []
      const { data, error } = await supabase
        .from('teachers')
        .select('id, user_id, users(id, first_name, last_name)')
        .in('id', teacherIds)
      if (error) throw error
      return (data || []).map((t: any) => ({
        id: t.id,
        firstName: t.users?.first_name || '',
        lastName: t.users?.last_name || ''
      }))
    },
    enabled: teacherIds.length > 0
  })

  const classesMap = new Map((classesData || []).map((c: any) => [c.id, c.name]))
  const teachersMap = new Map((teachersData || []).map((t: any) => [t.id, `${t.firstName} ${t.lastName}`]))

  const handleDelete = async () => {
    if (!deletingId) return
    
    setIsDeleting(true)
    try {
      await homeworkService.delete(deletingId)
      toast.success('Ödev başarıyla silindi')
      setDeletingId(null)
      queryClient.invalidateQueries({ queryKey: ['admin-homeworks'] })
    } catch (error: any) {
      toast.error(error.message || 'Ödev silinirken bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Başlık
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Sınıf
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Öğretmen
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Teslim Tarihi
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Durum
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {homeworks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-4">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Ödev bulunamadı</p>
                  </div>
                </td>
              </tr>
            ) : (
              homeworks.map((homework: any) => {
                const isOverdue = homework.due_date && new Date(homework.due_date) < new Date()
                const isActive = homework.is_active

                return (
                  <tr key={homework.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{homework.title || '-'}</p>
                        {homework.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {homework.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {classesMap.get(homework.class_id) || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {teachersMap.get(homework.teacher_id) || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(homework.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {isOverdue && isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                            Süresi Geçti
                          </span>
                        ) : isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Pasif
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/odevler/${homework.id}`)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/odevler/${homework.id}/edit`)}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingId(homework.id)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {homeworks.length > 0 && (
        <div className="border-t bg-gray-50/50 px-6 py-3">
          <p className="text-sm text-gray-500">
            Toplam <span className="font-semibold text-gray-700">{homeworks.length}</span> ödev
          </p>
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ödevi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu ödevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
    </>
  )
}

