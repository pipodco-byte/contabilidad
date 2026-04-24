'use client'

import { useAuth } from '@/hooks/useAuth'
import { useResumen } from '@/hooks/useResumen'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { TransaccionForm } from '@/components/forms/transaccion-form'
import { GemaBottomBar } from '@/components/gema'
import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { resumen } = useResumen(user?.id || '', user?.rol || 'usuario')
  const [showForm, setShowForm] = useState(false)

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Action Buttons - ARRIBA DE KPI CARDS */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
        >
          Nueva Transacción
        </Button>

        <Button variant="outline" onClick={() => window.location.href = '/dashboard/informes'}>
          <FileText className="mr-2 h-4 w-4" />
          Informe Anual
        </Button>

        <Button variant="outline" onClick={() => window.location.href = '/dashboard/informes'}>
          <FileText className="mr-2 h-4 w-4" />
          Informe Mensual
        </Button>
      </div>

      {/* KPI Cards */}
      <DashboardCards
        totalIngresos={resumen.totalIngresos}
        totalEgresos={resumen.totalEgresos}
        balance={resumen.balance}
        formatCurrency={formatCurrency}
      />

      {/* Nueva Transacción Form */}
      {showForm && (
        <TransaccionForm
          userId={user.id}
          onSuccess={() => {
            setShowForm(false)
          }}
        />
      )}

      {/* Gema Bottom Bar */}
      <GemaBottomBar />
    </div>
  )
}
