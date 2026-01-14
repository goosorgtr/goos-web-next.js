import { useQuery } from '@tanstack/react-query'
import { supabaseApi } from '@/lib/supabase/api'
import type { Tables } from '@/lib/supabase/types'

export function useRoles() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await supabaseApi.getAll('roles', {
        filters: { isActive: true },
        sortBy: 'name',
        sortOrder: 'asc'
      })

      if (!response.success) {
        throw new Error('message' in response ? response.message : 'Failed to fetch roles')
      }

      return response.data as Tables<'roles'>[]
    }
  })

  return {
    roles: data ?? [],
    isLoading,
    error
  }
}
