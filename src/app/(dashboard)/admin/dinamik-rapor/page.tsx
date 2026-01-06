'use client'

import { useState } from 'react'
import { Play, Download, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock data
const MOCK_REPORTS = [
  {
    id: '1',
    name: 'Ekim Ayı Devamsızlık Raporu',
    createdAt: '25 Eki 2023, 10:23',
    createdBy: 'Admin',
    query: 'SELECT * FROM devamsizlik_kayitlari WHERE tarih >= "2023-10-01"'
  },
  {
    id: '2',
    name: 'Kantin 3. Çeyrek Satışları',
    createdAt: '24 Eki 2023, 16:15',
    createdBy: 'Admin',
    query: 'SELECT sum(tutar) FROM satislar WHERE donem = "3"'
  },
  {
    id: '3',
    name: 'Eylül Ayı Servis Kayıtları',
    createdAt: '20 Eki 2023, 09:00',
    createdBy: 'Admin',
    query: 'SELECT * FROM servis_kayitlari WHERE ay = "Eylül"'
  }
]

export default function DinamikRaporPage() {
  const [reportTitle, setReportTitle] = useState('')
  const [sqlQuery, setSqlQuery] = useState(`SELECT
    o.ogrenci_id,
    o.ad_soyad,
    d.durum,
    d.tarih
FROM
    devamsizlik_kayitlari d`)
  const [reports, setReports] = useState(MOCK_REPORTS)

  const handleGenerateReport = () => {
    // Yeni rapor ekleme simülasyonu
    const newReport = {
      id: Date.now().toString(),
      name: reportTitle || 'Yeni Rapor',
      createdAt: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdBy: 'Admin',
      query: sqlQuery
    }
    setReports([newReport, ...reports])
    console.log('Generating report:', reportTitle, sqlQuery)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu raporu silmek istediğinize emin misiniz?')) {
      setReports(reports.filter(r => r.id !== id))
    }
  }

  const handleEdit = (report: any) => {
    setReportTitle(report.name)
    setSqlQuery(report.query || '')
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDownload = (report: any) => {
    alert(`${report.name} indiriliyor...`)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Kontrol Paneli</span>
        <span>/</span>
        <span>Raporlar</span>
        <span>/</span>
        <span className="font-medium text-foreground">Dinamik Rapor</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dinamik Rapor</h1>
      </div>

      {/* Tab */}
      <div>
        <button className="border-b-2 border-b-primary px-4 py-2 text-sm font-medium text-primary">
          Rapor Oluşturucu
        </button>
      </div>

      {/* Rapor Oluşturma Alanı */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Rapor Başlığı */}
          <div className="space-y-2">
            <Label htmlFor="report-title">Rapor Başlığı</Label>
            <Input
              id="report-title"
              placeholder="Örn: Aylık Devamsızlık Raporu"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>

          {/* SQL Sorgusu */}
          <div className="space-y-2">
            <Label htmlFor="sql-query">SQL Sorgusu</Label>
            <textarea
              id="sql-query"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="h-64 w-full rounded-lg border bg-gray-50 p-4 font-mono text-sm outline-none focus:border-primary focus:bg-white"
              placeholder="SQL sorgunuzu buraya yazın..."
            />
          </div>

          {/* Rapor Oluştur Butonu */}
          <Button className="gap-2" onClick={handleGenerateReport}>
            <Play className="h-4 w-4" />
            Rapor Oluştur
          </Button>
        </div>
      </div>

      {/* Rapor Listesi */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Rapor Listesi</h2>
              <p className="text-sm text-muted-foreground">Oluşturulan raporların listesi</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  RAPOR ADI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  OLUŞTURMA TARİHİ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  OLUŞTURAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İŞLEMLER
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  {/* Rapor Adı */}
                  <td className="px-6 py-4">
                    <p className="font-medium">{report.name}</p>
                  </td>

                  {/* Oluşturma Tarihi */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{report.createdAt}</p>
                  </td>

                  {/* Oluşturan */}
                  <td className="px-6 py-4">
                    <p className="text-sm">{report.createdBy}</p>
                  </td>

                  {/* İşlemler */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* İndir */}
                      <button
                        onClick={() => handleDownload(report)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="İndir"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {/* Düzenle */}
                      <button
                        onClick={() => handleEdit(report)}
                        className="rounded-lg p-2 text-yellow-600 hover:bg-yellow-50"
                        title="Düzenle (Forma Doldur)"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {/* Sil */}
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
