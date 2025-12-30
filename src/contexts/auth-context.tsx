'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { Role } from '@/types/roles'

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
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isAuthenticated: boolean
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
  // URL'den kullanıcı rolünü belirleme fonksiyonu
  const getUserFromPath = (path: string | null) => {
    if (path?.startsWith('/admin')) return MOCK_USERS.ADMIN
    if (path?.startsWith('/veli')) return MOCK_USERS.VELI
    if (path?.startsWith('/ogrenci')) return MOCK_USERS.OGRENCI
    if (path?.startsWith('/ogretmen')) return MOCK_USERS.OGRETMEN
    if (path?.startsWith('/kantinci')) return MOCK_USERS.KANTINCI
    if (path?.startsWith('/servici')) return MOCK_USERS.SERVICI
    return null
  }

  const [user, setUser] = useState<User | null>(() => getUserFromPath(pathname))

  // URL değiştiğinde kullanıcıyı güncelle
  useEffect(() => {
    const newUser = getUserFromPath(pathname)
    if (newUser?.id !== user?.id) {
      setUser(newUser)
    }
  }, [pathname])

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
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
