'use client';

import * as React from 'react';
import { StrategyChatMessage } from '@/lib/strategy-types';
import { cn } from '@/lib/utils';

interface StrategyMessageProps {
  message: StrategyChatMessage;
}

export function StrategyMessage({ message }: StrategyMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
