'use client'

import { useState } from 'react'
import { Edit, Trash2, Zap, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock data
const MOCK_MENUS = [
  {
    id: '1',
    name: 'Ekim 2023 Yemek Menüsü',
    status: 'active',
    createdAt: '25 Eki 2023, 10:23'
  },
  {
    id: '2',
    name: 'Eylül 2023 Yemek Menüsü',
    status: 'passive',
    createdAt: '24 Eki 2023, 16:15'
  },
  {
    id: '3',
    name: 'Ağustos 2023 Yaz Okulu Menüsü',
    status: 'passive',
    createdAt: '20 Eki 2023, 09:00'
  }
]

export default function YemekListesiPage() {
  const [menuTitle, setMenuTitle] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('File dropped:', e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log('File selected:', e.target.files[0])
    }
  }

  const handleSave = () => {
    console.log('Saving menu:', menuTitle, isActive)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Yemek Listesi Yönetimi</h1>
        <p className="text-sm text-muted-foreground">
          Okul yemek menülerini buradan yönetebilir, yeni listeler ekleyebilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Sol Taraf - Mevcut Listeler */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-semibold">Mevcut Listeler</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              Tümünü Gör
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    YEMEK LİSTESİ ADI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    DURUM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    İŞLEMLER
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MOCK_MENUS.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50">
                    {/* Yemek Listesi Adı */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="font-medium">{menu.name}</p>
                      </div>
                    </td>

                    {/* Durum */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        menu.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {menu.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>

                    {/* İşlemler */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
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

          {/* Pagination */}
          <div className="flex items-center justify-center border-t p-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">‹</button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-white">1</button>
              <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">2</button>
              <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">3</button>
              <span className="px-2">...</span>
              <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">›</button>
            </div>
            <p className="ml-4 text-sm text-muted-foreground">
              Toplam 3 kayıt gösteriliyor
            </p>
          </div>
        </div>

        {/* Sağ Taraf - Hızlı Kaydet */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Hızlı Kaydet</h2>
          </div>

          <div className="space-y-4">
            {/* Yemek Listesi Adı */}
            <div className="space-y-2">
              <Label htmlFor="menu-title">Yemek Listesi Adı</Label>
              <Input
                id="menu-title"
                placeholder="Örn: Kasım Ayı Menüsü"
                value={menuTitle}
                onChange={(e) => setMenuTitle(e.target.value)}
              />
            </div>

            {/* PDF Yükleme Alanı */}
            <div className="space-y-2">
              <Label>PDF Yükleme Alanı</Label>
              <div
                className={`relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-center text-sm font-medium">
                    Dosyayı buraya sürükleyin
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    veya seçmek için{' '}
                    <span className="font-medium text-primary">tıklayın</span>
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sadece PDF dosyaları (Maks 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Aktif Yayınla Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="active-publish">Aktif Yayınla</Label>
              <button
                id="active-publish"
                onClick={() => setIsActive(!isActive)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isActive ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Kaydet Butonu */}
            <Button className="w-full gap-2" onClick={handleSave}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
