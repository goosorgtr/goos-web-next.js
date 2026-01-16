# Ekip İçin Test ve CI/CD Kurulum Rehberi

## 🎯 Amaç

Takım arkadaşlarınızın da aynı testleri çalıştırabilmesi ve GitHub'da otomatik test edilmesi.

---

## 📋 Takım Arkadaşlarınız İçin Adımlar

### 1. Projeyi Clone Edin (İlk Kez)

```bash
git clone https://github.com/goosorgtr/goos-web-next.js.git
cd goos-web-next.js
npm install
```

### 2. Environment Dosyalarını Kopyalayın

```bash
# .env.local zaten var (production Supabase)
# .env.test dosyası da var (test credentials)

# Kontrol et
cat .env.local
cat .env.test
```

**ÖNEMLİ:** `.env.test` dosyası **GIT'e commitlendi** - herkes aynı test kullanıcılarını kullanacak.

### 3. Testleri Çalıştırın

```bash
# Sadece unit testler (mock data - hızlı)
npm run test:unit

# Integration testler (gerçek Supabase - yavaş)
npm run test:integration

# Tüm testler
npm test

# Watch mode (geliştirme sırasında)
npm run test:watch
```

---

## 🔐 Test Kullanıcıları

### Supabase'de Olması Gereken Test Kullanıcısı

**Email:** `admin@test.com`  
**Password:** `admin123`  
**TC No:** `12345678901`  
**Role:** ADMIN

### Nasıl Oluşturulur?

**Seçenek 1: Supabase Dashboard**
1. https://supabase.com/dashboard → Projeniz
2. Authentication → Users → Add User
3. Email: `admin@test.com`, Password: `admin123`
4. Table Editor → users tablosuna git
5. Bu kullanıcıyı bul ve `tc_no` ekle: `12345678901`

**Seçenek 2: SQL Editor**
```sql
-- 1. Auth user oluştur (Supabase Dashboard'dan)
-- 2. Users tablosuna ekle
INSERT INTO users (id, email, tc_no, first_name, last_name, role_id, is_active)
VALUES (
  'AUTH_USER_ID_BURAYA', -- Supabase Auth'dan gelen ID
  'admin@test.com',
  '12345678901',
  'Test',
  'Admin',
  (SELECT id FROM roles WHERE name = 'ADMIN'),
  true
);
```

---

## 🚀 GitHub Actions Kurulumu

### Repository Secrets Ekleyin

**goosorgtr/goos-web-next.js** repo'sunda:

1. **Settings → Secrets and variables → Actions**
2. **New repository secret** tıkla
3. **Ekle:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://lzsvwjtvhqugksbwsjvz.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3Z3anR2aHF1Z2tzYndzanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDA5NTYsImV4cCI6MjA4Mzc3Njk1Nn0.oTvwhuvLK0_G5qTzYGt2KE9pYAOE_VZ6pU5qwyQG42U

Name: TEST_USER_EMAIL
Value: admin@test.com

Name: TEST_USER_PASSWORD
Value: admin123

Name: TEST_USER_TC_NO
Value: 12345678901
```

---

## 📊 Test Tipleri

### Unit Tests (Mock Data)
- **Dosya:** `*.test.ts` (integration hariç)
- **Hız:** Çok hızlı (~5 saniye)
- **Supabase:** Bağlanmaz (mock)
- **Kullanım:** Geliştirme sırasında

```bash
npm run test:unit
```

### Integration Tests (Real Supabase)
- **Dosya:** `*.integration.test.ts`
- **Hız:** Yavaş (~15-30 saniye)
- **Supabase:** Gerçek API çağrıları
- **Kullanım:** PR öncesi, CI/CD'de

```bash
npm run test:integration
```

---

## 🔄 Workflow - Nasıl Çalışır?

### Local Geliştirme
```bash
# 1. Kod yaz
# 2. Unit testleri çalıştır (hızlı feedback)
npm run test:unit

# 3. Integration testleri çalıştır (gerçek test)
npm run test:integration

# 4. Commit yap
git add .
git commit -m "feat: yeni özellik"

# 5. Pre-commit hook otomatik çalışır:
# - Lint
# - Type check
# - Unit tests
```

### GitHub'a Push
```bash
git push origin main

# GitHub Actions otomatik başlar:
# ✅ Lint check
# ✅ Type check
# ✅ Unit tests (mock)
# ✅ Integration tests (real Supabase)
# ✅ Build
```

### Pull Request
```bash
# PR açtığında:
# - Tüm testler otomatik çalışır
# - Sonuçlar PR'da görünür
# - Testler geçmeden merge edemezsin
```

---

## ⚠️ Önemli Notlar

### 1. Test Kullanıcısı Paylaşımlı
- Tüm takım aynı test kullanıcısını kullanır
- **Dikkat:** Paralel testlerde sorun olabilir
- **Çözüm:** Her test sonunda sign out yapılıyor

### 2. Production Supabase Kullanılıyor
- Test için ayrı Supabase projesi YOK
- **Dikkat:** Test verileri production'da
- **Öneri:** İleride test Supabase projesi oluşturun

### 3. .env.test Git'te
- Test credentials herkes görebilir
- **Güvenlik:** Sadece test kullanıcısı için
- **Production credentials:** Asla commit etmeyin!

---

## 🐛 Sorun Giderme

### Test Kullanıcısı Bulunamıyor
```bash
# Supabase'de test kullanıcısı var mı kontrol et
# users tablosunda tc_no: 12345678901 olmalı
```

### GitHub Actions Başarısız
```bash
# Secrets doğru mu kontrol et
# Settings → Secrets and variables → Actions
```

### Integration Testler Timeout
```bash
# Supabase bağlantısı yavaş olabilir
# Test timeout'ları artırıldı (15 saniye)
```

---

## 📚 Kaynaklar

- [Jest Documentation](https://jestjs.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## ✅ Checklist - Takım İçin

- [ ] Projeyi clone et
- [ ] `npm install` çalıştır
- [ ] `.env.local` ve `.env.test` dosyaları var mı kontrol et
- [ ] `npm run test:unit` çalıştır (geçmeli)
- [ ] `npm run test:integration` çalıştır (geçmeli)
- [ ] GitHub'da secrets eklenmiş mi kontrol et
- [ ] Test commit yap ve push et
- [ ] GitHub Actions'da testlerin geçtiğini gör

**Herhangi bir sorun olursa takım liderine bildirin!** 🚀
