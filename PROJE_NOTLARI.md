# Proje Notları ve Yeni Eklenen Componentler

Bu dosya, projeye sonradan eklenen kütüphaneleri, componentleri ve önemli yapısal değişiklikleri takip etmek amacıyla oluşturulmuştur.

---

## 📦 TÜM COMPONENTLER LİSTESİ

### 🎨 UI Componentleri (`src/components/ui/`)

Shadcn/ui ve Radix UI tabanlı temel UI componentleri:

| Component | Kullanım Amacı |
|-----------|----------------|
| `breadcrumb.tsx` | Sayfa navigasyon breadcrumb |
| `button.tsx` | Buton component'i |
| `calendar.tsx` | Tarih seçici takvim |
| `card.tsx` | Kart container |
| `checkbox.tsx` | Checkbox input |
| `dialog.tsx` | Modal/Dialog pencere |
| `input.tsx` | Text input |
| `label.tsx` | Form label |
| `pdf-download-button.tsx` | PDF indirme butonu |
| `pdf-print-button.tsx` | PDF yazdırma butonu |
| `popover.tsx` | Popover baloncuk |
| `scroll-area.tsx` | Scroll container |
| `select.tsx` | Dropdown seçim |

### 🤝 Shared Componentler (`src/components/shared/`)

Tüm roller için ortak kullanılan componentler:

| Component | Kullanım Amacı |
|-----------|----------------|
| `ProfilePage.tsx` | Ortak profil sayfası (tüm roller) |
| `ProfileSettingsForm.tsx` | Profil bilgileri düzenleme formu |
| `PasswordChangeForm.tsx` | Şifre değiştirme formu |
| `SettingsContent.tsx` | Ayarlar sayfası ana component |

### 🏗️ Layout Componentleri (`src/components/layout/`)

Temel layout ve sidebar componentleri:

| Component | Kullanım Amacı |
|-----------|----------------|
| `BaseSidebar.tsx` | Temel sidebar component'i |
| `LogoutButton.tsx` | Çıkış yapma butonu |
| `SidebarDropdown.tsx` | Sidebar açılır menü |
| `SidebarItem.tsx` | Sidebar menü item |

---

## 👥 ROL-SPESİFİK COMPONENTLER

### 👨‍💼 Admin Componentleri (`src/components/admin/`)

**Layout:**
- `layout/AdminHeader.tsx` - Admin header
- `layout/AdminSidebar.tsx` - Admin sidebar
- `layout/AdminStats.tsx` - İstatistik kartları

**Kullanıcılar & Roller:**
- `kullanicilar/AdminKullanicilarDashboard.tsx` - Kullanıcı yönetim dashboard'u
- `kullanicilar/AddUserDialog.tsx` - Yeni kullanıcı ekleme popup
- `kullanicilar/EditUserDialog.tsx` - Kullanıcı düzenleme popup

**Ödev:**
- `odev/AdminOdevDashboard.tsx` - Ödev yönetim ana sayfa
- `odev/AdminOdevTable.tsx` - Ödev tablosu
- `odev/AdminOdevStats.tsx` - Ödev istatistikleri
- `odev/AdminOdevFilters.tsx` - Ödev filtreleme
- `odev/AdminOdevActions.tsx` - Ödev işlem butonları

**Devamsızlık:**
- `devamsizlik/AddAbsenceDialog.tsx` - Devamsızlık ekleme popup
- `devamsizlik/EditAbsenceDialog.tsx` - Devamsızlık düzenleme popup

**Notlar:**
- `notlar/GradeDetailDialog.tsx` - Not detayları popup
- `notlar/EditGradeDialog.tsx` - Not düzenleme popup

**Kantin:**
- `kantin/AdminKantinDashboard.tsx` - Kantin yönetim dashboard'u
- `kantin/AdminKantinReports.tsx` - Kantin raporları
- `kantin/AdminKantinSettings.tsx` - Kantin ayarları

**Servis:**
- `vehicles/AddVehicleDialog.tsx` - Araç ekleme popup
- `vehicles/EditVehicleDialog.tsx` - Araç düzenleme popup
- `vehicles/AssignStudentDialog.tsx` - Öğrenci atama popup

**Diğer:**
- `bakiye/AddBalanceDialog.tsx` - Bakiye ekleme popup
- `yemek-listesi/AdminYemekListesiDashboard.tsx` - Yemek listesi yönetimi
- `ders-programi/AdminDersProgramiDashboard.tsx` - Ders programı yönetimi

### 👨‍🏫 Öğretmen Componentleri (`src/components/ogretmen/`)

**Layout:**
- `layout/OgretmenHeader.tsx` - Öğretmen header
- `layout/OgretmenSidebar.tsx` - Öğretmen sidebar

**Ödev:**
- `odev/OgretmenOdevDashboard.tsx` - Ödev yönetim ana sayfa
- `odev/OdevOlusturForm.tsx` - Yeni ödev oluşturma formu
- `odev/OdevNotlamaPanel.tsx` - Ödev notlama paneli
- `odev/OdevTeslimlerTable.tsx` - Ödev teslimleri tablosu
- `odev/OdevDurumuCard.tsx` - Ödev durum kartı

**Devamsızlık:**
- `devamsizlik/YoklamaAlPanel.tsx` - Yoklama alma paneli
- `devamsizlik/DevamsizlikListesi.tsx` - Devamsızlık listesi
- `devamsizlik/DevamsizlikIstatistik.tsx` - Devamsızlık istatistikleri

**Diğer:**
- `ders-programi/OgretmenDersProgramiDashboard.tsx` - Ders programı
- `yemek-listesi/OgretmenYemekListesiDashboard.tsx` - Yemek listesi

### 🎓 Öğrenci Componentleri (`src/components/ogrenci/`)

**Layout:**
- `layout/OgrenciHeader.tsx` - Öğrenci header
- `layout/OgrenciSidebar.tsx` - Öğrenci sidebar

**Ödev:**
- `odev/OgrenciOdevDashboard.tsx` - Ödev listesi ana sayfa
- `odev/OdevListesiCard.tsx` - Ödev listesi kartı
- `odev/OdevTeslimForm.tsx` - Ödev teslim formu
- `odev/OdevDurumBadge.tsx` - Ödev durum badge'i

**Kantin:**
- `kantin/OgrenciKantinMenu.tsx` - Kantin menüsü
- `kantin/BakiyeWidget.tsx` - Bakiye gösterge widget'ı
- `kantin/KantinSepet.tsx` - Kantin sepeti
- `kantin/SiparisGecmisi.tsx` - Sipariş geçmişi

**Diğer:**
- `ders-programi/OgrenciDersProgramiDashboard.tsx` - Ders programı
- `yemek-listesi/OgrenciYemekListesiDashboard.tsx` - Yemek listesi

### 👨‍👩‍👧‍👦 Veli Componentleri (`src/components/veli/`)

**Layout:**
- `layout/VeliHeader.tsx` - Veli header
- `layout/VeliSidebar.tsx` - Veli sidebar
- `layout/CocukSecici.tsx` - Çocuk seçme dropdown'u

**Ödev:**
- `odev/CocukOdevListesi.tsx` - Çocuğun ödev listesi
- `odev/OdevDetayCard.tsx` - Ödev detay kartı

**Konum:**
- `konum/CocukKonumTracker.tsx` - Çocuk konum takibi
- `konum/KonumGecmisi.tsx` - Konum geçmişi
- `konum/GuvenliAlanlar.tsx` - Güvenli alan yönetimi

**Diğer:**
- `ders-programi/VeliDersProgramiDashboard.tsx` - Ders programı
- `yemek-listesi/VeliYemekListesiDashboard.tsx` - Yemek listesi

### 🍔 Kantinci Componentleri (`src/components/kantinci/`)

**Layout:**
- `layout/KantinciSidebar.tsx` - Kantinci sidebar

**Ürünler:**
- `urunler/UrunYonetimPanel.tsx` - Ürün yönetim paneli
- `urunler/UrunForm.tsx` - Ürün ekleme/düzenleme formu
- `urunler/UrunKategoriManager.tsx` - Kategori yönetimi
- `urunler/StokTakip.tsx` - Stok takibi

**Siparişler:**
- `siparisler/SiparisYonetimPanel.tsx` - Sipariş yönetim paneli
- `siparisler/AktifSiparisler.tsx` - Aktif siparişler listesi
- `siparisler/SiparisDetay.tsx` - Sipariş detayı

### 🚌 Servici Componentleri (`src/components/servici/`)

**Layout:**
- `layout/ServiciSidebar.tsx` - Servici sidebar

**Rotalar:**
- `rotalar/RotaYonetimPanel.tsx` - Rota yönetim paneli
- `rotalar/RotaHaritasi.tsx` - Rota haritası
- `rotalar/OgrenciAtama.tsx` - Öğrenci rota ataması

**Konum:**
- `konum/AracKonumTracker.tsx` - Araç konum takibi
- `konum/RotaTakip.tsx` - Rota takibi

---

## 🧩 MODÜL COMPONENTLERI (`src/modules/`)

Paylaşımlı, rol-agnostik componentler:

### Ödev Modülü (`modules/odev/components/`)
- `HomeworkCard.tsx` - Ödev kartı
- `HomeworkList.tsx` - Ödev listesi
- `HomeworkDetail.tsx` - Ödev detayı
- `HomeworkForm.tsx` - Ödev formu
- `HomeworkSubmit.tsx` - Ödev teslim
- `HomeworkGrading.tsx` - Ödev notlama
- `HomeworkStatus.tsx` - Ödev durum badge'i

### Kantin Modülü (`modules/kantin/components/`)
- `ProductCard.tsx` - Ürün kartı
- `ProductList.tsx` - Ürün listesi
- `ProductForm.tsx` - Ürün formu
- `OrderCart.tsx` - Sipariş sepeti
- `OrderHistory.tsx` - Sipariş geçmişi
- `BalanceWidget.tsx` - Bakiye widget'ı
- `CategoryFilter.tsx` - Kategori filtresi

### Konum Modülü (`modules/konum/components/`)
- `LocationMap.tsx` - Konum haritası
- `LocationTracker.tsx` - Konum takip
- `LocationHistory.tsx` - Konum geçmişi
- `RouteMap.tsx` - Rota haritası
- `SafeZoneManager.tsx` - Güvenli alan yönetimi

### Servis Modülü (`modules/servis/components/`)
- `VehicleCard.tsx` - Araç kartı
- `RouteCard.tsx` - Rota kartı
- `RouteMap.tsx` - Rota haritası
- `RouteStatus.tsx` - Rota durumu
- `StudentAssignment.tsx` - Öğrenci ataması

### Devamsızlık Modülü (`modules/devamsizlik/components/`)
- `AttendanceTable.tsx` - Devamsızlık tablosu
- `AttendanceTaker.tsx` - Yoklama alma
- `AttendanceCalendar.tsx` - Devamsızlık takvimi
- `AttendanceStats.tsx` - İstatistikler
- `AttendanceReport.tsx` - Rapor

### Notlar Modülü (`modules/notlar/components/`)
- `GradeTable.tsx` - Not tablosu
- `GradeCard.tsx` - Not kartı
- `GradeForm.tsx` - Not formu
- `GradeChart.tsx` - Not grafikleri
- `ReportCard.tsx` - Karne

### Mesaj Modülü (`modules/mesaj/components/`)
- `MessageList.tsx` - Mesaj listesi
- `MessageThread.tsx` - Mesaj konusu
- `MessageBubble.tsx` - Mesaj balonu
- `MessageComposer.tsx` - Mesaj yazma
- `MessageNotification.tsx` - Mesaj bildirimleri

### Ödeme Modülü (`modules/odeme/components/`)
- `PaymentForm.tsx` - Ödeme formu
- `PaymentHistory.tsx` - Ödeme geçmişi
- `PaymentMethodSelector.tsx` - Ödeme yöntemi seçici
- `DebtCard.tsx` - Borç kartı
- `InvoiceCard.tsx` - Fatura kartı

### Dönem Modülü (`modules/donem/components/`)
- `AddDonemDialog.tsx` - Dönem ekleme popup
- `EditDonemDialog.tsx` - Dönem düzenleme popup
- `DonemForm.tsx` - Dönem formu

### Kullanıcılar Modülü (`modules/kullanicilar/components/`)
- `KullaniciForm.tsx` - Kullanıcı formu

### PDF Viewer Modülü (`modules/pdf-viewer/components/`)
- `PdfViewer.tsx` - PDF görüntüleyici
- `PdfDocument.tsx` - PDF doküman
- `PdfToolbar.tsx` - PDF araç çubuğu

---

## 📅 ZAMAN ÇİZELGESİ

### 06.01.2025 - Devamsızlık Modülü ve UI Eklentileri

Devamsızlık ekleme penceresi (`AddAbsenceDialog`) ve diğer form işlemleri için **shadcn/ui** kütüphanesinden aşağıdaki componentler projeye manuel olarak dahil edilmiştir.

#### Eklenen UI Componentleri

*   **`src/components/ui/select.tsx`** - Açılır menü (Dropdown)
*   **`src/components/ui/calendar.tsx`** - Tarih seçimi (Datepicker)
*   **`src/components/ui/popover.tsx`** - Baloncuk pencere

#### Yüklenen NPM Paketleri

```bash
npm install date-fns react-day-picker
npm install @radix-ui/react-select @radix-ui/react-popover
```

---

### 14.01.2026 - Profil Sayfası ve UI İyileştirmeleri

#### 1. Ortak Profil Sayfası Oluşturuldu

**Component:**
*   **`src/components/shared/ProfilePage.tsx`**
    *   Tüm roller için ortak profil görüntüleme ve düzenleme
    *   Profil fotoğrafı yükleme
    *   Rol bazlı özel bilgiler (Öğrenci no, sınıf, dersler, çocuklar)
    *   Edit/View mode toggle
    *   Modern cover + avatar tasarımı

**Sayfa Route'ları:**
*   `/admin/profil`
*   `/ogretmen/profil`
*   `/ogrenci/profil`
*   `/veli/profil`
*   `/kantinci/profil`
*   `/servici/profil`

#### 2. Sidebar Güncellemeleri

*   Tüm rollere "Profilim" menüsü eklendi (User icon)
*   Veli sidebar'ında "Kontrol Paneli" → "Ana Sayfa" olarak değiştirildi
*   Layout scroll sorunu düzeltildi (Sidebar fixed, content scrollable)

#### 3. Profil Sayfası Özellikleri

**Genel Bilgiler:**
*   Profil fotoğrafı (2MB max)
*   Ad Soyad
*   E-posta (salt okunur)
*   Telefon
*   Doğum tarihi
*   Cinsiyet
*   Adres

**Rol Bazlı Bilgiler:**
*   **Öğrenci:** Öğrenci No, Sınıf
*   **Öğretmen:** Verdiği dersler listesi
*   **Veli:** Çocuklar listesi
*   **Kantinci/Servici:** Görev bilgileri

---

## 🔮 Gelecek Adımlar

### ✅ Tamamlanan: Supabase Entegrasyonu (14.01.2026)

**Oluşturulan Dosyalar:**
*   `src/lib/supabase/client.ts` - Typed Supabase client
*   `src/lib/supabase/types.ts` - 40+ tablo için TypeScript tipleri
*   `src/lib/supabase/helpers.ts` - Case conversion ve utility fonksiyonları
*   `src/lib/supabase/api.ts` - CRUD wrapper (otomatik case conversion)

**Özellikler:**
*   ✅ Full TypeScript type safety (Database generic types)
*   ✅ Otomatik snake_case ↔ camelCase dönüşümü
*   ✅ Generic CRUD operations (getAll, getById, create, update, delete)
*   ✅ Error handling ve standardized responses
*   ✅ Pagination, filtering, sorting desteği
*   ✅ Backward compatibility (mevcut API client korundu)

**Database Types:**
*   40+ tablo için tam tip desteği
*   Enum types (AttendanceStatus, HomeworkStatus, Gender, vb.)
*   Row, Insert, Update helper types
*   Join table desteği

### Öncelikli Yapılacaklar

1. **Supabase RLS Politikaları**
   *   Row Level Security ayarları
   *   Rol bazlı erişim kontrolleri
   *   Profil fotoğrafı Storage

2. **Kantin Modülü Tabloları**
   *   canteen_products
   *   canteen_orders
   *   canteen_order_items

3. **Toast Notification**
   *   Sonner aktif et
   *   Success/Error toast'ları

4. **Form Validasyon**
   *   Zod schema'ları
   *   Telefon formatı

---

## 📊 İSTATİSTİKLER

- **Toplam UI Component:** 13
- **Toplam Shared Component:** 4
- **Toplam Layout Component:** 4
- **Toplam Admin Component:** 24
- **Toplam Öğretmen Component:** 12
- **Toplam Öğrenci Component:** 12
- **Toplam Veli Component:** 10
- **Toplam Kantinci Component:** 8
- **Toplam Servici Component:** 6
- **Toplam Modül Component:** 51

**GENEL TOPLAM: 144 Component** 🎉
