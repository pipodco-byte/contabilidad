'use client';

import { ReferenceLine } from 'recharts';
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';

type MilestoneType = 'fixed' | 'breakEven' | 'meta';

interface MilestoneConfig {
  stroke: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  label: string;
  value: number;
}

interface MilestoneLineProps {
  type: MilestoneType;
}

const milestoneConfig: Record<MilestoneType, MilestoneConfig> = {
  fixed: {
    stroke: '#fb7185',
    strokeDasharray: '3 3',
    label: 'Gastos Fijos',
    value: FINANCIAL_PLAN.fixedCosts,
  },
  breakEven: {
    stroke: '#6366f1',
    strokeDasharray: undefined,
    label: 'Break-even',
    value: FINANCIAL_PLAN.breakEven,
  },
  meta: {
    stroke: '#10b981',
    strokeDasharray: '5 5',
    strokeWidth: 2,
    label: 'Meta Sana',
    value: FINANCIAL_PLAN.businessGoal,
  },
};

const formatCompact = (value: number) => {
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(0)}K`;
  }
  return `$${value}`;
};

export function MilestoneLine({ type }: MilestoneLineProps) {
  const config = milestoneConfig[type];

  return (
    <ReferenceLine
      y={config.value}
      stroke={config.stroke}
      strokeDasharray={config.strokeDasharray}
      strokeWidth={config.strokeWidth}
      isFront={false}
      label={{
        value: `${config.label} ${formatCompact(config.value)}`,
        position: 'insideTopRight',
        fill: config.stroke,
        fillOpacity: 0.6,
        fontSize: 10,
        fontFamily: 'monospace',
      }}
    />
  );
}