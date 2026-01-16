'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { homeworkService } from '@/lib/services/homework.service'
import { useQuery } from '@tanstack/react-query'
import { AdminOdevTable } from './AdminOdevTable'
import { AdminOdevFilters } from './AdminOdevFilters'
import { AdminOdevStats } from './AdminOdevStats'
import { AdminOdevActions } from './AdminOdevActions'

export function AdminOdevDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string>('all')
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all')

  const { data: homeworksData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-homeworks', selectedClassId, selectedTeacherId],
    queryFn: async () => {
      const result = await homeworkService.getAll({
        sortBy: 'due_date',
        sortOrder: 'desc'
      })
      return result.data || []
    }
  })

  const homeworks = homeworksData || []

  const filteredHomeworks = homeworks.filter((hw: any) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const title = (hw.title || '').toLowerCase()
      const description = (hw.description || '').toLowerCase()
      if (!title.includes(searchLower) && !description.includes(searchLower)) {
        return false
      }
    }
    if (selectedClassId !== 'all' && hw.class_id !== selectedClassId) {
      return false
    }
    if (selectedTeacherId !== 'all' && hw.teacher_id !== selectedTeacherId) {
      return false
    }
    return true
  })

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Ödevler</h1>
        <div className="rounded-xl border bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ödevler yüklenirken bir hata oluştu.
            </p>
            <Button onClick={() => refetch()}>Tekrar Dene</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ödev Yönetimi</h1>
      </div>

      {/* Üst Bar - Arama ve Butonlar */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ödev başlığı veya açıklama ile ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <AdminOdevFilters
            selectedClassId={selectedClassId}
            selectedTeacherId={selectedTeacherId}
            onClassChange={setSelectedClassId}
            onTeacherChange={setSelectedTeacherId}
          />

          <AdminOdevActions />
        </div>
      </div>

      {/* İstatistikler */}
      <AdminOdevStats homeworks={filteredHomeworks} />

      {/* Tablo */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <AdminOdevTable 
          homeworks={filteredHomeworks} 
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

