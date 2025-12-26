'use client'

import { useState } from 'react'
import { Plus, Search, ChevronDown, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Mock data
const MOCK_VEHICLES = [
  {
    id: '1',
    plate: '34 ABC 123',
    model: 'Ford Transit',
    capacity: 16,
    driver: 'Ahmet Yılmaz',
    status: 'active'
  },
  {
    id: '2',
    plate: '34 XYZ 456',
    model: 'Mercedes Sprinter',
    capacity: 20,
    driver: 'Fatma Kaya',
    status: 'active'
  },
  {
    id: '3',
    plate: '34 DEF 789',
    model: 'Volkswagen Crafter',
    capacity: 18,
    driver: 'Mehmet Öztürk',
    status: 'passive'
  }
]

const STATUS_OPTIONS = ['Tüm Durumlar', 'Aktif', 'Pasif']
const DRIVER_OPTIONS = ['Tüm Şoförler', 'Ahmet Yılmaz', 'Fatma Kaya', 'Mehmet Öztürk']

export default function OkulAraclariPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Tüm Durumlar')
  const [selectedDriver, setSelectedDriver] = useState('Tüm Şoförler')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showDriverDropdown, setShowDriverDropdown] = useState(false)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Yönetim Paneli</span>
        <span>›</span>
        <span className="font-medium text-foreground">Okul Araçları Yönetimi</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Okul Araçları Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            Okul servis araçlarını tanımlayın, ekleyin, düzenleyin ve silin.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Araç Ekle
        </Button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
        {/* Arama */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Plaka, model veya şoför ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Duruma Göre Filtrele */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <span>Duruma Göre Filtrele</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showStatusDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowStatusDropdown(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-white shadow-lg">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status)
                      setShowStatusDropdown(false)
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Şoföre Göre Filtrele */}
        <div className="relative">
          <button
            onClick={() => setShowDriverDropdown(!showDriverDropdown)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <span>Şoföre Göre Filtrele</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showDriverDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDriverDropdown(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-white shadow-lg">
                {DRIVER_OPTIONS.map((driver) => (
                  <button
                    key={driver}
                    onClick={() => {
                      setSelectedDriver(driver)
                      setShowDriverDropdown(false)
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                  >
                    {driver}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Araç Plakası
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Kapasite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Atanan Şoför
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Eylemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_VEHICLES.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  {/* Araç Plakası */}
                  <td className="px-6 py-4">
                    <p className="font-medium">{vehicle.plate}</p>
                  </td>

                  {/* Model */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                  </td>

                  {/* Kapasite */}
                  <td className="px-6 py-4">
                    <p className="text-sm">{vehicle.capacity}</p>
                  </td>

                  {/* Atanan Şoför */}
                  <td className="px-6 py-4">
                    <p className="text-sm">{vehicle.driver}</p>
                  </td>

                  {/* Durum */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        vehicle.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">
                        {vehicle.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </td>

                  {/* Eylemler */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Öğrenci Ata */}
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                        Öğrenci Ata
                      </button>
                      {/* Düzenle */}
                      <button className="rounded-lg p-2 text-yellow-600 hover:bg-yellow-50">
                        <Edit className="h-4 w-4" />
                      </button>
                      {/* Sil */}
                      <button className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
