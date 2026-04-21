'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type KPIVariant = 'ingreso' | 'gasto' | 'balance';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  variant: KPIVariant;
  trend?: number;
  isEmpty?: boolean;
}

const variantStyles = {
  ingreso: {
    border: 'border-l-emerald-500',
    glow: 'hover:shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    amountColor: '',
  },
  gasto: {
    border: 'border-l-rose-400',
    glow: 'hover:shadow-rose-400/20',
    iconBg: 'bg-rose-400/10',
    iconColor: 'text-rose-400',
    amountColor: '',
  },
  balance: {
    border: 'border-l-violet-500',
    glow: 'hover:shadow-violet-500/20',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    amountColor: '',
  },
};

const emptyStateStyles = {
  ingreso: { label: 'Sin ingresos', value: '$0' },
  gasto: { label: 'Sin gastos', value: '$0' },
  balance: { label: 'Sin balance', value: '$0' },
};

export function KPICard({
  label,
  value,
  icon: Icon,
  variant,
  trend,
  isEmpty = false,
}: KPICardProps) {
  const styles = variantStyles[variant];
  const emptyConfig = emptyStateStyles[variant];
  const prefersReducedMotion = useReducedMotion();

  const displayLabel = isEmpty ? emptyConfig.label : label;
  const displayValue = isEmpty ? emptyConfig.value : value;

  const hoverMotion = prefersReducedMotion
    ? {}
    : { scale: 1.02, boxShadow: '0 4px 20px -4px rgba(139, 92, 246, 0.25)' };

  return (
    <motion.div
      whileHover={hoverMotion}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card
        className={cn(
          'border-l-4 bg-white dark:bg-zinc-950/80 border border-zinc-200/50 dark:border-zinc-800/50',
          'hover:border-violet-500/30 transition-all duration-300',
          'hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-black/40',
          styles.border,
          styles.glow
        )}
      >
        <div className="flex items-start justify-between p-6">
          <div className="flex-1 text-right">
            <p className="text-sm text-muted-foreground mb-1">{displayLabel}</p>
            <p
              className={cn(
                'text-3xl font-bold font-mono tabular-nums tracking-tighter',
                styles.amountColor
              )}
            >
              {displayValue}
            </p>
            {trend !== undefined && !isEmpty && (
              <p
                className={cn(
                  'text-xs mt-1',
                  trend >= 0 ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-lg ml-4', styles.iconBg)}>
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}