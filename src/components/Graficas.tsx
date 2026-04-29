'use client';

import { useGraficas } from '@/hooks/useGraficas';
import { useInformeAnual } from '@/hooks/useInformeAnual';
import { useEvolucionMensual } from '@/hooks/useEvolucionMensual';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { MilestoneLine } from '@/components/MilestoneLine';
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';
import { motion } from 'framer-motion';
import { SimpleLegendContent } from '@/components/ui/chart';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';

interface GraficasProps {
  userId: string;
  userRole: string;
}

const pieColors = ['#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#fbbf24', '#f59e0b'];

export function Graficas({ userId, userRole }: GraficasProps) {
  const { datosPorCategoria, loading } = useGraficas(userId, userRole);
  const { datosAnuales, loading: loadingAnual } = useInformeAnual(userId, userRole);
  const { data: evolucionMensual, loading: loadingEvolucion } = useEvolucionMensual(userId, userRole);

  if (loading || loadingAnual || loadingEvolucion) {
    return (
      <div className="space-y-6">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (datosPorCategoria.length === 0) {
    return (
      <div className="bg-card border border-border backdrop-blur-md rounded-xl p-8 text-center text-muted-foreground font-medium">
        No hay datos para mostrar gráficas
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatTooltipInsight = (value: number) => {
    const breakEven = FINANCIAL_PLAN.breakEven;
    const metaSana = FINANCIAL_PLAN.businessGoal;

    if (value < breakEven) {
      const falta = breakEven - value;
      return `Faltan ${formatCurrencyCompact(falta)} para el Break-even`;
    }
    if (value < metaSana) {
      const pct = ((value - breakEven) / (metaSana - breakEven) * 100).toFixed(0);
      return `Superaste el Break-even. Vas ${pct}% camino a la Meta Sana`;
    }
    const exceso = value - metaSana;
    return `¡Meta alcanzada! Excediste por ${formatCurrencyCompact(exceso)}`;
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value?: number; name?: string }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    const value = payload[0].value;
    if (value === undefined) return null;
    const insight = formatTooltipInsight(value);
    const isExceded = value >= FINANCIAL_PLAN.businessGoal;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-foreground font-medium text-sm">{label}</p>
        <p className="text-muted-foreground text-sm">{formatCurrency(value)}</p>
        <p className={`text-sm mt-1 ${isExceded ? 'text-emerald-500' : 'text-indigo-400'}`}>
          {insight}
        </p>
      </div>
    );
  };

  const mesesOrdenados = [...datosAnuales].sort((a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime());
  const mesActual = mesesOrdenados[mesesOrdenados.length - 1];
  const mesAnterior = mesesOrdenados[mesesOrdenados.length - 2];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.6
        }}
        className="relative group bg-card/50 border border-border/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1">
            Análisis Operativo
          </h3>
          <p className="text-2xl font-semibold text-foreground tracking-tight" id="chart-categoria-title">
            Ingresos vs Egresos
          </p>
        </div>

        <div role="img" aria-labelledby="chart-categoria-title" className="mt-4">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={datosPorCategoria}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              barGap={8}
            >
              <defs>
                <linearGradient id="ingresosGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="egresosGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.1}/>
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.4} />

              <XAxis
                dataKey="categoria"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                dy={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => formatCurrencyCompact(value)}
              />

              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                content={<SimpleLegendContent />}
              />

              <Bar
                dataKey="ingresos"
                fill="url(#ingresosGradient)"
                stroke="#10b981"
                strokeWidth={1.5}
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="egresos"
                fill="url(#egresosGradient)"
                stroke="#fb7185"
                strokeWidth={1.5}
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20,
          delay: 0.1
        }}
        className="group relative bg-card/40 border border-border/50 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[80px] pointer-events-none" />

        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Time Analysis</span>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-1" id="chart-evolucion-title">
              Evolución Temporal
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Real-time Data</span>
          </div>
        </div>

        <div role="img" aria-labelledby="chart-evolucion-title" className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datosAnuales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="40%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEgresosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                  <stop offset="40%" stopColor="#fb7185" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="8 8"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />

              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                interval="preserveStartEnd"
                dy={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => formatCurrencyCompact(value)}
                domain={[0, (dataMax: number) => Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
              />

              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="top"
                align="right"
                content={<SimpleLegendContent />}
                wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px' }}
              />

              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIngresosGrad)"
                name="Ingresos"
                animationDuration={2500}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981', className: "shadow-lg" }}
              />
              <Area
                type="monotone"
                dataKey="egresos"
                stroke="#fb7185"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEgresosGrad)"
                name="Egresos"
                animationDuration={2500}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fb7185', className: "shadow-lg" }}
              />

              <MilestoneLine type="fixed" />
              <MilestoneLine type="breakEven" />
              <MilestoneLine type="meta" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
          delay: 0.2
        }}
        className="group relative bg-card/40 border border-border/50 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-500/5 blur-[60px] pointer-events-none" />

        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold italic">Resource Allocation</span>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-1" id="chart-distribucion-title">
            Distribución de Egresos
          </h3>
        </div>

        <div role="img" aria-labelledby="chart-distribucion-title" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosPorCategoria.filter(d => d.egresos > 0)}
                cx="50%"
                cy="45%"
                innerRadius={105}
                outerRadius={140}
                paddingAngle={5}
                cornerRadius={6}
                dataKey="egresos"
                nameKey="categoria"
                stroke="none"
                animationBegin={200}
                animationDuration={1800}
              >
                {datosPorCategoria.filter(d => d.egresos > 0).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                content={<SimpleLegendContent />}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
          delay: 0.3
        }}
        className="group relative bg-card/40 border border-border/50 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
      >
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/5 blur-[80px] pointer-events-none" />

        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Performance Snapshot</span>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-1" id="chart-mensual-title">
              Evolución Mensual
            </h3>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Periodo</span>
            <span className="text-xs font-medium bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
              Año Fiscal 2026
            </span>
          </div>
        </div>

        <div role="img" aria-labelledby="chart-mensual-title" className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolucionMensual} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresosMensual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="40%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEgresosMensual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                  <stop offset="40%" stopColor="#fb7185" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="8 8"
                stroke="hsl(var(--border))"
                opacity={0.4}
              />

              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                dy={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => formatCurrencyCompact(value)}
              />

              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="top"
                align="right"
                content={<SimpleLegendContent />}
                wrapperStyle={{ paddingBottom: '30px' }}
              />

              <Area
                type="monotone"
                dataKey="Ingresos"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIngresosMensual)"
                name="Ingresos"
                animationDuration={2000}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
              <Area
                type="monotone"
                dataKey="Egresos"
                stroke="#fb7185"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEgresosMensual)"
                name="Egresos"
                animationDuration={2000}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fb7185' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 25,
          delay: 0.4
        }}
        className="group relative bg-card/40 border border-border/50 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Financial Health</span>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-1" id="chart-balance-title">
              Balance Neto Mensual
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status</span>
            <span className="text-xs font-mono font-medium text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded">
              Live Analysis
            </span>
          </div>
        </div>

        <div role="img" aria-labelledby="chart-balance-title" className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mesesOrdenados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradientUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="8 8"
                stroke="hsl(var(--border))"
                opacity={0.4}
              />

              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                dy={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => formatCurrencyCompact(value)}
                domain={[0, (dataMax: number) => Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
              />

              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="top"
                align="right"
                content={<SimpleLegendContent showBalance />}
                wrapperStyle={{ paddingBottom: '20px' }}
              />

              <ReferenceLine
                y={0}
                stroke="hsl(var(--foreground))"
                strokeDasharray="4 4"
                strokeWidth={1}
                opacity={0.2}
              />

              <Line
                type="monotone"
                dataKey="balance"
                stroke="url(#balanceGradientUnique)"
                strokeWidth={4}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 0,
                  fill: "hsl(var(--foreground))",
                  className: "shadow-2xl"
                }}
                animationDuration={3000}
                name="Balance"
              />

              <MilestoneLine type="fixed" />
              <MilestoneLine type="breakEven" />
              <MilestoneLine type="meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {mesActual && mesAnterior && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 22,
            delay: 0.5
          }}
          className="group relative bg-card/40 border border-border/50 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
        >
          <div className="absolute top-0 left-10 w-20 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Data Snapshot</span>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-1" id="table-comparativa-title">
                Comparativa Mensual
              </h3>
            </div>
            <div className="bg-secondary/30 px-3 py-1 rounded-full border border-border/50">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Delta Analysis</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-labelledby="table-comparativa-title">
              <thead>
                <tr className="border-b border-border/50">
                  <th scope="col" className="text-left pb-4 px-2 font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Concepto</th>
                  <th scope="col" className="text-right pb-4 px-2 font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Mes Anterior</th>
                  <th scope="col" className="text-right pb-4 px-2 font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Mes Actual</th>
                  <th scope="col" className="text-right pb-4 px-2 font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Variación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="group/row hover:bg-emerald-500/[0.02] transition-colors">
                  <td className="py-5 px-2 text-foreground font-medium">Ingresos</td>
                  <td className="py-5 px-2 text-right font-mono text-muted-foreground">{formatCurrency(mesAnterior.ingresos)}</td>
                  <td className="py-5 px-2 text-right font-mono font-semibold text-foreground">{formatCurrency(mesActual.ingresos)}</td>
                  <td className="py-5 px-2 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${mesActual.ingresos >= mesAnterior.ingresos ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {mesActual.ingresos >= mesAnterior.ingresos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {mesAnterior.ingresos > 0 ? `${((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                  </td>
                </tr>

                <tr className="group/row hover:bg-red-500/[0.02] transition-colors">
                  <td className="py-5 px-2 text-foreground font-medium">Egresos</td>
                  <td className="py-5 px-2 text-right font-mono text-muted-foreground">{formatCurrency(mesAnterior.egresos)}</td>
                  <td className="py-5 px-2 text-right font-mono font-semibold text-foreground">{formatCurrency(mesActual.egresos)}</td>
                  <td className="py-5 px-2 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${mesActual.egresos <= mesAnterior.egresos ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {mesActual.egresos <= mesAnterior.egresos ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                      {mesAnterior.egresos > 0 ? `${((mesActual.egresos - mesAnterior.egresos) / mesAnterior.egresos * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                  </td>
                </tr>

                <tr className="group/row bg-secondary/10">
                  <td className="py-6 px-2 text-foreground font-bold">Balance Neto</td>
                  <td className="py-6 px-2 text-right font-mono text-foreground/70">{formatCurrency(mesAnterior.balance)}</td>
                  <td className="py-6 px-2 text-right font-mono font-bold text-foreground text-lg">{formatCurrency(mesActual.balance)}</td>
                  <td className="py-6 px-2 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-sm ${mesActual.balance >= mesAnterior.balance ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {mesActual.balance >= mesAnterior.balance ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {mesAnterior.balance !== 0 ? `${((mesActual.balance - mesAnterior.balance) / Math.abs(mesAnterior.balance) * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
