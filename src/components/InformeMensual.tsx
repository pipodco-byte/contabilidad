'use client';

import { useInformeMensual } from '@/hooks/useInformeMensual';
import { useEnviarReporteMensual } from '@/hooks/useEnviarReporteMensual';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InformeMensualProps {
  userId: string;
  userRole: string;
}

export function InformeMensual({ userId, userRole }: InformeMensualProps) {
  const { datosMensuales, loading, mes, setMes } = useInformeMensual(userId, userRole);
  const { enviarReporte, loading: enviando } = useEnviarReporteMensual();

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Cargando informe mensual...</div>;
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

  const isDark = true;
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
  };

  const axisStroke = isDark ? '#64748b' : '#cbd5e1';
  const labelColor = isDark ? '#e2e8f0' : '#1e293b';

  const totalIngresos = datosMensuales.reduce((sum, d) => sum + d.ingresos, 0);
  const totalEgresos = datosMensuales.reduce((sum, d) => sum + d.egresos, 0);
  const totalBalance = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      {/* Selector de Mes */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mes:</label>
        <input
          type="month"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {userRole === 'admin' && (
          <button
            onClick={() => enviarReporte(mes)}
            disabled={enviando}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {enviando ? 'Enviando...' : 'Enviar a Felipe'}
          </button>
        )}
      </div>

      {/* Resumen Mensual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-2xl p-4">
          <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-1">Ingresos del Mes</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalIngresos)}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 rounded-2xl p-4">
          <p className="text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-1">Egresos del Mes</p>
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
          }`}>Balance del Mes</p>
          <p className={`text-2xl font-bold ${
            totalBalance >= 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}>{formatCurrency(totalBalance)}</p>
        </div>
      </div>

      {/* Grafica por Categoria */}
      {datosMensuales.length > 0 ? (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ingresos vs Egresos por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosMensuales} margin={{ bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={80} stroke={axisStroke} interval={0} />
              <YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatCurrency(value as number)}
                labelStyle={{ color: labelColor }}
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
              <Bar dataKey="egresos" fill="#6366f1" name="Egresos" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl text-center text-slate-400">
          No hay datos para este mes
        </div>
      )}

      {/* Tabla Mensual */}
      {datosMensuales.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Detalle por Categoria</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Categoria</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-400">Egresos</th>
                </tr>
              </thead>
              <tbody>
                {datosMensuales.map((dato) => (
                  <tr key={dato.categoria} className="border-b border-slate-200/60 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{dato.categoria}</td>
                    <td className="px-6 py-4 text-sm text-right text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(dato.ingresos)}</td>
                    <td className="px-6 py-4 text-sm text-right text-indigo-600 dark:text-indigo-400 font-medium">{formatCurrency(dato.egresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
