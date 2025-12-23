'use client';

import { useGraficas } from '@/hooks/useGraficas';
import { useInformeAnual } from '@/hooks/useInformeAnual';
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
} from 'recharts';

interface GraficasProps {
  userId: string;
  userRole: string;
}

export function Graficas({ userId, userRole }: GraficasProps) {
  const { datosPorCategoria, loading } = useGraficas(userId, userRole);
  const { datosAnuales, loading: loadingAnual } = useInformeAnual(userId, userRole);

  if (loading || loadingAnual) {
    return <div className="text-center py-8 text-slate-400">Cargando gráficas...</div>;
  }

  if (datosPorCategoria.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl text-center text-slate-400">
        No hay datos para mostrar gráficas
      </div>
    );
  }

  // Datos para Scatter Chart (cantidad vs monto)
  const datosScatter = datosPorCategoria.map(d => ({
    categoria: d.categoria,
    x: d.ingresos + d.egresos, // Total transacciones
    y: Math.abs(d.ingresos - d.egresos), // Diferencia
    ingresos: d.ingresos,
    egresos: d.egresos,
  }));

  // Datos para Radar Chart
  const datosRadar = datosPorCategoria.map(d => ({
    categoria: d.categoria.length > 15 ? d.categoria.substring(0, 15) + '...' : d.categoria,
    ingresos: d.ingresos / 1000000, // En millones
    egresos: d.egresos / 1000000,
  }));

  // Comparativa mensual (últimos 2 meses)
  const mesesOrdenados = datosAnuales.sort((a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime());
  const ultimosMeses = mesesOrdenados.slice(-2);
  const mesActual = ultimosMeses[1] || { mes: 'Actual', ingresos: 0, egresos: 0, balance: 0 };
  const mesAnterior = ultimosMeses[0] || { mes: 'Anterior', ingresos: 0, egresos: 0, balance: 0 };



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

  const isDark = true; // Usar tema oscuro por defecto

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    boxShadow: isDark ? 'none' : '0 8px 30px rgb(0,0,0,0.04)',
  };

  const axisStroke = isDark ? '#64748b' : '#cbd5e1';
  const labelColor = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <div className="space-y-6">
      {/* Gráfica de Barras */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Ingresos vs Egresos por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={datosPorCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 150 }} maxBarSize={60}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="categoria" angle={-30} textAnchor="middle" stroke={axisStroke} interval={0} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatCurrency(value as number)}
              labelStyle={{ color: labelColor }}
            />
            <Legend wrapperStyle={{ width: '100%', paddingTop: '40px' }} verticalAlign="bottom" align="right" />
            <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="egresos" fill="#6366f1" name="Egresos" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Área - Evolución Temporal */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Evolución Temporal (Área)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={datosAnuales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="mes" stroke={axisStroke} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatCurrency(value as number)}
              labelStyle={{ color: labelColor }}
            />
            <Legend />
            <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="egresos" stackId="2" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Radar - Comparación Multidimensional */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Análisis Radar (Millones COP)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={datosRadar}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis dataKey="categoria" tick={{ fontSize: 12, fill: labelColor }} />
            <PolarRadiusAxis tick={{ fontSize: 10, fill: labelColor }} tickFormatter={(value) => `$${value}M`} />
            <Radar name="Ingresos" dataKey="ingresos" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Radar name="Egresos" dataKey="egresos" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            <Legend />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`$${(value as number).toFixed(1)}M`, '']}
              labelStyle={{ color: labelColor }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Scatter - Relación Variables */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Volumen vs Diferencia por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Volumen Total" 
              stroke={axisStroke}
              tickFormatter={(value) => formatCurrencyCompact(value)}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Diferencia" 
              stroke={axisStroke}
              tickFormatter={(value) => formatCurrencyCompact(value)}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [formatCurrency(value as number), name]}
              labelFormatter={(label) => `Categoría: ${label}`}
              labelStyle={{ color: labelColor }}
            />
            <Scatter name="Categorías" data={datosScatter} fill="#8b5cf6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla Comparativa Mensual */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Comparativa Mensual
        </h3>
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
                <td className={`py-3 px-4 text-right font-semibold ${
                  mesActual.ingresos >= mesAnterior.ingresos ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {mesAnterior.ingresos > 0 ? 
                    `${((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos * 100).toFixed(1)}%` : 
                    'N/A'
                  }
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">Egresos</td>
                <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100">{formatCurrency(mesAnterior.egresos)}</td>
                <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100">{formatCurrency(mesActual.egresos)}</td>
                <td className={`py-3 px-4 text-right font-semibold ${
                  mesActual.egresos <= mesAnterior.egresos ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {mesAnterior.egresos > 0 ? 
                    `${((mesActual.egresos - mesAnterior.egresos) / mesAnterior.egresos * 100).toFixed(1)}%` : 
                    'N/A'
                  }
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Balance</td>
                <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100 font-semibold">{formatCurrency(mesAnterior.balance)}</td>
                <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100 font-semibold">{formatCurrency(mesActual.balance)}</td>
                <td className={`py-3 px-4 text-right font-bold ${
                  mesActual.balance >= mesAnterior.balance ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {mesAnterior.balance !== 0 ? 
                    `${((mesActual.balance - mesAnterior.balance) / Math.abs(mesAnterior.balance) * 100).toFixed(1)}%` : 
                    'N/A'
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
