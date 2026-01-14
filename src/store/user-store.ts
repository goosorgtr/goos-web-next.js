import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tables } from '@/lib/supabase/types'
import userService from '@/lib/services/user.service'

type User = Tables<'users'>

interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
  
  // Actions
  setCurrentUser: (user: User | null) => void
  fetchUsers: () => Promise<void>
  fetchUserById: (id: string) => Promise<User | null>
  updateUser: (id: string, data: Partial<User>) => Promise<boolean>
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      loading: false,
      error: null,

      setCurrentUser: (user) => {
        set({ currentUser: user })
      },

      fetchUsers: async () => {
        set({ loading: true, error: null })
        
        try {
          const result = await userService.getAll({ limit: 100 })
          
          if (result.success && result.data) {
            set({ 
              users: result.data,
              loading: false 
            })
          } else {
            set({ 
              error: 'message' in result ? result.message : 'Failed to fetch users',
              loading: false 
            })
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
        }
      },

      fetchUserById: async (id: string) => {
        try {
          const result = await userService.getById(id)
          
          if (result.success && result.data) {
            return result.data
          }
          
          return null
        } catch (error) {
          console.error('Error fetching user:', error)
          return null
        }
      },

      updateUser: async (id: string, data: Partial<User>) => {
        try {
          const result = await userService.update(id, data)
          
          if (result.success) {
            // Update in store if it's the current user
            const { currentUser } = get()
            if (currentUser?.id === id) {
              set({ currentUser: { ...currentUser, ...data } })
            }
            
            return true
          }
          
          return false
        } catch (error) {
          console.error('Error updating user:', error)
          return false
        }
      },

      clearUser: () => {
        set({ currentUser: null, users: [], error: null })
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ currentUser: state.currentUser })
    }
  )
)

export default useUserStore
