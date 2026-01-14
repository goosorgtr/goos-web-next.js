import { useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semester.service';
import type { UpdateDonemDto } from '../types';
import { toast } from 'sonner';

/**
 * Dönem güncelleyen hook
 * 
 * @example
 * ```tsx
 * const { mutate: updateSemester, isPending, isSuccess, reset } = useUpdateSemester()
 * 
 * const handleSubmit = (id: string, data: UpdateDonemDto) => {
 *   updateSemester({ id, dto: data })
 * }
 * ```
 */
export function useUpdateSemester() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateDonemDto }) =>
            semesterService.update(id, dto),
        onSuccess: () => {
            // Dönem listesini yenile
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
            queryClient.invalidateQueries({ queryKey: ['semesters', 'active'] });
            toast.success('Dönem başarıyla güncellendi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Dönem güncellenirken bir hata oluştu');
        }
    });
}

