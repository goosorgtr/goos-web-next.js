'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, MOCK_USERS } from "@/contexts/auth-context"

type LoginStep = 'login' | 'create-password'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [step, setStep] = useState<LoginStep>('login')
  const [tcNumber, setTcNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Sabit TC Kimlik Numarası
    const MOCK_TC = '12345678912'

    // TC kontrolü
    if (tcNumber !== MOCK_TC) {
      setError('TC Kimlik Numarası hatalı!')
      return
    }

    // Şifreye göre rol belirleme ve yönlendirme
    const passwordLower = password.toLowerCase().trim()

    switch (passwordLower) {
      case 'admin':
        setUser(MOCK_USERS.ADMIN)
        router.push('/admin')
        break
      case 'veli':
        setUser(MOCK_USERS.VELI)
        router.push('/veli')
        break
      case 'ogrenci':
      case 'öğrenci':
        setUser(MOCK_USERS.OGRENCI)
        router.push('/ogrenci')
        break
      case 'ogretmen':
      case 'öğretmen':
        setUser(MOCK_USERS.OGRETMEN)
        router.push('/ogretmen')
        break
      case 'kantinci':
        setUser(MOCK_USERS.KANTINCI)
        router.push('/kantinci')
        break
      case 'servici':
        setUser(MOCK_USERS.SERVICI)
        router.push('/servici')
        break
      default:
        setError('Geçersiz şifre! Lütfen rol adını girin (admin, veli, ogrenci, ogretmen, kantinci, servici)')
    }
  }

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API çağrısı - Şifre oluştur
    setStep('login')
    setPassword('')
  }

  // ADIM 2: Şifre Oluşturma (Yeni Kullanıcı)
  if (step === 'create-password') {
    return (
      <div className="space-y-6">
        {/* Logo ve Başlık */}
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Şifre Oluştur</h1>
          <p className="text-sm text-muted-foreground">
            TC Kimlik: <span className="font-medium text-foreground">{tcNumber}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Hesabınızın güvenliği için güçlü bir şifre belirleyin
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleCreatePassword}>
          {/* Yeni Şifre */}
          <div className="space-y-2">
            <Label htmlFor="new-password">Yeni Şifre</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Şifre Tekrar */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Şifre Gereksinimleri */}
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">Şifre gereksinimleri:</p>
            <ul className="space-y-1">
              <li>• En az 8 karakter</li>
              <li>• En az bir büyük harf (A-Z)</li>
              <li>• En az bir küçük harf (a-z)</li>
              <li>• En az bir rakam (0-9)</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Şifreyi Oluştur
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStep('login')
              setPassword('')
            }}
          >
            Geri Dön
          </Button>
        </form>
      </div>
    )
  }

  // ADIM 1: Normal Giriş (TC + Şifre) - Default Sayfa
  return (
    <div className="space-y-6">
      {/* Logo ve Başlık */}
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Hesabınıza Giriş Yapın</h1>
        <p className="text-sm text-muted-foreground">
          Sisteme erişmek için TC Kimlik ve şifrenizi girin
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleLogin}>
        {/* TC Kimlik Numarası */}
        <div className="space-y-2">
          <Label htmlFor="tc-number">TC Kimlik Numarası</Label>
          <Input
            id="tc-number"
            type="text"
            placeholder="11 haneli TC kimlik numaranız giriniz"
            value={tcNumber}
            onChange={(e) => setTcNumber(e.target.value)}
            maxLength={11}
            required
          />
        </div>

        {/* Şifre */}
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Beni Hatırla ve Şifremi Unuttum */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            <span>Beni Hatırla</span>
          </label>
          <Link
            href="/sifremi-unuttum"
            className="text-primary hover:underline"
          >
            Şifremi Unuttum
          </Link>
        </div>

        {/* Giriş Butonu */}
        <Button type="submit" className="w-full" size="lg">
          Giriş Yap
        </Button>
      </form>

      {/* Alt Linkler */}
      <div className="space-y-4 text-center text-sm">
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <Link href="/gizlilik" className="hover:text-primary">
            Gizlilik Politikası
          </Link>
          <span>•</span>
          <Link href="/kullanim-kosullari" className="hover:text-primary">
            Kullanım Koşulları
          </Link>
          <span>•</span>
          <Link href="/iletisim" className="hover:text-primary">
            © 2025 GOOS
          </Link>
        </div>
      </div>
    </div>
  )
}
