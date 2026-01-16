import { useQuery } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'

/**
 * Öğrencinin tüm ödevlerini getiren hook (sınıf değişikliğinden bağımsız)
 * Hem mevcut sınıfındaki ödevleri hem de geçmiş sınıflarındaki ödev durumlarını getirir
 * 
 * @example
 * ```tsx
 * const { data: homeworks, isLoading } = useStudentHomeworks('student-id')
 * ```
 */
export function useStudentHomeworks(studentId: string) {
  return useQuery({
    queryKey: ['student-homeworks', studentId],
    queryFn: async () => {
      // Öğrencinin tüm ödev durumlarını getir (geçmiş sınıflar dahil)
      const statusResult = await homeworkService.getStudentHomeworksWithStatus(studentId)
      if (!statusResult.success) {
        throw new Error(statusResult.message || 'Ödevler yüklenirken bir hata oluştu')
      }

      const homeworksWithStatus = statusResult.data || []

      // Ayrıca mevcut sınıfındaki tüm ödevleri getir (henüz durumu olmayanlar için)
      const currentClassResult = await homeworkService.getByStudent(studentId)
      if (!currentClassResult.success) {
        // Hata olsa bile mevcut durumları döndür
        return homeworksWithStatus
      }

      const currentClassHomeworks = currentClassResult.data || []

      // Mevcut sınıftaki ödevleri durumlarıyla birleştir
      const allHomeworks = [...homeworksWithStatus]
      
      currentClassHomeworks.forEach((hw: any) => {
        // Eğer bu ödev zaten listede yoksa ekle
        if (!allHomeworks.find((h: any) => h.id === hw.id)) {
          allHomeworks.push({
            ...hw,
            status: null,
            feedback: null,
            statusUpdatedAt: null
          })
        }
      })

      // Tarihe göre sırala (en yeni önce)
      return allHomeworks.sort((a: any, b: any) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0
        return dateB - dateA
      })
    },
    enabled: !!studentId
  })
}

