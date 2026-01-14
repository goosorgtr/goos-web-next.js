import { useQuery } from '@tanstack/react-query';
import { semesterService } from '../services/semester.service';
import type { Donem } from '../types';

export function useCurrentSemester() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['semesters', 'active'],
        queryFn: () => semesterService.getActiveSemester()
    });

    return {
        data: data ?? null,
        isLoading,
        error
    };
}

