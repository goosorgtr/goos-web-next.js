# 3 Katmanlı Mimari - Görsel Referans

## 📊 Katman Diyagramı

```mermaid
graph TB
    subgraph "KATMAN 1: Routing Layer"
        A1[app/dashboard/admin/odev/page.tsx]
        A2[app/dashboard/ogretmen/odev/page.tsx]
        A3[app/dashboard/ogrenci/odev/page.tsx]
        A4[app/dashboard/veli/odev/childId/page.tsx]
    end

    subgraph "KATMAN 2: Role-Specific Components"
        B1[components/admin/odev/AdminOdevDashboard.tsx]
        B2[components/ogretmen/odev/OgretmenOdevDashboard.tsx]
        B3[components/ogrenci/odev/OgrenciOdevDashboard.tsx]
        B4[components/veli/odev/CocukOdevListesi.tsx]
    end

    subgraph "KATMAN 3: Shared Modules"
        C1[modules/odev/components/HomeworkCard.tsx]
        C2[modules/odev/hooks/useHomework.ts]
        C3[modules/odev/services/homework.service.ts]
        C4[modules/odev/types/homework.types.ts]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4

    B1 --> C1
    B1 --> C2
    B2 --> C1
    B2 --> C2
    B3 --> C1
    B3 --> C2
    B4 --> C1
    B4 --> C2

    C2 --> C3
    C3 --> C4

    style A1 fill:#e1f5ff
    style A2 fill:#e1f5ff
    style A3 fill:#e1f5ff
    style A4 fill:#e1f5ff
    
    style B1 fill:#fff3e0
    style B2 fill:#fff3e0
    style B3 fill:#fff3e0
    style B4 fill:#fff3e0
    
    style C1 fill:#e8f5e9
    style C2 fill:#e8f5e9
    style C3 fill:#e8f5e9
    style C4 fill:#e8f5e9
```

## 🔄 Veri Akış Diyagramı

```mermaid
sequenceDiagram
    participant Page as Layer 1<br/>Page
    participant RoleComp as Layer 2<br/>OgretmenOdevDashboard
    participant SharedComp as Layer 3<br/>HomeworkCard
    participant Hook as Layer 3<br/>useHomework
    participant Service as Layer 3<br/>homeworkService
    participant API as Backend<br/>API

    Page->>RoleComp: Render component
    activate RoleComp
    
    RoleComp->>Hook: useHomework({ filters })
    activate Hook
    
    Hook->>Service: getHomeworks(filters)
    activate Service
    
    Service->>API: GET /api/homeworks
    activate API
    API-->>Service: { data: Homework[] }
    deactivate API
    
    Service-->>Hook: Homework[]
    deactivate Service
    
    Hook-->>RoleComp: { data, isLoading, error }
    deactivate Hook
    
    loop For each homework
        RoleComp->>SharedComp: <HomeworkCard homework={hw} actions={[...]} />
        activate SharedComp
        SharedComp-->>RoleComp: Rendered card
        deactivate SharedComp
    end
    
    RoleComp-->>Page: Complete dashboard
    deactivate RoleComp
```

## 📁 Dizin Yapısı Ağacı

```
src/
│
├── app/(dashboard)/              # KATMAN 1: Routing
│   ├── admin/
│   │   ├── odev/
│   │   │   ├── page.tsx         ← Minimal, sadece component çağırır
│   │   │   ├── [id]/page.tsx
│   │   │   └── yeni/page.tsx
│   │   └── kantin/
│   │       └── ...
│   │
│   ├── ogretmen/
│   │   ├── odev/
│   │   │   ├── page.tsx         ← Minimal, sadece component çağırır
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── notla/page.tsx
│   │   │   │   └── teslimler/page.tsx
│   │   │   └── yeni/page.tsx
│   │   └── devamsizlik/
│   │       └── ...
│   │
│   ├── ogrenci/
│   │   ├── odev/
│   │   └── kantin/
│   │
│   ├── veli/
│   │   ├── konum/
│   │   └── odev/
│   │
│   ├── kantinci/
│   │   ├── urunler/
│   │   └── siparisler/
│   │
│   └── servici/
│       ├── rotalar/
│       └── konum/
│
├── components/                   # KATMAN 2: Role-Specific UI
│   ├── admin/
│   │   ├── odev/
│   │   │   ├── AdminOdevDashboard.tsx
│   │   │   ├── AdminOdevTable.tsx
│   │   │   └── AdminOdevStats.tsx
│   │   ├── kantin/
│   │   └── layout/
│   │
│   ├── ogretmen/
│   │   ├── odev/
│   │   │   ├── OgretmenOdevDashboard.tsx  ← Rol-spesifik UI
│   │   │   ├── OdevOlusturForm.tsx
│   │   │   └── OdevNotlamaPanel.tsx
│   │   ├── devamsizlik/
│   │   └── layout/
│   │
│   ├── ogrenci/
│   │   ├── odev/
│   │   ├── kantin/
│   │   └── layout/
│   │
│   ├── veli/
│   │   ├── konum/
│   │   ├── odev/
│   │   └── layout/
│   │
│   ├── kantinci/
│   │   ├── urunler/
│   │   ├── siparisler/
│   │   └── layout/
│   │
│   └── servici/
│       ├── rotalar/
│       ├── konum/
│       └── layout/
│
└── modules/                      # KATMAN 3: Shared Business Logic
    ├── odev/
    │   ├── components/
    │   │   ├── HomeworkCard.tsx          ← Paylaşımlı, tüm roller kullanır
    │   │   ├── HomeworkForm.tsx
    │   │   ├── HomeworkList.tsx
    │   │   └── HomeworkStatus.tsx
    │   ├── hooks/
    │   │   ├── useHomework.ts            ← React Query hooks
    │   │   ├── useCreateHomework.ts
    │   │   └── useHomeworkGrade.ts
    │   ├── types/
    │   │   ├── homework.types.ts         ← TypeScript types
    │   │   └── submission.types.ts
    │   ├── services/
    │   │   └── homework.service.ts       ← API calls
    │   ├── utils/
    │   │   └── homework.helpers.ts
    │   └── validations/
    │       └── homework.schema.ts        ← Zod schemas
    │
    ├── kantin/
    │   ├── components/
    │   ├── hooks/
    │   ├── types/
    │   ├── services/
    │   └── store/                        ← Zustand store (sepet)
    │
    ├── konum/
    ├── servis/
    ├── devamsizlik/
    ├── notlar/
    ├── mesaj/
    ├── odeme/
    ├── etkinlik/
    ├── duyuru/
    ├── ders-programi/
    └── donem/
```

## 🎯 Sorumluluk Matrisi

| Katman | Sorumluluklar | Sorumluk DEĞİL |
|--------|---------------|----------------|
| **Layer 1: Routing** | • Route tanımlama<br>• Metadata (SEO)<br>• Layout yapısı | • İş mantığı<br>• UI component kodu<br>• API çağrıları |
| **Layer 2: Role-Specific** | • Rol-spesifik UI<br>• Rol-spesifik aksiyonlar<br>• Hook kullanımı<br>• Veri filtreleme | • Ham API çağrıları<br>• İş mantığı<br>• Diğer rollerin UI'ı |
| **Layer 3: Shared Modules** | • Paylaşımlı componentler<br>• API hooks<br>• TypeScript types<br>• Validations<br>• Utils | • Rol-spesifik UI<br>• Routing |

## 🔗 Component İlişkileri

```mermaid
graph LR
    subgraph "Öğretmen Flow"
        P1[ogretmen/odev/page.tsx] --> D1[OgretmenOdevDashboard]
        D1 --> H1[useHomework hook]
        D1 --> C1[HomeworkCard]
        D1 --> P2[OdevNotlamaPanel]
    end

    subgraph "Öğrenci Flow"
        P3[ogrenci/odev/page.tsx] --> D2[OgrenciOdevDashboard]
        D2 --> H1
        D2 --> C1
        D2 --> T1[OdevTeslimForm]
    end

    subgraph "Shared Layer"
        H1 --> S1[homeworkService]
        C1 --> T2[Homework types]
        S1 --> T2
    end

    style P1 fill:#e1f5ff
    style P3 fill:#e1f5ff
    style D1 fill:#fff3e0
    style D2 fill:#fff3e0
    style P2 fill:#fff3e0
    style T1 fill:#fff3e0
    style H1 fill:#e8f5e9
    style C1 fill:#e8f5e9
    style S1 fill:#e8f5e9
    style T2 fill:#e8f5e9
```

## 📋 Örnek Kod Akışı

### 1. Page (Layer 1) - Minimal
```tsx
// app/(dashboard)/ogretmen/odev/page.tsx
import { OgretmenOdevDashboard } from '@/components/ogretmen/odev/OgretmenOdevDashboard'

export default function Page() {
  return <OgretmenOdevDashboard />  // Sadece component çağırır
}
```

### 2. Role Component (Layer 2) - Rol-Spesifik UI
```tsx
// components/ogretmen/odev/OgretmenOdevDashboard.tsx
'use client'

import { useHomework } from '@/modules/odev/hooks/useHomework'
import { HomeworkCard } from '@/modules/odev/components/HomeworkCard'

export function OgretmenOdevDashboard() {
  const { data: homeworks } = useHomework()  // Shared hook kullanır
  
  return (
    <div>
      {/* Öğretmene özel header ve stats */}
      <TeacherStats />
      
      {/* Paylaşımlı component, öğretmen aksiyonları ile */}
      {homeworks.map(hw => (
        <HomeworkCard 
          homework={hw} 
          actions={['edit', 'delete', 'grade']}  // Öğretmen aksiyonları
        />
      ))}
    </div>
  )
}
```

### 3. Shared Component (Layer 3) - Paylaşımlı
```tsx
// modules/odev/components/HomeworkCard.tsx
export function HomeworkCard({ homework, actions }) {
  return (
    <Card>
      <h3>{homework.title}</h3>
      {/* Rol bazlı aksiyonlar */}
      {actions.includes('grade') && <GradeButton />}
      {actions.includes('submit') && <SubmitButton />}
    </Card>
  )
}
```

### 4. Hook (Layer 3) - API Integration
```tsx
// modules/odev/hooks/useHomework.ts
import { useQuery } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'

export function useHomework(filters) {
  return useQuery({
    queryKey: ['homeworks', filters],
    queryFn: () => homeworkService.getHomeworks(filters)
  })
}
```

### 5. Service (Layer 3) - API Calls
```tsx
// modules/odev/services/homework.service.ts
export const homeworkService = {
  getHomeworks: (filters) => api.get('/api/homeworks', { params: filters }),
  createHomework: (data) => api.post('/api/homeworks', data)
}
```

## 🎨 Renk Kodları

- 🔵 **Mavi (Layer 1)**: Routing katmanı - Minimal kod
- 🟠 **Turuncu (Layer 2)**: Rol-spesifik componentler - UI odaklı
- 🟢 **Yeşil (Layer 3)**: Paylaşımlı modüller - İş mantığı

## ✅ Kontrol Listesi

Yeni bir özellik eklerken:

- [ ] Layer 3'te type tanımlandı mı?
- [ ] Layer 3'te service oluşturuldu mu?
- [ ] Layer 3'te hook yazıldı mı?
- [ ] Layer 3'te paylaşımlı component var mı?
- [ ] Layer 2'de rol-spesifik component oluşturuldu mu?
- [ ] Layer 2 component Layer 3 modüllerini kullanıyor mu?
- [ ] Layer 1'de route tanımlandı mı?
- [ ] Layer 1 sadece component çağırıyor mu?
- [ ] Circular dependency yok mu?
- [ ] TypeScript tipleri doğru mu?
