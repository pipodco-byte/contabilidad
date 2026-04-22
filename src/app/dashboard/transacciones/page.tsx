'use client'

import { useAuth } from '@/hooks/useAuth'
import { TransactionTable } from '@/components/tables/transaction-table'
import { TransaccionForm } from '@/components/forms/transaccion-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function TransaccionesPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Nueva Transacción Button */}
      <div className="flex gap-3">
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-500">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Transacción
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <TransaccionForm
          userId={user.id}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Table */}
      <TransactionTable userId={user.id} userRole={user.rol} />
    </div>
  )
}
