'use client'

import { useState } from 'react'
import { Upload, Eye, Download, Trash2, ChevronDown, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PdfViewer } from '@/modules/pdf-viewer/components/PdfViewer'
import { usePdfViewer } from '@/modules/pdf-viewer/hooks/usePdfViewer'
import { pdfViewerService } from '@/modules/pdf-viewer/services/pdf-viewer.service'
import { downloadPdf, generateFilename } from '@/modules/pdf-viewer/utils/pdf-helpers'

// Mock data
const MOCK_CLASS_SCHEDULES = [
  {
    id: '1',
    className: '12-A',
    status: 'active',
    icon: '🎓',
    iconColor: 'bg-orange-100',
    sinifId: '12a'
  },
  {
    id: '2',
    className: '10-B',
    status: 'active',
    icon: '📚',
    iconColor: 'bg-purple-100',
    sinifId: '10b'
  },
  {
    id: '3',
    className: '8-C',
    status: 'passive',
    icon: '👤',
    iconColor: 'bg-blue-100',
    sinifId: '8c'
  }
]

const CLASSES = Array.from({ length: 8 }, (_, i) => `${i + 1}. Sınıf`)
const BRANCHES = ['A', 'B', 'C', 'D', 'E', 'F']

export default function SinifDersProgramiPage() {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showBranchDropdown, setShowBranchDropdown] = useState(false)
  const [viewingSchedule, setViewingSchedule] = useState<string | null>(null)
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

  const {
    document,
    isLoading,
    error,
    scale,
    handleDownload,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    isDownloading,
  } = usePdfViewer({
    role: 'ADMIN',
    userId: 'admin-1',
    type: 'ders-programi',
    sinifId: viewingSchedule || undefined,
  })

  const handleViewSchedule = (sinifId: string) => {
    setViewingSchedule(sinifId)
  }

  const handleCloseViewer = () => {
    setViewingSchedule(null)
  }

  const handleDirectDownload = async (sinifId: string) => {
    try {
      setDownloadingIds(prev => new Set(prev).add(sinifId))

      const doc = await pdfViewerService.getPdfByClass(sinifId, 'ders-programi')
      const filename = generateFilename(doc)
      await downloadPdf(doc.url, filename)

    } catch (error) {
      console.error('Download error:', error)
      // Here you might want to show a toast notification
    } finally {
      setDownloadingIds(prev => {
        const next = new Set(prev)
        next.delete(sinifId)
        return next
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Sınıf Ders Programı Yükleme</h1>
        <p className="text-sm text-muted-foreground">
          Sınıf ders programlarını akademik yıl için yükleyin, doğrulayın ve yönetin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Sol Taraf - Aktif Ders Programları */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Aktif Ders Programları</h2>

          {/* Table */}
          <div className="mb-4 rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Sınıf/Şube
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MOCK_CLASS_SCHEDULES.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${schedule.iconColor} text-2xl`}>
                          {schedule.icon}
                        </div>
                        <span className="font-medium">{schedule.className}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${schedule.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {schedule.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewSchedule(schedule.sinifId)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDirectDownload(schedule.sinifId)}
                          disabled={downloadingIds.has(schedule.sinifId)}
                          className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                          title="İndir"
                        >
                          {downloadingIds.has(schedule.sinifId) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                        <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Sil">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="text-sm font-medium text-primary hover:underline">
            Tüm Ders Programlarını Görüntüle
          </button>
        </div>

        {/* Sağ Taraf - Yeni Ders Programı Yükle */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Yeni Ders Programı Yükle</h2>

          <div className="space-y-4">
            {/* Sınıf Seç */}
            <div className="space-y-2">
              <Label>Sınıf Seç</Label>
              <div className="relative">
                <button
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-gray-50 px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                >
                  <span className={selectedClass ? '' : 'text-muted-foreground'}>
                    {selectedClass || 'Sınıf Seçin'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showClassDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowClassDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                      {CLASSES.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setSelectedClass(cls)
                            setShowClassDropdown(false)
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Şube Seçin */}
            <div className="space-y-2">
              <Label>Şube Seçin</Label>
              <div className="relative">
                <button
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border bg-gray-50 px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                >
                  <span className={selectedBranch ? '' : 'text-muted-foreground'}>
                    {selectedBranch || 'Şube Seçin'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {showBranchDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBranchDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
                      {BRANCHES.map((branch) => (
                        <button
                          key={branch}
                          onClick={() => {
                            setSelectedBranch(branch)
                            setShowBranchDropdown(false)
                          }}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                        >
                          {branch}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Dosya Yükleme Alanı */}
            <div className="space-y-2">
              <Label>Yüklemek için tıklayın veya sürükleyip bırakın</Label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center hover:border-primary">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-2 text-sm font-medium">
                  Yüklemek için tıklayın veya sürükleyip bırakın
                </p>
                <p className="text-xs text-muted-foreground">
                  Yalnızca PDF dosyaları (Maks 10MB)
                </p>
              </div>
            </div>

            {/* Kaydet Butonu */}
            <Button className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Kaydet
            </Button>

            {/* Yayınlama Süreci Info */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-2 flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-xs">i</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Yayınlama Süreci</p>
                </div>
              </div>
              <p className="ml-7 text-xs leading-relaxed text-blue-700">
                Yeni bir ders programı yüklemek, mevcut aktif programı arşivleyecektir.
                Yayınlandıktan sonra ilgili tüm öğretmen ve öğrencilere otomatik olarak
                bildirim gönderilecektir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <h2 className="text-xl font-bold">Ders Programı Görüntüleme</h2>
              <button
                onClick={handleCloseViewer}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <p className="text-red-600 font-medium">Hata: {error.message}</p>
                    <p className="text-gray-500 text-sm mt-2">Program yüklenemedi</p>
                  </div>
                </div>
              ) : (
                <PdfViewer
                  document={document}
                  actions={['download', 'print', 'zoom-in', 'zoom-out', 'zoom-reset']}
                  scale={scale}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onZoomReset={handleZoomReset}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                  isDownloading={isDownloading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
