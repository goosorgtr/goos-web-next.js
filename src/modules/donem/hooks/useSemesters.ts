import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semester.service';
import type { Donem, CreateDonemDto, UpdateDonemDto } from '../types';

export function useSemesters() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['semesters'],
        queryFn: () => semesterService.getAll()
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateDonemDto) => semesterService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateDonemDto }) =>
            semesterService.update(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => semesterService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
        }
    });

    const toggleActiveMutation = useMutation({
        mutationFn: (id: string) => semesterService.toggleActive(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['semesters'] });
        }
    });

    return {
        data: data ?? [],
        isLoading,
        error,
        createSemester: createMutation.mutate,
        updateSemester: updateMutation.mutate,
        deleteSemester: deleteMutation.mutate,
        toggleActive: toggleActiveMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isTogglingActive: toggleActiveMutation.isPending
    };
}
