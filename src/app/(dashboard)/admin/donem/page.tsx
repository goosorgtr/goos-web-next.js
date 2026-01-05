'use client'

import { useState } from 'react'
import { Plus, Search, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSemesters } from '@/modules/donem/hooks/useSemesters'
import { AddDonemDialog } from '@/modules/donem/components/AddDonemDialog'
import { EditDonemDialog } from '@/modules/donem/components/EditDonemDialog'
import type { Donem } from '@/modules/donem/types'

export default function DonemPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingDonem, setEditingDonem] = useState<Donem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    data: semesters,
    isLoading,
    createSemester,
    updateSemester,
    deleteSemester,
    toggleActive,
    isCreating,
    isUpdating,
    isDeleting
  } = useSemesters()

  // Format date for display (YYYY-MM-DD to DD.MM.YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  // Filtreleme mantığı
  const filteredSemesters = semesters.filter((semester) => {
    // Arama filtresi
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === '' ||
      semester.name.toLowerCase().includes(searchLower) ||
      semester.startDate.includes(searchQuery) ||
      semester.endDate.includes(searchQuery)

    // Durum filtresi
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && semester.isActive) ||
      (statusFilter === 'inactive' && !semester.isActive)

    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" dönemini silmek istediğinizden emin misiniz?`)) {
      deleteSemester(id)
    }
  }

  const handleToggleActive = (id: string) => {
    toggleActive(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dönem</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            Excel
          </Button>
          <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            Dönem Tanımla
          </Button>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Dönem adı veya tarih ile ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dönem Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dönem Başlangıç Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dönem Bitiş Tarihi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Durum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredSemesters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Arama kriterlerinize uygun dönem bulunamadı
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Lütfen farklı arama kriterleri deneyin
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSemesters.map((semester) => (
                  <tr key={semester.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{semester.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{formatDate(semester.startDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{formatDate(semester.endDate)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(semester.id)}
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium transition-colors ${semester.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {semester.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDonem(semester)}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(semester.id, semester.name)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Sil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kayıt Sayısı */}
        {filteredSemesters.length > 0 && (
          <div className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Toplam <span className="font-medium">{filteredSemesters.length}</span> dönem gösteriliyor
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddDonemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(data) => {
          createSemester(data)
          setShowAddDialog(false)
        }}
        isLoading={isCreating}
      />

      <EditDonemDialog
        open={!!editingDonem}
        onOpenChange={(open) => !open && setEditingDonem(null)}
        donem={editingDonem}
        onSubmit={(id, data) => {
          updateSemester({ id, dto: data })
          setEditingDonem(null)
        }}
        isLoading={isUpdating}
      />
    </div>
  )
}
