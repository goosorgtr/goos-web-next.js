'use client'

import { useState } from 'react'
import { Search, Filter, Plus, MoreVertical, Edit, Trash2, Key } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditUserDialog } from '@/components/admin/kullanicilar/EditUserDialog'

// Mock data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Selin Yılmaz',
    avatar: '/avatars/selin.jpg',
    lastSeen: 'Son giriş: 2 dk önce',
    role: 'Admin',
    roleColor: 'bg-purple-100 text-purple-700',
    email: 'selin.y@goos.edu',
    userId: 'BAD-001',
    department: '-',
    status: 'Aktif',
    statusColor: 'text-green-600'
  },
  {
    id: '2',
    name: 'Mert Demir',
    avatar: '/avatars/mert.jpg',
    lastSeen: 'Son giriş: Dün',
    role: 'Öğretmen',
    roleColor: 'bg-orange-100 text-orange-700',
    email: 'mert.d@goos.edu',
    userId: 'TC-042',
    department: 'Matematik',
    status: 'Aktif',
    statusColor: 'text-green-600'
  },
  {
    id: '3',
    name: 'Elif Kaya',
    avatar: 'EK',
    lastSeen: 'Son giriş: 1 saat önce',
    role: 'Öğrenci',
    roleColor: 'bg-blue-100 text-blue-700',
    email: 'elif.kaya@ogrenci.goos.edu',
    userId: 'KT-809',
    department: '11-B Sınıfı',
    status: 'Aktif',
    statusColor: 'text-green-600'
  },
  {
    id: '4',
    name: 'Ahmet Koç',
    avatar: '/avatars/ahmet.jpg',
    lastSeen: 'Son giriş: 5 gün önce',
    role: 'Servici',
    roleColor: 'bg-gray-100 text-gray-700',
    email: 'ahmet.k@goos.edu',
    userId: 'SRV-02',
    department: 'Güney Güzergahı',
    status: 'Pasif',
    statusColor: 'text-gray-600'
  },
  {
    id: '5',
    name: 'Zeynep Öz',
    avatar: 'ZÖ',
    lastSeen: 'Son giriş: @nul',
    role: 'Veli Uzman',
    roleColor: 'bg-teal-100 text-teal-700',
    email: 'zeynep.oz@goos.edu',
    userId: 'DAT-09',
    department: 'IT Department',
    status: 'Aktif',
    statusColor: 'text-green-600'
  }
]

export default function KullanicilarRollerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filtreleme mantığı
  const filteredUsers = MOCK_USERS.filter((user) => {
    // Arama filtresi
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.userId.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower)

    // Rol filtresi
    const matchesRole = 
      selectedRole === 'all' ||
      user.role.toLowerCase() === selectedRole.toLowerCase() ||
      (selectedRole === 'ogretmen' && user.role === 'Öğretmen') ||
      (selectedRole === 'ogrenci' && user.role === 'Öğrenci')

    // Durum filtresi
    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.status === 'Aktif') ||
      (selectedStatus === 'inactive' && user.status === 'Pasif')

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Ana Sayfa', href: '/admin' },
          { label: 'Yönetim', href: '/admin' },
          { label: 'Kullanıcılar ve Roller' }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kullanıcılar ve Roller</h1>
          <p className="text-sm text-muted-foreground">
            Tüm okul paydaşlarını, yetkilerini ve rollerini tek bir yerden yönetin.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Kullanıcı Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</p>
              <p className="mt-2 text-3xl font-bold">2,452</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-green-600">+12%</span>
            <span className="text-muted-foreground">geçen aylara göre</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Öğretmenler</p>
              <p className="mt-2 text-3xl font-bold">124</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Aktif kadro</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Öğrenciler</p>
              <p className="mt-2 text-3xl font-bold">1,850</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-green-600">+5</span>
            <span className="text-muted-foreground">yeni kayıt</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="İsim, E-posta, TC Kimlik veya ID ile ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="ogretmen">Öğretmen</option>
              <option value="ogrenci">Öğrenci</option>
              <option value="veli">Veli</option>
              <option value="servici">Servici</option>
              <option value="kantinci">Kantinci</option>
            </select>
            <select 
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Durum: Hepsi</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
            <button className="rounded-lg border p-2 hover:bg-gray-50">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Kullanıcı Bilgisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İletişim / ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Bölüm / Sınıf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Durum
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Arama kriterlerinize uygun kullanıcı bulunamadı
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Lütfen farklı arama kriterleri deneyin
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar.startsWith('/') ? (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                            {user.avatar}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.lastSeen}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${user.roleColor}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{user.email}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.userId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          user.status === 'Aktif' ? 'bg-green-600' : 'bg-gray-400'
                        }`}></span>
                        <span className={`text-sm font-medium ${user.statusColor}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="rounded-lg p-1 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openMenuId === user.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-8 z-20 w-48 rounded-lg border bg-white shadow-lg">
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setEditDialogOpen(true)
                                  setOpenMenuId(null)
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span>Düzenle</span>
                              </button>
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50">
                                <Key className="h-4 w-4 text-orange-600" />
                                <span>Şifre Değiştir</span>
                              </button>
                              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                <span>Sil</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Toplam <span className="font-medium">{filteredUsers.length}</span> kayıt {filteredUsers.length > 0 && `gösteriliyor`}
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              ‹
            </button>
            <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white">
              1
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              2
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              3
            </button>
            <span className="px-2 text-sm text-muted-foreground">...</span>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              8
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={selectedUser}
        />
      )}
    </div>
  )
}
