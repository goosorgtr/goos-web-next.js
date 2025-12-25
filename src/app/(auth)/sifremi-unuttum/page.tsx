'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Logo ve Başlık */}
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Şifremi Unuttum</h1>
        <p className="text-sm text-muted-foreground">
          Şifrenizi sıfırlamak için e-posta adresinizi girin
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
          />
          <p className="text-xs text-muted-foreground">
            Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı göndereceğiz
          </p>
        </div>

        {/* Gönder Butonu */}
        <Button type="submit" className="w-full" size="lg">
          Sıfırlama Bağlantısı Gönder
        </Button>
      </form>

      {/* Bilgi Kutusu */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-900 dark:bg-blue-950">
        <div className="flex gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1 text-blue-800 dark:text-blue-300">
            <p className="font-medium">E-posta gelmedi mi?</p>
            <p className="text-xs">
              Spam/gereksiz klasörünüzü kontrol edin veya birkaç dakika bekleyip tekrar deneyin.
            </p>
          </div>
        </div>
      </div>

      {/* Alt Linkler */}
      <div className="space-y-4 text-center text-sm">
        <Link
          href="/giris"
          className="block text-muted-foreground hover:text-primary"
        >
          Giriş sayfasına dön
        </Link>
        
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <Link href="/kayit-politikasi" className="hover:text-primary">
            Kayıt Politikası
          </Link>
          <span>•</span>
          <Link href="/gizlilik" className="hover:text-primary">
            Gizlilik
          </Link>
          <span>•</span>
          <Link href="/iletisim" className="hover:text-primary">
            İletişim
          </Link>
        </div>
      </div>
    </div>
  )
}
