# 🏗️ 3-Layer Architecture Guide

## Core Principle: Unidirectional Dependency Flow

```
ROUTE → ROLE UI → MODULE
(Upper layer uses lower layer. Lower layer NEVER knows upper layer)
```
kerem
---

## 🎯 Quick Decision Matrix

| What I'm Building | Where It Goes | What It Can Import | What It Cannot Do |
|------------------|---------------|-------------------|-------------------|
| New page/route | `app/(dashboard)/` | `components/[role]/` | API calls, business logic |
| Role screen | `components/[role]/` | `modules/hooks`, `modules/components` | fetch, axios, services |
| API call | `modules/services/` | `@/lib/api`, `types` | React, business logic |
| Business logic | `modules/hooks/` | `react-query`, `services` | Direct API, components |
| Shared UI | `modules/components/` | `types`, ui libs | Role logic, services |

---

## 📐 LAYER 1: ROUTE (app/dashboard)

### Single Responsibility
**Routing + Page skeleton ONLY**

### File Location
```
app/(dashboard)/[role]/[feature]/page.tsx
```

### ✅ MUST DO
- Define URL routes only
- Set metadata (title, description)
- Import and render ONE role-specific component
- Keep file under 10 lines

### ❌ NEVER DO
- API calls (fetch, axios, any HTTP request)
- Business logic
- State management (useState, useReducer, useContext)
- Data fetching
- Conditional logic beyond simple loading states
- Direct service imports
- Multiple component renders with logic

### Example
```tsx
// app/(dashboard)/admin/ogrenciler/page.tsx
import { AdminOgrencilerDashboard } from '@/components/admin/ogrenciler/AdminOgrencilerDashboard'

export const metadata = {
  title: 'Öğrenci Yönetimi',
  description: 'Admin öğrenci yönetim paneli'
}

export default function OgrencilerPage() {
  return <AdminOgrencilerDashboard />
}
```

---

## 🎭 LAYER 2: ROLE UI (components/[role])

### Single Responsibility
**Role-specific user interface ONLY**

### File Location
```
components/[role]/[feature]/[Role][Feature]Dashboard.tsx
```

### Naming Convention
- Component name MUST include role name
- Format: `[Role][Feature]Dashboard`
- Examples: `AdminOgrencilerDashboard`, `OgretmenDersProgramiDashboard`

### ✅ MUST DO
- Import hooks from `modules/[feature]/hooks/`
- Import shared components from `modules/[feature]/components/`
- Pass role and userId to hooks
- Handle loading/error states for UI
- Define role-specific actions array
- UI-only state (modals, tabs, filters display)

### ❌ NEVER DO
- Direct API calls (fetch, axios)
- Import from `services/` folder
- Write business logic
- Access other role folders
- Hard-code permissions
- Call API endpoints directly
- Use useEffect for data fetching

### Example
```tsx
// components/admin/ogrenciler/AdminOgrencilerDashboard.tsx
'use client'

import { useOgrenciler } from '@/modules/ogrenciler/hooks/useOgrenciler'
import { OgrenciCard } from '@/modules/ogrenciler/components/OgrenciCard'
import { useAuth } from '@/hooks/useAuth'

export function AdminOgrencilerDashboard() {
  const { user } = useAuth()
  const { data, isLoading, createOgrenci, updateOgrenci, deleteOgrenci } = useOgrenciler({
    role: 'admin',
    userId: user?.id
  })

  const actions = ['view', 'edit', 'delete', 'create'] as const

  if (isLoading) return <div>Yükleniyor...</div>

  return (
    <div>
      {data?.map(ogrenci => (
        <OgrenciCard
          key={ogrenci.id}
          item={ogrenci}
          actions={actions}
          onAction={(action, item) => {
            if (action === 'delete') deleteOgrenci(item.id)
            // ... handle other actions
          }}
        />
      ))}
    </div>
  )
}
```

---

## 🧩 LAYER 3: MODULE (modules/[module])

### Single Responsibility
**Business logic + Data layer**

### Required Folder Structure
```
modules/[feature]/
├── services/         # API calls ONLY (required)
├── hooks/           # React Query + business logic (required)
├── components/      # Shared UI components (required)
├── types/           # TypeScript definitions (required)
├── validations/     # Zod schemas (optional)
└── utils/           # Helper functions (optional)
```

---

### 3.1 SERVICES Rules

#### Location
```
modules/[feature]/services/[feature].service.ts
```

#### ✅ MUST DO
- Export single object named `[feature]Service`
- Each method returns Promise
- Use centralized api client (import from `@/lib/api`)
- Include proper TypeScript return types
- Cover all CRUD operations needed

#### ❌ NEVER DO
- Business logic inside services
- Role checks in services
- Data transformation (do in hooks)
- Import React or React Query
- Export multiple service objects
- Use fetch/axios directly without api client

#### Required Methods
- `getAll()` or `getByRole()`
- `create()`
- `update()`
- `delete()`

#### Example
```typescript
// modules/ogrenciler/services/ogrenciler.service.ts
import { api } from '@/lib/api'
import type { Ogrenci, CreateOgrenciDto, UpdateOgrenciDto } from '../types'

export const ogrencilerService = {
  async getAll(): Promise<Ogrenci[]> {
    const { data } = await api.get('/ogrenciler')
    return data
  },

  async getByRole(role: string, userId: string): Promise<Ogrenci[]> {
    const { data } = await api.get(`/ogrenciler?role=${role}&userId=${userId}`)
    return data
  },

  async create(dto: CreateOgrenciDto): Promise<Ogrenci> {
    const { data } = await api.post('/ogrenciler', dto)
    return data
  },

  async update(id: string, dto: UpdateOgrenciDto): Promise<Ogrenci> {
    const { data } = await api.put(`/ogrenciler/${id}`, dto)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/ogrenciler/${id}`)
  }
}
```

---

### 3.2 HOOKS Rules

#### Location
```
modules/[feature]/hooks/use[Feature].ts
```

#### ✅ MUST DO
- Use React Query (useQuery, useMutation)
- Accept options object with role and userId
- Implement role-based logic HERE
- Return standardized object with:
  - `data` (items/list)
  - `isLoading`
  - `error`
  - mutation functions (`createItem`, `updateItem`, `deleteItem`)
  - `isPending` states for mutations
- Use `queryClient.invalidateQueries` after mutations
- Include proper TypeScript interfaces for options

#### ❌ NEVER DO
- Direct API calls (must call service methods)
- Import from components folder
- Return raw React Query objects
- Skip error handling
- Forget to invalidate queries after mutations
- Use useState for server data

#### Required Pattern
```
Options interface → useQuery → useMutation → Return object
```

#### Query Key Convention
```typescript
['featureName', role, userId/otherParams]
```

#### Example
```typescript
// modules/ogrenciler/hooks/useOgrenciler.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ogrencilerService } from '../services/ogrenciler.service'
import type { Ogrenci, CreateOgrenciDto, UpdateOgrenciDto } from '../types'

interface UseOgrencilerOptions {
  role: string
  userId: string
}

export function useOgrenciler({ role, userId }: UseOgrencilerOptions) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['ogrenciler', role, userId],
    queryFn: () => ogrencilerService.getByRole(role, userId)
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateOgrenciDto) => ogrencilerService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ogrenciler'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateOgrenciDto }) =>
      ogrencilerService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ogrenciler'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ogrencilerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ogrenciler'] })
    }
  })

  return {
    data: data ?? [],
    isLoading,
    error,
    createOgrenci: createMutation.mutate,
    updateOgrenci: updateMutation.mutate,
    deleteOgrenci: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}
```

---

### 3.3 SHARED COMPONENTS Rules

#### Location
```
modules/[feature]/components/[Feature]Card.tsx
```

#### ✅ MUST DO
- Accept `actions` prop as array of strings
- Use TypeScript union types for actions
- Be completely role-agnostic
- Accept `onAction` callback for event handling
- Include all possible actions in type definition
- Use conditional rendering based on actions prop

#### ❌ NEVER DO
- Hard-code role names
- Import from `components/[role]/`
- Include role-specific logic
- Make assumptions about user permissions
- Render different UI based on role checks

#### Actions Type Pattern
```typescript
type Action = 'view' | 'edit' | 'delete' | 'create' | 'submit' | 'grade'
```

#### Props Pattern
```typescript
interface Props {
  item: [Feature]           // the data object
  actions: Action[]         // allowed actions
  onAction?: (action: Action, item: [Feature]) => void
}
```

#### Example
```tsx
// modules/ogrenciler/components/OgrenciCard.tsx
import type { Ogrenci } from '../types'

type OgrenciAction = 'view' | 'edit' | 'delete' | 'create'

interface OgrenciCardProps {
  item: Ogrenci
  actions: OgrenciAction[]
  onAction?: (action: OgrenciAction, item: Ogrenci) => void
}

export function OgrenciCard({ item, actions, onAction }: OgrenciCardProps) {
  return (
    <div className="card">
      <h3>{item.ad} {item.soyad}</h3>
      <p>{item.email}</p>
      
      <div className="actions">
        {actions.includes('view') && (
          <button onClick={() => onAction?.('view', item)}>Görüntüle</button>
        )}
        {actions.includes('edit') && (
          <button onClick={() => onAction?.('edit', item)}>Düzenle</button>
        )}
        {actions.includes('delete') && (
          <button onClick={() => onAction?.('delete', item)}>Sil</button>
        )}
      </div>
    </div>
  )
}
```

---

## 🔄 Data Flow Rules (CRITICAL)

### ✅ CORRECT Flow
1. User visits URL
2. `page.tsx` renders
3. Role UI component mounts
4. Hook is called with role + userId
5. Hook calls service method
6. Service makes API request
7. Data flows back through same chain

### ❌ FORBIDDEN Flows
- `page.tsx` → Service (skipping UI + Hook)
- Component → Service (skipping Hook)
- Module → Role UI (upward dependency)
- Service → Hook import (circular)

---

## 🚨 Critical Validation Rules

### Before Generating ANY Code:

#### 1. Layer Identification
- Is this a route? → Must go in `app/(dashboard)/`
- Is this role-specific UI? → Must go in `components/[role]/`
- Is this shared logic/UI? → Must go in `modules/[feature]/`

#### 2. Import Rules
- **Routes** can import from: `components/[role]/` ONLY
- **Role UI** can import from: `modules/[feature]/hooks/`, `modules/[feature]/components/` ONLY
- **Services** can import from: `@/lib/api`, `../types/` ONLY
- **Hooks** can import from: `react-query`, `../services/`, `../types/` ONLY
- **Shared components** can import from: `../types/`, ui library ONLY

#### 3. API Call Rules
- API calls ONLY in `services/`
- Services called ONLY by `hooks`
- Hooks called ONLY by `components`
- NO exceptions to this chain

#### 4. Role Logic Rules
- Role checks ONLY in `hooks`
- Components receive role as prop
- Services are role-agnostic
- Shared components NEVER check roles

#### 5. Naming Rules
- Service: `[feature]Service`
- Hook: `use[Feature]`
- Type: `[Feature]` (singular)
- Shared Component: `[Feature]Card`/`[Feature]Form`/`[Feature]List`
- Role Component: `[Role][Feature]Dashboard`

---

## 📋 Pre-Generation Checklist

Before writing ANY code, verify:

- [ ] I know which layer this belongs to
- [ ] I'm not mixing concerns across layers
- [ ] API calls only in services
- [ ] Business logic only in hooks
- [ ] Role-specific UI only in `components/[role]/`
- [ ] Shared components are role-agnostic
- [ ] Import paths follow layer rules
- [ ] Using React Query in hooks
- [ ] Using actions prop pattern in shared components
- [ ] Query keys follow convention
- [ ] No upward dependencies
- [ ] Naming follows conventions

---

## 🔥 Common Anti-Patterns to REJECT

### ❌ Pattern 1: "Smart" Page Components
- Pages with useEffect
- Pages with useState
- Pages with fetch
- Pages with business logic

### ❌ Pattern 2: "God" Components
- Components calling services directly
- Components with API calls
- Components with complex business logic
- Components checking user roles internally

### ❌ Pattern 3: "Leaky" Services
- Services importing React
- Services with role logic
- Services doing data transformation
- Services importing hooks

### ❌ Pattern 4: "Coupled" Shared Components
- Shared components with hard-coded roles
- Shared components importing role-specific code
- Shared components with permission checks
- Shared components without actions prop

### ❌ Pattern 5: "Direct" Data Access
- Skipping hooks and calling services
- Using fetch in components
- Bypassing React Query
- Manual cache management

---

## ✅ Quality Gates

Every Generated Code MUST Pass:

1. **Single Responsibility**: Does this file do ONE thing only?
2. **Dependency Direction**: Am I only importing from lower layers?
3. **No Duplication**: Could this be reused from modules/?
4. **Type Safety**: Are all TypeScript types defined?
5. **Error Handling**: Are errors properly handled?
6. **Naming Convention**: Do names follow the pattern?
7. **File Location**: Is this in the correct folder?
8. **Import Validation**: Are all imports from allowed locations?

---

## 🎓 Success Criteria

### ✅ You are successful when:
- Code is in correct layer based on responsibility
- No layer violations in imports
- API calls only in services
- Business logic only in hooks
- React Query used properly
- Shared components are flexible with actions prop
- Role components use hooks correctly
- Pages only render components
- No anti-patterns present
- All quality gates pass

### ❌ You have failed when:
- API calls outside services
- Business logic in components
- Direct service imports in UI
- Hard-coded roles in shared components
- Missing React Query in hooks
- Upward dependencies
- Mixed concerns in single file
- Incorrect folder structure

---

## 📚 Project Structure Example

### Complete File Structure
```
src/
├── app/
│   └── (dashboard)/
│       ├── admin/
│       │   ├── ogrenciler/
│       │   │   └── page.tsx
│       │   ├── ogretmenler/
│       │   │   └── page.tsx
│       │   ├── ders-programi/
│       │   │   └── page.tsx
│       │   └── etkinlik-duyuru/
│       │       └── page.tsx
│       ├── ogretmen/
│       │   ├── dersler/
│       │   │   └── page.tsx
│       │   ├── odevler/
│       │   │   └── page.tsx
│       │   └── notlar/
│       │       └── page.tsx
│       ├── ogrenci/
│       │   ├── odevler/
│       │   │   └── page.tsx
│       │   ├── notlar/
│       │   │   └── page.tsx
│       │   └── kantin/
│       │       └── page.tsx
│       └── veli/
│           ├── cocuklar/
│           │   └── page.tsx
│           ├── odemeler/
│           │   └── page.tsx
│           └── konum/
│               └── page.tsx
│
├── components/
│   ├── admin/
│   │   ├── ogrenciler/
│   │   │   └── AdminOgrencilerDashboard.tsx
│   │   ├── ogretmenler/
│   │   │   └── AdminOgretmenlerDashboard.tsx
│   │   └── ders-programi/
│   │       └── AdminDersProgramiDashboard.tsx
│   ├── ogretmen/
│   │   ├── dersler/
│   │   │   └── OgretmenDerslerDashboard.tsx
│   │   ├── odevler/
│   │   │   └── OgretmenOdevlerDashboard.tsx
│   │   └── notlar/
│   │       └── OgretmenNotlarDashboard.tsx
│   ├── ogrenci/
│   │   ├── odevler/
│   │   │   └── OgrenciOdevlerDashboard.tsx
│   │   ├── notlar/
│   │   │   └── OgrenciNotlarDashboard.tsx
│   │   └── kantin/
│   │       └── OgrenciKantinDashboard.tsx
│   └── veli/
│       ├── cocuklar/
│       │   └── VeliCocuklarDashboard.tsx
│       ├── odemeler/
│       │   └── VeliOdemelerDashboard.tsx
│       └── konum/
│           └── VeliKonumDashboard.tsx
│
└── modules/
    ├── ogrenciler/
    │   ├── services/
    │   │   └── ogrenciler.service.ts
    │   ├── hooks/
    │   │   └── useOgrenciler.ts
    │   ├── components/
    │   │   ├── OgrenciCard.tsx
    │   │   ├── OgrenciForm.tsx
    │   │   └── OgrenciList.tsx
    │   └── types/
    │       └── index.ts
    ├── odevler/
    │   ├── services/
    │   │   └── odevler.service.ts
    │   ├── hooks/
    │   │   └── useOdevler.ts
    │   ├── components/
    │   │   ├── OdevCard.tsx
    │   │   └── OdevForm.tsx
    │   └── types/
    │       └── index.ts
    ├── notlar/
    │   ├── services/
    │   │   └── notlar.service.ts
    │   ├── hooks/
    │   │   └── useNotlar.ts
    │   ├── components/
    │   │   ├── NotCard.tsx
    │   │   └── NotForm.tsx
    │   └── types/
    │       └── index.ts
    ├── kantin/
    │   ├── services/
    │   │   └── kantin.service.ts
    │   ├── hooks/
    │   │   └── useKantin.ts
    │   ├── components/
    │   │   ├── UrunCard.tsx
    │   │   └── SiparisForm.tsx
    │   └── types/
    │       └── index.ts
    └── konum/
        ├── services/
        │   └── konum.service.ts
        ├── hooks/
        │   └── useKonum.ts
        ├── components/
        │   └── KonumMap.tsx
        └── types/
            └── index.ts
```

---

## 👥 Roller ve Yetkiler

### 1. Admin
- Tüm modüllere tam erişim
- Tüm CRUD işlemleri
- Raporlama ve analiz

### 2. Öğretmen
- Ödev oluşturma ve notlama
- Yoklama alma
- Not girişi
- Duyuru yayınlama
- Mesajlaşma

### 3. Öğrenci
- Ödev görüntüleme ve teslim
- Kantin sipariş
- Konum paylaşımı
- Not görüntüleme
- Mesajlaşma

### 4. Veli
- Çocuk takibi
- Konum izleme
- Ödeme yapma
- Kantin bakiye ekleme
- Mesajlaşma

### 5. Kantinci
- Ürün yönetimi
- Sipariş yönetimi
- Stok takibi
- Raporlama

### 6. Servici
- Rota yönetimi
- Araç konumu
- Öğrenci ataması
- Devamsızlık bildirimi

---

## 🚀 Yeni Modül Ekleme

```bash
# 1. Modül yapısını oluştur
mkdir -p src/modules/[yeni-modul]/{components,hooks,types,services,utils,validations}

# 2. Her role component klasörü ekle
mkdir -p src/components/{admin,ogretmen,ogrenci,veli,kantinci,servici}/[yeni-modul]

# 3. Gerekli sayfalara route ekle
# Her rolün ihtiyacına göre app/(dashboard)/[role]/[yeni-modul]/page.tsx
```

---

## 📚 Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Management**: React Hook Form + Zod
- **HTTP Client**: Axios

---

## 🎯 Avantajlar

1. **Separation of Concerns**: Her katman kendi sorumluluğuna odaklanır
2. **Reusability**: Modüller tüm rollerde tekrar kullanılır
3. **Type Safety**: Merkezi tip yönetimi
4. **Maintainability**: Bir değişiklik tüm rollere yansır
5. **Scalability**: Yeni rol/modül eklemek kolay
6. **Security**: Route bazlı izinlendirme
7. **Code Splitting**: Next.js otomatik optimizasyon

---

**Remember**: This architecture ensures maintainability, testability, and scalability. Always follow the unidirectional dependency flow: **ROUTE → ROLE UI → MODULE**.
