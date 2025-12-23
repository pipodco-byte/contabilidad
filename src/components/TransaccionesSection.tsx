'use client';

import { useState } from 'react';
import { useListaTransacciones } from '@/hooks/useListaTransacciones';
import { useExportarExcel } from '@/hooks/useExportarExcel';
import { useExportarPDF } from '@/hooks/useExportarPDF';
import { useTema } from '@/hooks/useTema';

interface TransaccionesSectionProps {
  userId: string;
  userRole: string;
}

export function TransaccionesSection({ userId, userRole }: TransaccionesSectionProps) {
  const [filtro, setFiltro] = useState<'todos' | 'ingreso' | 'egreso'>('todos');
  const { transacciones, loading } = useListaTransacciones(userId, userRole);
  const { exportarExcel } = useExportarExcel(userId, userRole);
  const { exportarPDF } = useExportarPDF(userId, userRole);
  const { tema } = useTema();

  const transaccionesFiltradas = transacciones.filter(t => {
    if (filtro === 'ingreso') return t.tipo === 'Ingreso';
    if (filtro === 'egreso') return t.tipo === 'Egreso';
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO');
  };

  const isDark = tema === 'dark';

  const buttonBase = 'px-4 py-2 rounded-lg font-semibold transition-all text-sm';
  const buttonActive = 'bg-emerald-600 text-white shadow-lg';
  const buttonInactive = isDark 
    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
    : 'bg-slate-200 text-slate-700 hover:bg-slate-300';

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
      {/* Encabezado con Botones */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Transacciones
        </h3>
        
        {/* Barra de Filtros y Exportación */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`${buttonBase} ${filtro === 'todos' ? buttonActive : buttonInactive}`}
            >
              Todos ({transacciones.length})
            </button>
            <button
              onClick={() => setFiltro('ingreso')}
              className={`${buttonBase} ${filtro === 'ingreso' ? buttonActive : buttonInactive}`}
            >
              Ingreso ({transacciones.filter(t => t.tipo === 'Ingreso').length})
            </button>
            <button
              onClick={() => setFiltro('egreso')}
              className={`${buttonBase} ${filtro === 'egreso' ? buttonActive : buttonInactive}`}
            >
              Egreso ({transacciones.filter(t => t.tipo === 'Egreso').length})
            </button>
          </div>

          {/* Exportación */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => exportarExcel(transaccionesFiltradas)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all text-sm shadow-lg"
            >
              📊 CSV
            </button>
            <button
              onClick={() => exportarPDF(transaccionesFiltradas)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all text-sm shadow-lg"
            >
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando transacciones...</div>
      ) : transaccionesFiltradas.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No hay transacciones</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Categoría</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Tipo</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesFiltradas.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{formatDate(t.fecha)}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{t.descripcion}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{t.categoria}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.tipo === 'Ingreso' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    t.tipo === 'Ingreso' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(t.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
