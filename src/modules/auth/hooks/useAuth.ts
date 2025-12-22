'use client'

import { useSession } from 'next-auth/react'
import type { Role } from '@/types/roles'

/**
 * Authentication hook
 * Provides user authentication state and role information
 * 
 * @example
 * const { user, role, isAuthenticated, isAdmin } = useAuth()
 */
export function useAuth() {
    const { data: session, status } = useSession()

    return {
        user: session?.user,
        role: session?.user?.role as Role | undefined,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        isAdmin: session?.user?.role === 'ADMIN',
        isTeacher: session?.user?.role === 'OGRETMEN',
        isStudent: session?.user?.role === 'OGRENCI',
        isParent: session?.user?.role === 'VELI',
        isCanteen: session?.user?.role === 'KANTINCI',
        isDriver: session?.user?.role === 'SERVICI',
    }
}
