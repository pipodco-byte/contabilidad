'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  badge?: 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  showBadge?: boolean;
  badgeLabel?: string;
  badgeEmoji?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  badge,
  icon,
  showBadge,
  badgeLabel,
  badgeEmoji,
}: MetricCardProps) {
  const trendColor = trend && trend > 0 ? 'text-emerald-400' : trend && trend < 0 ? 'text-red-400' : 'text-muted-foreground';
  const trendSymbol = trend && trend > 0 ? '↑' : trend && trend < 0 ? '↓' : '';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'bg-card border rounded-lg p-4 space-y-2',
        badge === 'success' && 'border-l-4 border-l-emerald-500',
        badge === 'warning' && 'border-l-4 border-l-yellow-500',
        badge === 'danger' && 'border-l-4 border-l-red-500'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{title}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold font-mono">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      <div className="flex items-center justify-between">
        {trend !== undefined && trend !== 0 && (
          <span className={cn('text-xs font-mono', trendColor)}>
            {trendSymbol} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {showBadge && badgeLabel && (
          <span className="text-xs">
            {badgeEmoji} {badgeLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}
