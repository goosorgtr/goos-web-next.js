'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
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
  // Varsayılan olarak Admin kullanıcısı ile başla
  const [user, setUser] = useState<User | null>(MOCK_USERS.ADMIN)

  const value = {
    user,
    setUser,
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
