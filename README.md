# 🏫 GOOS - Okul Yönetim Sistemi

Next.js 14, TypeScript, Tailwind CSS ve Supabase ile geliştirilmiş kapsamlı okul yönetim sistemi.

## ✨ Özellikler

- 🏫 **Çoklu Rol Desteği**: Admin, Öğretmen, Öğrenci, Veli, Kantinci, Servici
- 📚 **Akademik Yönetim**: Sınıflar, dersler, sınavlar, notlar ve ödevler
- 💰 **Finans Yönetimi**: Ödeme planları, borç takibi ve taksitler
- 🍔 **Kantin Sistemi**: Ürün yönetimi, siparişler ve bakiye takibi
- 📢 **İletişim**: Duyurular, etkinlikler ve bildirimler
- 🚌 **Servis Yönetimi**: Araç ve öğrenci atama yönetimi
- 📊 **Raporlama**: Akademik ve finansal raporlar
- 🔔 **Real-time Bildirimler**: Supabase real-time ile canlı güncellemeler
- 🔐 **Güvenli Auth**: Supabase Auth ile güvenli kimlik doğrulama

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   └── (dashboard)/       # Dashboard pages (admin, teacher, student, parent)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── tables/           # Table components
│   └── ...
├── lib/                   # Utility functions and configurations
│   ├── api/              # API client and endpoints
│   ├── services/         # API service functions
│   ├── validations/      # Zod schemas
│   └── utils/            # Helper functions
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
├── types/                 # TypeScript type definitions
└── constants/            # App constants
```

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ ve npm/yarn/pnpm
- Supabase hesabı ([supabase.com](https://supabase.com))

### Kurulum

1. **Repoyu klonla**
```bash
git clone <repository-url>
cd goos-web-next.js
```

2. **Dependencies yükle**
```bash
npm install
```

3. **Environment dosyası oluştur**
```bash
# .env.local dosyası oluştur
echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
echo "NODE_ENV=development" >> .env.local
```

**Supabase credentials'ı al:**
- [app.supabase.com](https://app.supabase.com) → Projeniz → Settings → API
- `URL` ve `anon public` key'i kopyalayın

4. **Development server başlat**
```bash
npm run dev
```

5. **Tarayıcıda aç**
[http://localhost:3000](http://localhost:3000)

### 🔐 Test Kullanıcıları (Development Mode)

**TC:** `12345678912`  
**Şifreler:**
- `admin` → Admin paneli
- `veli` → Veli paneli
- `ogrenci` → Öğrenci paneli
- `ogretmen` → Öğretmen paneli
- `kantinci` → Kantinci paneli
- `servici` → Servici paneli

**Production için:** Login sayfasında "E-posta" sekmesine geçip Supabase Auth kullanın.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## User Roles

### Admin
- Full system access
- User management (students, teachers, parents)
- Academic management (classes, courses, semesters)
- Finance management (payment plans, debts)
- Canteen management
- Reports and analytics

### Teacher
- Course and student management
- Exam creation and grading
- Attendance tracking
- Homework assignment and evaluation

### Student
- View courses and schedule
- Submit homework
- View grades and attendance
- Use canteen system
- View payments

### Parent
- Monitor children's academic progress
- View grades and attendance
- Track payments and debts
- Manage canteen balance
- Communicate with teachers

## 📚 Dokümantasyon

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Detaylı kurulum talimatları
- **[SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)** - Supabase entegrasyon rehberi
- **[ARCHITECTURE_FINAL.md](./ARCHITECTURE_FINAL.md)** - Mimari dökümantasyon

## 🎯 Geliştirme Durumu

### ✅ Tamamlanan (v1.0)
- ✅ Supabase entegrasyonu
- ✅ Auth sistemi (Login/Logout/Password Reset)
- ✅ 24 Service dosyası
- ✅ Real-time notifications
- ✅ Store management (Zustand)
- ✅ Type-safe database operations
- ✅ 50+ database table types
- ✅ UI components (shadcn/ui)

### 🚧 Devam Eden
- Component migration (mock data → real data)
- Row Level Security policies
- Storage buckets setup

### 📋 Planlanan
- Advanced reporting
- Mobile app
- Push notifications

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen önce bir issue açın.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**© 2025 GOOS - Okul Yönetim Sistemi**
