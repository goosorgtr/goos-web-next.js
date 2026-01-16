'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { homeworkService } from '@/lib/services/homework.service'
import { calculateGeneralStatus } from '@/modules/odev/services/homework.service'
import { classService } from '@/modules/classes/services/class.service'
import { HomeworkGeneralStatus } from '@/modules/odev/types/homework.types'
import { CheckCircle2, XCircle, Loader2, BookOpen, User, Calendar, Search, Users, ArrowLeft, ChevronDown, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface EditOdevPageProps {
  homeworkId: string
  onClose?: () => void
}

type HomeworkStatusType = 'done' | 'not_done' | 'incomplete' | 'pending' | null

interface StudentWithStatus {
  id: string
  studentId: string
  userId: string
  studentNo: string
  firstName: string
  lastName: string
  classId: string
  status: HomeworkStatusType
  feedback: string | null
  updatedAt: string | null
}

// Status badge selector component
function StatusBadgeSelector({
  student,
  currentStatus,
  onStatusChange,
  disabled
}: {
  student: StudentWithStatus
  currentStatus: string
  onStatusChange: (value: string) => void
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'done':
        return {
          label: 'Ödevi Yaptı',
          className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
          icon: CheckCircle2
        }
      case 'not_done':
        return {
          label: 'Ödevi Yapmadı',
          className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
          icon: XCircle
        }
      case 'incomplete':
        return {
          label: 'Eksik',
          className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
          icon: Loader2
        }
      case 'pending':
      default:
        return {
          label: 'Bekliyor',
          className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
          icon: Clock
        }
    }
  }

  const currentConfig = getStatusConfig(currentStatus)
  const CurrentIcon = currentConfig.icon

  const statusOptions = [
    { value: 'pending', ...getStatusConfig('pending') },
    { value: 'done', ...getStatusConfig('done') },
    { value: 'not_done', ...getStatusConfig('not_done') },
    { value: 'incomplete', ...getStatusConfig('incomplete') }
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
            currentConfig.className,
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'hover:shadow-sm'
          )}
        >
          <CurrentIcon className="h-3.5 w-3.5" />
          <span>{currentConfig.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          {statusOptions.map((option) => {
            const OptionIcon = option.icon
            const isSelected = option.value === currentStatus
            
            // Seçili olmayan durumlar için de renkli arka plan (daha açık ton)
            const getUnselectedClassName = (value: string) => {
              switch (value) {
                case 'done':
                  return 'bg-green-50/50 text-green-600 hover:bg-green-50 border border-green-100'
                case 'not_done':
                  return 'bg-red-50/50 text-red-600 hover:bg-red-50 border border-red-100'
                case 'incomplete':
                  return 'bg-orange-50/50 text-orange-600 hover:bg-orange-50 border border-orange-100'
                case 'pending':
                default:
                  return 'bg-gray-50/50 text-gray-600 hover:bg-gray-50 border border-gray-100'
              }
            }
            
            return (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all text-left',
                  isSelected
                    ? option.className + ' shadow-sm'
                    : getUnselectedClassName(option.value)
                )}
              >
                <OptionIcon className="h-4 w-4" />
                <span>{option.label}</span>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 ml-auto text-current" />
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function EditOdevPage({ homeworkId, onClose }: EditOdevPageProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Ödev bilgisini çek
  const { data: homework, isLoading: isLoadingHomework } = useQuery({
    queryKey: ['homework', homeworkId],
    queryFn: async () => {
      const result = await homeworkService.getById(homeworkId)
      if (!result.success) {
        throw new Error(result.message || 'Ödev bulunamadı')
      }
      return result.data
    },
    enabled: !!homeworkId
  })

  // Öğrenci status güncelleme mutation
  const updateStudentStatusMutation = useMutation({
    mutationFn: async ({ studentId, status, feedback }: { studentId: string; status: HomeworkStatusType; feedback?: string | null }) => {
      if (!homeworkId || !studentId || !status) return
      
      // homework_status kaydını bul veya oluştur
      const { data: existingStatus } = await supabase
        .from('homework_status')
        .select('*')
        .eq('homework_id', homeworkId)
        .eq('student_id', studentId)
        .single()

      if (existingStatus) {
        // Mevcut kaydı güncelle (composite key kullanarak)
        const { error } = await (supabase
          .from('homework_status') as any)
          .update({
            status: status,
            feedback: feedback || null,
            updated_at: new Date().toISOString()
          })
          .eq('homework_id', homeworkId)
          .eq('student_id', studentId)
        
        if (error) throw error
      } else {
        // Yeni kayıt oluştur
        const { error } = await (supabase
          .from('homework_status') as any)
          .insert({
            homework_id: homeworkId,
            student_id: studentId,
            status: status,
            feedback: feedback || null,
            updated_at: new Date().toISOString()
          })
        
        if (error) throw error
      }
      
      return { success: true }
    },
    onSuccess: async () => {
      // general_status'ü güncelle (tüm öğrenciler notlandırıldıysa 'graded' olacak)
      if (homework?.dueDate) {
        try {
          const newGeneralStatus = await calculateGeneralStatus(homeworkId, homework.dueDate)
          await (supabase
            .from('homeworks') as any)
            .update({ general_status: newGeneralStatus })
            .eq('id', homeworkId)
        } catch (error) {
          console.error('General status güncellenirken hata:', error)
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['homework-statuses', homeworkId] })
      queryClient.invalidateQueries({ queryKey: ['homework', homeworkId] })
      queryClient.invalidateQueries({ queryKey: ['admin-homeworks'] })
      toast.success('Öğrenci durumu güncellendi')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Durum güncellenirken bir hata oluştu')
    }
  })

  // Sınıf bilgisini çek
  const { data: classData } = useQuery<{ id: string; name: string; grade: number } | null>({
    queryKey: ['class-detail', homework?.classId],
    queryFn: async () => {
      if (!homework?.classId) return null
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, grade')
        .eq('id', homework.classId)
        .single()
      if (error) throw error
      return data as { id: string; name: string; grade: number } | null
    },
    enabled: !!homework?.classId
  })

  // Öğretmen bilgisini çek
  const { data: teacherData } = useQuery<{
    id: string;
    user_id: string;
    users: { id: string; first_name: string; last_name: string } | null;
  } | null>({
    queryKey: ['teacher-detail', homework?.teacherId],
    queryFn: async () => {
      if (!homework?.teacherId) return null
      const { data, error } = await supabase
        .from('teachers')
        .select('id, user_id, users(id, first_name, last_name)')
        .eq('id', homework.teacherId)
        .single()
      if (error) throw error
      return data as {
        id: string;
        user_id: string;
        users: { id: string; first_name: string; last_name: string } | null;
      } | null
    },
    enabled: !!homework?.teacherId
  })

  // Ders bilgisini çek
  const { data: courseData } = useQuery<{ id: string; name: string } | null>({
    queryKey: ['course-detail', homework?.courseId],
    queryFn: async () => {
      if (!homework?.courseId) return null
      const { data, error } = await supabase
        .from('courses')
        .select('id, name')
        .eq('id', homework.courseId)
        .single()
      if (error) throw error
      return data as { id: string; name: string } | null
    },
    enabled: !!homework?.courseId
  })

  // Dönem bilgisini çek
  const { data: semesterData } = useQuery<{ id: string; name: string } | null>({
    queryKey: ['semester-detail', homework?.semesterId],
    queryFn: async () => {
      if (!homework?.semesterId) return null
      const { data, error } = await supabase
        .from('semesters')
        .select('id, name')
        .eq('id', homework.semesterId)
        .single()
      if (error) throw error
      return data as { id: string; name: string } | null
    },
    enabled: !!homework?.semesterId
  })

  // Önce ödeve ait TÜM durumları çek (hangi sınıfta olursa olsun)
  const { data: homeworkStatuses } = useQuery<Array<{
    homework_id: string;
    student_id: string;
    status: HomeworkStatusType;
    feedback: string | null;
    updated_at: string | null;
  }>>({
    queryKey: ['homework-statuses', homeworkId],
    queryFn: async () => {
      if (!homeworkId) return []
      
      const { data, error } = await supabase
        .from('homework_status')
        .select('*')
        .eq('homework_id', homeworkId)
      
      if (error) throw error
      return (data || []) as Array<{
        homework_id: string;
        student_id: string;
        status: HomeworkStatusType;
        feedback: string | null;
        updated_at: string | null;
      }>
    },
    enabled: !!homeworkId
  })

  // Durumları olan öğrenci ID'lerini topla
  const studentIdsWithStatus = Array.from(new Set((homeworkStatuses || []).map((s: any) => s.student_id)))

  // Bu öğrencilerin bilgilerini getir (hangi sınıfta olursa olsun)
  const { data: studentsWithStatusData } = useQuery({
    queryKey: ['students-with-status', studentIdsWithStatus],
    queryFn: async () => {
      if (studentIdsWithStatus.length === 0) return []
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          user_id,
          class_id,
          student_no,
          users!inner (
            first_name,
            last_name
          )
        `)
        .in('id', studentIdsWithStatus)
      
      if (error) throw error
      
      return (data || []).map((student: any) => ({
        id: student.id,
        studentId: student.id,
        userId: student.user_id,
        studentNo: student.student_no || '',
        firstName: student.users?.first_name || '',
        lastName: student.users?.last_name || '',
        classId: student.class_id
      }))
    },
    enabled: studentIdsWithStatus.length > 0
  })

  // Mevcut sınıftaki öğrencileri de çek (durumu olmayanlar için)
  const { data: currentClassStudents, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['class-students', homework?.classId],
    queryFn: async () => {
      if (!homework?.classId) return []
      return await classService.getStudentsByClass(homework.classId)
    },
    enabled: !!homework?.classId
  })

  // Tüm öğrencileri birleştir (durumu olanlar + mevcut sınıftakiler)
  const allStudents = new Map<string, any>()
  
  // Önce durumu olan öğrencileri ekle
  ;(studentsWithStatusData || []).forEach((student: any) => {
    allStudents.set(student.id, student)
  })
  
  // Sonra mevcut sınıftaki öğrencileri ekle (zaten yoksa)
  ;(currentClassStudents || []).forEach((student: any) => {
    if (!allStudents.has(student.id)) {
      allStudents.set(student.id, student)
    }
  })

  // Öğrencileri durumlarıyla birleştir
  const studentsWithStatus: StudentWithStatus[] = Array.from(allStudents.values()).map((student: any) => {
    const statusRecord = (homeworkStatuses || []).find(
      (s: any) => s.student_id === student.id
    )
    return {
      ...student,
      status: statusRecord?.status || null,
      feedback: statusRecord?.feedback || null,
      updatedAt: statusRecord?.updated_at || null
    }
  })

  // Filtreleme
  const filteredStudents = studentsWithStatus.filter((student) => {
    // Arama filtresi
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
      const studentNo = student.studentNo?.toLowerCase() || ''
      if (!fullName.includes(searchLower) && !studentNo.includes(searchLower)) {
        return false
      }
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      if (statusFilter === 'done') {
        return student.status === 'done'
      }
      if (statusFilter === 'not_done') {
        // not_done veya null (henüz durum atanmamış) olanları göster
        return student.status === 'not_done' || student.status === null
      }
      if (statusFilter === 'incomplete') {
        return student.status === 'incomplete'
      }
    }

    return true
  })

  const getStatusBadge = (status: HomeworkStatusType) => {
    switch (status) {
      case 'done':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Ödevi Yaptı
          </span>
        )
      case 'incomplete':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
            <XCircle className="h-3 w-3" />
            Eksik
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <Loader2 className="h-3 w-3 animate-spin" />
            Bekliyor
          </span>
        )
      case 'not_done':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
            <XCircle className="h-3 w-3" />
            Ödevi Yapmadı
          </span>
        )
    }
  }

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

  const getGeneralStatusBadge = (status: HomeworkGeneralStatus | null, dueDate: string | null) => {
    // Eğer status string olarak geliyorsa enum'a çevir
    let statusEnum: HomeworkGeneralStatus | null = null
    if (status) {
      if (typeof status === 'string') {
        statusEnum = status as HomeworkGeneralStatus
      } else {
        statusEnum = status
      }
    }

    if (!statusEnum || !dueDate) {
      // Status yoksa veya dueDate yoksa, dueDate'e göre varsayılan göster
      if (dueDate) {
    const now = new Date()
    const dueDateObj = new Date(dueDate)
        if (dueDateObj > now) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Aktif
            </span>
          )
        } else {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              Notlandırılmayı Bekliyor
            </span>
          )
        }
      }
      return null
    }

    switch (statusEnum) {
      case HomeworkGeneralStatus.ACTIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Aktif
          </span>
        )
      case HomeworkGeneralStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
            Bekliyor
          </span>
        )
      case HomeworkGeneralStatus.WAITING_FOR_GRADING:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            Notlandırılmayı Bekliyor
          </span>
        )
      case HomeworkGeneralStatus.GRADED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            Notlandırıldı
          </span>
        )
      default:
        // Eğer beklenmeyen bir değer gelirse, dueDate'e göre varsayılan göster
        const now = new Date()
        const dueDateObj = new Date(dueDate)
        if (dueDateObj > now) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Aktif
            </span>
          )
        } else {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              Notlandırılmayı Bekliyor
          </span>
        )
        }
    }
  }

  if (isLoadingHomework) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!homework) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Ödev bulunamadı</p>
        </div>
      </div>
    )
  }

  const handleBack = () => {
    if (onClose) {
      onClose()
    } else {
      router.push('/admin/odevler')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Geri Butonu */}
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </button>
        </div>

        {/* Ödev Bilgileri - Beyaz Kart */}
        <div className="bg-white rounded-xl border shadow-sm p-8 mb-6">
          {/* Başlık ve Bilgiler */}
          <div className="mb-8 pb-6 border-b">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-4xl font-bold text-gray-900">
                {homework?.title || 'Ödev Detayı'}
              </h1>
              {homework?.generalStatus && getGeneralStatusBadge(homework.generalStatus, homework?.dueDate || null)}
            </div>
            <div className="flex items-center gap-2 text-base text-gray-600">
              {classData?.grade && (
                <>
                  <span className="font-medium">{classData.grade}. Sınıf</span>
                  <span className="text-gray-400">•</span>
                </>
              )}
              <span className="font-medium">{filteredStudents.length} Öğrenci</span>
            </div>
          </div>

          {/* Detay Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sınıf */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                <BookOpen className="h-4 w-4" />
                Sınıf
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {classData?.name || '-'}
              </p>
            </div>

            {/* Ders */}
            {courseData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <BookOpen className="h-4 w-4" />
                  Ders
                </div>
                <p className="text-lg font-semibold text-gray-900">{courseData.name}</p>
              </div>
            )}

            {/* Öğretmen */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                <User className="h-4 w-4" />
                Öğretmen
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {teacherData?.users 
                  ? `${teacherData.users.first_name} ${teacherData.users.last_name}`
                  : '-'}
              </p>
            </div>

            {/* Teslim Tarihi */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                <Calendar className="h-4 w-4" />
                Teslim Tarihi
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatDate(homework?.dueDate)}</p>
            </div>

            {/* Dönem */}
            {semesterData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <Calendar className="h-4 w-4" />
                  Dönem
                </div>
                <p className="text-lg font-semibold text-gray-900">{semesterData.name}</p>
              </div>
            )}

            {/* Açıklama - Full Width */}
            {homework?.description && (
              <div className="md:col-span-2 space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <div className="h-4 w-4" />
                  Açıklama
                </div>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{homework.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Öğrenci Listesi - Ortada */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6">
            {/* Header with Search and Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold flex items-center gap-2.5 text-gray-900">
                  <Users className="h-5 w-5 text-gray-600" />
                  Öğrenciler ve Durumlar
                  <span className="text-base font-normal text-gray-500">
                    ({filteredStudents.length})
                  </span>
                </h3>
              </div>
              
              {/* Search and Filter Bar */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Ara..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tüm Durumlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="done">Ödevi Yaptı</SelectItem>
                    <SelectItem value="not_done">Ödevi Yapmadı</SelectItem>
                    <SelectItem value="incomplete">Eksik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoadingStudents ? (
              <div className="rounded-lg border bg-gray-50 p-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Öğrenciler yükleniyor...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="rounded-lg border bg-gray-50 p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Arama kriterlerine uygun öğrenci bulunamadı'
                    : 'Bu sınıfta öğrenci bulunamadı'}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Öğrenci
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Durum
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Güncelleme
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            {student.studentNo && (
                              <p className="text-xs text-gray-500 mt-0.5">No: {student.studentNo}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadgeSelector
                            student={student}
                            currentStatus={student.status || 'pending'}
                            onStatusChange={(value) => {
                              updateStudentStatusMutation.mutate({
                                studentId: student.studentId,
                                status: value as HomeworkStatusType
                              })
                            }}
                            disabled={updateStudentStatusMutation.isPending}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-500">
                            {student.updatedAt ? formatDate(student.updatedAt) : '-'}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

