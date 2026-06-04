'use client';

import * as React from 'react';
import { CalculatedMetrics, Goal } from '@/lib/strategy-types';
import { MetricsGrid } from './MetricsGrid';
import { TrendChart } from './TrendChart';
import { GoalsList } from './GoalsList';
import { StrategyConfig, StrategyConfigData, FixedCostItem } from './StrategyConfig';
import { cn } from '@/lib/utils';

interface DataPanelProps {
  metrics: CalculatedMetrics;
  goals: Goal[];
  historicalMargins: Array<{ month: string; margin: number }>;
  saldoInicial: number;
  fechaSaldo: string;
  costosFijos: FixedCostItem[];
  margenObjetivo: number;
  onSaveConfig: (config: StrategyConfigData) => Promise<void>;
  configLoading: boolean;
}

export function DataPanel({
  metrics,
  goals,
  historicalMargins,
  saldoInicial,
  fechaSaldo,
  costosFijos,
  margenObjetivo,
  onSaveConfig,
  configLoading,
}: DataPanelProps) {
  return (
    <div
      className={cn(
        'w-[380px] h-full',
        'bg-muted/5 overflow-y-auto'
      )}
    >
      <div className="p-4 space-y-6">
        <MetricsGrid metrics={metrics} />

        <TrendChart data={historicalMargins} />

        <GoalsList goals={goals} />

        <StrategyConfig
          saldoInicial={saldoInicial}
          fechaSaldo={fechaSaldo}
          costosFijos={costosFijos}
          margenObjetivo={margenObjetivo}
          onSave={onSaveConfig}
          loading={configLoading}
        />

        {saldoInicial > 0 && (
          <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
            Cash estimado basado en saldo inicial + transacciones registradas.
            Verifica que todas las transacciones esten cargadas.
          </p>
        )}
      </div>
    </div>
  );
}
