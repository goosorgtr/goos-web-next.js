import { useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semester.service';
import type { CreateDonemDto } from '../types';
import { toast } from 'sonner';

/**
 * Yeni dönem oluşturan hook
 * 
 * @example
 * ```tsx
 * const { mutate: createSemester, isPending, isSuccess, reset } = useCreateSemester()
 * 
 * const handleSubmit = (data: CreateDonemDto) => {
 *   createSemester(data)
 * }
 * ```
 */
export function useCreateSemester() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateDonemDto) => semesterService.create(dto),
        onSuccess: () => {
            // Dönem listesini yenile
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
            queryClient.invalidateQueries({ queryKey: ['semesters', 'active'] });
            toast.success('Dönem başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Dönem oluşturulurken bir hata oluştu');
        }
    });
}

