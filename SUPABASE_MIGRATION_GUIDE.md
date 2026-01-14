# 🚀 Supabase Migration Guide

Bu dokuman, projenin Supabase entegrasyonuna geçiş sürecini ve yapılan değişiklikleri açıklar.

## ✅ Tamamlanan İşler

### 1. **Database Types ve API Wrapper** ✅
- ✅ `src/lib/supabase/types.ts` - 50+ tablo için TypeScript tipleri
- ✅ `src/lib/supabase/client.ts` - Typed Supabase client
- ✅ `src/lib/supabase/api.ts` - Generic CRUD operasyonları
- ✅ `src/lib/supabase/helpers.ts` - Utility fonksiyonlar

**Eklenen Yeni Tablolar:**
- `canteen_products` - Kantin ürünleri
- `canteen_categories` - Kantin kategorileri  
- `canteen_orders` - Kantin siparişleri
- `canteen_order_items` - Sipariş kalemleri
- `payments` - Ödemeler
- `payment_categories` - Ödeme kategorileri
- `debts` - Borçlar
- `payment_plans` - Ödeme planları

**Eklenen Enum'lar:**
- `OrderStatus` - Sipariş durumları
- `PaymentStatus` - Ödeme durumları

---

### 2. **Auth Sistemi** ✅
- ✅ `src/lib/services/auth.service.ts` - Supabase Auth entegrasyonu
- ✅ `src/contexts/auth-context.tsx` - Supabase session yönetimi
- ✅ `src/middleware.ts` - Supabase Auth middleware

**Özellikler:**
- Sign in / Sign up
- Password reset
- Session management
- Auto redirect on auth state change
- Backward compatibility (mock users for development)

---

### 3. **Service Dosyaları** ✅

Tüm service dosyaları Supabase API'ye göre yeniden yazıldı:

| Service | Dosya | Status |
|---------|-------|--------|
| Auth | `auth.service.ts` | ✅ |
| User | `user.service.ts` | ✅ |
| Student | `student.service.ts` | ✅ |
| Teacher | `teacher.service.ts` | ✅ |
| Parent | `parent.service.ts` | ✅ |
| Class | `class.service.ts` | ✅ |
| Course | `course.service.ts` | ✅ |
| Semester | `semester.service.ts` | ✅ |
| Homework | `homework.service.ts` | ✅ |
| Attendance | `attendance.service.ts` | ✅ |
| Grade | `grade.service.ts` | ✅ |
| Exam | `exam.service.ts` | ✅ |
| Canteen | `canteen.service.ts` | ✅ |
| Payment | `payment.service.ts` | ✅ |
| Announcement | `announcement.service.ts` | ✅ |
| Event | `event.service.ts` | ✅ |
| Message | `message.service.ts` | ✅ |
| Notification | `notification.service.ts` | ✅ |
| Vehicle | `vehicle.service.ts` | ✅ |
| Appointment | `appointment.service.ts` | ✅ |
| Leave | `leave.service.ts` | ✅ |
| Report | `report.service.ts` | ✅ |
| Upload | `upload.service.ts` | ✅ |
| Export | `export.service.ts` | ✅ |

---

### 4. **API Client Güncellemesi** ✅
- ✅ `src/lib/api/client.ts` - Supabase signOut entegrasyonu
- Backward compatibility korundu
- Legacy axios client hala çalışıyor

---

## 📝 Kullanım Örnekleri

### Basic CRUD Operations

```typescript
import { supabaseApi } from '@/lib/supabase/api'

// GET all
const users = await supabaseApi.getAll('users', {
  page: 1,
  limit: 10,
  filters: { isActive: true }
})

// GET by ID
const user = await supabaseApi.getById('users', 'user-id')

// CREATE
const newUser = await supabaseApi.create('users', {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe'
})

// UPDATE
const updated = await supabaseApi.update('users', 'user-id', {
  firstName: 'Jane'
})

// DELETE
const deleted = await supabaseApi.delete('users', 'user-id')
```

### Using Services

```typescript
import studentService from '@/lib/services/student.service'

// Get all students
const students = await studentService.getAll()

// Get by class
const classStudents = await studentService.getByClass('class-id')

// Get student balance
const balance = await studentService.getBalance('student-id', 'semester-id')

// Update balance
await studentService.updateBalance('student-id', 'semester-id', 100)
```

### Auth Operations

```typescript
import authService from '@/lib/services/auth.service'

// Sign in
const result = await authService.signIn({
  email: 'user@example.com',
  password: 'password'
})

// Sign out
await authService.signOut()

// Reset password
await authService.resetPassword('user@example.com')
```

### Using Auth Context

```typescript
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, logout, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  )
}
```

---

## 🔧 Environment Variables

`.env.local` dosyasına şunları ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🚦 Kalan İşler

### 1. Environment Variables Ayarları
- [ ] `.env.local` dosyasını oluştur
- [ ] Supabase credentials ekle

### 2. Component Migration
- [ ] Component'lerdeki mock data çağrılarını gerçek service çağrılarına çevir
- [ ] useQuery hookları ekle (@tanstack/react-query)
- [ ] Loading ve error state'leri ekle

### 3. Real-time Features (Opsiyonel)
- [ ] Store'ları Supabase real-time ile entegre et
- [ ] Live notifications
- [ ] Live message updates

### 4. Storage Setup
- [ ] Supabase Storage bucket'ları oluştur:
  - `profile-images` - Profil fotoğrafları
  - `documents` - Dökümanlar
  - `homework-submissions` - Ödev teslimleri
  - `announcements` - Duyuru görselleri

### 5. Row Level Security (RLS)
- [ ] Supabase dashboard'da RLS politikaları oluştur
- [ ] Her tablo için rol bazlı erişim kontrolleri

---

## 📚 Önemli Notlar

### Development Mode
- Middleware development modunda devre dışı (herkes erişebilir)
- Mock users hala çalışıyor (backward compatibility)
- Production'da `NODE_ENV=production` yapın

### Backward Compatibility
- Eski axios client korundu
- Mock users çalışmaya devam ediyor
- Kademeli migration mümkün

### Type Safety
- Tüm database işlemleri tip-güvenli
- TypeScript auto-complete tam destek
- Compile-time hata kontrolü

---

## 🎯 Migration Stratejisi

### Aşama 1: Hazırlık ✅
- [x] Types oluştur
- [x] Service'leri yaz
- [x] Auth entegrasyonu

### Aşama 2: Component Migration (ŞİMDİ)
1. Bir modül seç (örn: Öğrenci)
2. Component'lerdeki mock data'yı değiştir
3. Service'leri kullan
4. Test et
5. Diğer modüllere geç

### Aşama 3: Production (SON)
1. Environment variables ayarla
2. RLS politikaları oluştur
3. Storage bucket'ları ayarla
4. Development mode'u kapat
5. Deploy

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
`.env.local` dosyasında credentials kontrol edin.

### "Auth session not found"
Development modda mock users kullanılıyor. Production'da gerçek auth gerekli.

### "Insufficient privileges"
Supabase RLS politikalarını kontrol edin.

---

## 📞 İletişim

Sorular için proje sahibi ile iletişime geçin.

**Migration tamamlanma oranı: 70%** 🎉
