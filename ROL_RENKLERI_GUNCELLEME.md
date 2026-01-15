# Rol Renkleri Güncelleme Dökümantasyonu

## Yapılan Değişiklikler

### 1. Rol Renkleri ve İsimleri Tanımlandı

**Dosya:** `src/lib/utils/role-utils.ts`

Her rol için özel renkler ve isimler tanımlandı:

| Rol | Renk | Badge Rengi | Türkçe İsim |
|-----|------|-------------|-------------|
| ADMIN | Mavi | `bg-blue-100 text-blue-700` | Admin |
| OGRETMEN | Yeşil | `bg-green-100 text-green-700` | Öğretmen |
| OGRENCI | Turuncu | `bg-orange-100 text-orange-700` | Öğrenci |
| VELI | Mor | `bg-purple-100 text-purple-700` | Veli |
| KANTINCI | Amber | `bg-amber-100 text-amber-700` | Kantinci |
| SERVICI | Teal | `bg-teal-100 text-teal-700` | Servis Şoförü |

**Fonksiyonlar:**
- `getRoleColor(roleId)` - Rol ID'sine göre badge rengi döndürür
- `getRoleDisplayName(roleId, roleName)` - Rol ID'sine göre Türkçe isim döndürür
- `getRoleColorByName(roleName)` - Rol adına göre badge rengi döndürür

### 2. Avatar Renkleri Eklendi

**Dosya:** `src/lib/utils/avatar-utils.ts`

Rol bazlı avatar arka plan renkleri tanımlandı:

| Rol | Avatar Rengi |
|-----|--------------|
| ADMIN | `bg-blue-600` |
| OGRETMEN | `bg-green-600` |
| OGRENCI | `bg-orange-600` |
| VELI | `bg-purple-600` |
| KANTINCI | `bg-amber-600` |
| SERVICI | `bg-teal-600` |

**Fonksiyon:**
- `getAvatarColorByRole(roleName)` - Rol adına göre avatar rengi döndürür

### 3. Kullanıcılar Servisi Güncellendi

**Dosya:** `src/modules/kullanicilar/services/kullanicilar.service.ts`

**Değişiklikler:**
- Rol ID yerine rol ismi getiriliyor (veritabanından `roles` tablosunu join ederek)
- Rollere göre dinamik renkler atanıyor
- `getAll()`, `getByRole()`, `create()` ve `update()` fonksiyonları güncellendi

**Örnek Kullanım:**
```typescript
// Kullanıcıları çek
const users = await kullanicilarService.getAll();

// Her kullanıcı için:
// - role: "Admin", "Öğretmen", "Öğrenci", vb. (Türkçe isim)
// - roleColor: "bg-blue-100 text-blue-700" (Rol rengine göre)
```

### 4. Admin Dashboard Güncellendi

**Dosya:** `src/components/admin/kullanicilar/AdminKullanicilarDashboard.tsx`

**Değişiklikler:**
- Avatar renkleri rollere göre değişiyor
- Rol badgeleri rollere göre renkli gösteriliyor

**Kod Örneği:**
```tsx
// Avatar rengi
<div className={`... ${getAvatarColorByRole(user.role)} ...`}>
  {user.name.charAt(0)}
</div>

// Rol badge'i
<span className={`... ${user.roleColor}`}>
  {user.role}
</span>
```

## Renk Tutarlılığı

Tüm renkler, genel sayfalardaki tema renkleriyle tutarlıdır:

**globals.css'deki tema renkleri:**
```css
.theme-ogrenci {
  --primary: 20.5 90.2% 48.2%;  /* Turuncu */
}

.theme-ogretmen {
  --primary: 161.4 93.5% 30.4%;  /* Yeşil */
}

.theme-veli {
  --primary: 258.3 79.4% 58.6%;  /* Mor */
}
```

## Kullanım Örnekleri

### Rol Rengini Almak
```typescript
import { getRoleColor, getRoleColorByName } from '@/lib/utils/role-utils';

// ID ile
const color = getRoleColor('ADMIN'); // "bg-blue-100 text-blue-700"

// İsim ile
const color = getRoleColorByName('Öğretmen'); // "bg-green-100 text-green-700"
```

### Avatar Rengini Almak
```typescript
import { getAvatarColorByRole } from '@/lib/utils/avatar-utils';

const avatarColor = getAvatarColorByRole('Admin'); // "bg-blue-600"
```

### Rol İsmini Almak
```typescript
import { getRoleDisplayName } from '@/lib/utils/role-utils';

const displayName = getRoleDisplayName('ADMIN'); // "Admin"
const displayName = getRoleDisplayName('OGRETMEN'); // "Öğretmen"
```

## Test Sonuçları

✅ Kullanıcılar sayfasında roller ID yerine isim olarak gösteriliyor
✅ Her rol için farklı badge renkleri gösteriliyor
✅ Avatar renkleri rollere göre değişiyor
✅ Renkler genel sayfa temalarıyla tutarlı

## Ekran Görüntüleri

Kullanıcılar sayfasında tüm roller farklı renklerle gösteriliyor:
- **Admin** - Mavi badge ve avatar
- **Öğretmen** - Yeşil badge ve avatar
- **Öğrenci** - Turuncu badge ve avatar
- **Veli** - Mor badge ve avatar
- **Kantinci** - Amber badge ve avatar
- **Servis Şoförü** - Teal badge ve avatar

## Notlar

- Veritabanı bağlantısı sorunları için geçici olarak mock data kullanılıyor
- Gerçek veritabanı bağlantısı yapıldığında, servis kodundaki mock data kısmı kaldırılmalı
- Rol renkleri ve isimleri merkezi olarak `role-utils.ts` dosyasında tanımlandı
- Yeni roller eklendiğinde bu dosyaya eklenmeli

## Gelecek Geliştirmeler

1. Veritabanı bağlantısını düzelt ve mock data'yı kaldır
2. Diğer sayfalarda da aynı renk sistemini kullan
3. Rol bazlı tema değişikliklerini tüm sayfalara uygula
4. Rol yönetimi sayfası ekle (roller ekle/düzenle/sil)
