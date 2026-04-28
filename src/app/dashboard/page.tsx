'use client'

import { useAuth } from '@/hooks/useAuth'
import { useResumen } from '@/hooks/useResumen'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { TransaccionForm } from '@/components/forms/transaccion-form'
import { useState } from 'react'
import { Gem, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { resumen } = useResumen(user?.id || '', user?.rol || 'usuario')
  const [showForm, setShowForm] = useState(false)
  const [showGema, setShowGema] = useState(false)
  const [gemaInput, setGemaInput] = useState('')
  const [gemaLoading, setGemaLoading] = useState(false)
  const [gemaMessage, setGemaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

  const handleGemaImport = async () => {
    setGemaLoading(true)

    try {
      if (!gemaInput.trim()) {
        setGemaMessage({ type: 'error', text: 'Por favor pega datos de Gema' })
        setGemaLoading(false)
        return
      }

      const lines = gemaInput.trim().split('\n').filter((l) => l.trim())

      const transacciones = lines.map((line) => {
        const parts = line.split(';')
        const [fecha, descripcion, categoria, sub_categoria, monto, tipo, medio_pago, estado_iva, comentarios] = parts

        let formattedFecha = fecha?.trim() || ''

        if (formattedFecha.includes('/')) {
          const [day, month, year] = formattedFecha.split('/')
          formattedFecha = `${year}-${month}-${day}`
        }

        return {
          fecha: formattedFecha,
          descripcion: descripcion?.trim() || '',
          categoria: categoria?.trim() || '',
          sub_categoria: sub_categoria?.trim() || '',
          monto: parseFloat(monto) || 0,
          tipo: tipo?.trim() || '',
          medio_pago: medio_pago?.trim() || '',
          estado_iva: estado_iva?.trim() || '',
          comentarios: comentarios?.trim() || '',
        }
      })

      const bodyString = JSON.stringify({ transacciones, userId: user.id })

      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/gema/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
        signal: controller.signal,
      })

      clearTimeout(id)

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Error al importar')

      setGemaMessage({ type: 'success', text: `✓ ${data.count} transacciones importadas` })
      setGemaInput('')
      setShowGema(false)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setGemaMessage({ type: 'error', text: 'Timeout: El servidor tardó demasiado' })
      } else {
        setGemaMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al importar' })
      }
    } finally {
      setGemaLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Action Buttons - ARRIBA DE KPI CARDS */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowGema(!showGema)}
          className="bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
        >
          <Gem className="mr-2 h-4 w-4" />
          Gema
        </Button>

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

      {/* Gema Import */}
      {showGema && (
        <div className="flex gap-3 p-4 border rounded-xl">
          <textarea
            value={gemaInput}
            onChange={(e) => setGemaInput(e.target.value)}
            placeholder="Pega aquí el output de Gema de Contabilidad..."
            className="flex-1 px-4 py-3 border rounded-lg resize-none bg-muted border-input text-foreground"
            rows={4}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleGemaImport}
              disabled={gemaLoading}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
            >
              {gemaLoading ? 'Importando...' : 'Enviar'}
            </Button>
            {gemaMessage && (
              <p className={`text-sm ${gemaMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {gemaMessage.text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Nueva Transacción Form */}
      {showForm && (
        <TransaccionForm
          userId={user.id}
          onSuccess={() => {
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}
