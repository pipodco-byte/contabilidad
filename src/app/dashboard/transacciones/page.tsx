'use client'

import { useAuth } from '@/hooks/useAuth'
import { TransactionTable } from '@/components/tables/transaction-table'

export default function TransaccionesPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div>
      <TransactionTable userId={user.id} userRole={user.rol} />
    </div>
  )
}
