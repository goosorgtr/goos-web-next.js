import { supabase } from '@/lib/supabase/client'
import { supabaseApi } from '@/lib/supabase/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData extends LoginCredentials {
  firstName: string
  lastName: string
  phone?: string
  roleId: string
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, data: data.user }
  },

  /**
   * Sign up new user
   */
  async signUp(userData: SignUpData) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) {
      return { success: false, message: authError.message }
    }

    if (!authData.user) {
      return { success: false, message: 'Failed to create user' }
    }

    // Create user profile
    const profileResult = await supabaseApi.create('users', {
      id: authData.user.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      roleId: userData.roleId,
      isActive: true,
    })

    if (!profileResult.success) {
      // Rollback: delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: 'Failed to create user profile' }
    }

    return { success: true, data: authData.user }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true }
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, data: data.session }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, data: user }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sifre-yenileme`,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: 'Password reset email sent' }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: 'Password updated successfully' }
  },
}

export default authService
