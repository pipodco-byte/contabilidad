'use client'

import { useState, useCallback, useRef } from 'react'
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
  setInput: (input: string) => void
  isLoading: boolean
  pendingTransaction: TransaccionData | null
  error: string | null
  handleSend: (text?: string) => Promise<void>
  handleConfirm: () => Promise<void>
  handleCorrect: () => void
  reset: () => void
}

export function useAssistantChat(): UseAssistantChatReturn {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingTransaction, setPendingTransaction] = useState<TransaccionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSend = useCallback(
    async (text?: string) => {
      const textToSend = text || input
      if (!textToSend.trim()) return

      setInput('')
      setError(null)
      setPendingTransaction(null)

      const userMessage: Message = { role: 'user', content: textToSend }
      setMessages((prev) => [...prev, userMessage])

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

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ ${result.message}\n\nTransacción #${result.transaction.id.slice(0, 8)} registrada exitosamente.`,
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
  }
}