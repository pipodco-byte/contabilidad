'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { StrategyData, StrategyChatMessage } from '@/lib/strategy-types';
import { StrategyChat } from './StrategyChat';

interface ChatWorkspaceProps {
  strategyData: StrategyData;
  chatHistory: StrategyChatMessage[];
  onAddMessage: (msg: StrategyChatMessage) => void;
  onClearChat: () => void;
}

export function ChatWorkspace({
  strategyData,
  chatHistory,
  onAddMessage,
  onClearChat,
}: ChatWorkspaceProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <Sparkles className="h-5 w-5 text-violet-400" />
        <h1 className="text-lg font-semibold text-foreground">Asesor Estratégico Gema</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto px-6 py-4">
          <StrategyChat
            strategyData={strategyData}
            chatHistory={chatHistory}
            onAddMessage={onAddMessage}
            onClearChat={onClearChat}
          />
        </div>
      </div>
    </div>
  );
}