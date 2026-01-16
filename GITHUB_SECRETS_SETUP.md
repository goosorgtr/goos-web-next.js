# GitHub Actions Secrets Kurulum Rehberi

## 🔐 GitHub Repository Secrets Nasıl Eklenir?

### Adım 1: Repository Settings'e Git

1. **GitHub'da projenize gidin:** https://github.com/goosorgtr/goos-web-next.js
2. **Settings** sekmesine tıklayın (sağ üstte)
3. Sol menüden **Secrets and variables** → **Actions** seçin

### Adım 2: Secrets Ekleyin

**"New repository secret"** butonuna tıklayın ve aşağıdaki secret'ları TEK TEK ekleyin:

#### 1. NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://lzsvwjtvhqugksbwsjvz.supabase.co
```

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3Z3anR2aHF1Z2tzYndzanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDA5NTYsImV4cCI6MjA4Mzc3Njk1Nn0.oTvwhuvLK0_G5qTzYGt2KE9pYAOE_VZ6pU5qwyQG42U
```

#### 3. TEST_USER_EMAIL
```
Name: TEST_USER_EMAIL
Value: admin@test.com
```

#### 4. TEST_USER_PASSWORD
```
Name: TEST_USER_PASSWORD
Value: admin123
```

#### 5. TEST_USER_TC_NO
```
Name: TEST_USER_TC_NO
Value: 12345678901
```

### Adım 3: Kontrol Edin

Secrets ekledikten sonra şöyle görünmeli:

```
Repository secrets (5)
├── NEXT_PUBLIC_SUPABASE_URL
├── NEXT_PUBLIC_SUPABASE_ANON_KEY
├── TEST_USER_EMAIL
├── TEST_USER_PASSWORD
└── TEST_USER_TC_NO
```

### Adım 4: Test Edin

Bir commit yapın ve GitHub Actions'ın çalışıp çalışmadığını kontrol edin:

```bash
git add .
git commit -m "test: GitHub Actions secrets test"
git push origin main
```

**Actions** sekmesinden workflow'u izleyin!

---

## ⚠️ Önemli Notlar

- **Secrets güvenlidir** - GitHub'da şifreli saklanır
- **Workflow'larda kullanılır** - `${{ secrets.SECRET_NAME }}` ile
- **Loglar'da görünmez** - GitHub otomatik maskeler
- **Sadece admin ekleyebilir** - Repository admin yetkisi gerekir

---

## 📸 Görsel Rehber

![GitHub Secrets](uploaded_image_1768562173375.png)

Yukarıdaki ekran görüntüsünde gördüğünüz gibi Settings → Secrets and variables → Actions bölümünden ekleyebilirsiniz.
