'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { X, Send, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAssistantChat } from '@/hooks/useAssistantChat'
import { TransaccionData } from '@/lib/assistant-tools'
import { AssistantMicButton } from './AssistantMicButton'
import { ImageUpload } from './ImageUpload'
import { extractDataFromText } from '@/lib/image-extract'
import { toast } from 'sonner'

interface AssistantSheetProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

const markdownComponents: Record<string, React.ComponentType<any>> = {
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm text-zinc-100 mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-indigo-400 font-semibold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-zinc-400 italic">{children}</em>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-sm text-zinc-300">{children}</li>
  ),
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-lg font-bold text-zinc-100 mb-2">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base font-semibold text-zinc-100 mb-2">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-zinc-200 mb-1">{children}</h3>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-indigo-500 bg-zinc-900/50 pl-4 py-1 my-2 italic text-zinc-300">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-400 text-xs font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 my-2 overflow-x-auto">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-zinc-800 my-4" />,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-indigo-400 hover:text-indigo-300 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-800 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-zinc-800/50">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-zinc-800">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-zinc-800/30 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-2 text-left font-semibold text-zinc-200">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-3 py-2 text-zinc-400">{children}</td>
  ),
}

export function AssistantSheet({ isOpen, onClose, initialMessage }: AssistantSheetProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [attachedImage, setAttachedImage] = useState<string | null>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    clearHistory,
  } = useAssistantChat()

  const handleInterimChange = useCallback((interimText: string) => {
    setInput((current) => `${current} ${interimText}`.trim())
  }, [])

  const handleImageSelected = (base64: string) => {
    setAttachedImage(base64)
    const extracted = extractDataFromText(base64)
    const montoStr = extracted.monto ? extracted.monto.toLocaleString('es-CO') : '[monto]'
    const fechaStr = extracted.fecha || '[fecha]'

    const userMessage = `Screenshot: ${fechaStr}, ${montoStr}, ${extracted.medio_pago || '[medio_pago]'}, Ref: ${extracted.referencia || 'N/A'}`
    setInput(userMessage)
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: isFirstLoad ? 'instant' : 'smooth'
      })
    }
    setIsFirstLoad(false)
  }, [messages, isFirstLoad])

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
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Borrar historial"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                )}
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

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-zinc-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex items-center gap-2">
            <AssistantMicButton
              disabled={isLoading}
              onInterimChange={handleInterimChange}
            />
            <ImageUpload
              onImageSelected={handleImageSelected}
              disabled={isLoading}
            />
            {attachedImage && (
              <div className="relative">
                <img
                  src={attachedImage}
                  alt="Attached"
                  className="w-10 h-10 object-cover rounded border border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Dicta o escribe tu transacción..."
              disabled={isLoading}
              rows={1}
              className="flex-1 px-4 py-3 min-h-[44px] max-h-40 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-all resize-none overflow-y-auto"
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

        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">¿Borrar historial?</h3>
              <p className="text-sm text-zinc-400 mb-4">Se eliminará toda la conversación.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearHistory()
                    setShowDeleteConfirm(false)
                    toast('Historial eliminado')
                  }}
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        )}
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