# Test ve CI/CD Kullanım Kılavuzu

## 🧪 Testleri Çalıştırma

### Tüm Testleri Çalıştır
```bash
npm test
```

### Watch Mode (Geliştirme)
```bash
npm run test:watch
```

### Coverage Raporu
```bash
npm run test:coverage
```

### Belirli Bir Test Dosyası
```bash
npm test auth.service.test
```

### Belirli Bir Test İsmi
```bash
npm test -- --testNamePattern="signIn"
```

## 📊 Test Coverage

Hedef coverage oranları:
- **Branches**: %50+
- **Functions**: %50+
- **Lines**: %50+
- **Statements**: %50+

Coverage raporunu görmek için:
```bash
npm run test:coverage
```

Rapor `coverage/` klasöründe oluşturulur. HTML raporu için:
```bash
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

## 🚀 CI/CD Pipeline

### GitHub Actions

Her PR ve push'ta otomatik olarak çalışır:

1. **Lint Check** - Kod stili kontrolü
2. **Type Check** - TypeScript hata kontrolü
3. **Unit Tests** - Tüm testler
4. **Build** - Production build kontrolü

### Workflow Durumu

GitHub repository'nizde **Actions** sekmesinden workflow durumunu görebilirsiniz.

### Secrets Ayarlama

GitHub repository → Settings → Secrets and variables → Actions:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🔒 Pre-commit Hooks

Husky ile her commit öncesi otomatik kontroller:

### Kurulum
```bash
npm install --save-dev husky
npx husky install
```

### Pre-commit Hook Aktif

Her commit öncesi otomatik olarak:
- ✅ Lint check
- ✅ Type check
- ✅ Değiştirilen dosyalar için testler

### Hook'u Geçici Devre Dışı Bırakma
```bash
git commit --no-verify -m "message"
```

## 📝 Test Yazma Rehberi

### Unit Test Örneği

```typescript
import { myFunction } from '../myFunction'

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })
  
  it('should handle errors', () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

### Mock Supabase

```typescript
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signIn: jest.fn(),
    },
  },
}))

// Test içinde
const mockSignIn = supabase.auth.signIn as jest.Mock
mockSignIn.mockResolvedValue({ data: mockUser, error: null })
```

## 🐛 Sorun Giderme

### Testler Çalışmıyor

1. Node modules'ü temizle:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Jest cache'i temizle:
```bash
npm test -- --clearCache
```

### TypeScript Hataları

```bash
npx tsc --noEmit
```

### Lint Hataları

```bash
npm run lint -- --fix
```

## 📚 Kaynaklar

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Husky](https://typicode.github.io/husky/)
