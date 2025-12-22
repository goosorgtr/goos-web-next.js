# 🏗️ 3-Katmanlı Mimari - Final Yapı

## 📊 MİMARİ KATMANLAR

```
┌─────────────────────────────────────────────────────────┐
│  KATMAN 1: app/(dashboard)/[role]/                      │
│  → Routing & Sayfa Yapısı (Next.js Pages)               │
│  → Sadece layout ve component çağırma                   │
└─────────────────────────────────────────────────────────┘
                        ↓ kullanır
┌─────────────────────────────────────────────────────────┐
│  KATMAN 2: components/[role]/                           │
│  → Rol-Spesifik UI Componentleri                        │
│  → Her rolün kendine özel görünümleri                   │
└─────────────────────────────────────────────────────────┘
                        ↓ kullanır
┌─────────────────────────────────────────────────────────┐
│  KATMAN 3: modules/[modul]/                             │
│  → Paylaşımlı İş Mantığı & Componentler                 │
│  → TÜM HOOKS BURADA (API + Auth + Her şey)             │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 TAM KLASÖR YAPISI

```
src/
├── app/(dashboard)/              ← KATMAN 1: ROUTING
│   ├── admin/
│   │   ├── odev/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── yeni/page.tsx
│   │   ├── kantin/
│   │   ├── konum/
│   │   └── ...
│   │
│   ├── ogretmen/
│   │   ├── odev/
│   │   ├── devamsizlik/
│   │   └── ...
│   │
│   ├── ogrenci/
│   ├── veli/
│   ├── kantinci/
│   └── servici/
│
├── components/                   ← KATMAN 2: ROL-SPESİFİK UI
│   ├── admin/
│   │   ├── odev/
│   │   │   ├── AdminOdevDashboard.tsx
│   │   │   ├── AdminOdevTable.tsx
│   │   │   └── AdminOdevStats.tsx
│   │   ├── kantin/
│   │   └── layout/
│   │       ├── AdminSidebar.tsx
│   │       └── AdminHeader.tsx
│   │
│   ├── ogretmen/
│   │   ├── odev/
│   │   │   ├── OgretmenOdevDashboard.tsx
│   │   │   ├── OdevNotlamaPanel.tsx
│   │   │   └── OdevTeslimlerTable.tsx
│   │   ├── devamsizlik/
│   │   └── layout/
│   │
│   ├── ogrenci/
│   ├── veli/
│   ├── kantinci/
│   └── servici/
│
├── modules/                      ← KATMAN 3: PAYLAŞIMLI MODÜLLER
│   │
│   ├── auth/                     ← ✅ Auth modülü (genel hooks)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts        ← Authentication
│   │   │   ├── useUser.ts        ← User bilgileri
│   │   │   └── useSession.ts     ← Session yönetimi
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── UserAvatar.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── odev/                     ← Ödev modülü
│   │   ├── hooks/
│   │   │   ├── useHomework.ts
│   │   │   ├── useCreateHomework.ts
│   │   │   └── useHomeworkGrade.ts
│   │   ├── components/
│   │   │   ├── HomeworkCard.tsx
│   │   │   ├── HomeworkForm.tsx
│   │   │   └── HomeworkStatus.tsx
│   │   ├── services/
│   │   │   └── homework.service.ts
│   │   └── types/
│   │       └── homework.types.ts
│   │
│   ├── kantin/                   ← Kantin modülü
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   ├── useCart.ts
│   │   │   └── useOrders.ts
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── store/
│   │       └── cart.store.ts
│   │
│   ├── konum/                    ← Konum modülü
│   ├── servis/                   ← Servis modülü
│   ├── devamsizlik/              ← Devamsızlık modülü
│   ├── notlar/                   ← Notlar modülü
│   ├── mesaj/                    ← Mesaj modülü
│   ├── odeme/                    ← Ödeme modülü
│   ├── etkinlik/                 ← Etkinlik modülü
│   ├── duyuru/                   ← Duyuru modülü
│   ├── ders-programi/            ← Ders programı modülü
│   └── donem/                    ← Dönem modülü
│
├── lib/                          ← YARDIMCI KÜTÜPHANELER
│   ├── permissions/
│   │   ├── role-permissions.ts
│   │   └── module-access.ts
│   ├── api/
│   │   └── client.ts
│   └── utils/                    ← ✅ Utility fonksiyonlar
│       ├── debounce.ts           ← Debounce utility
│       ├── format.ts             ← Format helpers
│       ├── validation.ts         ← Validation helpers
│       ├── cn.ts                 ← Class name merger
│       └── index.ts
│
└── types/                        ← GLOBAL TİPLER
    ├── roles.ts
    └── permissions.ts
```

---

## 🎯 ÖNEMLİ DEĞİŞİKLİKLER

### ❌ KALDIRILDI
```
src/hooks/                        ← ARTIK YOK!
├── use-auth.ts
├── use-debounce.ts
└── use-media-query.ts
```

### ✅ YENİ YAPILAR

#### 1. Auth Modülü
```
modules/auth/hooks/
├── useAuth.ts                    ← Authentication
├── useUser.ts                    ← User bilgileri
└── useSession.ts                 ← Session yönetimi
```

#### 2. Utility Fonksiyonlar
```
lib/utils/
├── debounce.ts                   ← Debounce utility
├── format.ts                     ← Format helpers
└── validation.ts                 ← Validation helpers
```

---

## 🔄 KULLANIM ÖRNEKLERİ

### Örnek 1: Auth Hook Kullanımı

```tsx
// components/ogretmen/odev/OgretmenOdevDashboard.tsx
'use client'

// ✅ Auth modülünden
import { useAuth } from '@/modules/auth/hooks/useAuth'

// ✅ Ödev modülünden
import { useHomework } from '@/modules/odev/hooks/useHomework'
import { HomeworkCard } from '@/modules/odev/components/HomeworkCard'

export function OgretmenOdevDashboard() {
  const { user, role } = useAuth()              // Auth modülü
  const { data: homeworks } = useHomework()     // Ödev modülü
  
  return (
    <div>
      <h1>Hoş geldin {user?.name} ({role})</h1>
      {homeworks?.map(hw => (
        <HomeworkCard 
          homework={hw} 
          actions={['edit', 'grade', 'delete']} 
        />
      ))}
    </div>
  )
}
```

### Örnek 2: Utility Kullanımı

```tsx
// components/ogrenci/kantin/OgrenciKantinMenu.tsx
'use client'

import { useState } from 'react'
import { debounce } from '@/lib/utils/debounce'  // ✅ Utility
import { useProducts } from '@/modules/kantin/hooks/useProducts'

export function OgrenciKantinMenu() {
  const [search, setSearch] = useState('')
  const debouncedSearch = debounce(search, 500)  // Utility kullanımı
  
  const { data: products } = useProducts({ search: debouncedSearch })
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Ürün ara..."
      />
      {/* Products list */}
    </div>
  )
}
```

---

## 📊 HOOK KONUMLARI

| Hook Türü | Konum | Örnek |
|-----------|-------|-------|
| **Auth Hooks** | `modules/auth/hooks/` | `useAuth`, `useUser` |
| **Modül API Hooks** | `modules/[modul]/hooks/` | `useHomework`, `useProducts` |
| **Utility Fonksiyonlar** | `lib/utils/` | `debounce`, `format` |

---

## ✅ MİMARİ KURALLARI

### KATMAN 1: Routing
- ✅ Sadece component çağırır
- ❌ Hook kullanmaz
- ❌ İş mantığı yok

### KATMAN 2: Rol-Spesifik Components
- ✅ Modül hooks kullanır
- ✅ Paylaşımlı components kullanır
- ✅ Rol-spesifik UI
- ❌ Ham API çağrısı yok

### KATMAN 3: Modules
- ✅ TÜM HOOKS BURADA
- ✅ Paylaşımlı components
- ✅ Services (API)
- ✅ Types
- ✅ Utilities (modül-spesifik)

### LIB: Yardımcı Kütüphaneler
- ✅ Utility fonksiyonlar
- ✅ API client
- ✅ Permissions
- ❌ React hooks YOK

---

## 🎯 ÖZET

**Artık `src/hooks/` klasörü YOK!**

- ✅ Auth hooks → `modules/auth/hooks/`
- ✅ API hooks → `modules/[modul]/hooks/`
- ✅ Utilities → `lib/utils/`
- ✅ Her şey modül yapısında
- ✅ Temiz ve tutarlı mimari

**Tüm hooks modül içinde, utility'ler lib/utils/ altında!** 🚀
