import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import type { CreateTeacherCourseDto, UpdateTeacherCourseDto } from '../types';
import { toast } from 'sonner';

interface UseTeacherCoursesOptions {
    courseId?: string;
    semesterId?: string;
}

export function useTeacherCourses(options?: UseTeacherCoursesOptions) {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['teacher-courses', options?.courseId, options?.semesterId],
        queryFn: () => courseService.getTeacherCourses({
            courseId: options?.courseId,
            semesterId: options?.semesterId
        })
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateTeacherCourseDto) => courseService.createTeacherCourse(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
            toast.success('Öğretmen ataması başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Öğretmen ataması oluşturulurken bir hata oluştu');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateTeacherCourseDto }) =>
            courseService.updateTeacherCourse(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
            toast.success('Öğretmen ataması başarıyla güncellendi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Öğretmen ataması güncellenirken bir hata oluştu');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => courseService.deleteTeacherCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
            toast.success('Öğretmen ataması başarıyla silindi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Öğretmen ataması silinirken bir hata oluştu');
        }
    });

    return {
        data: data ?? [],
        isLoading,
        error,
        refetch,
        createTeacherCourse: createMutation.mutate,
        updateTeacherCourse: updateMutation.mutate,
        deleteTeacherCourse: deleteMutation.mutate,
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

