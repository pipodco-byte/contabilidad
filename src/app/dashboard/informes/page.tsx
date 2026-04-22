'use client'

import { useAuth } from '@/hooks/useAuth'
import { ReportsTabs } from '@/components/reports/reports-tabs'

export default function InformesPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div>
      <ReportsTabs userId={user.id} userRole={user.rol} />
    </div>
  )
}
