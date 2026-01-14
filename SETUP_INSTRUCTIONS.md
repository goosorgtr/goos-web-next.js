# 🚀 GOOS Supabase Entegrasyonu - Kurulum Talimatları

## ✅ Tamamlanan İşler

### 1. Database & API ✅
- ✅ TypeScript types (50+ tablo)
- ✅ Generic CRUD API wrapper
- ✅ 24 Service dosyası
- ✅ Otomatik camelCase ↔ snake_case dönüşümü

### 2. Auth Sistemi ✅
- ✅ Supabase Auth entegrasyonu
- ✅ Login/Logout
- ✅ Session management
- ✅ Auth context
- ✅ Middleware

### 3. Store Management ✅
- ✅ Notification store (real-time)
- ✅ Cart store (kantin)
- ✅ User store
- ✅ Modal store
- ✅ UI store

### 4. Components ✅
- ✅ Login sayfası Supabase'e bağlandı
- ✅ Toast notifications eklendi

---

## 📦 ADIM 1: Environment Variables Ayarla

`.env.local` dosyası oluştur (proje root'unda):

```bash
# .env.local dosyasını oluştur
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here" >> .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
echo "NODE_ENV=development" >> .env.local
```

**Supabase Credentials'ı Al:**
1. https://app.supabase.com/ adresine git
2. Projenizi seçin
3. Settings → API menüsüne git
4. `URL` ve `anon` `public` key'i kopyala

---

## 🗄️ ADIM 2: Supabase Database Setup

### Option A: Automatic (Recommended)

Database tablolarını otomatik oluşturmak için Supabase SQL Editor'ü kullan.

### Option B: Manual

Supabase Dashboard → SQL Editor'de şu tabloları oluştur:

**Temel Tablolar:**
- `roles` - Roller
- `users` - Kullanıcılar
- `students` - Öğrenciler
- `teachers` - Öğretmenler
- `parents` - Veliler
- `classes` - Sınıflar
- `courses` - Dersler
- `semesters` - Dönemler

**Modül Tabloları:**
- `homeworks` - Ödevler
- `homework_status_records` - Ödev durumları
- `attendance` - Devamsızlık
- `exams` - Sınavlar
- `exam_results` - Sınav sonuçları
- `announcements` - Duyurular
- `events` - Etkinlikler

**Kantin Tabloları:**
- `canteen_products` - Ürünler
- `canteen_categories` - Kategoriler
- `canteen_orders` - Siparişler
- `canteen_order_items` - Sipariş kalemleri
- `canteen_transactions` - İşlemler
- `student_balances` - Öğrenci bakiyeleri

**Ödeme Tabloları:**
- `payments` - Ödemeler
- `payment_categories` - Ödeme kategorileri
- `debts` - Borçlar
- `payment_plans` - Ödeme planları

**Servis Tabloları:**
- `vehicles` - Araçlar
- `routes` - Rotalar
- `route_stops` - Duraklar
- `student_route_assignments` - Öğrenci atamala

**Diğer:**
- `notifications` - Bildirimler
- `messages` - Mesajlar
- `message_threads` - Mesaj konuları
- `appointments` - Randevular

---

## 🔐 ADIM 3: Row Level Security (RLS) Politikaları

Supabase Dashboard → Authentication → Policies menüsünde RLS politikalarını oluştur.

**Örnek Policy (users tablosu):**

```sql
-- Kullanıcılar sadece kendi profilini görebilir
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Kullanıcılar sadece kendi profilini güncelleyebilir
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

---

## 📁 ADIM 4: Storage Buckets Oluştur

Supabase Dashboard → Storage menüsünde şu bucket'ları oluştur:

1. **profile-images** (Public)
   - Profil fotoğrafları
   - Max size: 2MB

2. **documents** (Private)
   - Dökümanlar
   - Max size: 10MB

3. **homework-submissions** (Private)
   - Ödev teslimleri
   - Max size: 20MB

4. **announcements** (Public)
   - Duyuru görselleri
   - Max size: 5MB

---

## 🚀 ADIM 5: Uygulamayı Çalıştır

```bash
# Dependencies yükle (eğer yüklenmemişse)
npm install

# Development server başlat
npm run dev
```

Tarayıcıda aç: http://localhost:3000

---

## 🔑 ADIM 6: İlk Kullanıcıyı Oluştur

### Development Mode (Mock Users):

TC: `12345678912`  
Şifreler:
- `admin` → Admin paneli
- `veli` → Veli paneli
- `ogrenci` → Öğrenci paneli
- `ogretmen` → Öğretmen paneli
- `kantinci` → Kantinci paneli
- `servici` → Servici paneli

### Production Mode (Supabase Auth):

1. Login sayfasında "E-posta" sekmesine geç
2. Email ve şifre ile giriş yap
3. İlk kullanıcı için Supabase Dashboard'dan manuel oluştur:

```sql
-- Supabase SQL Editor'de
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'admin@goos.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Role oluştur
INSERT INTO roles (name, is_active) VALUES ('admin', true);

-- User profile oluştur
INSERT INTO users (id, email, first_name, last_name, role_id, is_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@goos.com'),
  'admin@goos.com',
  'Admin',
  'User',
  (SELECT id FROM roles WHERE name = 'admin'),
  true
);
```

---

## 📚 Kullanım Örnekleri

### Service Kullanımı

```typescript
import studentService from '@/lib/services/student.service'

// Öğrencileri getir
const students = await studentService.getAll()

// Öğrenci detayı
const student = await studentService.getById('student-id')

// Bakiye sorgula
const balance = await studentService.getBalance('student-id', 'semester-id')
```

### Store Kullanımı

```typescript
import { useNotificationStore } from '@/store/notification-store'

function MyComponent() {
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore()
  
  useEffect(() => {
    fetchNotifications(userId)
  }, [userId])
  
  return <div>Unread: {unreadCount}</div>
}
```

### Auth Context Kullanımı

```typescript
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginPrompt />
  }
  
  return (
    <div>
      <p>Welcome {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- `.env.local` dosyasını kontrol et
- Development server'ı yeniden başlat (`Ctrl+C` → `npm run dev`)

### "Failed to fetch user profile"
- Supabase'de `users` tablosu var mı kontrol et
- RLS politikaları doğru mu kontrol et

### "Auth session not found"
- Development modda mock users kullanabilirsin
- Production için Supabase'de kullanıcı oluştur

### Login sonrası redirect olmuyor
- Auth context'te user fetch ediliyor mu kontrol et
- Browser console'da hata var mı bak

---

## 🎯 Sonraki Adımlar

### Öncelikli:
1. ✅ `.env.local` dosyasını oluştur
2. ✅ Supabase'de database tablolarını oluştur
3. ✅ İlk admin kullanıcısını oluştur
4. ✅ Login sayfasından test et

### Opsiyonel (Kademeli):
1. Component'leri migrate et
2. Real-time features ekle
3. RLS politikalarını detaylandır
4. Storage bucket'ları ayarla

---

## 📞 Yardım

Migration guide: `SUPABASE_MIGRATION_GUIDE.md`

**Başarılar! 🚀**
