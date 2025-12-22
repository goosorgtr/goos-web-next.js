# Rol ve İzin Sistemi Dokümantasyonu

## 📋 Genel Bakış

Bu sistem, 6 farklı rol ve 12 modül için kapsamlı bir izin yönetimi sağlar.

## 🎭 Roller

| Rol | Açıklama | Erişim Seviyesi |
|-----|----------|-----------------|
| **ADMIN** | Sistem Yöneticisi | Tüm modüllerde tam yetki |
| **OGRETMEN** | Öğretmen | Eğitim modüllerinde yetki |
| **OGRENCI** | Öğrenci | Görüntüleme ve kendi işlemleri |
| **VELI** | Veli | Çocuk takibi ve ödeme |
| **KANTINCI** | Kantin Görevlisi | Kantin yönetimi |
| **SERVICI** | Servis Şoförü | Servis ve konum yönetimi |

## 📦 Modüller

1. **konum** - Konum Takibi
2. **odev** - Ödevler
3. **mesaj** - Mesajlaşma
4. **servis** - Servis Yönetimi
5. **odeme** - Ödemeler
6. **kantin** - Kantin
7. **etkinlik** - Etkinlikler
8. **duyuru** - Duyurular
9. **devamsizlik** - Devamsızlık
10. **notlar** - Notlar
11. **ders-programi** - Ders Programı
12. **donem** - Dönem

## 🔐 İzin Tipleri

- **create** - Yeni kayıt oluşturma
- **read** - Kayıtları görüntüleme
- **update** - Kayıtları güncelleme
- **delete** - Kayıtları silme

## 📊 Rol-Modül Erişim Matrisi

### Admin (Yönetici)
✅ Tüm modüllerde tam yetki (CRUD)

### Öğretmen
| Modül | İzinler | Açıklama |
|-------|---------|----------|
| Konum | 👁️ Görüntüle | Öğrenci konumunu görüntüle |
| Ödev | ➕ Oluştur, 👁️ Görüntüle, ✏️ Güncelle | Ödev oluştur, notla |
| Mesaj | ➕ Oluştur, 👁️ Görüntüle | Öğrenci/Veli iletişim |
| Etkinlik | ➕ Oluştur, 👁️ Görüntüle | Etkinlik oluştur |
| Duyuru | ➕ Oluştur, 👁️ Görüntüle | Duyuru yayınla |
| Devamsızlık | ➕ Oluştur, 👁️ Görüntüle | Yoklama al |
| Notlar | ➕ Oluştur, 👁️ Görüntüle, ✏️ Güncelle | Not gir |
| Ders Programı | 👁️ Görüntüle | Kendi derslerini görüntüle |
| Dönem | 👁️ Görüntüle | Dönem bilgisi |

### Öğrenci
| Modül | İzinler | Açıklama |
|-------|---------|----------|
| Konum | ➕ Oluştur, 👁️ Görüntüle | Konum paylaş (RFID/NFC) |
| Ödev | 👁️ Görüntüle, ✏️ Güncelle | Ödev görüntüle, teslim et |
| Mesaj | ➕ Oluştur, 👁️ Görüntüle | Mesajlaşma |
| Servis | 👁️ Görüntüle | Servis durumu |
| Ödeme | 👁️ Görüntüle | Bakiye görüntüle |
| Kantin | ➕ Oluştur, 👁️ Görüntüle | Sipariş ver |
| Etkinlik | 👁️ Görüntüle | Etkinlikleri görüntüle |
| Duyuru | 👁️ Görüntüle | Duyuruları görüntüle |
| Devamsızlık | 👁️ Görüntüle | Devamsızlık durumu |
| Notlar | 👁️ Görüntüle | Notları görüntüle |
| Ders Programı | 👁️ Görüntüle | Ders programı |
| Dönem | 👁️ Görüntüle | Dönem bilgisi |

### Veli
| Modül | İzinler | Açıklama |
|-------|---------|----------|
| Konum | 👁️ Görüntüle | Çocuk takibi (realtime) |
| Ödev | 👁️ Görüntüle | Çocuğun ödevleri |
| Mesaj | ➕ Oluştur, 👁️ Görüntüle | Öğretmen iletişim |
| Servis | 👁️ Görüntüle | Servis durumu |
| Ödeme | ➕ Oluştur, 👁️ Görüntüle | Ödeme yap |
| Kantin | ➕ Oluştur, 👁️ Görüntüle | Bakiye ekle |
| Etkinlik | 👁️ Görüntüle | Etkinlikler |
| Duyuru | 👁️ Görüntüle | Duyurular |
| Devamsızlık | 👁️ Görüntüle | Devamsızlık raporu |
| Notlar | 👁️ Görüntüle | Not raporu |
| Ders Programı | 👁️ Görüntüle | Çocuğun programı |
| Dönem | 👁️ Görüntüle | Dönem bilgisi |

### Kantinci
| Modül | İzinler | Açıklama |
|-------|---------|----------|
| Ödeme | 👁️ Görüntüle | Ödeme işlemleri |
| Kantin | ➕ Oluştur, 👁️ Görüntüle, ✏️ Güncelle, 🗑️ Sil | Tam yetki |

### Servici
| Modül | İzinler | Açıklama |
|-------|---------|----------|
| Konum | ➕ Oluştur, 👁️ Görüntüle, ✏️ Güncelle | Araç konumu (GPS) |
| Servis | ➕ Oluştur, 👁️ Görüntüle, ✏️ Güncelle, 🗑️ Sil | Rota yönetimi |
| Devamsızlık | 👁️ Görüntüle | Servise binmeyenler |

## 💻 Kullanım Örnekleri

### 1. Client-Side İzin Kontrolü (Hook)

```tsx
'use client'

import { usePermissions } from '@/lib/permissions/guards'

export function HomeworkActions({ role }: { role: Role }) {
  const { canCreate, canEdit, canDelete } = usePermissions(role, 'odev')

  return (
    <div className="flex gap-2">
      {canCreate && <CreateButton />}
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  )
}
```

### 2. Client-Side Component Guard

```tsx
import { PermissionGuard } from '@/lib/permissions/guards'

export function TeacherDashboard({ role }: { role: Role }) {
  return (
    <div>
      <h1>Ödev Yönetimi</h1>
      
      {/* Sadece oluşturma yetkisi olanlar görebilir */}
      <PermissionGuard role={role} module="odev" permission="create">
        <CreateHomeworkButton />
      </PermissionGuard>

      {/* Sadece silme yetkisi olanlar görebilir */}
      <PermissionGuard 
        role={role} 
        module="odev" 
        permission="delete"
        fallback={<p>Silme yetkiniz yok</p>}
      >
        <DeleteButton />
      </PermissionGuard>
    </div>
  )
}
```

### 3. Server-Side İzin Kontrolü

```tsx
// app/(dashboard)/ogretmen/odev/yeni/page.tsx
import { getServerSession } from 'next-auth'
import { requirePermission } from '@/lib/permissions/guards'

export default async function CreateHomeworkPage() {
  const session = await getServerSession()
  
  // İzin yoksa /unauthorized'a yönlendirir
  requirePermission(session.user.role, 'odev', 'create')

  return <CreateHomeworkForm />
}
```

### 4. Modül Erişim Kontrolü

```tsx
import { ModuleGuard } from '@/lib/permissions/guards'

export function Sidebar({ role }: { role: Role }) {
  return (
    <nav>
      {/* Sadece kantine erişimi olanlar görebilir */}
      <ModuleGuard role={role} module="kantin">
        <SidebarLink href="/kantin">Kantin</SidebarLink>
      </ModuleGuard>

      {/* Sadece servise erişimi olanlar görebilir */}
      <ModuleGuard role={role} module="servis">
        <SidebarLink href="/servis">Servis</SidebarLink>
      </ModuleGuard>
    </nav>
  )
}
```

### 5. Rol Bazlı Component Rendering

```tsx
'use client'

import { HomeworkCard } from '@/modules/odev/components/HomeworkCard'
import type { Role } from '@/types/roles'

export function HomeworkList({ role }: { role: Role }) {
  const { data: homeworks } = useHomework({ role })

  // Rol bazlı aksiyonlar
  const getActions = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return ['view', 'edit', 'delete', 'grade']
      case 'OGRETMEN':
        return ['view', 'edit', 'grade']
      case 'OGRENCI':
        return ['view', 'submit']
      case 'VELI':
        return ['view']
      default:
        return ['view']
    }
  }

  return (
    <div>
      {homeworks.map(hw => (
        <HomeworkCard
          key={hw.id}
          homework={hw}
          actions={getActions(role)}
        />
      ))}
    </div>
  )
}
```

## 🔧 Yardımcı Fonksiyonlar

### hasPermission
```tsx
import { hasPermission } from '@/lib/permissions/role-permissions'

// Bir rolün belirli bir izni olup olmadığını kontrol eder
const canEdit = hasPermission('OGRETMEN', 'odev', 'update')
```

### hasModuleAccess
```tsx
import { hasModuleAccess } from '@/lib/permissions/role-permissions'

// Bir rolün modüle erişimi olup olmadığını kontrol eder
const hasAccess = hasModuleAccess('KANTINCI', 'kantin')
```

### getAccessibleModules
```tsx
import { getAccessibleModules } from '@/lib/permissions/role-permissions'

// Bir rolün erişebildiği tüm modülleri döndürür
const modules = getAccessibleModules('OGRENCI')
// ['konum', 'odev', 'mesaj', 'servis', ...]
```

### getModulePermissions
```tsx
import { getModulePermissions } from '@/lib/permissions/role-permissions'

// Bir rolün belirli bir modüldeki tüm izinlerini döndürür
const permissions = getModulePermissions('OGRETMEN', 'odev')
// ['create', 'read', 'update']
```

## 🎯 En İyi Pratikler

1. **Server-Side Validation**: Her zaman server-side'da da izin kontrolü yapın
2. **Client-Side UX**: Client-side guard'lar sadece UX için, güvenlik için değil
3. **Fallback UI**: Guard'larda fallback UI sağlayın
4. **Type Safety**: TypeScript tiplerini kullanın
5. **Centralized Logic**: İzin mantığını merkezi tutun

## 🔒 Güvenlik Notları

- ⚠️ Client-side kontroller sadece UI için
- ✅ Kritik işlemler için server-side validation şart
- ✅ API route'larında izin kontrolü yapın
- ✅ Middleware ile route koruma ekleyin
