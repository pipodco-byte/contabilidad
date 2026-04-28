'use client';

import { useGraficas } from '@/hooks/useGraficas';
import { useInformeAnual } from '@/hooks/useInformeAnual';
import { useEvolucionMensual } from '@/hooks/useEvolucionMensual';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { MilestoneLine } from '@/components/MilestoneLine';
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';
import { motion } from 'framer-motion';
import { SimpleLegendContent } from '@/components/ui/chart';
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

  const axisStroke = 'hsl(var(--muted-foreground))';
  const gridStroke = 'hsl(var(--border))';

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
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-lg font-bold text-foreground mb-4" id="chart-categoria-title">
          Ingresos vs Egresos por Categoría
        </h3>
        <div role="img" aria-labelledby="chart-categoria-title">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosPorCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={80} stroke={axisStroke} />
              <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<SimpleLegendContent />} />
              <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
              <Bar dataKey="egresos" fill="#fb7185" name="Egresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-lg font-bold text-foreground mb-4" id="chart-evolucion-title">
          Evolución Temporal
        </h3>
        <div role="img" aria-labelledby="chart-evolucion-title">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosAnuales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorIngresosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEgresosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="mes" stroke={axisStroke} angle={-45} textAnchor="end" height={60} />
              <YAxis
                stroke={axisStroke}
                tickFormatter={(value) => formatCurrencyCompact(value)}
                domain={[0, (dataMax: number) => Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<SimpleLegendContent />} />
              <Area type="monotone" dataKey="ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresosGrad)" name="Ingresos" />
              <Area type="monotone" dataKey="egresos" stroke="#fb7185" fillOpacity={1} fill="url(#colorEgresosGrad)" name="Egresos" />
              <MilestoneLine type="fixed" />
              <MilestoneLine type="breakEven" />
              <MilestoneLine type="meta" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-lg font-bold text-foreground mb-4" id="chart-distribucion-title">
          Distribución de Egresos
        </h3>
        <div role="img" aria-labelledby="chart-distribucion-title">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={datosPorCategoria.filter(d => d.egresos > 0)}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="egresos"
                nameKey="categoria"
              >
                {datosPorCategoria.filter(d => d.egresos > 0).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<SimpleLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-lg font-bold text-foreground mb-4" id="chart-mensual-title">
          Evolución Mensual (Año Actual)
        </h3>
        <div role="img" aria-labelledby="chart-mensual-title">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={evolucionMensual} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorIngresosMensual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEgresosMensual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="mes" stroke={axisStroke} />
              <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<SimpleLegendContent />} />
              <Area type="monotone" dataKey="Ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresosMensual)" name="Ingresos" />
              <Area type="monotone" dataKey="Egresos" stroke="#fb7185" fillOpacity={1} fill="url(#colorEgresosMensual)" name="Egresos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
        className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-lg font-bold text-foreground mb-4" id="chart-balance-title">
          Balance Neto Mensual
        </h3>
        <div role="img" aria-labelledby="chart-balance-title">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mesesOrdenados} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="mes" stroke={axisStroke} angle={-45} textAnchor="end" height={60} />
              <YAxis
                stroke={axisStroke}
                tickFormatter={(value) => formatCurrencyCompact(value)}
                domain={[0, (dataMax: number) => Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<SimpleLegendContent showBalance />} />
              <ReferenceLine
                y={0}
                stroke="#8b5cf6"
                strokeDasharray="5 5"
                label={{
                  value: 'Punto de equilibrio',
                  position: 'insideTopRight',
                  fill: '#8b5cf6',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
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
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
          className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-bold text-foreground mb-4" id="table-comparativa-title">Comparativa Mensual</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-labelledby="table-comparativa-title">
              <caption className="sr-only">Comparación entre el mes anterior y el mes actual de ingresos, egresos y balance</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="text-left py-3 px-4 font-semibold text-foreground">Concepto</th>
                  <th scope="col" className="text-right py-3 px-4 font-semibold text-foreground">Mes Anterior</th>
                  <th scope="col" className="text-right py-3 px-4 font-semibold text-foreground">Mes Actual</th>
                  <th scope="col" className="text-right py-3 px-4 font-semibold text-foreground">Variación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-muted-foreground">Ingresos</td>
                  <td className="py-3 px-4 text-right text-foreground">{formatCurrency(mesAnterior.ingresos)}</td>
                  <td className="py-3 px-4 text-right text-foreground">{formatCurrency(mesActual.ingresos)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${mesActual.ingresos >= mesAnterior.ingresos ? 'text-emerald-500' : 'text-red-500'}`}>
                    {mesAnterior.ingresos > 0 ? `${((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-muted-foreground">Egresos</td>
                  <td className="py-3 px-4 text-right text-foreground">{formatCurrency(mesAnterior.egresos)}</td>
                  <td className="py-3 px-4 text-right text-foreground">{formatCurrency(mesActual.egresos)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${mesActual.egresos <= mesAnterior.egresos ? 'text-emerald-500' : 'text-red-500'}`}>
                    {mesAnterior.egresos > 0 ? `${((mesActual.egresos - mesAnterior.egresos) / mesAnterior.egresos * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground font-semibold">Balance</td>
                  <td className="py-3 px-4 text-right text-foreground font-semibold">{formatCurrency(mesAnterior.balance)}</td>
                  <td className="py-3 px-4 text-right text-foreground font-semibold">{formatCurrency(mesActual.balance)}</td>
                  <td className={`py-3 px-4 text-right font-bold ${mesActual.balance >= mesAnterior.balance ? 'text-emerald-500' : 'text-red-500'}`}>
                    {mesAnterior.balance !== 0 ? `${((mesActual.balance - mesAnterior.balance) / Math.abs(mesAnterior.balance) * 100).toFixed(1)}%` : 'N/A'}
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
