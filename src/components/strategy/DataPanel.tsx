'use client';

import * as React from 'react';
import { CalculatedMetrics, Goal } from '@/lib/strategy-types';
import { MetricsGrid } from './MetricsGrid';
import { TrendChart } from './TrendChart';
import { GoalsList } from './GoalsList';
import { cn } from '@/lib/utils';

interface DataPanelProps {
  metrics: CalculatedMetrics;
  goals: Goal[];
  historicalMargins: Array<{ month: string; margin: number }>;
}

export function DataPanel({
  metrics,
  goals,
  historicalMargins,
}: DataPanelProps) {
  return (
    <div
      className={cn(
        'w-[380px] h-full border-l border-zinc-800/50',
        'bg-zinc-900/10 overflow-y-auto'
      )}
    >
      <div className="p-4 space-y-6">
        <MetricsGrid metrics={metrics} />

        <TrendChart data={historicalMargins} />

        <GoalsList goals={goals} />
      </div>
    </div>
  );
}