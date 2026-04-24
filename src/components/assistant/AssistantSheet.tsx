'use client'

import { useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { useAssistantChat } from '@/hooks/useAssistantChat'
import { TransaccionData } from '@/lib/assistant-tools'

interface AssistantSheetProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export function AssistantSheet({ isOpen, onClose, initialMessage }: AssistantSheetProps) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    pendingTransaction,
    handleSend,
    handleConfirm,
    handleCorrect,
  } = useAssistantChat()

  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      handleSend(initialMessage)
    }
  }, [initialMessage])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '¡Hola! Soy tu asistente contable. Puedo ayudarte a registrar transacciones con lenguaje natural.\n\nSolo describe tu transacción y yo me encargo del resto. Por ejemplo:\n"Venta de consultoría $2.000.000 Nequi Gravado"\n\n¿Listo para empezar?'
      }])
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">Copilot</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/20 text-zinc-100 rounded-br-md border border-indigo-500/30'
                    : 'bg-zinc-800/80 text-zinc-100 rounded-bl-md border border-zinc-700/50'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/80 text-zinc-100 px-4 py-3 rounded-2xl rounded-bl-md border border-zinc-700/50">
                <p className="text-sm animate-pulse">Escribiendo...</p>
              </div>
            </div>
          )}

          {pendingTransaction && (
            <div className="mt-4">
              <PreVizCard transaction={pendingTransaction} onConfirm={handleConfirm} onCorrect={handleCorrect} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu transacción..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

function PreVizCard({
  transaction,
  onConfirm,
  onCorrect,
}: {
  transaction: TransaccionData
  onConfirm: () => void
  onCorrect: () => void
}) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)

  const isBold = transaction.medio_pago === 'Bold'
  const comision = isBold ? Math.round(transaction.monto * 0.05) : 0

  return (
    <div className="bg-zinc-900 border border-indigo-500/50 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">
        Verifica los datos
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">Fecha:</span>
          <span className="text-zinc-100">{transaction.fecha}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Descripción:</span>
          <span className="text-zinc-100">{transaction.descripcion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Categoría:</span>
          <span className="text-zinc-100">{transaction.categoria}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Tipo:</span>
          <span className={`font-medium ${transaction.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {transaction.tipo}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Monto:</span>
          <span className={`font-mono font-semibold ${transaction.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {transaction.tipo === 'Ingreso' ? '+' : '-'}
            {formatCurrency(transaction.monto)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Medio de Pago:</span>
          <span className="text-zinc-100">{transaction.medio_pago}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">IVA:</span>
          <span className="text-zinc-100">{transaction.estado_iva}</span>
        </div>
        {transaction.comentarios && (
          <div className="flex justify-between">
            <span className="text-zinc-400">Comentarios:</span>
            <span className="text-zinc-100 text-right">{transaction.comentarios}</span>
          </div>
        )}

        {isBold && (
          <div className="mt-3 pt-3 border-t border-zinc-700 space-y-2">
            <p className="text-xs text-indigo-400 font-medium">Comisión Bold (5%):</p>
            <div className="flex justify-between">
              <span className="text-zinc-400">Egreso automático:</span>
              <span className="text-rose-400 font-mono">-{formatCurrency(comision)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Confirmar
        </button>
        <button
          onClick={onCorrect}
          className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
        >
          Corregir
        </button>
      </div>
    </div>
  )
}