'use client'

import { Calendar, BookOpen, User, CheckCircle2, XCircle } from 'lucide-react'
import type { Homework } from '../types/homework.types'

interface HomeworkCardProps {
  homework: Homework
  onClick?: () => void
  showStatus?: boolean
}

export function HomeworkCard({ homework, onClick, showStatus = true }: HomeworkCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const isOverdue = homework.dueDate && new Date(homework.dueDate) < new Date()
  const isActive = homework.isActive

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border bg-white p-4 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {homework.title || 'Başlıksız Ödev'}
          </h3>
          
          {homework.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {homework.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {homework.dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(homework.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {showStatus && (
          <div className="flex-shrink-0">
            {isOverdue && isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                <XCircle className="h-3 w-3" />
                Süresi Geçti
              </span>
            ) : isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                <CheckCircle2 className="h-3 w-3" />
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                <XCircle className="h-3 w-3" />
                Pasif
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

