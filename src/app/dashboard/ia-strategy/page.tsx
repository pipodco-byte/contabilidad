'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ChatWorkspace } from '@/components/strategy/ChatWorkspace'
import { DataPanel } from '@/components/strategy/DataPanel'
import { useStrategyData } from '@/hooks/useStrategyData'
import { StrategyConfigData } from '@/components/strategy/StrategyConfig'
import { StrategyChatMessage } from '@/lib/strategy-types'

export default function IAStrategyPage() {
  const { user, loading } = useAuth()
  const { strategyData, config, configLoading, refreshConfig } = useStrategyData()

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

  const handleSaveConfig = async (newConfig: StrategyConfigData) => {
    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig),
    });
    if (!response.ok) throw new Error('Error saving config');
    await refreshConfig();
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
      <div className="flex-1 min-w-0 flex flex-col">
        <ChatWorkspace
          strategyData={strategyData}
          chatHistory={chatHistory}
          onAddMessage={handleAddMessage}
          onClearChat={handleClearChat}
        />
      </div>

      <div className="flex-shrink-0">
        <DataPanel
          metrics={strategyData.calculatedMetrics}
          goals={strategyData.goals}
          historicalMargins={strategyData.calculatedMetrics.historicalMargins}
          saldoInicial={config?.saldo_inicial || 0}
          fechaSaldo={config?.fecha_saldo || ''}
          costosFijos={config?.costos_fijos || []}
          margenObjetivo={config?.margen_objetivo || 18}
          onSaveConfig={handleSaveConfig}
          configLoading={configLoading}
        />
      </div>
    </div>
  )
}
