'use client';

import { useGraficas } from '@/hooks/useGraficas';
import { useInformeAnual } from '@/hooks/useInformeAnual';
import { useEvolucionMensual } from '@/hooks/useEvolucionMensual';
import { useTema } from '@/hooks/useTema';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { MilestoneLine } from '@/components/MilestoneLine';
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';
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

export function Graficas({ userId, userRole }: GraficasProps) {
  const { datosPorCategoria, loading } = useGraficas(userId, userRole);
  const { datosAnuales, loading: loadingAnual } = useInformeAnual(userId, userRole);
  const { data: evolucionMensual, loading: loadingEvolucion } = useEvolucionMensual(userId, userRole);
  const { tema } = useTema();

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
      <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-xl p-8 text-center text-zinc-300 font-medium">
        No hay datos para mostrar gráficas
      </div>
    );
  }

  const isDark = tema === 'dark';
  const tooltipStyle = {
    backgroundColor: isDark ? '#18181b' : '#ffffff',
    borderColor: '#8b5cf6',
    borderRadius: '8px',
    border: '1px solid #8b5cf6',
    color: isDark ? '#e4e4e7' : '#18181b',
  };
  const axisStroke = isDark ? '#52525b' : '#cbd5e1';
  const gridStroke = 'rgba(255,255,255,0.05)';

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

  const mesesOrdenados = [...datosAnuales].sort((a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime());
  const mesActual = mesesOrdenados[mesesOrdenados.length - 1];
  const mesAnterior = mesesOrdenados[mesesOrdenados.length - 2];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Ingresos vs Egresos por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={datosPorCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={80} stroke={axisStroke} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
            <Bar dataKey="egresos" fill="#fb7185" name="Egresos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Evolución Temporal
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datosAnuales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
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
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Area type="monotone" dataKey="ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos" />
            <Area type="monotone" dataKey="egresos" stroke="#fb7185" fillOpacity={1} fill="url(#colorEgresos)" name="Egresos" />
            <MilestoneLine type="fixed" />
            <MilestoneLine type="breakEven" />
            <MilestoneLine type="meta" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Distribución de Egresos
        </h3>
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
              <Cell fill="#fb7185" />
              <Cell fill="#f43f5e" />
              <Cell fill="#e11d48" />
              <Cell fill="#be123c" />
              <Cell fill="#9f1239" />
              <Cell fill="#881337" />
              <Cell fill="#fbbf24" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Evolución Mensual (Año Actual)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={evolucionMensual} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="mes" stroke={axisStroke} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Area type="monotone" dataKey="Ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos" />
            <Area type="monotone" dataKey="Egresos" stroke="#fb7185" fillOpacity={1} fill="url(#colorEgresos)" name="Egresos" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Balance Neto Mensual
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mesesOrdenados} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="mes" stroke={axisStroke} angle={-45} textAnchor="end" height={60} />
            <YAxis
              stroke={axisStroke}
              tickFormatter={(value) => formatCurrencyCompact(value)}
              domain={[0, (dataMax: number) => Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
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

      {/* Scatter Chart - Volumen vs Margen de Ganancia (Comentado)
      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Volumen vs Margen de Ganancia
        </h3>
        <div className="relative">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-emerald-50 dark:bg-emerald-950/20"></div>
            <div className="flex-1 bg-red-50 dark:bg-red-950/20"></div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" dataKey="x" name="Volumen Total" stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
              <YAxis type="number" dataKey="y" name="Margen %" stroke={axisStroke} domain={[-100, 100]} tickFormatter={(value) => `${value}%`} />
              <ReferenceLine y={0} stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth={2} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => name === 'Margen %' ? `${(value as number).toFixed(1)}%` : formatCurrency(value as number)} />
              <Scatter name="Categorías" data={datosPorCategoria.map(d => ({ x: d.ingresos + d.egresos, y: d.ingresos > 0 ? ((d.ingresos - d.egresos) / d.ingresos) * 100 : 0, categoria: d.categoria }))} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      */}

      {mesActual && mesAnterior && (
        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Comparativa Mensual</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Concepto</th>
                  <th className="text-right py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Mes Anterior</th>
                  <th className="text-right py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Mes Actual</th>
                  <th className="text-right py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Variación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Ingresos</td>
                  <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100">{formatCurrency(mesAnterior.ingresos)}</td>
                  <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100">{formatCurrency(mesActual.ingresos)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${mesActual.ingresos >= mesAnterior.ingresos ? 'text-emerald-600' : 'text-red-500'}`}>
                    {mesAnterior.ingresos > 0 ? `${((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Egresos</td>
                  <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100">{formatCurrency(mesAnterior.egresos)}</td>
                  <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100">{formatCurrency(mesActual.egresos)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${mesActual.egresos <= mesAnterior.egresos ? 'text-emerald-600' : 'text-red-500'}`}>
                    {mesAnterior.egresos > 0 ? `${((mesActual.egresos - mesAnterior.egresos) / mesAnterior.egresos * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-semibold">Balance</td>
                  <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100 font-semibold">{formatCurrency(mesAnterior.balance)}</td>
                  <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100 font-semibold">{formatCurrency(mesActual.balance)}</td>
                  <td className={`py-3 px-4 text-right font-bold ${mesActual.balance >= mesAnterior.balance ? 'text-emerald-600' : 'text-red-500'}`}>
                    {mesAnterior.balance !== 0 ? `${((mesActual.balance - mesAnterior.balance) / Math.abs(mesAnterior.balance) * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
