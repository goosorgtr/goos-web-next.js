# 🚀 Supabase Kurulum Rehberi

Bu rehber, GOOS School Management System için Supabase veritabanını kurmak için gereken adımları içerir.

## ✅ 1. .env.local Dosyası Oluşturuldu

`.env.local` dosyası zaten oluşturuldu ve Supabase credentials eklendi.

## 📋 2. Veritabanı Şemasını Oluştur

Supabase Dashboard'a git: https://lzsvwjtvhqugksbwsjvz.supabase.co

### Adım 1: SQL Editor'ü Aç
1. Sol menüden **SQL Editor**'e tıkla
2. **New Query** butonuna tıkla

### Adım 2: Migration SQL'ini Çalıştır
`supabase/migrations/001_initial_schema.sql` dosyasındaki SQL kodunu kopyala ve SQL Editor'de çalıştır.

Bu SQL şunları oluşturur:
- ✅ `roles` tablosu (6 rol: admin, veli, ogrenci, ogretmen, kantinci, servici)
- ✅ `users` tablosu (tüm kullanıcı bilgileri + TC Kimlik No)
- ✅ Indexes (performans için)
- ✅ Row Level Security (RLS) policies
- ✅ Otomatik `updated_at` trigger'ları

### Adım 3: Tabloları Kontrol Et
1. Sol menüden **Table Editor**'e tıkla
2. `roles` tablosunu aç → 6 rol olmalı (admin, veli, ogrenci, ogretmen, kantinci, servici)
3. `users` tablosunu aç → Boş olmalı (henüz kullanıcı oluşturmadık)

## 🧪 3. Test Et

### Dev Server'ı Yeniden Başlat
```bash
# Eğer çalışıyorsa durdur (Ctrl+C)
npm run dev
```

### Sayfaları Test Et
1. **http://localhost:3000/admin/kullanicilar-roller**
   - Artık "Yükleniyor..." yazısı gitmeli
   - Boş kullanıcı listesi görünmeli
   - "Yeni Kullanıcı Ekle" butonu çalışmalı

2. **Yeni Kullanıcı Oluştur**
   - "Yeni Kullanıcı Ekle" butonuna tıkla
   - Test kullanıcısı oluştur:
     - Ad: Test
     - Soyad: Admin
     - TC No: 12345678901
     - Email: admin@goos.com
     - Rol: admin
     - Şifre: admin1234
   - "Kullanıcı Oluştur" butonuna tıkla

3. **Login Test Et**
   - **http://localhost:3000/giris** sayfasına git

   **Email ile giriş:**
   - Email: admin@goos.com
   - Şifre: admin1234

   **TC Kimlik ile giriş:**
   - TC toggle'a tıkla
   - TC No: 12345678901
   - Şifre: admin1234

4. **Dashboard'a Yönlendir**
   - Giriş başarılı olursa otomatik olarak `/admin` sayfasına yönlendirileceksin

## 🔧 Olası Sorunlar ve Çözümler

### Sorun 1: "Yükleniyor..." Sonsuz Döngü
**Çözüm:**
- Dev server'ı yeniden başlat
- Browser cache'i temizle (Ctrl+Shift+R veya Cmd+Shift+R)
- Supabase'de `users` ve `roles` tablolarının oluşturulduğunu kontrol et

### Sorun 2: "Row Level Security" Hatası
**Çözüm:**
- SQL migration'ı tamamen çalıştır
- Veya geçici olarak RLS'yi kapat (önerilmez, sadece test için):
  ```sql
  ALTER TABLE users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
  ```

### Sorun 3: Kullanıcı Oluşturulamıyor
**Çözüm:**
- Supabase Dashboard → Authentication → Email Templates → Confirm signup
- "Enable email confirmations" ayarını kapat (development için)

### Sorun 4: TC Kimlik ile Giriş Yapmıyor
**Çözüm:**
- Önce Email ile kullanıcı oluştur
- TC Kimlik No'yu doğru girdiğinden emin ol (11 hane)
- Kullanıcının `is_active = true` olduğunu kontrol et

## 📊 Veritabanı Yapısı

### roles tablosu
| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | UUID | Primary key |
| name | TEXT | Rol adı (admin, veli, ogrenci, etc.) |
| is_active | BOOLEAN | Aktif/pasif durumu |
| created_at | TIMESTAMP | Oluşturulma tarihi |
| updated_at | TIMESTAMP | Güncellenme tarihi |

### users tablosu
| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | UUID | Primary key (Supabase Auth ile eşleşir) |
| role_id | UUID | Rol ID (foreign key) |
| email | TEXT | Email (unique) |
| tc_no | TEXT | TC Kimlik No (unique, 11 hane) |
| first_name | TEXT | Ad |
| last_name | TEXT | Soyad |
| phone | TEXT | Telefon |
| date_of_birth | DATE | Doğum tarihi |
| gender | TEXT | Cinsiyet (male/female/other) |
| address | TEXT | Adres |
| profile_image_url | TEXT | Profil resmi URL'i |
| is_active | BOOLEAN | Aktif/pasif durumu |
| created_at | TIMESTAMP | Oluşturulma tarihi |
| updated_at | TIMESTAMP | Güncellenme tarihi |

## 🎉 Başarılı Kurulum Kontrolü

Eğer şunları yapabiliyorsan, kurulum başarılı:
- ✅ `/admin/kullanicilar-roller` sayfası açılıyor
- ✅ Yeni kullanıcı oluşturabiliyorsun
- ✅ Email + şifre ile giriş yapabiliyorsun
- ✅ TC Kimlik + şifre ile giriş yapabiliyorsun
- ✅ Giriş sonrası otomatik dashboard'a yönlendiriliyorsun

## 💡 İpuçları

1. **Development için Email Confirmation'ı kapat:**
   - Supabase Dashboard → Authentication → Settings
   - "Enable email confirmations" → OFF

2. **Supabase Studio (Local Development):**
   - Eğer local Supabase kullanmak istersen: `npx supabase init`

3. **Veritabanı Backup:**
   - Supabase Dashboard → Database → Backups
   - Manuel backup al (önemli değişikliklerden önce)

4. **RLS Debug:**
   - RLS hatası alırsan: Supabase Dashboard → Authentication → Policies
   - Policy'leri kontrol et ve gerekirse düzenle
