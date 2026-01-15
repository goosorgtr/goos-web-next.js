import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import type { CreateClassDto, UpdateClassDto } from '../types';
import { toast } from 'sonner';

export function useClasses() {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['classes'],
        queryFn: () => classService.getClasses()
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateClassDto) => classService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Sınıf başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Sınıf oluşturulurken bir hata oluştu');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateClassDto }) =>
            classService.update(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Sınıf başarıyla güncellendi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Sınıf güncellenirken bir hata oluştu');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => classService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            queryClient.invalidateQueries({ queryKey: ['available-students'] });
            queryClient.invalidateQueries({ queryKey: ['class-students'] });
            toast.success('Sınıf başarıyla silindi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Sınıf silinirken bir hata oluştu');
        }
    });

    return {
        data: data ?? [],
        isLoading,
        error,
        refetch,
        createClass: createMutation.mutate,
        updateClass: updateMutation.mutate,
        deleteClass: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isCreateSuccess: createMutation.isSuccess,
        isUpdateSuccess: updateMutation.isSuccess,
        isDeleteSuccess: deleteMutation.isSuccess,
        resetCreate: createMutation.reset,
        resetUpdate: updateMutation.reset,
        resetDelete: deleteMutation.reset
    };
}

