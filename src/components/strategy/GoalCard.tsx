'use client';

import * as React from 'react';
import { Goal } from '@/lib/strategy-types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Circle } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

const categoryIcons: Record<Goal['category'], string> = {
  savings: '💰',
  investment: '📈',
  debt_payment: '💳',
};

const statusConfig: Record<Goal['status'], { icon: React.ReactNode; color: string }> = {
  on_track: { icon: <Circle className="h-3 w-3" />, color: 'text-emerald-400' },
  at_risk: { icon: <AlertCircle className="h-3 w-3" />, color: 'text-yellow-400' },
  completed: { icon: <CheckCircle2 className="h-3 w-3" />, color: 'text-blue-400' },
};

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const status = statusConfig[goal.status];

  return (
    <button
      onClick={() => onEdit(goal)}
      className="w-full bg-card border rounded-lg p-3 text-left hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span>{categoryIcons[goal.category]}</span>
          <span className="font-medium text-sm">{goal.title}</span>
        </div>
        <span className={cn('flex items-center gap-1 text-xs', status.color)}>
          {status.icon}
          {goal.status === 'completed' && 'Completada'}
          {goal.status === 'on_track' && 'En curso'}
          {goal.status === 'at_risk' && 'En riesgo'}
        </span>
      </div>

      <Progress value={progress} className="h-2 mb-2" />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          ${goal.currentAmount.toLocaleString('es-MX')} / ${goal.targetAmount.toLocaleString('es-MX')}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      {goal.deadline && (
        <div className="mt-2 text-xs text-muted-foreground">
          Fecha límite: {new Date(goal.deadline).toLocaleDateString('es-MX')}
        </div>
      )}
    </button>
  );
}
