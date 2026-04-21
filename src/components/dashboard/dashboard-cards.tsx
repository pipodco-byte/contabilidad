'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Scale, Wallet } from 'lucide-react';
import { KPICard, KPIVariant } from './kpi-card';

interface DashboardCardsProps {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  formatCurrency: (value: number) => string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function DashboardCards({
  totalIngresos,
  totalEgresos,
  balance,
  formatCurrency,
}: DashboardCardsProps) {
  const isEmptyIngresos = totalIngresos === 0;
  const isEmptyEgresos = totalEgresos === 0;
  const isEmptyBalance = balance === 0;

  const kpis: Array<{
    label: string;
    value: string;
    icon: typeof TrendingUp;
    variant: KPIVariant;
    trend?: number;
    isEmpty?: boolean;
  }> = [
    {
      label: 'Ingresos',
      value: formatCurrency(totalIngresos),
      icon: TrendingUp,
      variant: 'ingreso',
      trend: 12,
      isEmpty: isEmptyIngresos,
    },
    {
      label: 'Egresos',
      value: formatCurrency(totalEgresos),
      icon: Scale,
      variant: 'gasto',
      trend: 8,
      isEmpty: isEmptyEgresos,
    },
    {
      label: 'Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      variant: 'balance',
      isEmpty: isEmptyBalance,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        className="contents"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.variant} variants={itemVariants}>
            <KPICard
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
              variant={kpi.variant}
              trend={kpi.trend}
              isEmpty={kpi.isEmpty}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}