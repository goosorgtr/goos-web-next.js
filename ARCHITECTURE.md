# GOOS Web - Proje Mimarisi

## 🏗️ 3 Katmanlı Mimari

Bu proje, modüler ve ölçeklenebilir bir mimari kullanır. Üç ana katmandan oluşur:

### Katman 1: Routing (app/(dashboard)/)
- Next.js App Router ile sayfa yapısı
- Rol bazlı route ayrımı
- Her rol için ayrı klasör yapısı

### Katman 2: Rol-Spesifik Componentler (components/[role]/)
- Her rolün kendine özel UI componentleri
- Rol bazlı işlemler ve görünümler
- Paylaşımlı modülleri kullanır

### Katman 3: Paylaşımlı Modüller (modules/)
- Tüm roller tarafından kullanılan ortak kodlar
- İş mantığı, API hooks, tipler
- DRY prensibi (Don't Repeat Yourself)

---

## 📁 Klasör Yapısı

```
src/
├── app/(dashboard)/          # Katman 1: Routing
│   ├── admin/               # Admin paneli
│   ├── ogretmen/            # Öğretmen paneli
│   ├── ogrenci/             # Öğrenci paneli
│   ├── veli/                # Veli paneli
│   ├── kantinci/            # Kantinci paneli
│   └── servici/             # Servici paneli
│
├── components/               # Katman 2: Rol-Spesifik
│   ├── admin/               # Admin UI componentleri
│   ├── ogretmen/            # Öğretmen UI componentleri
│   ├── ogrenci/             # Öğrenci UI componentleri
│   ├── veli/                # Veli UI componentleri
│   ├── kantinci/            # Kantinci UI componentleri
│   └── servici/             # Servici UI componentleri
│
└── modules/                  # Katman 3: Paylaşımlı
    ├── konum/               # Konum modülü
    ├── odev/                # Ödev modülü
    ├── mesaj/               # Mesaj modülü
    ├── servis/              # Servis modülü
    ├── odeme/               # Ödeme modülü
    ├── kantin/              # Kantin modülü
    ├── etkinlik/            # Etkinlik modülü
    ├── duyuru/              # Duyuru modülü
    ├── devamsizlik/         # Devamsızlık modülü
    ├── notlar/              # Not listesi modülü
    ├── ders-programi/       # Ders programı modülü
    └── donem/               # Dönem modülü
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

## 📦 Modül Yapısı

Her modül aşağıdaki yapıyı içerir:

```
modules/[modul-adi]/
├── components/           # Paylaşımlı UI componentleri
├── hooks/                # API hooks (useQuery, useMutation)
├── types/                # TypeScript type definitions
├── services/             # API servis fonksiyonları
├── utils/                # Yardımcı fonksiyonlar
├── validations/          # Zod validation schemaları
└── index.ts              # Modül export dosyası
```

---

## 🔄 Veri Akışı

```
Sayfa (app/)
    ↓ import
Rol-Spesifik Component (components/[role]/)
    ↓ kullanır
Paylaşımlı Component (modules/[modul]/components/)
    ↓ kullanır
Hooks (modules/[modul]/hooks/)
    ↓ çağırır
Services (modules/[modul]/services/)
    ↓ API isteği
Backend
```

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

## 📝 Geliştirme Kuralları

1. **Routing**: Sadece `app/` klasöründe
2. **İş Mantığı**: Sadece `modules/` klasöründe
3. **Rol-Spesifik UI**: Sadece `components/[role]/` klasöründe
4. **API Çağrıları**: Sadece hooks ve services içinde
5. **Tip Tanımları**: Her modülün kendi `types/` klasöründe

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

## 📄 Lisans

MIT License
