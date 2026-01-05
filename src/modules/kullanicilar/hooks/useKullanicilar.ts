import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kullanicilarService } from '../services/kullanicilar.service';
import type { Kullanici, CreateKullaniciDto, UpdateKullaniciDto } from '../types';

interface UseKullanicilarOptions {
    role?: string;
    userId?: string;
}

export function useKullanicilar(options?: UseKullanicilarOptions) {
    const queryClient = useQueryClient();
    const { role, userId } = options || {};

    const { data, isLoading, error } = useQuery({
        queryKey: ['kullanicilar', role, userId],
        queryFn: () => role && userId
            ? kullanicilarService.getByRole(role, userId)
            : kullanicilarService.getAll()
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateKullaniciDto) => kullanicilarService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kullanicilar'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateKullaniciDto }) =>
            kullanicilarService.update(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kullanicilar'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => kullanicilarService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kullanicilar'] });
        }
    });

    return {
        data: data ?? [],
        isLoading,
        error,
        createKullanici: createMutation.mutate,
        updateKullanici: updateMutation.mutate,
        deleteKullanici: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}
