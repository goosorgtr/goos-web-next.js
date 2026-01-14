'use client'

import { useState, useEffect } from 'react'
import { Camera, Mail, Phone, MapPin, Calendar, User, BookOpen, Users, GraduationCap, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'

interface ProfileData {
  // Genel bilgiler
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string
  gender: string
  profile_image_url: string | null
  role: string
  
  // Öğrenci spesifik
  student_no?: string
  class_name?: string
  beacon_id?: string
  
  // Öğretmen spesifik
  teacher_courses?: Array<{ course: string; class: string }>
  
  // Veli spesifik
  children?: Array<{ name: string; class: string; student_no: string }>
  
  // Personel spesifik
  staff_type?: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  async function loadProfileData() {
    // TODO: Supabase'den tüm profil bilgilerini çek
    // Şimdilik mock data
    setProfileData({
      id: user?.id || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      date_of_birth: user?.date_of_birth || '',
      gender: user?.gender || '',
      profile_image_url: user?.profile_image_url || null,
      role: user?.role || '',
      
      // Rol bazlı ekstra bilgiler
      ...(user?.role === 'OGRENCI' && {
        student_no: '2024001',
        class_name: '10-A',
      }),
      
      ...(user?.role === 'OGRETMEN' && {
        teacher_courses: [
          { course: 'Matematik', class: '10-A' },
          { course: 'Matematik', class: '10-B' },
        ]
      }),
      
      ...(user?.role === 'VELI' && {
        children: [
          { name: 'Ahmet Yılmaz', class: '10-A', student_no: '2024001' },
          { name: 'Ayşe Yılmaz', class: '8-B', student_no: '2024125' },
        ]
      }),
    })
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Dosya boyutu 2MB\'dan küçük olmalıdır')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin')
      return
    }

    setUploadingPhoto(true)
    
    // TODO: Supabase'e yükle
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileData(prev => prev ? {
        ...prev,
        profile_image_url: reader.result as string
      } : null)
      setUploadingPhoto(false)
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setLoading(true)
    try {
      // TODO: Supabase'e kaydet
      await new Promise(resolve => setTimeout(resolve, 800))
      alert('Profil başarıyla güncellendi!')
      setIsEditing(false)
    } catch (error) {
      alert('Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!profileData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>
          <p className="text-sm text-gray-500">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Profili Düzenle
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        )}
      </div>

      {/* Profil Kartı */}
      <div className="rounded-xl border bg-white shadow-sm">
        {/* Cover & Avatar */}
        <div className="relative h-32 rounded-t-xl bg-gradient-to-r from-primary to-primary/70">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                {profileData.profile_image_url ? (
                  <Image
                    src={profileData.profile_image_url}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              
              {isEditing && (
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
                >
                  <Camera className="h-5 w-5" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profil Bilgileri */}
        <div className="px-8 pb-8 pt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {profileData.first_name} {profileData.last_name}
            </h2>
            <p className="text-sm text-gray-500">{profileData.role}</p>
          </div>

          {/* Genel Bilgiler Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* E-posta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                E-posta Adresi
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Telefon Numarası
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Doğum Tarihi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Doğum Tarihi
              </label>
              <input
                type="date"
                value={profileData.date_of_birth}
                onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                disabled={!isEditing}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Cinsiyet */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Cinsiyet
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                disabled={!isEditing}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Seçiniz</option>
                <option value="MALE">Erkek</option>
                <option value="FEMALE">Kadın</option>
                <option value="OTHER">Diğer</option>
              </select>
            </div>

            {/* Adres - Full width */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Adres
              </label>
              <textarea
                rows={3}
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ev adresinizi girin..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rol Bazlı Özel Bilgiler */}
      {profileData.role === 'OGRENCI' && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Öğrenci Bilgileri</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Öğrenci No</label>
              <p className="mt-1 text-sm text-gray-900">{profileData.student_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Sınıf</label>
              <p className="mt-1 text-sm text-gray-900">{profileData.class_name}</p>
            </div>
          </div>
        </div>
      )}

      {profileData.role === 'OGRETMEN' && profileData.teacher_courses && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Verdiğim Dersler</h3>
          </div>
          <div className="space-y-2">
            {profileData.teacher_courses.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-gray-900">{item.course}</span>
                <span className="text-sm text-gray-500">{item.class}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {profileData.role === 'VELI' && profileData.children && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Çocuklarım</h3>
          </div>
          <div className="space-y-3">
            {profileData.children.map((child, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{child.name}</p>
                    <p className="text-sm text-gray-500">Öğrenci No: {child.student_no}</p>
                  </div>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {child.class}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(profileData.role === 'KANTINCI' || profileData.role === 'SERVICI') && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Görev Bilgileri</h3>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Görev</label>
            <p className="mt-1 text-sm text-gray-900">
              {profileData.role === 'KANTINCI' ? 'Kantin Görevlisi' : 'Servis Şoförü'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
