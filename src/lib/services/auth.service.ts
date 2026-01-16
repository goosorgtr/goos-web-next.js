import { supabase } from '@/lib/supabase/client'
import { supabaseApi } from '@/lib/supabase/api'
import type { LoginCredentials, TcLoginCredentials, SignUpData } from '@/modules/auth/types'

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials) {
    console.log('🟡 [AUTH SERVICE] signIn başlatıldı:', { email: credentials.email.substring(0, 3) + '***' })
    const startTime = Date.now()

    try {
      console.log('🔵 [AUTH SERVICE] supabase.auth.signInWithPassword çağrılıyor...')
      const signInCallStart = Date.now()

      // Önce mevcut session'ı kontrol et
      const { data: existingSession } = await supabase.auth.getSession()
      console.log('🔵 [AUTH SERVICE] Mevcut session kontrol edildi:', {
        hasSession: !!existingSession.session
      })

      // signInWithPassword çağrısını başlat (fire-and-forget yaklaşımı)
      const signInPromise = supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      // Promise'i arka planda çalıştır, hata olursa logla ama bekleme
      signInPromise.catch((err) => {
        console.log('🟡 [AUTH SERVICE] signInWithPassword promise hatası (arka plan):', err)
      })

      // 3 saniye içinde session'ı kontrol et (daha agresif)
      console.log('🔵 [AUTH SERVICE] Session kontrolü başlatıldı (max 3s bekleme)...')
      let sessionFound = false
      let signInResult: any = null

      // Her 200ms'de bir session kontrolü yap (max 15 deneme = 3 saniye)
      for (let i = 0; i < 15; i++) {
        await new Promise(resolve => setTimeout(resolve, 200))

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionData?.session?.user && !sessionError) {
          console.log(`🟢 [AUTH SERVICE] Session bulundu (deneme ${i + 1}/15):`, {
            userId: sessionData.session.user.id,
            waitTime: (i + 1) * 200 + 'ms'
          })
          sessionFound = true
          signInResult = {
            data: {
              user: sessionData.session.user,
              session: sessionData.session
            },
            error: null
          }
          break
        }

        // Promise tamamlanmış mı kontrol et (non-blocking)
        try {
          const result = await Promise.race([
            signInPromise.then(r => ({ type: 'success', data: r })),
            new Promise(resolve => setTimeout(() => resolve({ type: 'timeout' }), 50))
          ]) as any

          if (result.type === 'success') {
            console.log(`🟢 [AUTH SERVICE] signInWithPassword promise tamamlandı (deneme ${i + 1})`)
            signInResult = result.data
            sessionFound = true
            break
          }
        } catch (err) {
          // Promise henüz tamamlanmamış, devam et
        }
      }

      if (!sessionFound) {
        // Son bir kez promise'i kontrol et
        console.log('🟡 [AUTH SERVICE] Session bulunamadı, promise son kontrolü yapılıyor...')
        try {
          const result = await Promise.race([
            signInPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
          ])
          signInResult = result
          sessionFound = true
        } catch (err: any) {
          console.log('🔴 [AUTH SERVICE] Promise timeout, session kontrol ediliyor...')
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData?.session?.user) {
            console.log('🟢 [AUTH SERVICE] Son kontrol: Session mevcut!')
            signInResult = {
              data: {
                user: sessionData.session.user,
                session: sessionData.session
              },
              error: null
            }
            sessionFound = true
          }
        }
      }

      if (!sessionFound || !signInResult) {
        console.log('🔴 [AUTH SERVICE] Session bulunamadı ve promise tamamlanmadı')
        return { success: false, message: 'Giriş yapılamadı: Session oluşturulamadı' }
      }

      const { data, error } = signInResult

      const callDuration = Date.now() - signInCallStart
      console.log('🔵 [AUTH SERVICE] signInWithPassword işlemi tamamlandı:', {
        duration: callDuration + 'ms',
        hasData: !!data,
        hasError: !!error,
        hasUser: !!data?.user,
        hasSession: !!data?.session
      })

      if (error) {
        console.log('🔴 [AUTH SERVICE] signIn hatası:', {
          message: error.message,
          status: error.status,
          code: error.name,
          duration: Date.now() - startTime + 'ms'
        })
        return { success: false, message: error.message }
      }

      if (!data) {
        console.log('🔴 [AUTH SERVICE] signIn: data yok ama error da yok')
        return { success: false, message: 'Giriş yapılamadı: Veri alınamadı' }
      }

      console.log('🟢 [AUTH SERVICE] signIn başarılı:', {
        userId: data.user?.id,
        email: data.user?.email,
        duration: Date.now() - startTime + 'ms',
        hasSession: !!data.session,
        sessionExpiresAt: data.session?.expires_at,
        accessToken: data.session?.access_token ? 'Mevcut' : 'Yok'
      })

      // Session'ın localStorage'a kaydedildiğini kontrol et
      if (typeof window !== 'undefined') {
        const storageKeys = Object.keys(localStorage).filter(key => key.includes('supabase'))
        console.log('🔵 [AUTH SERVICE] localStorage Supabase keys:', storageKeys)
      }

      return { success: true, data: data.user }
    } catch (err: any) {
      console.error('🔴 [AUTH SERVICE] signIn beklenmeyen hata:', {
        error: err,
        message: err?.message,
        name: err?.name,
        duration: Date.now() - startTime + 'ms'
      })

      // Timeout hatası ise özel mesaj
      if (err?.message?.includes('timeout')) {
        return { success: false, message: 'Giriş işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.' }
      }

      throw err
    }
  },

  /**
   * Sign in with TC Number and password
   * First finds user by TC number, then uses their email to authenticate
   */
  async signInWithTcNo(credentials: TcLoginCredentials) {
    console.log('🟡 [AUTH SERVICE] signInWithTcNo başlatıldı:', { tcNo: credentials.tcNo.substring(0, 3) + '***' })
    const startTime = Date.now()

    try {
      // Find user by TC number
      console.log('🔵 [AUTH SERVICE] TC numarası ile kullanıcı aranıyor...')
      const queryStart = Date.now()
      const { data: users, error: queryError } = await supabase
        .from('users')
        .select('email, is_active')
        .eq('tc_no', credentials.tcNo)
        .limit(1)

      console.log('🔵 [AUTH SERVICE] Kullanıcı sorgusu tamamlandı:', {
        duration: Date.now() - queryStart + 'ms',
        hasError: !!queryError,
        userCount: users?.length || 0
      })

      if (queryError) {
        console.log('🔴 [AUTH SERVICE] Veritabanı hatası:', queryError.message)
        return { success: false, message: 'Veritabanı hatası: ' + queryError.message }
      }

      if (!users || users.length === 0) {
        console.log('🔴 [AUTH SERVICE] TC numarası ile kullanıcı bulunamadı')
        return { success: false, message: 'TC Kimlik Numarası ile eşleşen kullanıcı bulunamadı' }
      }

      const user = users[0]
      console.log('🟢 [AUTH SERVICE] Kullanıcı bulundu:', {
        email: user.email?.substring(0, 3) + '***',
        isActive: user.is_active
      })

      // Check if user is active
      if (!user.is_active) {
        console.log('🔴 [AUTH SERVICE] Kullanıcı hesabı aktif değil')
        return { success: false, message: 'Hesabınız aktif değil. Lütfen yöneticinize başvurun' }
      }

      // Check if email exists
      if (!user.email) {
        console.log('🔴 [AUTH SERVICE] Kullanıcı e-posta adresi yok')
        return { success: false, message: 'Kullanıcı e-posta adresi bulunamadı' }
      }

      // Use email to sign in with Supabase Auth
      console.log('🔵 [AUTH SERVICE] E-posta ile giriş yapılıyor...')
      const signInResult = await this.signIn({
        email: user.email,
        password: credentials.password
      })

      console.log('🟢 [AUTH SERVICE] signInWithTcNo tamamlandı:', {
        success: signInResult.success,
        totalDuration: Date.now() - startTime + 'ms'
      })

      return signInResult
    } catch (error) {
      console.error('🔴 [AUTH SERVICE] signInWithTcNo beklenmeyen hata:', error)
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
    console.log('🟡 [AUTH SERVICE] getSession başlatıldı')
    const startTime = Date.now()

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.log('🔴 [AUTH SERVICE] getSession hatası:', {
          message: error.message,
          duration: Date.now() - startTime + 'ms'
        })
        return { success: false, message: error.message }
      }

      console.log('🟢 [AUTH SERVICE] getSession başarılı:', {
        hasSession: !!data.session,
        hasUser: !!data.session?.user,
        userId: data.session?.user?.id,
        expiresAt: data.session?.expires_at,
        duration: Date.now() - startTime + 'ms'
      })

      return { success: true, data: data.session }
    } catch (err) {
      console.error('🔴 [AUTH SERVICE] getSession beklenmeyen hata:', err)
      throw err
    }
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
