'use client'

import { useParams, useRouter } from 'next/navigation'
import { EditOdevPage } from '@/components/admin/odev/EditOdevPage'

export default function EditOdevPageRoute() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  if (!id) {
    return null
  }

  return (
    <EditOdevPage 
      homeworkId={id}
      onClose={() => router.push('/admin/odevler')}
    />
  )
}

