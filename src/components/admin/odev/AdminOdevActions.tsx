'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AdminOdevActions() {
  const router = useRouter()

  return (
    <div className="ml-auto">
      <Button 
        className="gap-2" 
        onClick={() => router.push('/admin/odevler/create')}
      >
        <Plus className="h-4 w-4" />
        Ödev Ekle
      </Button>
    </div>
  )
}

