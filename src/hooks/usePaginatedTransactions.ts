import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Transaccion {
  id: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  sub_categoria: string;
  monto: number;
  tipo: 'Ingreso' | 'Egreso';
  medio_pago: string;
  estado_iva: string;
  comentarios?: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;

export function usePaginatedTransactions(userId: string, userRole: string) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];

        let query = supabase
          .from('transacciones')
          .select('*', { count: 'exact' })
          .gte('fecha', startDate)
          .lte('fecha', endDate)
          .order('fecha', { ascending: false });

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count, error } = await query.range(offset, offset + ITEMS_PER_PAGE - 1);

        if (error) throw error;
        setTransacciones(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setTransacciones([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, userRole, selectedYear, selectedMonth, currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    transacciones,
    loading,
    selectedYear,
    selectedMonth,
    currentPage,
    totalPages,
    totalCount,
    setSelectedYear: (year: number) => {
      setSelectedYear(year);
      setCurrentPage(1);
    },
    setSelectedMonth: (month: number) => {
      setSelectedMonth(month);
      setCurrentPage(1);
    },
    nextPage: () => currentPage < totalPages && setCurrentPage(currentPage + 1),
    prevPage: () => currentPage > 1 && setCurrentPage(currentPage - 1),
    goToPage: (page: number) => page >= 1 && page <= totalPages && setCurrentPage(page),
    firstPage: () => setCurrentPage(1),
    lastPage: () => setCurrentPage(totalPages),
  };
}
