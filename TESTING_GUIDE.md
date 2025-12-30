# PDF Viewer Testing Guide

## 🧪 Mock Data Kullanarak Test Etme

### 1. Mock Data Hazırlığı

Mock PDF dosyalarını `public/mock-pdfs/` klasörüne koyun:

```
public/
└── mock-pdfs/
    ├── yemek-programi-ocak-2025.pdf
    ├── hakan-yilmaz-ders-programi.pdf
    ├── ders-programi-10a.pdf
    ├── yemek-programi-subat-2025.xlsx
    └── ders-programi-9b.png
```

### 2. Service'i Mock Data ile Değiştirme

**Geçici olarak** `usePdfViewer.ts` hook'unda service import'unu değiştirin:

```typescript
// Gerçek service yerine mock service kullan
// import { pdfViewerService } from '../services/pdf-viewer.service'
import { mockPdfViewerService as pdfViewerService } from '../utils/mock-data'
```

### 3. Test Senaryoları

#### Senaryo 1: Admin - Yemek Listesi
1. `http://localhost:3000/admin/yemek-listesi` adresine gidin
2. ✅ PDF viewer görünmeli
3. ✅ "Ocak 2025 Haftalık Yemek Programı" başlığı görünmeli
4. ✅ Zoom butonları çalışmalı
5. ✅ PDF İndir butonu çalışmalı
6. ✅ Yazdır butonu çalışmalı

#### Senaryo 2: Öğretmen - Ders Programı
1. `http://localhost:3000/ogretmen/ders-programi` adresine gidin
2. ✅ "Hakan_Yılmaz_Ders_Programı_Matematik" görünmeli
3. ✅ Öğretmenin kendi programı yüklenmeli

#### Senaryo 3: Öğrenci - Ders Programı
1. `http://localhost:3000/ogrenci/ders-programi` adresine gidin
2. ✅ "10-A Sınıfı Ders Programı" görünmeli
3. ✅ Sınıf programı yüklenmeli

#### Senaryo 4: Öğrenci - Yemek Listesi
1. `http://localhost:3000/ogrenci/yemek-listesi` adresine gidin
2. ✅ Genel yemek programı görünmeli

#### Senaryo 5: Veli - Ders Programı
1. `http://localhost:3000/veli/ders-programi` adresine gidin
2. ✅ Çocuğun sınıf programı görünmeli

#### Senaryo 6: Veli - Yemek Listesi
1. `http://localhost:3000/veli/yemek-listesi` adresine gidin
2. ✅ Genel yemek programı görünmeli

### 4. Farklı Dosya Formatlarını Test Etme

Mock data'da farklı formatlar var. Test etmek için:

```typescript
// mock-data.ts içinde URL'leri değiştirin
'yemek-programi-genel': {
  // ...
  url: '/mock-pdfs/yemek-programi-subat-2025.xlsx', // Excel
  format: 'excel',
}
```

veya

```typescript
'ders-programi-10a': {
  // ...
  url: '/mock-pdfs/ders-programi-9b.png', // Image
  format: 'png',
}
```

### 5. Loading ve Error State'lerini Test Etme

#### Loading State
Mock service'de delay var (500ms), bu loading state'ini gösterir.

#### Error State
Mock service'de hata simüle etmek için:

```typescript
// mock-data.ts
async getPdfByType() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  throw new Error('PDF yüklenemedi') // Hata simülasyonu
}
```

### 6. Browser DevTools ile Test

1. **Network Tab**: Mock dosyaların yüklendiğini görün
2. **Console**: Hataları kontrol edin
3. **React DevTools**: Component state'lerini inceleyin

### 7. Zoom Fonksiyonlarını Test Etme

1. **Zoom In** (-) butonuna tıklayın
   - ✅ PDF küçülmeli
   - ✅ Yüzde değeri azalmalı

2. **Zoom Out** (+) butonuna tıklayın
   - ✅ PDF büyümeli
   - ✅ Yüzde değeri artmalı

3. **Reset** (100%) butonuna tıklayın
   - ✅ PDF normal boyuta dönmeli

### 8. Download Fonksiyonunu Test Etme

1. **PDF İndir** butonuna tıklayın
2. ✅ Dosya indirilmeli
3. ✅ Dosya adı doğru formatta olmalı: `[Title]_[Date].pdf`

### 9. Print Fonksiyonunu Test Etme

1. **Yazdır** butonuna tıklayın
2. ✅ Yeni pencere açılmalı
3. ✅ Print dialog görünmeli

### 10. Responsive Tasarımı Test Etme

1. Browser'ı küçültün (mobile view)
2. ✅ PDF viewer responsive olmalı
3. ✅ Butonlar düzgün görünmeli

---

## 🔄 Backend'e Geçiş

Backend hazır olduğunda:

### 1. Mock Service'i Kaldırın

```typescript
// usePdfViewer.ts
import { pdfViewerService } from '../services/pdf-viewer.service' // Gerçek service
// import { mockPdfViewerService as pdfViewerService } from '../utils/mock-data' // Kaldır
```

### 2. API Endpoints'leri Test Edin

```bash
# Postman veya curl ile test edin
curl http://localhost:5000/api/pdf/document?type=yemek-programi&role=ADMIN&userId=1
```

### 3. Backend Response Format'ını Kontrol Edin

Backend'in döndüğü data `PdfDocument` type'ına uymalı:

```typescript
{
  id: string
  title: string
  url: string
  type: 'yemek-programi' | 'ders-programi'
  format: 'pdf' | 'excel' | 'png' | 'jpeg'
  createdAt: string
  updatedAt: string
  metadata?: {
    sinifId?: string
    sinifAdi?: string
    ogretmenId?: string
    ogretmenAdi?: string
    ogrenciId?: string
    ogrenciAdi?: string
    hafta?: number
    donem?: string
  }
}
```

### 4. CORS ve Authentication

Backend'de CORS ve authentication ayarlarını yapın:

```typescript
// Backend (Express örneği)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

// JWT middleware
app.use('/api/pdf', authenticateJWT)
```

---

## 📝 Test Checklist

### Fonksiyonel Testler
- [ ] PDF görüntüleme çalışıyor
- [ ] Zoom in/out çalışıyor
- [ ] Download çalışıyor
- [ ] Print çalışıyor
- [ ] Loading state görünüyor
- [ ] Error state görünüyor
- [ ] Excel dosyaları için download prompt görünüyor
- [ ] Image dosyaları görüntüleniyor

### Rol Bazlı Testler
- [ ] Admin tüm programları görebiliyor
- [ ] Öğretmen kendi programını görebiliyor
- [ ] Öğrenci sınıf programını görebiliyor
- [ ] Veli çocuğun programını görebiliyor

### UI/UX Testler
- [ ] Responsive tasarım çalışıyor
- [ ] Butonlar doğru görünüyor
- [ ] Renkler doğru (mavi download, beyaz print)
- [ ] Icons doğru görünüyor
- [ ] Toolbar düzgün çalışıyor

### Performance Testler
- [ ] PDF yükleme hızlı
- [ ] Zoom smooth çalışıyor
- [ ] Sayfa geçişleri smooth
- [ ] Memory leak yok

---

## 🐛 Yaygın Sorunlar ve Çözümleri

### Problem: PDF görünmüyor
**Çözüm**: 
- PDF.js worker URL'ini kontrol edin
- Console'da hata var mı bakın
- Mock PDF dosyası public klasöründe mi kontrol edin

### Problem: Download çalışmıyor
**Çözüm**:
- Browser popup blocker'ı kapatın
- CORS ayarlarını kontrol edin

### Problem: Zoom çalışmıyor
**Çözüm**:
- Scale state'ini kontrol edin
- React DevTools'da state değişimini izleyin

---

**Mock data ile test tamamlandıktan sonra backend entegrasyonuna geçebilirsiniz!** 🚀
