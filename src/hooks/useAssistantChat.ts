'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TransaccionData } from '@/lib/assistant-tools'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface UseAssistantChatReturn {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  pendingTransaction: TransaccionData | null
  error: string | null
  handleSend: (text?: string) => Promise<void>
  handleConfirm: () => Promise<void>
  handleCorrect: () => void
  reset: () => void
  clearHistory: () => void
  requestCSV: () => Promise<void>
}

const ANALYTICS_KEYWORDS = ['resumen', 'total', 'mes', 'año', 'balance', 'ventas', 'egresos', 'gastos']
const CSV_KEYWORDS = ['csv', 'dame el csv', 'genera csv', 'descargar csv', 'exportar csv']
const LOCALSTORAGE_KEY = 'copilot_history'
const MAX_MESSAGES = 40

function saveToLocalStorage(messages: Message[]) {
  if (typeof window === 'undefined') return
  try {
    const sliced = messages.slice(-MAX_MESSAGES)
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(sliced))
  } catch (err) {
    console.error('[History] Save error:', err)
  }
}

function loadFromLocalStorage(): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.error('[History] Load error:', err)
  }
  return []
}

function clearLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(LOCALSTORAGE_KEY)
  } catch (err) {
    console.error('[History] Clear error:', err)
  }
}

function detectAnalytics(text: string): boolean {
  const lower = text.toLowerCase()
  return ANALYTICS_KEYWORDS.some(keyword => lower.includes(keyword))
}

function detectCSV(text: string): boolean {
  const lower = text.toLowerCase()
  return CSV_KEYWORDS.some(keyword => lower.includes(keyword))
}

export function useAssistantChat(): UseAssistantChatReturn {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingTransaction, setPendingTransaction] = useState<TransaccionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const loaded = loadFromLocalStorage()
    if (loaded.length > 0) {
      setMessages(loaded)
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      saveToLocalStorage(messages)
    }
  }, [messages])

  const handleSend = useCallback(
    async (text?: string) => {
      const textToSend = text || input
      if (!textToSend.trim()) return

      setInput('')
      setError(null)
      setPendingTransaction(null)

      const userMessage: Message = { role: 'user', content: textToSend }
      setMessages((prev) => [...prev, userMessage])

      if (detectCSV(textToSend)) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Consultando transacciones...' }
        ])
        requestCSV()
        return
      }

      if (detectAnalytics(textToSend)) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Consultando analytics...' }
        ])
        return
      }

      setIsLoading(true)

      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id || 'anonymous',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            fullResponse += chunk

            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1]
              if (lastMsg?.role === 'assistant') {
                return [...prev.slice(0, -1), { ...lastMsg, content: fullResponse }]
              }
              return [...prev, { role: 'assistant', content: fullResponse }]
            })
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'Conversación cancelada.' },
          ])
        } else {
          setError(err instanceof Error ? err.message : 'Error desconocido')
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'Error desconocido'}` },
          ])
        }
      } finally {
        setIsLoading(false)
      }
    },
    [input, messages, user?.id]
  )

  const handleConfirm = useCallback(async () => {
    if (!pendingTransaction) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'anonymous',
        },
        body: JSON.stringify({
          pendingTransaction,
        }),
      })

      const result = await response.json()

      if (result.type === 'error') {
        throw new Error(result.message)
      }

      const successMessage = `✅ ${result.message}\n\nTransacción #${result.transaction.id.slice(0, 8)} registrada exitosamente.\n\n¿Nueva transacción?`

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: successMessage,
        },
      ])

      setPendingTransaction(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar')
    } finally {
      setIsLoading(false)
    }
  }, [pendingTransaction, user?.id])

  const handleCorrect = useCallback(() => {
    setPendingTransaction(null)
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Entendido. ¿Qué dato necesitas corregir?',
      },
    ])
  }, [])

  const reset = useCallback(() => {
    setMessages([])
    setInput('')
    setIsLoading(false)
    setPendingTransaction(null)
    setError(null)
    abortControllerRef.current?.abort()
  }, [])

  const clearHistory = useCallback(() => {
    setMessages([])
    clearLocalStorage()
  }, [])

  const requestCSV = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/transacciones?limit=1000')
      if (!response.ok) throw new Error('Error al obtener transacciones')

      const transacciones = await response.json()
      const today = new Date().toISOString().split('T')[0]

      const todayTransactions = transacciones.filter(
        (t: any) => t.fecha && t.fecha.startsWith(today)
      )

      const csvLines = todayTransactions.map((t: any) => {
        const fecha = t.fecha.split('T')[0].split('-').reverse().join('/')
        const descripcion = t.descripcion || ''
        const categoria = t.categoria || ''
        const sub_categoria = t.sub_categoria || ''
        const monto = t.monto?.toString() || '0'
        const tipo = t.tipo || ''
        const medio_pago = t.medio_pago || ''
        const estado_iva = t.estado_iva || 'N/A'
        const comentarios = t.comentarios || ''

        return `${fecha};${descripcion};${categoria};${sub_categoria};${monto};${tipo};${medio_pago};${estado_iva}${comentarios ? ';' + comentarios : ''}`
      })

      const csvContent = csvLines.join('\n')

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: `Aquí está el CSV de hoy:\n\n\`\`\`\n${csvContent}\n\`\`\`\n\nCopia y pega en el botón Gema para importar.` }
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Error al obtener transacciones. Intenta de nuevo.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    input,
    setInput,
    setMessages,
    isLoading,
    pendingTransaction,
    error,
    handleSend,
    handleConfirm,
    handleCorrect,
    reset,
    clearHistory,
    requestCSV,
  }
}