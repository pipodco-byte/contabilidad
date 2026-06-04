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

function getDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export function usePaginatedTransactions(userId: string, userRole: string, searchQuery?: string) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState(getDefaultDateRange().startDate);
  const [endDate, setEndDate] = useState(getDefaultDateRange().endDate);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedYear = new Date(startDate).getFullYear();
  const selectedMonth = new Date(startDate).getMonth() + 1;

  useEffect(() => {
    if (!userId || userId.length < 5) {
      setTransacciones([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('cont_transacciones')
          .select('*', { count: 'exact' })
          .gte('fecha', startDate)
          .lte('fecha', endDate)
          .order('fecha', { ascending: false });

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        if (searchQuery && searchQuery.trim()) {
          query = query.ilike('descripcion', `%${searchQuery.trim()}%`);
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
  }, [userId, userRole, startDate, endDate, currentPage, searchQuery]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    transacciones,
    loading,
    selectedYear,
    selectedMonth,
    currentPage,
    totalPages,
    totalCount,
    startDate,
    endDate,
    showingLast30Days: true,
    setSelectedYear: (year: number) => {
      const currentDate = new Date(startDate);
      const newDate = new Date(year, currentDate.getMonth(), 1);
      setStartDate(newDate.toISOString().split('T')[0]);
      setCurrentPage(1);
    },
    setSelectedMonth: (month: number) => {
      const year = new Date(startDate).getFullYear();
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
      setCurrentPage(1);
    },
    nextPage: () => currentPage < totalPages && setCurrentPage(currentPage + 1),
    prevPage: () => currentPage > 1 && setCurrentPage(currentPage - 1),
    goToPage: (page: number) => page >= 1 && page <= totalPages && setCurrentPage(page),
    firstPage: () => setCurrentPage(1),
    lastPage: () => setCurrentPage(totalPages),
  };
}
