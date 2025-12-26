'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SMS_PROVIDERS = ['NetGSM', 'İletiMerkezi', 'Vatansms', 'Diğer']

export default function AyarlarPage() {
  const [senderEmail, setSenderEmail] = useState('noreply@goos.com')
  const [smsHeader, setSmsHeader] = useState('GOOSOKUL')
  const [smtpServer, setSmtpServer] = useState('smtp.example.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUsername, setSmtpUsername] = useState('kullanici@example.com')
  const [smtpPassword, setSmtpPassword] = useState('••••••••')
  const [sslEnabled, setSslEnabled] = useState(true)
  const [smsProvider, setSmsProvider] = useState('NetGSM')
  const [showProviderDropdown, setShowProviderDropdown] = useState(false)
  const [smsApiKey, setSmsApiKey] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')

  const handleSave = () => {
    console.log('Saving settings...')
  }

  const handleCancel = () => {
    console.log('Cancelling...')
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Anasayfa</span>
        <span>/</span>
        <span className="font-medium text-foreground">Sistem Ayarları</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Modül Ayarları</h1>
          <p className="text-sm text-muted-foreground">
            Konum servislerini, bildirimleri ve akademik parametreleri yapılandırın.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Vazgeç
          </Button>
          <Button onClick={handleSave}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>

      {/* E-posta ve SMS Ayarları */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">E-posta ve SMS Ayarları</h2>
            <p className="text-sm text-muted-foreground">
              Otomatik bildirimleri ve gönderim bilgilerini yönetin.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gönderen E-posta Adresi */}
          <div className="space-y-2">
            <Label htmlFor="sender-email">Gönderen E-posta Adresi</Label>
            <Input
              id="sender-email"
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="bg-gray-50"
            />
          </div>

          {/* SMS Gönderen Başlığı */}
          <div className="space-y-2">
            <Label htmlFor="sms-header">SMS Gönderen Başlığı</Label>
            <Input
              id="sms-header"
              value={smsHeader}
              onChange={(e) => setSmsHeader(e.target.value)}
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* E-posta Sunucu Ayarları */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">E-posta Sunucu Ayarları</h2>
            <p className="text-sm text-muted-foreground">
              Giden e-postalar için SMTP sunucu bilgilerini yapılandırın.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* SMTP Sunucu Adresi */}
            <div className="space-y-2">
              <Label htmlFor="smtp-server">SMTP Sunucu Adresi</Label>
              <Input
                id="smtp-server"
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                className="bg-gray-50"
              />
            </div>

            {/* Port */}
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Port</Label>
              <Input
                id="smtp-port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Kullanıcı Adı */}
            <div className="space-y-2">
              <Label htmlFor="smtp-username">Kullanıcı Adı</Label>
              <Input
                id="smtp-username"
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                className="bg-gray-50"
              />
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Şifre</Label>
              <Input
                id="smtp-password"
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* SSL/TLS Kullan */}
          <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
            <Label htmlFor="ssl-toggle" className="cursor-pointer">
              SSL/TLS Kullan
            </Label>
            <button
              id="ssl-toggle"
              onClick={() => setSslEnabled(!sslEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                sslEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  sslEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* SMS Sağlayıcı Ayarları */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">SMS Sağlayıcı Ayarları</h2>
            <p className="text-sm text-muted-foreground">
              SMS gönderimleri için API anahtarlarını ve uç noktaları yapılandırın.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Sağlayıcı Seçimi */}
          <div className="space-y-2">
            <Label>Sağlayıcı Seçimi</Label>
            <div className="relative">
              <button
                onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                className="flex w-full items-center justify-between rounded-lg border bg-gray-50 px-4 py-2.5 text-left text-sm hover:bg-gray-100"
              >
                <span>{smsProvider}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {showProviderDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProviderDropdown(false)}
                  />
                  <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
                    {SMS_PROVIDERS.map((provider) => (
                      <button
                        key={provider}
                        onClick={() => {
                          setSmsProvider(provider)
                          setShowProviderDropdown(false)
                        }}
                        className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* SMS API Anahtarı */}
            <div className="space-y-2">
              <Label htmlFor="sms-api-key">SMS API Anahtarı</Label>
              <Input
                id="sms-api-key"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className="bg-gray-50"
                placeholder="API anahtarınızı girin"
              />
            </div>

            {/* API Uç Noktası */}
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Uç Noktası</Label>
              <Input
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="bg-gray-50"
                placeholder="API uç noktasını girin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
