'use client';

import { useState } from 'react';
import { usePaginatedTransactions } from '@/hooks/usePaginatedTransactions';
import { useExportarExcel } from '@/hooks/useExportarExcel';
import { useExportarPDF } from '@/hooks/useExportarPDF';
import { PaginationControls } from './PaginationControls';
import { Trash2, Edit2 } from 'lucide-react';
import { FilterSelectors } from './FilterSelectors';

interface ListaTransaccionesProps {
  userId: string;
  userRole: string;
  onRefresh?: () => void;
}

export function ListaTransacciones({ userId, userRole }: ListaTransaccionesProps) {
  const { transacciones, loading, selectedYear, selectedMonth, currentPage, totalPages, totalCount, setSelectedYear, setSelectedMonth, nextPage, prevPage, goToPage, firstPage, lastPage } = usePaginatedTransactions(userId, userRole);
  const { exportarTransacciones } = useExportarExcel();
  const { exportarTransaccionesPDF } = useExportarPDF();
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Ingreso' | 'Egreso'>('Todos');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const transaccionesFiltradas = transacciones.filter((t) => {
    if (filtroTipo === 'Todos') return true;
    return t.tipo === filtroTipo;
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

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Cargando transacciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transacciones</h2>
            <div className="flex gap-2">
              <button
                onClick={() => exportarTransacciones(userId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-lg"
              >
                📊 CSV
              </button>
              <button
                onClick={() => exportarTransaccionesPDF(userId, userRole)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-lg"
              >
                📄 PDF
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <FilterSelectors
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
                onApply={() => {}}
                onReset={() => {
                  setSelectedYear(new Date().getFullYear());
                  setSelectedMonth(new Date().getMonth() + 1);
                }}
              />
              <div className="flex gap-2 ml-auto">
                {(['Todos', 'Ingreso', 'Egreso'] as const).map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFiltroTipo(tipo)}
                    className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
                      filtroTipo === tipo
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tipo} ({transacciones.filter(t => tipo === 'Todos' ? true : t.tipo === tipo).length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Tipo</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">Monto</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No hay transacciones para este período
                  </td>
                </tr>
              ) : (
                transaccionesFiltradas.map((t) => (
                  <tr key={t.id} className="border-b border-slate-200/60 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{formatDate(t.fecha)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{t.descripcion}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-slate-700 dark:text-slate-300">{t.categoria}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">{t.sub_categoria}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          t.tipo === 'Ingreso'
                            ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {t.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">
                      <span
                        className={
                          t.tipo === 'Ingreso'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {t.tipo === 'Ingreso' ? '+' : '-'}
                        {formatCurrency(t.monto)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditandoId(editandoId === t.id ? null : t.id)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors text-red-600 dark:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {transaccionesFiltradas.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-200/60 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
            Total: {transaccionesFiltradas.length} transacciones
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onGoToPage={goToPage}
          onFirstPage={firstPage}
          onLastPage={lastPage}
        />
      )}
    </div>
  );
}
