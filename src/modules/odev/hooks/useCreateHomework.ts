import { useMutation, useQueryClient } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'
import type { CreateHomeworkInput } from '../types'
import { toast } from 'sonner'

/**
 * Yeni ödev oluşturan hook
 * 
 * @example
 * ```tsx
 * const { mutate: createHomework, isPending } = useCreateHomework()
 * 
 * const handleSubmit = (data: CreateHomeworkInput) => {
 *   createHomework(data)
 * }
 * ```
 */
export function useCreateHomework() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateHomeworkInput) => homeworkService.createHomework(data),
        onSuccess: () => {
            // Ödev listesini yenile
            queryClient.invalidateQueries({ queryKey: ['homeworks'] })
            toast.success('Ödev başarıyla oluşturuldu')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ödev oluşturulurken bir hata oluştu')
        }
    })
}
