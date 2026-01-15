import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import type { CreateCourseDto, UpdateCourseDto } from '../types';
import { toast } from 'sonner';

export function useCourses() {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getCourses()
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateCourseDto) => courseService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Ders başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Ders oluşturulurken bir hata oluştu');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseDto }) =>
            courseService.update(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Ders başarıyla güncellendi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Ders güncellenirken bir hata oluştu');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => courseService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Ders başarıyla silindi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Ders silinirken bir hata oluştu');
        }
    });

    return {
        data: data ?? [],
        isLoading,
        error,
        refetch,
        createCourse: createMutation.mutate,
        updateCourse: updateMutation.mutate,
        deleteCourse: deleteMutation.mutate,
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

