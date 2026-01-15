import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { toast } from 'sonner';

export function useClassStudents(classId: string | null) {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['class-students', classId],
        queryFn: () => classId ? classService.getStudentsByClass(classId) : Promise.resolve([]),
        enabled: !!classId
    });

    const { data: availableStudents, isLoading: isLoadingAvailable } = useQuery({
        queryKey: ['available-students'],
        queryFn: () => classService.getAvailableStudents(),
        enabled: !!classId
    });

    const addStudentMutation = useMutation({
        mutationFn: ({ studentId, classId }: { studentId: string; classId: string }) =>
            classService.addStudentToClass(studentId, classId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['class-students', classId] });
            queryClient.invalidateQueries({ queryKey: ['available-students'] });
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Öğrenci sınıfa eklendi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Öğrenci eklenirken bir hata oluştu');
        }
    });

    const removeStudentMutation = useMutation({
        mutationFn: (studentId: string) => classService.removeStudentFromClass(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['class-students', classId] });
            queryClient.invalidateQueries({ queryKey: ['available-students'] });
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Öğrenci sınıftan çıkarıldı');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Öğrenci çıkarılırken bir hata oluştu');
        }
    });

    return {
        students: data ?? [],
        availableStudents: availableStudents ?? [],
        isLoading,
        isLoadingAvailable,
        error,
        refetch,
        addStudent: addStudentMutation.mutate,
        removeStudent: removeStudentMutation.mutate,
        isAdding: addStudentMutation.isPending,
        isRemoving: removeStudentMutation.isPending
    };
}

