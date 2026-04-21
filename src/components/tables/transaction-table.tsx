'use client';

import { useState } from 'react';
import { usePaginatedTransactions } from '@/hooks/usePaginatedTransactions';
import { useExportarExcel } from '@/hooks/useExportarExcel';
import { useExportarPDF } from '@/hooks/useExportarPDF';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilterSelectors } from '@/components/FilterSelectors';
import { EmptyState } from '@/components/empty-state';
import { TransactionTableSkeleton } from '@/components/ui/skeleton';
import { Trash2, Edit2, Download, FileText } from 'lucide-react';

interface TransactionTableProps {
  userId: string;
  userRole: string;
}

export function TransactionTable({ userId, userRole }: TransactionTableProps) {
  const {
    transacciones,
    loading,
    selectedYear,
    selectedMonth,
    currentPage,
    totalPages,
    totalCount,
    setSelectedYear,
    setSelectedMonth,
    nextPage,
    prevPage,
    goToPage,
    firstPage,
    lastPage,
  } = usePaginatedTransactions(userId, userRole);

  const { exportarTransacciones } = useExportarExcel();
  const { exportarTransaccionesPDF } = useExportarPDF();
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Ingreso' | 'Egreso'>('Todos');

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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading) {
    return <TransactionTableSkeleton />;
  }

  if (transaccionesFiltradas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
          <div className="p-6 border-b border-zinc-800/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Transacciones</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => exportarTransacciones(userId)}
                  className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => exportarTransaccionesPDF(userId, userRole)}
                  className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <FileText className="w-4 h-4 mr-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  PDF
                </Button>
              </div>
            </div>
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
                  <Button
                    key={tipo}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiltroTipo(tipo)}
                    className={
                      filtroTipo === tipo
                        ? tipo === 'Todos'
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200'
                          : tipo === 'Ingreso'
                          ? 'bg-emerald-500 text-white active:scale-95 transition-all duration-200'
                          : 'bg-rose-500 text-white active:scale-95 transition-all duration-200'
                        : 'text-zinc-500 bg-transparent border border-transparent hover:text-zinc-200 hover:bg-white/5'
                    }
                  >
                    {tipo}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <EmptyState
          title="Sin transacciones aún"
          description="Comienza a registrar tus ingresos y egresos para ver tu panorama financiero completo."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
        <div className="p-6 border-b border-zinc-800/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Transacciones</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportarTransacciones(userId)}
                className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportarTransaccionesPDF(userId, userRole)}
                className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                PDF
              </Button>
            </div>
          </div>
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
                <Button
                  key={tipo}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltroTipo(tipo)}
                  className={
                    filtroTipo === tipo
                      ? tipo === 'Todos'
                        ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200'
                        : tipo === 'Ingreso'
                        ? 'bg-emerald-500 text-white active:scale-95 transition-all duration-200'
                        : 'bg-rose-500 text-white active:scale-95 transition-all duration-200'
                      : 'text-zinc-500 bg-transparent border border-transparent hover:text-zinc-200 hover:bg-white/5'
                  }
                >
                  {tipo}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 bg-zinc-900/50 hover:bg-zinc-900/50">
                  <TableHead className="uppercase text-xs tracking-wider text-zinc-400 font-medium">
                    Fecha
                  </TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-zinc-400 font-medium">
                    Descripción
                  </TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-zinc-400 font-medium">
                    Categoría
                  </TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-zinc-400 font-medium">
                    Tipo
                  </TableHead>
                  <TableHead className="text-right uppercase text-xs tracking-wider text-zinc-400 font-medium">
                    Monto
                  </TableHead>
                  <TableHead className="text-center uppercase text-xs tracking-wider text-zinc-400 font-medium">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaccionesFiltradas.map((t) => (
                  <TableRow
                    key={t.id}
                    className="border-zinc-800/30 hover:bg-zinc-900/30 transition-colors"
                  >
                    <TableCell className="text-zinc-300 font-medium">
                      {formatDate(t.fecha)}
                    </TableCell>
                    <TableCell className="text-zinc-400">{t.descripcion}</TableCell>
                    <TableCell>
                      <div className="text-zinc-300">{t.categoria}</div>
                      <div className="text-xs text-zinc-500">{t.sub_categoria}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          t.tipo === 'Ingreso'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }
                      >
                        {t.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold">
                      <span className={t.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}>
                        {t.tipo === 'Ingreso' ? '+' : '-'}
                        {formatCurrency(t.monto)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <div className="md:hidden p-4 space-y-4">
          {transaccionesFiltradas.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-zinc-100 font-medium">{t.descripcion}</div>
                  <div className="text-sm text-zinc-500">{formatDate(t.fecha)}</div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    t.tipo === 'Ingreso'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }
                >
                  {t.tipo}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-zinc-400">{t.categoria}</div>
                  <div className="text-xs text-zinc-500">{t.sub_categoria}</div>
                </div>
                <span
                  className={`font-mono tabular-nums font-semibold ${
                    t.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.tipo === 'Ingreso' ? '+' : '-'}
                  {formatCurrency(t.monto)}
                </span>
              </div>
              <div className="flex gap-2 justify-end pt-2 border-t border-zinc-800/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-zinc-800/50 bg-zinc-900/20">
          <div className="text-sm text-zinc-500 text-center">
            Total: {transaccionesFiltradas.length} transacciones
          </div>
        </div>
      </div>

      {totalCount > 0 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={firstPage}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={prevPage}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }
              />
            </PaginationItem>
            {getPageNumbers().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => goToPage(page)}
                  isActive={currentPage === page}
                  className={
                    currentPage === page
                      ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={lastPage}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}