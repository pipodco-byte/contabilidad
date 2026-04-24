'use client';

import * as React from 'react';
import { X, Settings } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useStrategyData } from '@/hooks/useStrategyData';
import { MetricsGrid } from './MetricsGrid';
import { StrategyChat } from './StrategyChat';
import { GoalsList } from './GoalsList';
import { TrendChart } from './TrendChart';
import { StrategySettingsModal } from './StrategySettingsModal';
import { Button } from '@/components/ui/button';

interface StrategyPanelProps {
  onClose: () => void;
}

export function StrategyPanel({ onClose }: StrategyPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { strategyData, chatHistory, addChatMessage, clearChat } = useStrategyData();

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        className="fixed inset-y-0 right-0 w-full lg:w-[480px] bg-background border-l z-40 flex flex-col"
      >
        <header className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-lg font-semibold">Estrategia</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <MetricsGrid metrics={strategyData.calculatedMetrics} />

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Tendencia de Márgenes</h3>
            <TrendChart data={strategyData.calculatedMetrics.historicalMargins} />
          </section>

          <section className="space-y-3">
            <StrategyChat
              strategyData={strategyData}
              chatHistory={chatHistory}
              onAddMessage={addChatMessage}
              onClearChat={clearChat}
            />
          </section>

          <section className="space-y-3">
            <GoalsList
              goals={strategyData.goals}
            />
          </section>
        </div>
      </motion.div>

      <StrategySettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
