import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setToken: (token) =>
        set({
          token,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      clearAuth: () =>
        set({
          ...initialState,
          isLoading: false,
        }),

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selectors for better performance
export const selectUser = (state: AuthStore) => state.user
export const selectToken = (state: AuthStore) => state.token
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated
export const selectIsLoading = (state: AuthStore) => state.isLoading
