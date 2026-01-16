'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClasses } from '@/modules/classes/hooks/useClasses'
import { useCourses } from '@/modules/courses/hooks/useCourses'
import { useCurrentSemester } from '@/modules/donem/hooks/useCurrentSemester'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { homeworkService } from '@/lib/services/homework.service'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'

interface AddOdevDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddOdevDialog({ open, onOpenChange }: AddOdevDialogProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [classId, setClassId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: classes } = useClasses()
  const { data: courses } = useCourses()
  const { currentSemester } = useCurrentSemester()

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-for-homework'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, user_id, users(id, first_name, last_name)')
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

  useEffect(() => {
    if (open) {
      // Reset form
      setTitle('')
      setDescription('')
      setDueDate('')
      setClassId('')
      setCourseId('')
      setTeacherId('')
    }
  }, [open, currentSemester])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: Boş string ve 'none' değerlerini kontrol et
    if (!title || !dueDate || !classId || classId === '' || !teacherId || teacherId === '' || !courseId || courseId === '' || courseId === 'none') {
      toast.error('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    setIsSubmitting(true)
    try {
      // due_date geçmişse is_active false olacak
      const dueDateObj = new Date(dueDate)
      const now = new Date()
      const isActive = dueDateObj >= now

      const result = await homeworkService.create({
        title,
        description: description || null,
        dueDate: dueDate,
        classId: classId || null,
        courseId: courseId === 'none' ? null : courseId,
        teacherId: teacherId || null,
        semesterId: currentSemester?.id || null,
        isActive: isActive,
        createdBy: user?.id || null
      })
      
      if (!result.success) {
        throw new Error(result.message || 'Ödev oluşturulurken bir hata oluştu')
      }
      
      toast.success('Ödev başarıyla oluşturuldu')
      queryClient.invalidateQueries({ queryKey: ['admin-homeworks'] })
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Ödev oluşturulurken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Ödev Ekle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Başlık */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ödev başlığını girin"
                required
              />
            </div>

            {/* Açıklama */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ödev açıklamasını girin"
                rows={4}
              />
            </div>

            {/* Sınıf */}
            <div>
              <Label htmlFor="class">Sınıf *</Label>
              <Select value={classId} onValueChange={setClassId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sınıf seçin" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Öğretmen */}
            <div>
              <Label htmlFor="teacher">Öğretmen *</Label>
              <Select value={teacherId} onValueChange={setTeacherId} required>
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

            {/* Ders */}
            <div>
              <Label htmlFor="course">Ders *</Label>
              <Select value={courseId} onValueChange={setCourseId} required>
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


            {/* Teslim Tarihi */}
            <div className="md:col-span-2">
              <Label htmlFor="dueDate">Teslim Tarihi *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

