import { useQuery } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'
import type { HomeworkFilters } from '../types/homework.types'

/**
 * Ödevleri getiren hook
 * 
 * @example
 * ```tsx
 * const { data: homeworks, isLoading } = useHomework({ classId: '123' })
 * ```
 */
export function useHomework(filters?: HomeworkFilters) {
  return useQuery({
    queryKey: ['homeworks', filters],
    queryFn: async () => {
      const result = await homeworkService.getHomeworks(filters)
      if (!result.success) {
        throw new Error(result.message || 'Ödevler yüklenirken bir hata oluştu')
      }
      return result.data || []
    }
  })
}

