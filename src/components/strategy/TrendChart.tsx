'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  data: Array<{ month: string; margin: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length < 2) {
    return (
      <div className="bg-card border rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center">
          Se necesitan al menos 2 meses de datos para mostrar tendencias
        </p>
      </div>
    );
  }

  const zeroMonths = data.filter((d) => d.margin === 0).length;
  if (zeroMonths / data.length > 0.5) {
    return (
      <div className="bg-card border rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center">
          Datos insuficientes para mostrar tendencia
        </p>
        <p className="text-[11px] text-muted-foreground text-center mt-1">
          Se necesitan mas meses con transacciones registradas
        </p>
      </div>
    );
  }

  const maxMargin = Math.max(...data.map((d) => Math.abs(d.margin)), 1);

  const trend = data[data.length - 1].margin - data[data.length - 2].margin;
  const trendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-muted-foreground';

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Últimos {data.length} meses</span>
        <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
          {React.createElement(trendIcon, { className: 'h-3 w-3' })}
          <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-16">
        {data.map((item) => {
          const heightPercent = Math.abs(item.margin) / maxMargin * 100;
          const isPositive = item.margin >= 0;

          return (
            <div key={item.month} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  'w-full rounded-sm transition-all',
                  isPositive ? 'bg-emerald-500/60' : 'bg-red-500/60'
                )}
                style={{ height: `${Math.max(heightPercent, 10)}%` }}
              />
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                {item.month.split(' ')[0].slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{data[0].month}</span>
        <span>{data[data.length - 1].month}</span>
      </div>
    </div>
  );
}
