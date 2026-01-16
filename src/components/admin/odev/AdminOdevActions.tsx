'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminOdevActionsProps {
  onAddClick: () => void
}

export function AdminOdevActions({ onAddClick }: AdminOdevActionsProps) {
  return (
    <div className="ml-auto">
      <Button 
        className="gap-2" 
        onClick={onAddClick}
      >
        <Plus className="h-4 w-4" />
        Ödev Ekle
      </Button>
    </div>
  )
}

