'use client'

import { useAuth } from '@/hooks/useAuth'
import { useResumen } from '@/hooks/useResumen'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { TransaccionForm } from '@/components/forms/transaccion-form'
import { useState } from 'react'
import Link from 'next/link'
import { Receipt, BarChart3, FileText, Settings, Plus } from 'lucide-react'
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

  const isAdmin = user.rol === 'admin'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      {/* Admin Badge */}
      {isAdmin && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm text-primary">
            ✨ Acceso de administrador activado
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <DashboardCards
        totalIngresos={resumen.totalIngresos}
        totalEgresos={resumen.totalEgresos}
        balance={resumen.balance}
        formatCurrency={formatCurrency}
      />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/transacciones">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50">
              <Receipt className="h-6 w-6 text-violet-400" />
              <span className="text-sm">Transacciones</span>
            </Button>
          </Link>

          <Link href="/dashboard/graficas">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
              <span className="text-sm">Gráficas</span>
            </Button>
          </Link>

          <Link href="/dashboard/informes">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50">
              <FileText className="h-6 w-6 text-rose-400" />
              <span className="text-sm">Informes</span>
            </Button>
          </Link>

          <Link href="/dashboard/config">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50">
              <Settings className="h-6 w-6 text-zinc-400" />
              <span className="text-sm">Config</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Nueva Transacción Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Nueva Transacción</h2>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-500">
              <Plus className="h-4 w-4 mr-2" />
              Nueva
            </Button>
          )}
        </div>

        {showForm && (
          <TransaccionForm
            userId={user.id}
            onSuccess={() => {
              setShowForm(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
