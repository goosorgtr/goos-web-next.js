import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import API_ENDPOINTS from '@/lib/api/endpoints'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ChangePasswordData
} from '@/types/user'
import { useAuthStore } from '@/store/auth-store'

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  const { setUser, setToken } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      )
      return data
    },
    onSuccess: (data) => {
      // Store auth data
      setUser(data.user)
      setToken(data.token)

      // Store tokens in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const { data: response } = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      )
      return response
    },
  })
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    },
    onSuccess: () => {
      // Clear auth data
      clearAuth()

      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')

      // Clear all queries
      queryClient.clear()
    },
  })
}

// Get current user query
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: User }>(
        API_ENDPOINTS.AUTH.ME
      )
      return data.data
    },
    enabled: isAuthenticated && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const { data: response } = await apiClient.post(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
      )
      return response
    },
  })
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      )
      return data
    },
  })
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const { data: response } = await apiClient.post(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      )
      return response
    },
  })
}

// Refresh token mutation
export function useRefreshToken() {
  const { setToken } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      const { data } = await apiClient.post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      )
      return data
    },
    onSuccess: (data) => {
      setToken(data.token)
      localStorage.setItem('token', data.token)
    },
  })
}
