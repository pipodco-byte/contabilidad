'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Pencil, X, RotateCcw } from 'lucide-react'
import { TransaccionItem } from '@/lib/assistant-tools'

interface BatchCardProps {
  transacciones: TransaccionItem[]
  onConfirm: () => void
  onEdit: (index: number, item: TransaccionItem) => void
  onDelete: (index: number) => void
  onCancel: () => void
  isLoading?: boolean
}

export function BatchCard({
  transacciones,
  onConfirm,
  onEdit,
  onDelete,
  onCancel,
  isLoading = false,
}: BatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  const handleDelete = (index: number) => {
    onDelete(index)
  }

  const handleEdit = (index: number, item: TransaccionItem) => {
    onEdit(index, item)
  }

  const handleCancel = () => {
    setShowEmpty(true)
    onCancel()
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)

  const totalIngresos = transacciones
    .filter((t) => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + t.monto, 0)

  const totalEgresos = transacciones
    .filter((t) => t.tipo === 'Egreso')
    .reduce((sum, t) => sum + t.monto, 0)

  const neto = totalIngresos - totalEgresos

  if (showEmpty || transacciones.length === 0) {
    return (
      <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
          <RotateCcw className="w-6 h-6 text-zinc-500" />
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          Lote descartado. El historial de este dictamen se ha limpiado para mantener tu contabilidad impecable.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => setShowEmpty(false)}
            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reintentar Dictado
          </button>
          <button
            onClick={() => {}}
            className="w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
          >
            Registro Manual
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 text-zinc-500 hover:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 border border-indigo-500/30 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-24 mb-3" />
        <div className="h-4 bg-zinc-800 rounded w-32 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-20" />
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-indigo-500/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Batch Ready
          </span>
          <span className={`text-2xl font-bold ${neto >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {neto >= 0 ? '+' : ''}{formatCurrency(neto)}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        )}
      </button>

      {!isExpanded && (
        <div className="px-4 pb-3">
          <p className="text-sm text-zinc-400">
            {transacciones.length} transacciones: {transacciones.filter((t) => t.tipo === 'Ingreso').length} ingresos, {transacciones.filter((t) => t.tipo === 'Egreso').length} egresos
          </p>
        </div>
      )}

      {isExpanded && (
        <div className="border-t border-zinc-800">
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {transacciones.map((t, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    t.tipo === 'Ingreso'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {t.tipo === 'Ingreso' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{t.descripcion}</p>
                  <p className="text-xs text-zinc-500">{t.categoria || 'Sin categoría'}</p>
                </div>

                <p
                  className={`font-mono font-semibold ${
                    t.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.tipo === 'Ingreso' ? '+' : '-'}
                  {formatCurrency(t.monto)}
                </p>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(i, t)}
                    className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4 text-zinc-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                    aria-label="Eliminar"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-emerald-400">Ingresos: {formatCurrency(totalIngresos)}</span>
              <span className="text-rose-400">Egresos: {formatCurrency(totalEgresos)}</span>
            </div>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              Confirmar Todo ({transacciones.length})
            </button>
            <button
              onClick={handleCancel}
              className="w-full mt-2 px-4 py-2 text-zinc-500 hover:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
            >
              Descartar Lote
            </button>
          </div>
        </div>
      )}
    </div>
  )
}