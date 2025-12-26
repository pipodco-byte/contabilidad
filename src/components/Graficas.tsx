'use client';

import { useGraficas } from '@/hooks/useGraficas';
import { useInformeAnual } from '@/hooks/useInformeAnual';
import { useRadarData } from '@/hooks/useRadarData';
import { useEvolucionMensual } from '@/hooks/useEvolucionMensual';
import { useTema } from '@/hooks/useTema';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from 'recharts';

interface GraficasProps {
  userId: string;
  userRole: string;
}

export function Graficas({ userId, userRole }: GraficasProps) {
  const { datosPorCategoria, loading } = useGraficas(userId, userRole);
  const { datosAnuales, loading: loadingAnual } = useInformeAnual(userId, userRole);
  const { data: datosRadar, loading: loadingRadar } = useRadarData(userId, userRole);
  const { data: evolucionMensual, loading: loadingEvolucion } = useEvolucionMensual(userId, userRole);
  const { tema } = useTema();

  if (loading || loadingAnual || loadingRadar || loadingEvolucion) {
    return <div className="text-center py-8 text-slate-400">Cargando gráficas...</div>;
  }

  if (datosPorCategoria.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl text-center text-slate-400">
        No hay datos para mostrar gráficas
      </div>
    );
  }

  const isDark = tema === 'dark';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
  };
  const axisStroke = isDark ? '#64748b' : '#cbd5e1';
  const labelColor = isDark ? '#e2e8f0' : '#1e293b';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
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

  const datosRadarTransformados = datosPorCategoria.map(d => ({
    subject: d.categoria.length > 12 ? d.categoria.substring(0, 12) + '...' : d.categoria,
    Ingresos: Math.round((d.ingresos / 1000000) * 10) / 10,
    Egresos: Math.round((d.egresos / 1000000) * 10) / 10,
    fullMark: 160,
  }));

  const mesesOrdenados = [...datosAnuales].sort((a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime());
  const mesActual = mesesOrdenados[mesesOrdenados.length - 1];
  const mesAnterior = mesesOrdenados[mesesOrdenados.length - 2];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Ingresos vs Egresos por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={datosPorCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e2e8f0'} />
            <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={80} stroke={axisStroke} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
            <Bar dataKey="egresos" fill="#6366f1" name="Egresos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Evolución Temporal
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datosAnuales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e2e8f0'} />
            <XAxis dataKey="mes" stroke={axisStroke} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Area type="monotone" dataKey="ingresos" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="egresos" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Análisis Radar (Millones COP)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={datosRadar}>
            <PolarGrid stroke={isDark ? '#475569' : '#cbd5e1'} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: labelColor }} />
            <PolarRadiusAxis domain={[0, 'auto']} tick={{ fontSize: 10, fill: labelColor }} tickFormatter={(value) => `$${value}M`} />
            <Radar name="Ingresos" dataKey="Ingresos" stroke={isDark ? '#34d399' : '#059669'} fill={isDark ? '#34d399' : '#059669'} fillOpacity={0.6} />
            <Radar name="Egresos" dataKey="Egresos" stroke={isDark ? '#818cf8' : '#4f46e5'} fill={isDark ? '#818cf8' : '#4f46e5'} fillOpacity={0.6} />
            <Legend />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `$${(value as number).toFixed(1)}M`} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Evolución Mensual (Año Actual)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={evolucionMensual} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e2e8f0'} />
            <XAxis dataKey="mes" stroke={axisStroke} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => `$${value}M`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `$${(value as number).toFixed(1)}M`} />
            <Legend />
            <Area type="monotone" dataKey="Ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos" />
            <Area type="monotone" dataKey="Egresos" stroke="#a855f7" fillOpacity={1} fill="url(#colorEgresos)" name="Egresos" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Chart - Volumen vs Margen de Ganancia (Comentado)
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Volumen vs Margen de Ganancia
        </h3>
        <div className="relative">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-emerald-50 dark:bg-emerald-950/20"></div>
            <div className="flex-1 bg-red-50 dark:bg-red-950/20"></div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e2e8f0'} />
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
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Comparativa Mensual</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Concepto</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Mes Anterior</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Mes Actual</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Variación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Ingresos</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100">{formatCurrency(mesAnterior.ingresos)}</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100">{formatCurrency(mesActual.ingresos)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${mesActual.ingresos >= mesAnterior.ingresos ? 'text-emerald-600' : 'text-red-500'}`}>
                    {mesAnterior.ingresos > 0 ? `${((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Egresos</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100">{formatCurrency(mesAnterior.egresos)}</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100">{formatCurrency(mesActual.egresos)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${mesActual.egresos <= mesAnterior.egresos ? 'text-emerald-600' : 'text-red-500'}`}>
                    {mesAnterior.egresos > 0 ? `${((mesActual.egresos - mesAnterior.egresos) / mesAnterior.egresos * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Balance</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100 font-semibold">{formatCurrency(mesAnterior.balance)}</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100 font-semibold">{formatCurrency(mesActual.balance)}</td>
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
