'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const response = await supabaseApi.getById('users', supabaseUser.id)
      
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
      } else {
        // Fallback to mock user for development
        const mockUser = getUserFromPath(pathname)
        if (mockUser) {
          setUser(mockUser)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Fallback to mock user
      const mockUser = getUserFromPath(pathname)
      if (mockUser) {
        setUser(mockUser)
      }
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          // Fallback to mock user for development
          const mockUser = getUserFromPath(pathname)
          if (mockUser) {
            setUser(mockUser)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/giris')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
      await supabase.auth.signOut()
      localStorage.removeItem('token')
      setUser(null)
      router.push('/giris')
    } catch (error) {
      console.error('Error signing out:', error)
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
