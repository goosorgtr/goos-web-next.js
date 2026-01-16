import { useMutation, useQueryClient } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'
import type { GradeHomeworkInput } from '../types/homework.types'
import { toast } from 'sonner'

/**
 * Ödev notlayan hook
 * 
 * @example
 * ```tsx
 * const { mutate: gradeHomework, isPending } = useGradeHomework()
 * 
 * const handleGrade = (homeworkId: string, studentId: string, grade: number) => {
 *   gradeHomework({ homeworkId, studentId, grade, feedback: 'İyi çalışma!' })
 * }
 * ```
 */
export function useGradeHomework() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: GradeHomeworkInput) => 
            homeworkService.gradeHomework(data.homeworkId, data.studentId, data.grade, data.feedback),
        onSuccess: () => {
            // Ödev durumlarını yenile
            queryClient.invalidateQueries({ queryKey: ['homework-statuses'] })
            queryClient.invalidateQueries({ queryKey: ['homeworks'] })
            toast.success('Ödev başarıyla notlandı')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ödev notlanırken bir hata oluştu')
        }
    })
}

