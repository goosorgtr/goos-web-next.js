import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../types';
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
        onMutate: async ({ id, dto }) => {
            await queryClient.cancelQueries({ queryKey: ['courses'] });
            const previousCourses = queryClient.getQueryData<Course[]>(['courses']);

            if (previousCourses) {
                queryClient.setQueryData<Course[]>(['courses'],
                    previousCourses.map((c) =>
                        c.id === id
                            ? {
                                ...c,
                                name: dto.name !== undefined ? dto.name : c.name,
                                isActive: dto.isActive !== undefined ? dto.isActive : c.isActive
                            }
                            : c
                    )
                );
            }

            return { previousCourses };
        },
        onSuccess: (updatedCourse) => {
            const current = queryClient.getQueryData<Course[]>(['courses']);
            if (current) {
                queryClient.setQueryData<Course[]>(
                    ['courses'],
                    current.map((c) => (c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c))
                );
            }
            toast.success('Ders başarıyla güncellendi');
        },
        onError: (error: Error, _variables, context) => {
            if (context?.previousCourses) {
                queryClient.setQueryData(['courses'], context.previousCourses);
            }
            toast.error(error.message || 'Ders güncellenirken bir hata oluştu');
        },
        onSettled: () => {}
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

