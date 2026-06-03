'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ChatWorkspace } from '@/components/strategy/ChatWorkspace'
import { DataPanel } from '@/components/strategy/DataPanel'
import { useStrategyData } from '@/hooks/useStrategyData'
import { StrategyChatMessage } from '@/lib/strategy-types'

export default function IAStrategyPage() {
  const { user, loading } = useAuth()
  const { strategyData } = useStrategyData()

  const [chatHistory, setChatHistory] = React.useState<StrategyChatMessage[]>([])
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('ia-strategy-chat')
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved))
      } catch {
        setChatHistory([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ia-strategy-chat', JSON.stringify(chatHistory))
    }
  }, [chatHistory, mounted])

  const handleAddMessage = (msg: StrategyChatMessage) => {
    setChatHistory(prev => [...prev.slice(-39), msg])
  }

  const handleClearChat = () => {
    setChatHistory([])
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex-[0.65] min-w-0 flex flex-col">
        <ChatWorkspace
          strategyData={strategyData}
          chatHistory={chatHistory}
          onAddMessage={handleAddMessage}
          onClearChat={handleClearChat}
        />
      </div>

      <DataPanel
        metrics={strategyData.calculatedMetrics}
        goals={strategyData.goals}
        historicalMargins={strategyData.calculatedMetrics.historicalMargins}
      />
    </div>
  )
}