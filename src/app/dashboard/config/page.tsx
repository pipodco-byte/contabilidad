'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Gem } from 'lucide-react'

export default function ConfigPage() {
  const { user } = useAuth()
  const [showGema, setShowGema] = useState(false)
  const [gemaInput, setGemaInput] = useState('')
  const [gemaLoading, setGemaLoading] = useState(false)
  const [gemaMessage, setGemaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!user) return null

  const handleGemaImport = async () => {
    setGemaLoading(true)

    try {
      if (!gemaInput.trim()) {
        setGemaMessage({ type: 'error', text: 'Por favor pega datos de Gema' })
        setGemaLoading(false)
        return
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch('/api/gema/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: gemaInput, userId: user.id }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Error al importar')

      setGemaMessage({ type: 'success', text: `✓ ${data.count} transacciones importadas` })
      setGemaInput('')
      setTimeout(() => setShowGema(false), 2000)
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
    <div className="space-y-6">
      {/* Gema Import */}
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight mb-4 flex items-center gap-2">
          <Gem className="h-5 w-5" />
          Importar desde Gema
        </h2>

        <Button
          onClick={() => setShowGema(!showGema)}
          className="mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
        >
          <Gem className="mr-2 h-4 w-4" />
          Gema
        </Button>

        {showGema && (
          <div className="flex gap-3 p-4 border rounded-xl bg-zinc-900/50">
            <textarea
              value={gemaInput}
              onChange={(e) => setGemaInput(e.target.value)}
              placeholder="Pega aquí el output de Gema de Contabilidad..."
              className="flex-1 px-4 py-3 border border-zinc-700 bg-zinc-900 text-zinc-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                <p className={`text-sm ${gemaMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {gemaMessage.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings placeholder */}
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight mb-4">
          Configuración
        </h2>
        <p className="text-zinc-400">Más opciones de configuración coming soon...</p>
      </div>
    </div>
  )
}
