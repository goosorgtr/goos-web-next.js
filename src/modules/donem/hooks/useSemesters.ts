import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semester.service';
import type { Donem, CreateDonemDto, UpdateDonemDto } from '../types';
import { toast } from 'sonner';
import { useCreateSemester } from './useCreateSemester';
import { useUpdateSemester } from './useUpdateSemester';

/**
 * Tüm dönem işlemlerini yöneten ana hook
 * İçeride useCreateSemester ve useUpdateSemester hook'larını kullanır
 * 
 * @example
 * ```tsx
 * const { 
 *   data: semesters, 
 *   createSemester, 
 *   updateSemester, 
 *   deleteSemester,
 *   isCreating,
 *   isUpdating 
 * } = useSemesters()
 * ```
 */
export function useSemesters() {
    const queryClient = useQueryClient();

    // Query: Tüm dönemleri getir
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['semesters'],
        queryFn: () => semesterService.getSemesters()
    });

    // Create mutation: useCreateSemester hook'unu kullan
    const createMutation = useCreateSemester();

    // Update mutation: useUpdateSemester hook'unu kullan
    const updateMutation = useUpdateSemester();

    // Delete mutation: Burada kalıyor (henüz ayrı hook yok)
    const deleteMutation = useMutation({
        mutationFn: (id: string) => semesterService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
            queryClient.invalidateQueries({ queryKey: ['semesters', 'active'] });
            toast.success('Dönem başarıyla silindi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Dönem silinirken bir hata oluştu');
        }
    });

    return {
        data: data ?? [],
        isLoading,
        error,
        refetch,
        // Create: useCreateSemester'dan gelen mutation
        createSemester: createMutation.mutate,
        // Update: useUpdateSemester'dan gelen mutation
        updateSemester: updateMutation.mutate,
        // Delete: Yerel mutation
        deleteSemester: deleteMutation.mutate,
        // Loading states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        // Success states
        isCreateSuccess: createMutation.isSuccess,
        isUpdateSuccess: updateMutation.isSuccess,
        isDeleteSuccess: deleteMutation.isSuccess,
        // Reset functions
        resetCreate: createMutation.reset,
        resetUpdate: updateMutation.reset,
        resetDelete: deleteMutation.reset
    };
}
