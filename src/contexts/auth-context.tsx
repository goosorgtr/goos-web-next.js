'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { supabaseApi } from '@/lib/supabase/api'
import type { Role } from '@/types/roles'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  name: string
  role: Role
  email: string
  avatar?: string
  // Öğrenci için sınıf bilgisi
  class?: string
  // Öğretmen için branş bilgisi
  subject?: string
  // Supabase user data
  supabaseUser?: SupabaseUser
  roleId?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock kullanıcılar - Test için
export const MOCK_USERS: Record<Role, User> = {
  ADMIN: {
    id: '1',
    name: 'Admin User',
    role: 'ADMIN',
    email: 'admin@goos.com',
  },
  VELI: {
    id: '2',
    name: 'Ayşe Yılmaz',
    role: 'VELI',
    email: 'ayse.yilmaz@goos.com',
  },
  OGRENCI: {
    id: '3',
    name: 'Ahmet Yılmaz',
    role: 'OGRENCI',
    email: 'ahmet.yilmaz@goos.com',
    class: '10/A',
  },
  OGRETMEN: {
    id: '4',
    name: 'Hakan Yılmaz',
    role: 'OGRETMEN',
    email: 'hakan.yilmaz@goos.com',
    subject: 'Matematik',
  },
  KANTINCI: {
    id: '5',
    name: 'Mehmet Demir',
    role: 'KANTINCI',
    email: 'mehmet.demir@goos.com',
  },
  SERVICI: {
    id: '6',
    name: 'Ali Kaya',
    role: 'SERVICI',
    email: 'ali.kaya@goos.com',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // URL'den kullanıcı rolünü belirleme fonksiyonu (backward compatibility)
  const getUserFromPath = (path: string | null) => {
    if (path?.startsWith('/admin')) return MOCK_USERS.ADMIN
    if (path?.startsWith('/veli')) return MOCK_USERS.VELI
    if (path?.startsWith('/ogrenci')) return MOCK_USERS.OGRENCI
    if (path?.startsWith('/ogretmen')) return MOCK_USERS.OGRETMEN
    if (path?.startsWith('/kantinci')) return MOCK_USERS.KANTINCI
    if (path?.startsWith('/servici')) return MOCK_USERS.SERVICI
    return null
  }

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser, shouldRedirect = false) => {
    console.log('🟡 [AUTH CONTEXT] fetchUserProfile başlatıldı:', { 
      userId: supabaseUser.id,
      shouldRedirect 
    })
    const startTime = Date.now()
    
    try {
      const response = await supabaseApi.getById('users', supabaseUser.id)
      console.log('🔵 [AUTH CONTEXT] User profile alındı:', { 
        success: response.success,
        duration: Date.now() - startTime + 'ms'
      })

      if (response.success && response.data) {
        const userData = response.data

        // Get role name
        const roleResponse = await supabaseApi.getById('roles', userData.roleId || '')
        const roleName = roleResponse.success ? roleResponse.data.name : 'OGRENCI'

        // Map role name to Role type
        const roleMap: Record<string, Role> = {
          'admin': 'ADMIN',
          'veli': 'VELI',
          'ogrenci': 'OGRENCI',
          'ogretmen': 'OGRETMEN',
          'kantinci': 'KANTINCI',
          'servici': 'SERVICI'
        }

        const mappedUser: User = {
          id: userData.id,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: userData.email || supabaseUser.email || '',
          role: roleMap[roleName.toLowerCase()] || 'OGRENCI',
          avatar: userData.profileImageUrl || undefined,
          supabaseUser,
          roleId: userData.roleId || undefined
        }

        setUser(mappedUser)
        console.log('🟢 [AUTH CONTEXT] User set edildi:', { 
          userId: mappedUser.id,
          role: mappedUser.role
        })

        // Redirect to role-based dashboard after successful login
        if (shouldRedirect) {
          const roleRoutes: Record<Role, string> = {
            'ADMIN': '/admin',
            'VELI': '/veli',
            'OGRENCI': '/ogrenci',
            'OGRETMEN': '/ogretmen',
            'KANTINCI': '/kantinci',
            'SERVICI': '/servici'
          }

          const redirectPath = roleRoutes[mappedUser.role] || '/admin'
          console.log('🟢 [AUTH CONTEXT] Yönlendirme yapılıyor:', { 
            role: mappedUser.role,
            redirectPath,
            totalDuration: Date.now() - startTime + 'ms'
          })
          router.push(redirectPath)
          console.log('🟢 [AUTH CONTEXT] router.push çağrıldı')
        }
      } else {
        // Fallback to mock user for development
        const mockUser = getUserFromPath(pathname)
        if (mockUser) {
          setUser(mockUser)
        }
        // If shouldRedirect is true but user not found, redirect to admin
        if (shouldRedirect) {
          router.push('/admin')
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Fallback to mock user
      const mockUser = getUserFromPath(pathname)
      if (mockUser) {
        setUser(mockUser)
      }
      // If shouldRedirect is true, redirect even on error
      if (shouldRedirect) {
        router.push('/admin')
      }
    } finally {
      setLoading(false)
    }
  }, [pathname, router])

  // Initialize auth state
  useEffect(() => {
    let isMounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const initAuth = async () => {
      try {
        // Check for existing session with abort signal
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          // Fallback to mock user for development
          const mockUser = getUserFromPath(pathname)
          if (mockUser && isMounted) {
            setUser(mockUser)
          }
          if (isMounted) {
            setLoading(false)
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error initializing auth:', error)
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes with proper cleanup
    try {
      console.log('🟡 [AUTH CONTEXT] onAuthStateChange listener kuruluyor...')
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🟡 [AUTH CONTEXT] onAuthStateChange event tetiklendi:', { 
            event, 
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id
          })
          
          if (!isMounted) {
            console.log('🔴 [AUTH CONTEXT] Component unmounted, event işlenmiyor')
            return
          }

          try {
            if (event === 'SIGNED_IN' && session?.user) {
              console.log('🟢 [AUTH CONTEXT] SIGNED_IN event, fetchUserProfile çağrılıyor...')
              // Redirect to dashboard after successful login
              await fetchUserProfile(session.user, true)
              console.log('🟢 [AUTH CONTEXT] fetchUserProfile tamamlandı')
            } else if (event === 'SIGNED_OUT') {
              console.log('🔴 [AUTH CONTEXT] SIGNED_OUT event')
              if (isMounted) {
                // Cache'i temizle
                queryClient.clear()
                setUser(null)
                router.push('/giris')
              }
            } else if (event === 'TOKEN_REFRESHED') {
              // Token yenilendiğinde cache'i invalidate et
              console.log('🟡 [AUTH CONTEXT] TOKEN_REFRESHED event, cache invalidate ediliyor')
              queryClient.invalidateQueries()
            } else {
              console.log('🔵 [AUTH CONTEXT] Diğer event:', event)
            }
          } catch (error) {
            if (isMounted) {
              console.error('🔴 [AUTH CONTEXT] Error in auth state change:', error)
            }
          }
        }
      )
      subscription = authSubscription
      console.log('🟢 [AUTH CONTEXT] onAuthStateChange listener kuruldu')
    } catch (error) {
      console.error('🔴 [AUTH CONTEXT] Error setting up auth listener:', error)
    }

    return () => {
      isMounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [pathname, router, fetchUserProfile, queryClient])

  // URL değiştiğinde kullanıcıyı güncelle (backward compatibility)
  useEffect(() => {
    if (!user) {
      const newUser = getUserFromPath(pathname)
      if (newUser) {
        setUser(newUser)
      }
    }
  }, [pathname])

  const logout = async () => {
    try {
      // Önce cache'i temizle
      queryClient.clear()
      
      await supabase.auth.signOut()
      localStorage.removeItem('token')
      setUser(null)
      router.push('/giris')
    } catch (error) {
      console.error('Error signing out:', error)
      // Hata olsa bile cache'i temizle
      queryClient.clear()
    }
  }

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
