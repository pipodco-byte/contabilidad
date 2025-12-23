import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Resumen {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
}

export function useResumen(userId: string, userRole: string = 'usuario') {
  const [resumen, setResumen] = useState<Resumen>({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        let query = supabase
          .from('transacciones')
          .select('tipo, monto');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data } = await query;

        if (data) {
          const totalIngresos = data
            .filter((t) => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + t.monto, 0);

          const totalEgresos = data
            .filter((t) => t.tipo === 'Egreso')
            .reduce((sum, t) => sum + t.monto, 0);

          setResumen({
            totalIngresos,
            totalEgresos,
            balance: totalIngresos - totalEgresos,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    cargarResumen();
  }, [userId, userRole]);

  return { resumen, loading };
}
