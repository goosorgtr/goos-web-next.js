# Proje Notları ve Yeni Eklenen Componentler

Bu dosya, projeye sonradan eklenen kütüphaneleri, componentleri ve önemli yapısal değişiklikleri takip etmek amacıyla oluşturulmuştur.

## 📅 06.01.2025 - Devamsızlık Modülü ve UI Eklentileri

Devamsızlık ekleme penceresi (`AddAbsenceDialog`) ve diğer form işlemleri için **shadcn/ui** kütüphanesinden aşağıdaki componentler projeye manuel olarak dahil edilmiştir.

### 1. Eklenen UI Componentleri (`src/components/ui/`)

Bu componentler `npx shadcn@latest add [component]` komutu veya manuel kopyalama ile eklenmiştir.

*   **`src/components/ui/select.tsx`**
    *   **Kullanım Amacı:** Açılır menü (Dropdown) oluşturmak.
    *   **Örnek:** Sınıf seçimi, Şube seçimi, Öğrenci listesi.
    *   **Bağımlılık:** `@radix-ui/react-select`

*   **`src/components/ui/calendar.tsx`**
    *   **Kullanım Amacı:** Tarih seçimi (Datepicker) için takvim arayüzü.
    *   **Örnek:** Devamsızlık tarihi, Doğum tarihi seçimi.
    *   **Bağımlılık:** `react-day-picker`, `date-fns`

*   **`src/components/ui/popover.tsx`**
    *   **Kullanım Amacı:** Bir butona tıklandığında üzerinde açılan baloncuk/pencere.
    *   **Örnek:** Tarih seçiciye tıklandığında takvimin açılması.
    *   **Bağımlılık:** `@radix-ui/react-popover`

### 2. Yüklenen NPM Paketleri

Bu componentlerin çalışması için aşağıdaki paketler projeye dahil edilmiştir:

```bash
npm install date-fns react-day-picker
npm install @radix-ui/react-select @radix-ui/react-popover
```

### 3. Yeni Oluşturulan Sayfa Componentleri

*   **`src/components/admin/devamsizlik/AddAbsenceDialog.tsx`**
    *   Yöneticilerin manuel devamsızlık eklemesini sağlayan popup form.

## 🚀 Gelecek İçin Öneriler ve Hazır Kütüphaneler

Projede `package.json` dosyasında yüklü olan ancak henüz UI component'i oluşturulmamış (veya aktif edilmemiş) çok güçlü kütüphaneler var. İleride bunları kullanarak projeyi hızlandırabilirsiniz:

### 1. Bildirimler (Toast / Sonner)
*   **Durum:** `sonner` paketi yüklü ancak `layout.tsx` dosyasında yapılandırılmamış.
*   **Öneri:** Kullanıcıya "Kayıt Başarılı", "Hata Oluştu" gibi mesajlar vermek için `src/components/ui/sonner.tsx` oluşturulup `layout.tsx` dosyasına `<Toaster />` eklenmeli.

### 2. Gelişmiş Tablolar (Data Table)
*   **Durum:** `@tanstack/react-table` yüklü. Bu, dünyadaki en popüler React tablo kütüphanesidir.
*   **Öneri:** Karmaşık tablolar (filtreleme, sıralama, sayfalama) için HTML table yerine bu kütüphane kullanılmalı.

### 3. Kullanıma Hazır Diğer Componentler
Aşağıdaki paketler projede yüklü, sadece `src/components/ui` içine dosyalarını oluşturmanız (veya `npx shadcn@latest add ...` komutunu çalıştırmanız) yeterli:

| Component | Paket Adı | Ne İşe Yarar? |
| :--- | :--- | :--- |
| **Dropdown Menu** | `@radix-ui/react-dropdown-menu` | "Düzenle", "Sil" gibi açılır menüler için. |
| **Avatar** | `@radix-ui/react-avatar` | Kullanıcı profil resimleri için yuvarlak çerçeve. |
| **Tabs** | `@radix-ui/react-tabs` | Sayfa yenilemeden sekmeler arası geçiş için. |
| **Alert Dialog** | `@radix-ui/react-alert-dialog` | "Silmek istediğinize emin misiniz?" uyarıları için. |
| **Form** | `react-hook-form` + `zod` | Şu an manuel kullanılıyor. Shadcn `<Form>` yapısına geçilirse hata yönetimi otomatikeşir. |

### 4. Kod İyileştirme Fırsatları
*   Mevcut formlarda (`KullaniciForm` vb.) standart HTML `<select>` etiketi kullanılıyor. Bunlar, yeni eklediğimiz ve daha şık duran `Select` component'i ile değiştirilebilir.

