'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Plus, MoreVertical, Edit, Trash2, Key, ChevronDown } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditUserDialog } from '@/components/admin/kullanicilar/EditUserDialog'
import { AddUserDialog } from '@/components/admin/kullanicilar/AddUserDialog'
import { useKullanicilar } from '@/modules/kullanicilar/hooks/useKullanicilar'
import type { Kullanici } from '@/modules/kullanicilar/types'
import { toast } from 'sonner'
import { getAvatarColorByRole } from '@/lib/utils/avatar-utils'
import { getRoleColorByName } from '@/lib/utils/role-utils'

export function AdminKullanicilarDashboard() {
    const { data: users, isLoading, createKullanici, deleteKullanici, isCreating, isDeleting } = useKullanicilar()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)

    // Benzersiz rolleri hesapla
    const availableRoles = useMemo(() => {
        const roles = new Set((users as Kullanici[]).map(user => user.role).filter(Boolean))
        return Array.from(roles).sort()
    }, [users])

    // Filtreleme mantığı
    const filteredUsers = (users as Kullanici[]).filter((user) => {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
            searchQuery === '' ||
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.userId.toLowerCase().includes(searchLower) ||
            (user.tcNo && user.tcNo.includes(searchLower)) ||
            user.department.toLowerCase().includes(searchLower)

        const matchesRole =
            selectedRole === 'all' ||
            user.role.toLowerCase() === selectedRole.toLowerCase()

        const matchesStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'active' && user.status === 'Aktif') ||
            (selectedStatus === 'inactive' && user.status === 'Pasif')

        return matchesSearch && matchesRole && matchesStatus
    })

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Yükleniyor...</div>

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Ana Sayfa', href: '/admin' },
                    { label: 'Yönetim', href: '/admin' },
                    { label: 'Kullanıcılar ve Roller' }
                ]}
            />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Kullanıcılar ve Roller</h1>
                    <p className="text-sm text-muted-foreground">
                        Tüm okul paydaşlarını, yetkilerini ve rollerini tek bir yerden yönetin.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Yeni Kullanıcı Ekle
                </Button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="İsim, E-posta, TC Kimlik veya ID ile ara..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Rol Filtresi */}
                    <div className="flex gap-2">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="all">Tüm Roller</option>
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>

                        {/* Durum Filtresi */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>

                        {/* Filtre Sayacı */}
                        {(selectedRole !== 'all' || selectedStatus !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedRole('all')
                                    setSelectedStatus('all')
                                }}
                                className="text-sm"
                            >
                                Filtreleri Temizle
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sonuç Sayısı */}
                <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-gray-900">{filteredUsers.length}</span> kullanıcı gösteriliyor
                        {(users as Kullanici[]).length !== filteredUsers.length && (
                            <span className="ml-1">
                                (Toplam: {(users as Kullanici[]).length})
                            </span>
                        )}
                    </p>
                    {selectedRole !== 'all' && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Filtre:</span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRoleColorByName(selectedRole)}`}>
                                {selectedRole}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Kullanıcı Bilgisi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">İletişim / ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Durum</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-12 w-12 text-gray-300" />
                                            <p className="text-sm font-medium text-gray-900">Kullanıcı bulunamadı</p>
                                            <p className="text-xs text-muted-foreground">
                                                Farklı filtreler veya arama terimleri deneyin
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getAvatarColorByRole(user.role)} text-white font-semibold`}>
                                                    {user.name.charAt(0)}
                                                </div>
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
                                        <td className="px-6 py-4 text-sm">
                                            {user.email}
                                            <p className="text-xs text-muted-foreground">ID: {user.userId}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block h-2 w-2 rounded-full ${user.status === 'Aktif' ? 'bg-green-600' : 'bg-gray-400'} mr-2`} />
                                            <span className="text-sm font-medium">{user.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <MoreVertical className="h-5 w-5 text-gray-400" />
                                                </button>
                                                {openMenuId === user.id && (
                                                    <div className="absolute right-0 top-8 z-20 w-48 rounded-lg border bg-white shadow-lg">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setEditDialogOpen(true)
                                                                setOpenMenuId(null)
                                                            }}
                                                            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                                                        >
                                                            <Edit className="h-4 w-4" /> Düzenle
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
                                                                    try {
                                                                        await deleteKullanici(user.id)
                                                                        toast.success('Kullanıcı başarıyla silindi')
                                                                    } catch (error) {
                                                                        toast.error('Kullanıcı silinemedi')
                                                                    }
                                                                }
                                                                setOpenMenuId(null)
                                                            }}
                                                            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> {isDeleting ? 'Siliniyor...' : 'Sil'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialogs */}
            <AddUserDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSubmit={async (data) => {
                    try {
                        await createKullanici(data)
                        toast.success('Kullanıcı başarıyla oluşturuldu!')
                        setAddDialogOpen(false)
                    } catch (error) {
                        toast.error(error instanceof Error ? error.message : 'Kullanıcı oluşturulamadı')
                    }
                }}
                isLoading={isCreating}
            />

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
