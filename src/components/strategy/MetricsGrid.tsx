'use client';

import * as React from 'react';
import { CalculatedMetrics, getRunwayBadge } from '@/lib/strategy-types';
import { MetricCard } from './MetricCard';
import { Flame, Clock, TrendingDown, Percent } from 'lucide-react';

interface MetricsGridProps {
  metrics: CalculatedMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const runwayBadge = getRunwayBadge(metrics.runway);

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        title="Burn Rate"
        value={`$${metrics.burnRate.toLocaleString('es-MX')}`}
        unit="/mes"
        icon={<Flame className="h-4 w-4" />}
      />

      <MetricCard
        title="Runway"
        value={metrics.runway}
        unit="meses"
        badge={runwayBadge.color}
        icon={<Clock className="h-4 w-4" />}
        showBadge
        badgeLabel={runwayBadge.label}
        badgeEmoji={runwayBadge.emoji}
      />

      <MetricCard
        title="Break-even"
        value={`$${metrics.breakEven.toLocaleString('es-MX')}`}
        unit="/mes"
        icon={<TrendingDown className="h-4 w-4" />}
      />

      <MetricCard
        title="Profit Margin"
        value={metrics.profitMarginMonthly}
        unit="%"
        trend={metrics.marginTrend}
        icon={<Percent className="h-4 w-4" />}
      />
    </div>
  );
}
