'use client'

import { useAuth } from '@/hooks/useAuth'
import { Graficas } from '@/components/Graficas'

export default function GraficasPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div>
      <Graficas userId={user.id} userRole={user.rol} />
    </div>
  )
}
