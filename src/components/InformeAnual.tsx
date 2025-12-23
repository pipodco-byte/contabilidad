'use client';

import { useInformeAnual } from '@/hooks/useInformeAnual';
import { useTema } from '@/hooks/useTema';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InformeAnualProps {
  userId: string;
  userRole: string;
}

export function InformeAnual({ userId, userRole }: InformeAnualProps) {
  const { datosAnuales, loading } = useInformeAnual(userId, userRole);
  const { tema } = useTema();

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Cargando informe anual...</div>;
  }

  if (datosAnuales.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl text-center text-slate-400">
        No hay datos para mostrar el informe anual
      </div>
    );
  }

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

  const isDark = tema === 'dark';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
  };

  const gridStroke = isDark ? '#334155' : '#e2e8f0';
  const axisStroke = isDark ? '#64748b' : '#cbd5e1';
  const labelColor = isDark ? '#e2e8f0' : '#1e293b';

  const totalIngresos = datosAnuales.reduce((sum, d) => sum + d.ingresos, 0);
  const totalEgresos = datosAnuales.reduce((sum, d) => sum + d.egresos, 0);
  const totalBalance = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      {/* Resumen Anual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-2xl p-4">
          <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-1">Ingresos Anuales</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalIngresos)}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 rounded-2xl p-4">
          <p className="text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-1">Egresos Anuales</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(totalEgresos)}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${
          totalBalance >= 0
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20'
            : 'bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20'
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            totalBalance >= 0
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-red-700 dark:text-red-300'
          }`}>Balance Anual</p>
          <p className={`text-2xl font-bold ${
            totalBalance >= 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}>{formatCurrency(totalBalance)}</p>
        </div>
      </div>

      {/* Grafica de Linea */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Evolucion Mensual
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosAnuales} margin={{ bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="mes" angle={-45} textAnchor="end" height={80} stroke={axisStroke} interval={0} />
            <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatCurrency(value as number)}
              labelStyle={{ color: labelColor }}
            />
            <Legend />
            <Line type="monotone" dataKey="ingresos" stroke="#10b981" name="Ingresos" strokeWidth={2} />
            <Line type="monotone" dataKey="egresos" stroke="#6366f1" name="Egresos" strokeWidth={2} />
            <Line type="monotone" dataKey="balance" stroke="#f59e0b" name="Balance" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla Mensual */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Detalle Mensual</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Mes</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-400">Egresos</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-400">Balance</th>
              </tr>
            </thead>
            <tbody>
              {datosAnuales.map((dato) => (
                <tr key={dato.mes} className="border-b border-slate-200/60 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{dato.mes}</td>
                  <td className="px-6 py-4 text-sm text-right text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(dato.ingresos)}</td>
                  <td className="px-6 py-4 text-sm text-right text-indigo-600 dark:text-indigo-400 font-medium">{formatCurrency(dato.egresos)}</td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${
                    dato.balance >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>{formatCurrency(dato.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
