import { supabase } from '@/lib/supabase/client'
import { supabaseApi } from '@/lib/supabase/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface TcLoginCredentials {
  tcNo: string
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
   * Sign in with TC Number and password
   * First finds user by TC number, then uses their email to authenticate
   */
  async signInWithTcNo(credentials: TcLoginCredentials) {
    try {
      // Find user by TC number
      const { data: users, error: queryError } = await supabase
        .from('users')
        .select('email, is_active')
        .eq('tc_no', credentials.tcNo)
        .limit(1)

      if (queryError) {
        return { success: false, message: 'Veritabanı hatası: ' + queryError.message }
      }

      if (!users || users.length === 0) {
        return { success: false, message: 'TC Kimlik Numarası ile eşleşen kullanıcı bulunamadı' }
      }

      const user = users[0]

      // Check if user is active
      if (!user.is_active) {
        return { success: false, message: 'Hesabınız aktif değil. Lütfen yöneticinize başvurun' }
      }

      // Check if email exists
      if (!user.email) {
        return { success: false, message: 'Kullanıcı e-posta adresi bulunamadı' }
      }

      // Use email to sign in with Supabase Auth
      return await this.signIn({
        email: user.email,
        password: credentials.password
      })
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu'
      }
    }
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
