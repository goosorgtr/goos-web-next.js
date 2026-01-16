'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClasses } from '@/modules/classes/hooks/useClasses'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

interface AdminOdevFiltersProps {
  selectedClassId: string
  selectedTeacherId: string
  onClassChange: (value: string) => void
  onTeacherChange: (value: string) => void
}

export function AdminOdevFilters({
  selectedClassId,
  selectedTeacherId,
  onClassChange,
  onTeacherChange
}: AdminOdevFiltersProps) {
  const { data: classes } = useClasses()

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-for-filter'],
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

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={selectedClassId} onValueChange={onClassChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sınıf Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Sınıflar</SelectItem>
          {classes.map((cls) => (
            <SelectItem key={cls.id} value={cls.id}>
              {cls.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTeacherId} onValueChange={onTeacherChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Öğretmen Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Öğretmenler</SelectItem>
          {teachers.map((teacher: any) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.firstName} {teacher.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

