'use client'

import { HomeworkCard } from './HomeworkCard'
import type { Homework } from '../types/homework.types'
import { Loader2, BookOpen } from 'lucide-react'

interface HomeworkListProps {
  homeworks: Homework[]
  isLoading?: boolean
  onHomeworkClick?: (homework: Homework) => void
  emptyMessage?: string
}

export function HomeworkList({
  homeworks,
  isLoading = false,
  onHomeworkClick,
  emptyMessage = 'Ödev bulunamadı'
}: HomeworkListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (homeworks.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {homeworks.map((homework) => (
        <HomeworkCard
          key={homework.id}
          homework={homework}
          onClick={onHomeworkClick ? () => onHomeworkClick(homework) : undefined}
        />
      ))}
    </div>
  )
}

