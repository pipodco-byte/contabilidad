'use client';

import { getRunwayBadge } from '@/lib/strategy-types';
import { cn } from '@/lib/utils';

interface RunwayBadgeProps {
  runway: number;
  className?: string;
}

export function RunwayBadge({ runway, className }: RunwayBadgeProps) {
  const badge = getRunwayBadge(runway);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
        badge.color === 'success' && 'bg-emerald-500/20 text-emerald-400',
        badge.color === 'warning' && 'bg-yellow-500/20 text-yellow-400',
        badge.color === 'danger' && 'bg-red-500/20 text-red-400',
        className
      )}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label}</span>
    </span>
  );
}
