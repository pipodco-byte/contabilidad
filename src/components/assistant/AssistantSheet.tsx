'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { X, Send, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAssistantChat } from '@/hooks/useAssistantChat'
import { TransaccionData, TransaccionItem } from '@/lib/assistant-tools'
import { BatchCard } from './BatchCard'
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
    <p className="text-sm text-foreground mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-indigo-400 font-semibold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-muted-foreground italic">{children}</em>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-sm text-foreground">{children}</li>
  ),
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-lg font-bold text-foreground mb-2">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base font-semibold text-foreground mb-2">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-foreground mb-1">{children}</h3>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-indigo-500 bg-muted pl-4 py-1 my-2 italic text-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-emerald-400 text-xs font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted border border-border rounded-lg p-3 my-2 overflow-x-auto">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-border my-4" />,
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
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-muted">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-2 text-left font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-3 py-2 text-muted-foreground">{children}</td>
  ),
}

export function AssistantSheet({ isOpen, onClose, initialMessage }: AssistantSheetProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [attachedImage, setAttachedImage] = useState<string | null>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [pendingLote, setPendingLote] = useState<TransaccionItem[]>([])
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

  const handleConfirmLote = async () => {
    try {
      for (const transaccion of pendingLote) {
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'anonymous',
          },
          body: JSON.stringify({ pendingTransaction: transaccion }),
        })
        const result = await response.json()
        if (result.type === 'error') {
          toast.error(result.message)
        }
      }
      setPendingLote([])
      toast.success('Lote confirmado')
    } catch {
      toast.error('Error al confirmar lote')
    }
  }

  const handleEditItem = (index: number, item: TransaccionItem) => {
    console.log('Edit item:', index, item)
  }

  const handleDeleteItem = (index: number) => {
    setPendingLote((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCancelLote = () => {
    setPendingLote([])
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant' as const,
        content: 'Entendido, Felipe. El lote ha sido limpiado para mantener tu contabilidad impecable. ¿Quieres intentar un nuevo dictamen o registrar manualmente?',
      },
    ])
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

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">C</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">Copilot</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Borrar historial"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
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
                    ? 'bg-primary/20 text-foreground rounded-br-md border border-primary/30'
                    : 'bg-secondary text-foreground rounded-bl-md border border-border/50'
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
              <div className="bg-secondary text-foreground px-4 py-3 rounded-2xl rounded-bl-md border border-border/50">
                <p className="text-sm animate-pulse">Escribiendo...</p>
              </div>
            </div>
          )}

          {pendingTransaction && (
            <div className="mt-4">
              <PreVizCard transaction={pendingTransaction} onConfirm={handleConfirm} onCorrect={handleCorrect} />
            </div>
          )}

          {pendingLote.length > 0 && (
            <div className="mt-4">
              <BatchCard
                transacciones={pendingLote}
                onConfirm={handleConfirmLote}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onCancel={handleCancelLote}
                isLoading={isLoading}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
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
                  className="w-10 h-10 object-cover rounded border border-border"
                />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
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
              className="flex-1 px-4 py-3 min-h-[44px] max-h-40 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-all resize-none overflow-y-auto"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-primary hover:bg-primary/80 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
</form>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-popover border border-border rounded-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-popover-foreground mb-2">¿Borrar historial?</h3>
              <p className="text-sm text-muted-foreground mb-4">Se eliminará toda la conversación.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearHistory()
                    setShowDeleteConfirm(false)
                    toast('Historial eliminado')
                  }}
                  className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-lg text-sm font-medium transition-colors"
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
    <div className="bg-card border border-primary/50 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
        Verifica los datos
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fecha:</span>
          <span className="text-foreground">{transaction.fecha}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Descripción:</span>
          <span className="text-foreground">{transaction.descripcion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Categoría:</span>
          <span className="text-foreground">{transaction.categoria}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tipo:</span>
          <span className={`font-medium ${transaction.tipo === 'Ingreso' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {transaction.tipo}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monto:</span>
          <span className={`font-mono font-semibold ${transaction.tipo === 'Ingreso' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {transaction.tipo === 'Ingreso' ? '+' : '-'}
            {formatCurrency(transaction.monto)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Medio de Pago:</span>
          <span className="text-foreground">{transaction.medio_pago}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">IVA:</span>
          <span className="text-foreground">{transaction.estado_iva}</span>
        </div>
        {transaction.comentarios && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comentarios:</span>
            <span className="text-foreground text-right">{transaction.comentarios}</span>
          </div>
        )}

        {isBold && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <p className="text-xs text-primary font-medium">Comisión Bold (5%):</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Egreso automático:</span>
              <span className="text-rose-500 font-mono">-{formatCurrency(comision)}</span>
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
          className="flex-1 px-4 py-2 bg-secondary hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          Corregir
        </button>
      </div>
    </div>
  )
}