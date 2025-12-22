import { useAuthStore } from '@/store/auth-store'
import {
  useLogin,
  useLogout,
  useRegister,
  useCurrentUser,
  useChangePassword,
  useForgotPassword,
  useResetPassword,
} from './api/use-auth-api'
import type { Role } from '@/constants'

/**
 * Combined authentication hook
 * Provides easy access to auth state and mutations
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const registerMutation = useRegister()
  const changePasswordMutation = useChangePassword()

  return {
    // State
    user,
    isAuthenticated,
    isLoading,

    // User info helpers
    userName: user ? `${user.firstName} ${user.lastName}` : '',
    userRole: user?.role as Role | undefined,
    userEmail: user?.email,

    // Auth mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    changePassword: changePasswordMutation.mutate,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    changePasswordError: changePasswordMutation.error,
  }
}

/**
 * Hook to check if user has specific role
 */
export function useRole(requiredRole: Role | Role[]): boolean {
  const { user } = useAuthStore()

  if (!user) return false

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }

  return user.role === requiredRole
}

/**
 * Hook for forgot password
 */
export function useForgotPasswordHook() {
  const mutation = useForgotPassword()

  return {
    sendResetEmail: mutation.mutate,
    sendResetEmailAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

/**
 * Hook for reset password
 */
export function useResetPasswordHook() {
  const mutation = useResetPassword()

  return {
    resetPassword: mutation.mutate,
    resetPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
