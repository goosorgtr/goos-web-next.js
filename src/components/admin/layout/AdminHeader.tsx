'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function AdminHeader() {
  const { user } = useAuth()
  const [selectedSemester, setSelectedSemester] = useState('Güz 2024 Dönemi')

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo ve Yönetim */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold">GOOS Yönetim</h1>
            <p className="text-xs text-muted-foreground">Okul Yönetimi</p>
          </div>
        </div>

        {/* Dönem Seçici */}
        <div className="ml-4 flex items-center gap-2 rounded-lg border px-3 py-1.5 hover:bg-gray-50">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <select 
            className="border-none bg-transparent text-sm font-medium outline-none"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option>Güz 2024 Dönemi</option>
            <option>Bahar 2024 Dönemi</option>
            <option>Güz 2023 Dönemi</option>
          </select>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Arama */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Öğrenci, personel veya öyerleri ara..."
              className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        {/* Sağ Taraf - Bildirimler ve Profil */}
        <div className="flex items-center gap-3">
          {/* Bildirimler */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>

          {/* Profil */}
          <div className="flex items-center gap-3 rounded-lg border-l pl-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium">{user?.name || 'Jane Admin'}</p>
              <p className="text-xs text-muted-foreground">Süper Yönetici</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0) || 'J'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

