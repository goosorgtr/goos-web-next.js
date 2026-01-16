'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar, User, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

interface OdevDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  homework: any | null
}

export function OdevDetailDialog({ open, onOpenChange, homework }: OdevDetailDialogProps) {
  if (!homework) return null

  // Sınıf bilgisini çek
  const { data: classData } = useQuery({
    queryKey: ['class-detail', homework.classId],
    queryFn: async () => {
      if (!homework.classId) return null
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, grade')
        .eq('id', homework.classId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!homework.classId && open
  })

  // Öğretmen bilgisini çek
  const { data: teacherData } = useQuery({
    queryKey: ['teacher-detail', homework.teacherId],
    queryFn: async () => {
      if (!homework.teacherId) return null
      const { data, error } = await supabase
        .from('teachers')
        .select('id, user_id, users(id, first_name, last_name)')
        .eq('id', homework.teacherId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!homework.teacherId && open
  })

  // Ders bilgisini çek
  const { data: courseData } = useQuery({
    queryKey: ['course-detail', homework.courseId],
    queryFn: async () => {
      if (!homework.courseId) return null
      const { data, error } = await supabase
        .from('courses')
        .select('id, name')
        .eq('id', homework.courseId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!homework.courseId && open
  })

  // Dönem bilgisini çek
  const { data: semesterData } = useQuery({
    queryKey: ['semester-detail', homework.semesterId],
    queryFn: async () => {
      if (!homework.semesterId) return null
      const { data, error } = await supabase
        .from('semesters')
        .select('id, name')
        .eq('id', homework.semesterId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!homework.semesterId && open
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOverdue = homework.dueDate && new Date(homework.dueDate) < new Date()
  const isActive = homework.isActive

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ödev Detayı</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Başlık ve Durum */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-gray-900">{homework.title || '-'}</h3>
              <div className="flex items-center gap-2">
                {isOverdue && isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                    <Clock className="h-3 w-3" />
                    Süresi Geçti
                  </span>
                ) : isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    <XCircle className="h-3 w-3" />
                    Pasif
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Açıklama */}
          {homework.description && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Açıklama</Label>
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{homework.description}</p>
              </div>
            </div>
          )}

          {/* Bilgiler Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Sınıf */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Sınıf
              </Label>
              <p className="font-medium text-gray-900">
                {classData?.name || '-'}
                {classData?.grade && ` (${classData.grade}. Sınıf)`}
              </p>
            </div>

            {/* Öğretmen */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <User className="h-3 w-3" />
                Öğretmen
              </Label>
              <p className="font-medium text-gray-900">
                {teacherData?.users 
                  ? `${teacherData.users.first_name} ${teacherData.users.last_name}`
                  : '-'}
              </p>
            </div>

            {/* Ders */}
            {courseData && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Ders</Label>
                <p className="font-medium text-gray-900">{courseData.name}</p>
              </div>
            )}

            {/* Dönem */}
            {semesterData && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Dönem</Label>
                <p className="font-medium text-gray-900">{semesterData.name}</p>
              </div>
            )}

            {/* Teslim Tarihi */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Teslim Tarihi
              </Label>
              <p className="font-medium text-gray-900">{formatDate(homework.dueDate)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

