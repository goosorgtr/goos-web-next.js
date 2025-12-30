import { Bell, Calendar, ChevronRight, Clock, MapPin, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'

export default function AnasayfaPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Merhaba, Ahmet! 👋</h1>
          <p className="text-gray-500">Bugün 24 Ekim Salı, İyi Dersler!</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-full bg-white p-2 shadow-sm hover:bg-gray-50">
            <Bell className="h-6 w-6 text-gray-600" />
          </button>
          <button className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
            Profilim
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Widget */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">Güncel Yoklama Durumu</h2>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:underline">
              Detaylı Rapor →
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl bg-green-50 p-4">
              <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded-full bg-green-200" />
              <div>
                <span className="rounded bg-black px-2 py-0.5 text-xs font-bold text-white">BUGÜN</span>
                <h3 className="text-2xl font-bold text-gray-900">Okuldasın</h3>
                <p className="text-sm text-gray-500">Giriş Saati: 08:42</p>
                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-green-700">
                  <span>✓</span> Yoklama Alındı
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500">Bu Hafta</h3>
              <div className="flex justify-between gap-1">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400">{day}</span>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${i < 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-300'
                        }`}
                    >
                      {i < 2 ? '✓' : '-'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-orange-50 p-3">
                  <p className="text-xs font-bold text-orange-600">Özürsüz</p>
                  <p className="text-xl font-bold text-gray-900">1.5 Gün</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs font-bold text-blue-600">Özürlü</p>
                  <p className="text-xl font-bold text-gray-900">0 Gün</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Widget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Kantin Bakiyesi
          </h2>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-4xl font-black text-gray-900">₺150</span>
            <span className="text-xl font-bold text-gray-400">.00</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-400">Son Harcamalar</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                  🍔
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Öğle Yemeği</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">-₺45.00</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                💳
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Bakiye Yükleme</p>
              </div>
            </div>
            <p className="ml-auto font-bold text-green-600 text-right">+₺100.00</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Homework Widget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                ⚠️
              </div>
              <h2 className="text-lg font-bold">Bekleyen Ödevler</h2>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
              3 Bekleyen
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Tarih - Araştırma Ödevi',
                desc: 'Osmanlı Devleti yükselme dönemi padişahları...',
                due: 'Yarın',
                color: 'red',
              },
              {
                title: 'Matematik - Problem Seti',
                desc: 'Sayfa 102-104 arası tüm alıştırmalar.',
                due: '2 Gün',
                color: 'orange',
              },
              {
                title: 'İngilizce - Reading',
                desc: 'Chapter 4 vocabulary list.',
                due: '5 Gün',
                color: 'green',
              },
            ].map((hw, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                <div className={`mt-1.5 h-2 w-2 rounded-full bg-${hw.color}-500`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{hw.title}</h3>
                    <span className={`text-xs font-bold text-${hw.color}-500`}>
                      {hw.due}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{hw.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exams Widget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">Yaklaşan Sınavlar</h2>
            </div>
            <button className="text-sm font-semibold text-gray-400 hover:text-gray-600">Takvim</button>
          </div>

          <div className="mb-4 rounded-xl bg-gray-900 p-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">EN YAKIN SINAV</p>
                <h3 className="mt-1 text-xl font-bold">Biyoloji - 1. Dönem 1. Yazılı</h3>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> 26 Ekim, Perşembe
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 3. Ders
                  </div>
                </div>
              </div>
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-gray-800">
                <span className="text-2xl font-bold">2</span>
                <span className="text-[10px] uppercase text-gray-400">GÜN</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
            <div className="flex flex-col items-center rounded bg-gray-100 p-2 text-center">
              <span className="text-xs font-bold text-gray-500">30</span>
              <span className="text-[10px] font-bold uppercase text-gray-400">EKİM</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Coğrafya</h4>
              <p className="text-xs text-gray-500">2. Ders Saati</p>
            </div>
            <span className="ml-auto text-xs font-bold text-gray-400">6 Gün Kaldı</span>
          </div>
        </div>
      </div>

      {/* Announcements Widget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Son Duyurular ve Etkinlikler</h2>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-gray-50">←</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-gray-50">→</button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="relative h-48 overflow-hidden rounded-xl bg-orange-600">
            <div className="absolute left-4 top-4 rounded bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">SPOR</div>
            {/* Abstract circle shapes matching the image design */}
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full border-[20px] border-orange-500/30"></div>
            <div className="absolute bottom-4 left-4 right-4">
              {/* Content for card 1 (Placeholder) */}
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative h-48 overflow-hidden rounded-xl bg-gray-200">
            <div className="absolute left-4 top-4 rounded bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">AKADEMİK</div>
            {/* Content */}
          </div>

          {/* Card 3 */}
          <div className="rounded-xl bg-blue-50 p-6">
            <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-600">DUYURU</span>
            <h3 className="mt-3 text-lg font-bold text-gray-900">Kantin Kartı Sistem Güncellemesi</h3>
            <p className="mt-2 text-sm text-gray-600">Hafta sonu yapılacak bakım çalışması nedeniyle...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
