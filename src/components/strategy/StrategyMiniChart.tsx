'use client';

import {
  AreaChart,
  Area,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface StrategyMiniChartDataPoint {
  month: string;
  ingresos: number;
  egresos: number;
  gastosFijos?: number;
  breakEven?: number;
}

interface StrategyMiniChartProps {
  data: StrategyMiniChartDataPoint[];
  showLegend?: boolean;
}

export function StrategyMiniChart({ data }: StrategyMiniChartProps) {
  return (
    <div className="h-[120px] w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="ingresosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="egresosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="month" hide />
          <YAxis hide />

          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="#10b981"
            fill="url(#ingresosGradient)"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="egresos"
            stroke="#fb7185"
            fill="url(#egresosGradient)"
            strokeWidth={1}
          />
          <Line
            type="monotone"
            dataKey="gastosFijos"
            stroke="#a1a1aa"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="breakEven"
            stroke="#6366f1"
            strokeWidth={1}
            dot={false}
          />

          <Tooltip
            contentStyle={{
              background: '#18181b',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#e4e4e7',
            }}
            formatter={(value: number) => new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(value)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}