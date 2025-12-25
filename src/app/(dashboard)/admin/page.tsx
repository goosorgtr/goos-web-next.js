'use client'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold">Tekrar Hoş Geldiniz, Yönetici</h1>
        <p className="text-sm text-muted-foreground">İşte bugün okulumuzda olan bitenler</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Toplam Öğrenci */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Öğrenci</p>
              <p className="mt-2 text-3xl font-bold">1,240</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-green-600">+5%</span>
            <span className="text-muted-foreground">geçen aya göre</span>
          </div>
        </div>

        {/* Aktif Personel */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Aktif Personel</p>
              <p className="mt-2 text-3xl font-bold">85</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-gray-600">0%</span>
            <span className="text-muted-foreground">değişim yok</span>
          </div>
        </div>

        {/* Bekleyen Ödemeler */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bekleyen Ödemeler</p>
              <p className="mt-2 text-3xl font-bold">$12,400</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-red-600">-2%</span>
            <span className="text-muted-foreground">geçen aya göre</span>
          </div>
        </div>

        {/* Bugünkü Katılım */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bugünkü Katılım</p>
              <p className="mt-2 text-3xl font-bold">96%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-green-600">+3%</span>
            <span className="text-muted-foreground">geçen haftaya göre</span>
          </div>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Hızlı İşlemler</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Yeni Dönem */}
          <button className="flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Yeni Dönem</h3>
              <p className="text-xs text-muted-foreground">Akademik yıl ayarları</p>
            </div>
          </button>

          {/* Duyuru */}
          <button className="flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Duyuru</h3>
              <p className="text-xs text-muted-foreground">Öğrencileri/Velileri bilgilendir</p>
            </div>
          </button>

          {/* Ders Programı Yükle */}
          <button className="flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Ders Programı Yükle</h3>
              <p className="text-xs text-muted-foreground">Ders organizasyonu yönetir</p>
            </div>
          </button>

          {/* Bekleyeni Yönet */}
          <button className="flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Bekleyeni Yönet</h3>
              <p className="text-xs text-muted-foreground">Finansalları inzele</p>
            </div>
          </button>
        </div>
      </div>

      {/* Finansal Grafik */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Finansal Tahsilat Genel Bakışı</h2>
          <select className="rounded-lg border px-3 py-1.5 text-sm outline-none">
            <option>Bu Dönem</option>
            <option>Bu Ay</option>
            <option>Bu Hafta</option>
          </select>
        </div>
        
        {/* Basit Grafik (Bar chart placeholder) */}
        <div className="flex h-64 items-end gap-2">
          {['Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub'].map((month, i) => (
            <div key={month} className="flex flex-1 flex-col items-center gap-2">
              <div 
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
              <span className="text-xs text-muted-foreground">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
