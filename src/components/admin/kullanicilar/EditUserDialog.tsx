'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string
    role: string
    email: string
    department: string
  }
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'communication' | 'permissions'>('info')
  const [selectedLevels, setSelectedLevels] = useState<number[]>([4, 5])
  const [selectedClass, setSelectedClass] = useState('A')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Matematik', 'Geometri'])

  const availableSubjects = ['Türkçe', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya']

  const toggleLevel = (level: number) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level))
    } else {
      setSelectedLevels([...selectedLevels, level])
    }
  }

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const removeSubject = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Öğretmen Düzenle</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-6 border-b">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'info'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Kullanıcı Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'communication'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            İletişim
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'permissions'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Yetkiler
          </button>
        </div>

        {/* Content */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* User Info Header */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                MD
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.department} Öğretmeni</p>
              </div>
            </div>

            {/* Seviye Seçimi */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Seviye Seçimi</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition ${
                      selectedLevels.includes(level)
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Şube Seçimi */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Şube Seçimi</label>
              <div className="flex gap-2">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                      selectedClass === cls
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Branş Seçimi */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Branş Seçimi</label>
              
              {/* Selected Subjects */}
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium text-primary">{subject}</span>
                    <button
                      onClick={() => removeSubject(subject)}
                      className="text-primary hover:text-primary/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Branş ara..."
                    className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-primary"
                  />
                  <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Available Subjects */}
              <div className="rounded-lg border p-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Mevcut branşlar: Türkçe, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`rounded-md px-3 py-1.5 text-sm transition ${
                        selectedSubjects.includes(subject)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="py-8 text-center text-muted-foreground">
            İletişim bilgileri burada gösterilecek
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="py-8 text-center text-muted-foreground">
            Yetki ayarları burada gösterilecek
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}



