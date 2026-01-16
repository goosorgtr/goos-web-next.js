'use client'

import { useState, useEffect } from 'react'
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
import type { CreateHomeworkInput, UpdateHomeworkInput, Homework } from '../types/homework.types'

interface HomeworkFormProps {
  initialData?: Homework | null
  onSubmit: (data: CreateHomeworkInput | UpdateHomeworkInput) => void
  onCancel?: () => void
  isLoading?: boolean
  classes?: Array<{ id: string; name: string }>
  courses?: Array<{ id: string; name: string }>
  teachers?: Array<{ id: string; firstName: string; lastName: string }>
  currentSemesterId?: string | null
  currentUserId?: string | null
}

export function HomeworkForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  classes = [],
  courses = [],
  teachers = [],
  currentSemesterId,
  currentUserId
}: HomeworkFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [classId, setClassId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [teacherId, setTeacherId] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      if (initialData.dueDate) {
        const date = new Date(initialData.dueDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        setDueDate(`${year}-${month}-${day}T${hours}:${minutes}`)
      } else {
        setDueDate('')
      }
      setClassId(initialData.classId || '')
      setCourseId(initialData.courseId || '')
      setTeacherId(initialData.teacherId || '')
    } else {
      // Reset form
      setTitle('')
      setDescription('')
      setDueDate('')
      setClassId('')
      setCourseId('')
      setTeacherId('')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !dueDate || !classId || !courseId || !teacherId) {
      return
    }

    const formData: CreateHomeworkInput = {
      title,
      description: description || null,
      dueDate: new Date(dueDate).toISOString(),
      classId,
      courseId,
      teacherId,
      semesterId: currentSemesterId || null,
      createdBy: currentUserId || null
    }

    if (initialData) {
      onSubmit({ ...formData, id: initialData.id } as UpdateHomeworkInput)
    } else {
      onSubmit(formData)
    }
  }

  return (
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
              {teachers.map((teacher) => (
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

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            İptal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  )
}

