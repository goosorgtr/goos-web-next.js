'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { homeworkService } from '@/lib/services/homework.service'
import { calculateGeneralStatus } from '@/modules/odev/services/homework.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { AdminOdevTable } from './AdminOdevTable'
import { AdminOdevFilters } from './AdminOdevFilters'
import { AdminOdevActions } from './AdminOdevActions'
import { AddOdevDialog } from './AddOdevDialog'
import { OdevDetailDialog } from './OdevDetailDialog'
import { EditOdevDialog } from './EditOdevDialog'
import { HomeworkGeneralStatus } from '@/modules/odev/types/homework.types'

export function AdminOdevDashboard() {
  const queryClient = useQueryClient()
  const hasCheckedOverdue = useRef(false)
  const hasUpdatedGeneralStatus = useRef(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string>('all')
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGeneralStatus, setSelectedGeneralStatus] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [viewingHomework, setViewingHomework] = useState<any | null>(null)
  const [editingHomework, setEditingHomework] = useState<any | null>(null)

  const { data: homeworksData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-homeworks', selectedClassId, selectedTeacherId],
    queryFn: async () => {
      const result = await homeworkService.getAll({
        sortBy: 'due_date',
        sortOrder: 'desc',
        limit: 1000 // Tüm ödevleri getir
      })
      if (!result.success) {
        throw new Error(result.message || 'Ödevler yüklenirken bir hata oluştu')
      }
      return result.data || []
    }
  })

  // Teslim tarihi geçmiş ödevleri otomatik olarak pasif yap ve pending olanları not_done yap
  useEffect(() => {
    if (!homeworksData || homeworksData.length === 0 || hasCheckedOverdue.current) return
    
    hasCheckedOverdue.current = true
    
    const updateOverdue = async () => {
      const result = await homeworkService.updateOverdueHomeworks()
      if (result.success) {
        // Eğer güncelleme yapıldıysa, ödevleri yeniden yükle
        queryClient.invalidateQueries({ queryKey: ['admin-homeworks'] })
        hasCheckedOverdue.current = false // Yeniden yüklendikten sonra tekrar kontrol edebilir
      }
    }
    
    updateOverdue()
  }, [homeworksData, queryClient])

  // General status'leri otomatik güncelle (sayfa açıldığında)
  useEffect(() => {
    if (!homeworksData || homeworksData.length === 0 || hasUpdatedGeneralStatus.current) return
    
    hasUpdatedGeneralStatus.current = true
    
    const updateGeneralStatuses = async () => {
      console.log('🔄 [AdminOdevDashboard] General statusler güncelleniyor...')
      let updatedCount = 0
      
      for (const homework of homeworksData) {
        if (!homework.id || !homework.dueDate) continue
        
        try {
          // Mevcut general_status'ü hesapla
          const calculatedStatus = await calculateGeneralStatus(homework.id, homework.dueDate)
          
          // Eğer mevcut status ile hesaplanan farklıysa güncelle
          if (homework.generalStatus !== calculatedStatus) {
            console.log(`🔄 [AdminOdevDashboard] Ödev ${homework.id} güncelleniyor: ${homework.generalStatus} → ${calculatedStatus}`)
            
            const { error } = await (supabase
              .from('homeworks') as any)
              .update({ general_status: calculatedStatus })
              .eq('id', homework.id)
            
            if (!error) {
              updatedCount++
            } else {
              console.error(`❌ [AdminOdevDashboard] Ödev ${homework.id} güncellenirken hata:`, error)
            }
          }
        } catch (error) {
          console.error(`❌ [AdminOdevDashboard] Ödev ${homework.id} için general status hesaplanırken hata:`, error)
        }
      }
      
      if (updatedCount > 0) {
        console.log(`✅ [AdminOdevDashboard] ${updatedCount} ödev için general status güncellendi`)
        // Ödevleri yeniden yükle
        queryClient.invalidateQueries({ queryKey: ['admin-homeworks'] })
        hasUpdatedGeneralStatus.current = false // Yeniden yüklendikten sonra tekrar kontrol edebilir
      }
    }
    
    updateGeneralStatuses()
  }, [homeworksData, queryClient])

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
    // camelCase field names (supabaseApi converts snake_case to camelCase)
    if (selectedClassId !== 'all' && hw.classId !== selectedClassId) {
      return false
    }
    if (selectedTeacherId !== 'all' && hw.teacherId !== selectedTeacherId) {
      return false
    }
    // Görünürlük filtresi (aktif/pasif)
    if (selectedStatus !== 'all') {
      const isActive = hw.isActive
      
      if (selectedStatus === 'active') {
        if (!isActive) return false
      } else if (selectedStatus === 'inactive') {
        if (isActive) return false
      }
    }
    // General status filtresi
    if (selectedGeneralStatus !== 'all') {
      const generalStatus = hw.generalStatus
      if (selectedGeneralStatus !== generalStatus) return false
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
            selectedStatus={selectedStatus}
            selectedGeneralStatus={selectedGeneralStatus}
            onClassChange={setSelectedClassId}
            onTeacherChange={setSelectedTeacherId}
            onStatusChange={setSelectedStatus}
            onGeneralStatusChange={setSelectedGeneralStatus}
          />

          <AdminOdevActions onAddClick={() => setShowAddDialog(true)} />
        </div>
      </div>

      {/* Tablo */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <AdminOdevTable 
          homeworks={filteredHomeworks} 
          isLoading={isLoading}
          onViewClick={(homework) => setViewingHomework(homework)}
          onEditClick={(homework) => setEditingHomework(homework)}
        />
      </div>

      {/* Ödev Ekleme Modal */}
      <AddOdevDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Ödev Detay Modal */}
      <OdevDetailDialog
        open={!!viewingHomework}
        onOpenChange={(open) => !open && setViewingHomework(null)}
        homework={viewingHomework}
      />

      {/* Ödev Düzenleme Modal */}
      <EditOdevDialog
        open={!!editingHomework}
        onOpenChange={(open) => !open && setEditingHomework(null)}
        homework={editingHomework}
      />
    </div>
  )
}

