# Hook Migration Plan

## 🎯 Amaç
Mevcut `src/hooks/api/` klasöründeki modül-spesifik API hooks'larını yeni mimari yapıya göre `modules/[modul]/hooks/` klasörlerine taşımak.

## 📊 Migration Mapping

### Ödev Modülü
```
src/hooks/api/use-homework.ts              → modules/odev/hooks/useHomework.ts
src/hooks/api/use-homework-submission.ts   → modules/odev/hooks/useHomeworkSubmission.ts
```

### Kantin Modülü
```
src/hooks/api/use-canteen-products.ts      → modules/kantin/hooks/useProducts.ts
src/hooks/api/use-canteen-orders.ts        → modules/kantin/hooks/useOrders.ts
src/hooks/api/use-canteen-balance.ts       → modules/kantin/hooks/useBalance.ts
```

### Devamsızlık Modülü
```
src/hooks/api/use-attendance.ts            → modules/devamsizlik/hooks/useAttendance.ts
```

### Notlar Modülü
```
src/hooks/api/use-grades.ts                → modules/notlar/hooks/useGrades.ts
src/hooks/api/use-grade.ts                 → modules/notlar/hooks/useGrade.ts
src/hooks/api/use-exams.ts                 → modules/notlar/hooks/useExams.ts
src/hooks/api/use-exam.ts                  → modules/notlar/hooks/useExam.ts
```

### Mesaj Modülü
```
src/hooks/api/use-messages.ts              → modules/mesaj/hooks/useMessages.ts
```

### Etkinlik Modülü
```
src/hooks/api/use-events.ts                → modules/etkinlik/hooks/useEvents.ts
```

### Duyuru Modülü
```
src/hooks/api/use-announcements.ts         → modules/duyuru/hooks/useAnnouncements.ts
```

### Ödeme Modülü
```
src/hooks/api/use-payments.ts              → modules/odeme/hooks/usePayments.ts
src/hooks/api/use-debts.ts                 → modules/odeme/hooks/useDebts.ts
src/hooks/api/use-payment-plans.ts         → modules/odeme/hooks/usePaymentPlans.ts
```

### Dönem Modülü
```
src/hooks/api/use-semesters.ts             → modules/donem/hooks/useSemesters.ts
src/hooks/api/use-semester.ts              → modules/donem/hooks/useSemester.ts
```

### Ders Programı Modülü
```
src/hooks/api/use-courses.ts               → modules/ders-programi/hooks/useCourses.ts
src/hooks/api/use-course.ts                → modules/ders-programi/hooks/useCourse.ts
```

### Servis Modülü
```
src/hooks/api/use-vehicles.ts              → modules/servis/hooks/useVehicles.ts
```

### Genel (Rol Yönetimi - src/hooks/ kalacak)
```
src/hooks/api/use-students.ts              → src/hooks/api/use-students.ts (KALMALI)
src/hooks/api/use-student.ts               → src/hooks/api/use-student.ts (KALMALI)
src/hooks/api/use-teachers.ts              → src/hooks/api/use-teachers.ts (KALMALI)
src/hooks/api/use-teacher.ts               → src/hooks/api/use-teacher.ts (KALMALI)
src/hooks/api/use-parents.ts               → src/hooks/api/use-parents.ts (KALMALI)
src/hooks/api/use-parent.ts                → src/hooks/api/use-parent.ts (KALMALI)
src/hooks/api/use-classes.ts               → src/hooks/api/use-classes.ts (KALMALI)
src/hooks/api/use-class.ts                 → src/hooks/api/use-class.ts (KALMALI)
```

## 🔄 Migration Steps

### 1. Dosyaları Taşı
```bash
# Örnek: Ödev hooks'larını taşı
mv src/hooks/api/use-homework.ts modules/odev/hooks/useHomework.ts
mv src/hooks/api/use-homework-submission.ts modules/odev/hooks/useHomeworkSubmission.ts
```

### 2. Import Path'leri Güncelle
```tsx
// ÖNCE
import { useHomework } from '@/hooks/api/use-homework'

// SONRA
import { useHomework } from '@/modules/odev/hooks/useHomework'
```

### 3. Dosya İçi Düzenlemeler
- Dosya adlarını camelCase yap (use-homework.ts → useHomework.ts)
- Export edilen fonksiyon adlarını kontrol et
- İlgili service import'larını güncelle

## 📋 Checklist

- [ ] Ödev modülü hooks'ları taşı
- [ ] Kantin modülü hooks'ları taşı
- [ ] Devamsızlık modülü hooks'ları taşı
- [ ] Notlar modülü hooks'ları taşı
- [ ] Mesaj modülü hooks'ları taşı
- [ ] Etkinlik modülü hooks'ları taşı
- [ ] Duyuru modülü hooks'ları taşı
- [ ] Ödeme modülü hooks'ları taşı
- [ ] Dönem modülü hooks'ları taşı
- [ ] Ders programı modülü hooks'ları taşı
- [ ] Servis modülü hooks'ları taşı
- [ ] Tüm import path'leri güncelle
- [ ] `src/hooks/api/` klasörünü temizle (sadece genel hooks kalsın)
- [ ] TypeScript hatalarını düzelt
- [ ] Build test yap

## ⚠️ Dikkat Edilecekler

1. **Genel hooks kalmalı**: Student, Teacher, Parent, Class gibi genel entity hooks'ları `src/hooks/api/` altında kalmalı
2. **Import path'ler**: Tüm kullanılan yerlerde import path'leri güncellenmelidir
3. **Naming convention**: Yeni dosya adları camelCase olmalı (use-homework.ts → useHomework.ts)
4. **Backward compatibility**: Eğer bu hooks'lar birçok yerde kullanılıyorsa, önce yeni konumda oluştur, sonra eski dosyadan re-export yap, sonra migration yap

## 🔧 Örnek Migration

### Önce (Eski)
```tsx
// src/hooks/api/use-homework.ts
export function useHomework() {
  return useQuery({
    queryKey: ['homeworks'],
    queryFn: () => fetch('/api/homeworks').then(r => r.json())
  })
}
```

### Sonra (Yeni)
```tsx
// modules/odev/hooks/useHomework.ts
import { useQuery } from '@tanstack/react-query'
import { homeworkService } from '../services/homework.service'

export function useHomework() {
  return useQuery({
    queryKey: ['homeworks'],
    queryFn: () => homeworkService.getHomeworks()
  })
}
```

## 🎯 Sonuç

Migration sonrası:
- ✅ Modül-spesifik hooks modül klasörlerinde
- ✅ Genel hooks `src/hooks/` altında
- ✅ Temiz ve organize yapı
- ✅ Kolay bakım ve geliştirme
