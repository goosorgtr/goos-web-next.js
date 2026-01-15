'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTeacherCourses } from '../hooks/useTeacherCourses'
import { useCourses } from '../hooks/useCourses'
import { useClasses } from '@/modules/classes/hooks/useClasses'
import { useSemesters } from '@/modules/donem/hooks/useSemesters'
import { useCurrentSemester } from '@/modules/donem/hooks/useCurrentSemester'
import { supabase } from '@/lib/supabase/client'
import type { TeacherCourse } from '../types'
import { useQuery } from '@tanstack/react-query'

interface AssignTeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingAssignment: TeacherCourse | null
}

export function AssignTeacherDialog({ open, onOpenChange, editingAssignment }: AssignTeacherDialogProps) {
  const [teacherId, setTeacherId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [classId, setClassId] = useState('')
  const [semesterId, setSemesterId] = useState('')

  const { data: courses } = useCourses()
  const { data: classes } = useClasses()
  const { data: semesters } = useSemesters()
  const { currentSemester } = useCurrentSemester()
  
  const { data: teachersData } = useQuery({
    queryKey: ['teachers-with-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, user_id, is_active, users(id, first_name, last_name)')
        .eq('is_active', true)
      
      if (error) throw error
      
      return (data || []).map((t: any) => ({
        id: t.id,
        firstName: t.users?.first_name || '',
        lastName: t.users?.last_name || ''
      }))
    }
  })
  const teachers = teachersData || []

  const {
    createTeacherCourse,
    updateTeacherCourse,
    isCreating,
    isUpdating,
    isCreateSuccess,
    isUpdateSuccess,
    resetCreate,
    resetUpdate
  } = useTeacherCourses()

  useEffect(() => {
    if (open) {
      resetCreate()
      resetUpdate()
      if (editingAssignment) {
        setTeacherId(editingAssignment.teacherId)
        setCourseId(editingAssignment.courseId)
        setClassId(editingAssignment.classId || '')
        setSemesterId(editingAssignment.semesterId || '')
      } else {
        setTeacherId('')
        setCourseId('')
        setClassId('')
        setSemesterId(currentSemester?.id || '')
      }
    }
  }, [open, editingAssignment, currentSemester, resetCreate, resetUpdate])

  useEffect(() => {
    if ((isCreateSuccess && !isCreating) || (isUpdateSuccess && !isUpdating)) {
      onOpenChange(false)
    }
  }, [isCreateSuccess, isCreating, isUpdateSuccess, isUpdating, onOpenChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!teacherId || !courseId) return

    const data = {
      teacherId,
      courseId,
      classId: classId && classId !== 'none' ? classId : null,
      semesterId: semesterId && semesterId !== 'none' ? semesterId : null,
      isActive: true
    }

    if (editingAssignment) {
      updateTeacherCourse({ id: editingAssignment.id, dto: data })
    } else {
      createTeacherCourse(data)
    }
  }

  const isLoading = isCreating || isUpdating
  const isValid = teacherId && courseId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingAssignment ? 'Atamayı Düzenle' : 'Yeni Öğretmen Ataması'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacher">Öğretmen *</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Öğretmen seçin" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher: any) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Ders *</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Ders seçin" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Sınıf (Opsiyonel)</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Sınıf seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sınıf Seçilmedi</SelectItem>
                {classes.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.grade}-{cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Dönem (Opsiyonel)</Label>
            <Select value={semesterId} onValueChange={setSemesterId}>
              <SelectTrigger>
                <SelectValue placeholder="Dönem seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Dönem Seçilmedi</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading ? 'Kaydediliyor...' : editingAssignment ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

