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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
import { courseService } from '../services/course.service'
import type { TeacherCourse } from '../types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface AssignTeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingAssignment: TeacherCourse | null
}

type AssignmentMode = 'course_to_classes' | 'class_to_courses'

export function AssignTeacherDialog({ open, onOpenChange, editingAssignment }: AssignTeacherDialogProps) {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<AssignmentMode>('course_to_classes')
  const [teacherId, setTeacherId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [classId, setClassId] = useState('')
  const [semesterId, setSemesterId] = useState('')

  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [isBulkCreating, setIsBulkCreating] = useState(false)

  const [classSearch, setClassSearch] = useState('')
  const [courseSearch, setCourseSearch] = useState('')

  const { data: courses } = useCourses()
  const { data: classes } = useClasses()
  const { data: semesters } = useSemesters()
  const { data: currentSemester } = useCurrentSemester()
  
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
        setMode('course_to_classes')
        setTeacherId(editingAssignment.teacherId)
        setCourseId(editingAssignment.courseId)
        setClassId(editingAssignment.classId || '')
        setSemesterId(editingAssignment.semesterId || '')
        setSelectedClassIds([])
        setSelectedCourseIds([])
        setClassSearch('')
        setCourseSearch('')
      } else {
        setMode('course_to_classes')
        setTeacherId('')
        setCourseId('')
        setClassId('')
        setSelectedClassIds([])
        setSelectedCourseIds([])
        setClassSearch('')
        setCourseSearch('')
        setSemesterId(currentSemester?.id || '')
      }
    }
  }, [open, editingAssignment, currentSemester])

  useEffect(() => {
    if ((isCreateSuccess && !isCreating) || (isUpdateSuccess && !isUpdating)) {
      onOpenChange(false)
    }
  }, [isCreateSuccess, isCreating, isUpdateSuccess, isUpdating, onOpenChange])

  const toggleSelectedId = (prev: string[], id: string, checked: boolean) => {
    if (checked) return prev.includes(id) ? prev : [...prev, id]
    return prev.filter((i) => i !== id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAssignment) {
      if (!teacherId || !courseId) return

      const data = {
        teacherId,
        courseId,
        classId: classId && classId !== 'none' ? classId : null,
        semesterId: semesterId && semesterId !== 'none' ? semesterId : null,
        isActive: true
      }

      updateTeacherCourse({ id: editingAssignment.id, dto: data })
      return
    }

    if (mode === 'course_to_classes') {
      if (!teacherId || !courseId || selectedClassIds.length === 0) return
    }

    if (mode === 'class_to_courses') {
      if (!teacherId || !classId || selectedCourseIds.length === 0) return
    }

    const normalizedSemesterId = currentSemester?.id ?? null

    try {
      setIsBulkCreating(true)

      if (mode === 'course_to_classes') {
        await Promise.all(
          selectedClassIds.map((targetClassId) =>
            courseService.createTeacherCourse({
              teacherId,
              courseId,
              classId: targetClassId,
              semesterId: normalizedSemesterId,
              isActive: true
            })
          )
        )
      } else {
        await Promise.all(
          selectedCourseIds.map((targetCourseId) =>
            courseService.createTeacherCourse({
              teacherId,
              courseId: targetCourseId,
              classId,
              semesterId: normalizedSemesterId,
              isActive: true
            })
          )
        )
      }

      toast.success('Öğretmen ataması başarıyla oluşturuldu')
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] })
      onOpenChange(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Öğretmen ataması oluşturulurken bir hata oluştu'
      toast.error(message)
    } finally {
      setIsBulkCreating(false)
    }
  }

  const isLoading = isCreating || isUpdating || isBulkCreating
  const isValid = editingAssignment
    ? !!(teacherId && courseId)
    : mode === 'course_to_classes'
      ? !!(teacherId && courseId && selectedClassIds.length > 0)
      : !!(teacherId && classId && selectedCourseIds.length > 0)

  const filteredClasses = classes.filter((cls: any) => {
    const q = classSearch.trim().toLowerCase()
    if (!q) return true
    const label = (cls.name || `${cls.grade}-${cls.section ?? ''}`).toString().toLowerCase()
    return label.includes(q)
  })

  const filteredCourses = courses.filter((c) => {
    const q = courseSearch.trim().toLowerCase()
    if (!q) return true
    return (c.name || '').toLowerCase().includes(q)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[920px]">
        <DialogHeader>
          <DialogTitle>
            {editingAssignment ? 'Atamayı Düzenle' : 'Yeni Öğretmen Ataması'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacher">Öğretmen *</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger disabled={!!editingAssignment}>
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

          {!editingAssignment && (
            <div className="space-y-2">
              <Label htmlFor="mode">Atama Tipi</Label>
              <Select
                value={mode}
                onValueChange={(v) => {
                  const nextMode = v as AssignmentMode
                  setMode(nextMode)
                  setCourseId('')
                  setClassId('')
                  setSelectedClassIds([])
                  setSelectedCourseIds([])
                  setClassSearch('')
                  setCourseSearch('')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Atama tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course_to_classes">Derse göre sınıf seç</SelectItem>
                  <SelectItem value="class_to_courses">Sınıfa göre ders seç</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {editingAssignment ? (
            <>
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
                        {cls.name || `${cls.grade}-${cls.section ?? ''}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                {mode === 'course_to_classes' ? (
                  <div className="space-y-2">
                    <Label htmlFor="course">Ders *</Label>
                    <Select
                      value={courseId}
                      onValueChange={(value) => {
                        setCourseId(value)
                        setSelectedClassIds([])
                      }}
                    >
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
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="class">Sınıf *</Label>
                    <Select
                      value={classId}
                      onValueChange={(value) => {
                        setClassId(value)
                        setSelectedCourseIds([])
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sınıf seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name || `${cls.grade}-${cls.section ?? ''}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {mode === 'course_to_classes' ? (
                  <div className="space-y-2">
                    <Label>Hedef Sınıflar *</Label>
                    <div className="rounded-md border">
                      <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={filteredClasses.length > 0 && selectedClassIds.length === filteredClasses.length}
                            onCheckedChange={(checked) => setSelectedClassIds(checked ? filteredClasses.map((c: any) => c.id) : [])}
                            disabled={filteredClasses.length === 0}
                          />
                          Tümünü Seç
                        </label>
                        <span className="text-xs text-muted-foreground">{selectedClassIds.length} seçili</span>
                      </div>
                      <div className="p-2">
                        <Input
                          value={classSearch}
                          onChange={(e) => setClassSearch(e.target.value)}
                          placeholder="Sınıf ara..."
                        />
                      </div>
                      <div className="max-h-[520px] overflow-y-auto p-2">
                        {filteredClasses.map((cls: any) => (
                          <label key={cls.id} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50">
                            <Checkbox
                              checked={selectedClassIds.includes(cls.id)}
                              onCheckedChange={(checked) =>
                                setSelectedClassIds((prev) => toggleSelectedId(prev, cls.id, checked as boolean))
                              }
                            />
                            <span className="text-sm">{cls.name || `${cls.grade}-${cls.section ?? ''}`}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Hedef Dersler *</Label>
                    <div className="rounded-md border">
                      <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={filteredCourses.length > 0 && selectedCourseIds.length === filteredCourses.length}
                            onCheckedChange={(checked) => setSelectedCourseIds(checked ? filteredCourses.map((c) => c.id) : [])}
                            disabled={filteredCourses.length === 0}
                          />
                          Tümünü Seç
                        </label>
                        <span className="text-xs text-muted-foreground">{selectedCourseIds.length} seçili</span>
                      </div>
                      <div className="p-2">
                        <Input
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          placeholder="Ders ara..."
                        />
                      </div>
                      <div className="max-h-[520px] overflow-y-auto p-2">
                        {filteredCourses.map((course) => (
                          <label key={course.id} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50">
                            <Checkbox
                              checked={selectedCourseIds.includes(course.id)}
                              onCheckedChange={(checked) =>
                                setSelectedCourseIds((prev) => toggleSelectedId(prev, course.id, checked as boolean))
                              }
                            />
                            <span className="text-sm">{course.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {editingAssignment && (
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
          )}

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

