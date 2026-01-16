import { useMutation, useQueryClient } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'
import type { SubmitHomeworkInput } from '../types/homework.types'
import { toast } from 'sonner'

/**
 * Ödev teslim eden hook
 * 
 * @example
 * ```tsx
 * const { mutate: submitHomework, isPending } = useSubmitHomework()
 * 
 * const handleSubmit = (homeworkId: string, content: string) => {
 *   submitHomework({ homeworkId, studentId: '123', content })
 * }
 * ```
 */
export function useSubmitHomework() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: SubmitHomeworkInput) => 
            homeworkService.submitHomework(data.homeworkId, data),
        onSuccess: () => {
            // Ödev listesini ve durumlarını yenile
            queryClient.invalidateQueries({ queryKey: ['homeworks'] })
            queryClient.invalidateQueries({ queryKey: ['homework-statuses'] })
            toast.success('Ödev başarıyla teslim edildi')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ödev teslim edilirken bir hata oluştu')
        }
    })
}

